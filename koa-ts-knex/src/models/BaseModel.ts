import fs from 'fs';
import path from 'path';
import Ajv, { JSONSchemaType, DefinedError } from 'ajv';
import Knex from 'knex';
import { Validator, Model, ValidatorArgs } from 'objection';
import cloneDeep from 'lodash.clonedeep';

class AjvSchema {
  uriPrefix: string;
  schemaPrefix: string;
  ajv: Ajv;
  ajvNoDefaults: Ajv;

  constructor(uriPrefix: string, schemaPrefix: string) {
    this.uriPrefix = uriPrefix;
    this.schemaPrefix = schemaPrefix;
    this.ajv = new Ajv({
      useDefaults: true,
      allErrors: true,
      ownProperties: true
    });
    this.ajvNoDefaults = new Ajv({
      useDefaults: false,
      allErrors: true,
      ownProperties: true
    });
  }

  filePathFromName(name: string) {
    return path.resolve(this.schemaPrefix, name + '.json');
  }

  uriFromName(name: string) {
    return this.uriPrefix + name + '.json';
  }

  loadSchema(name: string): any {
    const str = fs.readFileSync(this.filePathFromName(name), 'utf-8');
    const schema = JSON.parse(str);
    schema.$id = this.uriFromName(name);
    return schema;
  }

  addSchema(name: string) {
    console.log(`adding schema ${name}`);
    this.ajv.addSchema(this.loadSchema(name));
    this.ajvNoDefaults.addSchema(this.loadSchema(name));
  }

  addSchemas(names: string[]) {
    names.forEach((name) => this.addSchema(name));
  }

  addAll() {
    const jsonRegex = /.*\.json$/;

    var walk = (dir: string, prefixlen: number) => {
      dir = path.join(dir, '/');

      if (prefixlen == 0) {
        prefixlen = dir.length;
      }

      var list = fs.readdirSync(dir);
      list.forEach((file) => {
        file = path.join(dir, file);
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
          walk(file, prefixlen);
        } else {
          if (file.match(jsonRegex)) {
            this.addSchemas([file.substring(prefixlen, file.length - 5)]);
          }
        }
      });
    };

    walk(this.schemaPrefix, 0);
  }

  getSchemaValidator(name: string) {
    const validator = this.ajv.getSchema(this.uriFromName(name));
    if (!validator) {
      throw `Error - No validator for ${name}`;
    }
    return validator;
  }

  getSchemaValidatorNoDefaults(name: string) {
    const validator = this.ajvNoDefaults.getSchema(this.uriFromName(name));
    if (!validator) {
      throw `Error - No validator for ${name}`;
    }
    return validator;
  }
}

let ajvSchema!: AjvSchema;
let knex!: any;

export function InitializeSchemasAndModels(
  uri: string,
  filePath: string,
  knexConfig: any
) {
  knex = Knex(knexConfig);
  Model.knex(knex);
  ajvSchema = new AjvSchema(uri, filePath);
  ajvSchema.addAll();
}

class EntityValidationError {
  message: string;
  data: any;
  constructor(message: string, data: any) {
    this.message = message;
    this.data = data;
  }
}

class EntityValidator extends Validator {
  initialized: boolean = false;
  schemaName?: string;
  validator?: any;
  validatorNoDefaults?: any;
  validatorHasDefaults: boolean = false;

  constructor() {
    super();
  }

  getValidator(schemaName: string, withDefaults: boolean): any {
    if (!this.initialized) {
      if (!!schemaName) {
        this.schemaName = schemaName;
        this.validator = ajvSchema.getSchemaValidator(this.schemaName);
        // TODO
        this.validatorHasDefaults = true;
        if (this.validatorHasDefaults) {
          this.validatorNoDefaults = ajvSchema.getSchemaValidatorNoDefaults(
            this.schemaName
          );
        } else {
          this.validatorNoDefaults = this.validator;
        }
      } else {
        this.validator = (obj: any) => obj;
        this.validatorNoDefaults = this.validator;
        this.validatorHasDefaults = false;
      }

      this.initialized = true;
    }

    if (withDefaults) {
      return this.validator;
    } else {
      return this.validatorNoDefaults;
    }
  }

  validate(args: ValidatorArgs) {
    const modelClass: any = args.model.constructor;
    const validator = this.getValidator(
      modelClass.getSchemaName(),
      !!args.options.patch
    );

    const options: any = args.options;
    var json = args.json;

    // We need to clone the input json if we are about to set default values.
    if (!options.mutable && !options.patch && this.validatorHasDefaults) {
      json = cloneDeep(args.json);
    }

    validator(json);

    this.prepareAndThrowValidationError(
      validator.errors,
      modelClass,
      args.options
    );

    return json;
  }

  beforeValidate(args: any) {
    return super.beforeValidate(args);
  }

  afterValidate(args: any) {
    // Takes the same arguments as `validate`. Usually there is no need
    // to override this.
    return super.afterValidate(args);
  }

  // borrowed from AjvValidator in objection
  prepareAndThrowValidationError(errors: any, modelClass: any, options: any) {
    console.log(`Prepare called ${modelClass.name}`);
    if (!errors) {
      return null;
    }

    let relations = modelClass.getRelations();

    if (relations) {
      console.log(`Found relations ${relations}`);
    }

    let errorHash: Record<string, object[]> = {};
    let numErrors = 0;

    for (const error of errors) {
      const dataPath = `${options.dataPath || ''}${error.dataPath}`;

      // If additionalProperties = false, relations can pop up as additionalProperty
      // errors. Skip those.
      if (
        error.params &&
        error.params.additionalProperty &&
        relations[error.params.additionalProperty]
      ) {
        console.log(`ERROR skipped for ${error.params.additionalProperty}`);
        continue;
      }

      // Unknown properties are reported in `['propertyName']` notation,
      // so replace those with dot-notation, see:
      // https://github.com/epoberezkin/ajv/issues/671
      const key = dataPath.replace(/\['([^' ]*)'\]/g, '.$1').substring(1);

      const newerror = {
        message: error.message,
        keyword: error.keyword,
        params: error.params
      };

      if (!errorHash[key]) {
        errorHash[key] = [];
      }

      // Use unshift instead of push so that the last error ends up at [0],
      // preserving previous behavior where only the last error was stored.
      errorHash[key].push(newerror);

      ++numErrors;
    }

    if (numErrors === 0) {
      return null;
    }

    throw new EntityValidationError(
      `Error validation against ${this.schemaName}`,
      errorHash
    );
  }
}

export class BaseModel extends Model {
  static createValidator() {
    return new EntityValidator();
  }

  static schemaName?: string;

  static getSchemaName() {
    if (this.schemaName) {
      return this.schemaName;
    } else {
      return '';
    }
  }
}
