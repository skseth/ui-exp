'use strict';

import { Model } from 'objection';
import { BaseModel } from './BaseModel';
import { ApiValidationError } from '../routes/Errors';

export class List extends BaseModel {
  id!: number;
  name!: string;
  version?: number;
  color?: string;
  items?: ListItems[];

  static tableName = 'lists';
  static schemaName = 'schemas/List';

  //   static jsonSchema = {
  //     type: 'object',
  //     required: ['name'],

  //     properties: {
  //       id: { type: 'integer' },
  //       name: { type: 'string', minLength: 1, maxLength: 50 }
  //     }
  //   };

  static relationMappings = () => ({
    items: {
      relation: Model.HasManyRelation,

      // The related model.
      modelClass: ListItems,

      join: {
        from: 'lists.id',
        to: 'list_items.list_id'
      }
    }
  });

  $beforeInsert() {
    delete this.version;
  }
}

export class ListItems extends Model {
  value!: string;
  description!: string;

  static tableName = 'list_items';
  static schemaName = 'schemas/ListItem';
}
