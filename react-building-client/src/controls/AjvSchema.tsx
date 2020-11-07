import Ajv from 'ajv'
import path from 'path'
import ListSchema from '../api/schemas/List.json'
import ListItemSchema from '../api/schemas/ListItem.json'

class AjvSchema {
  uriPrefix: string
  schemaPrefix: string
  ajv: Ajv.Ajv
  ajvNoDefaults: Ajv.Ajv

  constructor(uriPrefix: string, schemaPrefix: string) {
    this.uriPrefix = uriPrefix
    this.schemaPrefix = schemaPrefix
    this.ajv = new Ajv({
      useDefaults: true,
      allErrors: true,
      ownProperties: true
    })
    this.ajvNoDefaults = new Ajv({
      useDefaults: false,
      allErrors: true,
      ownProperties: true
    })
  }

  filePathFromName(name: string) {
    return path.resolve(this.schemaPrefix, name + '.json')
  }

  uriFromName(name: string) {
    return this.uriPrefix + name + '.json'
  }

  async loadSchema(name: string) {
    const schema = await fetch(this.filePathFromName(name)).then((res) =>
      res.json()
    )
    schema.$id = this.uriFromName(name)
    return schema
  }

  addSchemaDirect(name: string, schema: any) {
    console.log(`adding schema ${name}`)
    delete schema.id
    schema.$id = this.uriFromName(name)
    console.log(schema)
    this.ajv.addSchema(schema)
    this.ajvNoDefaults.addSchema(schema)
  }

  async addSchema(name: string) {
    console.log(`adding schema ${name}`)
    const schema = await this.loadSchema(name)
    this.ajv.addSchema(schema)
    this.ajvNoDefaults.addSchema(schema)
  }

  getSchemaValidator(name: string) {
    const validator = this.ajv.getSchema(this.uriFromName(name))
    if (!validator) {
      throw `Error - No validator for ${name}`
    }
    return validator
  }

  getSchemaValidatorNoDefaults(name: string) {
    const validator = this.ajvNoDefaults.getSchema(this.uriFromName(name))
    if (!validator) {
      throw `Error - No validator for ${name}`
    }
    return validator
  }
}

export const ajvSchema = new AjvSchema(
  'http://localhost:3000/api/',
  'http://localhost:3000/api/'
)

ajvSchema.addSchemaDirect('schemas/ListItem', ListItemSchema)
ajvSchema.addSchemaDirect('schemas/List', ListSchema)
