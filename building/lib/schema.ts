export type SchemaValidator = {
  propertySchema: (field: string) => SchemaValidator
  title: string
  properties: string[]
  isRequired: () => boolean
}

export type SchemaRepository = {
  getSchemaValidator: (schemaName: string) => SchemaValidator
}

type JSONObjectSchema = {
  type: 'object'
  title: string
  properties: { [key: string]: JSONSchema }
  required?: string[]
}

type JSONFieldchema = {
  type: 'string' | 'number' | 'integer' | 'boolean'
  format?: 'date' | 'time' | 'date-time'
  title: string
}

type JSONSchema = JSONObjectSchema | JSONFieldchema

class JSONSchemaValidator implements SchemaValidator {
  #jsonschema: JSONSchema
  #parentValidator: JSONSchemaValidator | null
  #name: string

  constructor(
    name: string,
    jsonschema: JSONSchema,
    parentValidator: JSONSchemaValidator | null
  ) {
    this.#jsonschema = jsonschema
    this.#parentValidator = parentValidator
    this.#name = name
  }

  isFieldRequired(field: string) {
    return (
      this.#jsonschema.type === 'object' &&
      this.#jsonschema.required &&
      this.#jsonschema.required.indexOf(field) > -1
    )
  }

  propertySchema(field: string) {
    if (this.#jsonschema.type === 'object') {
      return new JSONSchemaValidator(
        field,
        this.#jsonschema.properties[field],
        this
      )
    } else {
      throw `field ${field} does not exist in ${this.#jsonschema.title}`
    }
  }

  get title() {
    return this.#jsonschema.title
  }

  get properties() {
    return []
  }

  isRequired() {
    return this.#parentValidator?.isFieldRequired(this.#name) ?? false
  }
}

const schema: { [key: string]: JSONObjectSchema } = {
  StockIssuance: {
    type: 'object',
    title: 'Stock Issuance',
    properties: {
      rowIndex: {
        type: 'integer',
        title: 'Row Index'
      },
      issueDate: {
        type: 'string',
        format: 'date',
        title: 'Issue Date'
      },
      itemName: {
        type: 'string',
        title: 'Item Name'
      },
      quantity: {
        type: 'number',
        title: 'Quantity'
      },
      unit: {
        type: 'string',
        title: 'Unit'
      },
      to: {
        type: 'string',
        title: 'To'
      }
    }
  },
  InventoryItem: {
    type: 'object',
    title: 'Inventory Item',
    properties: {
      name: {
        type: 'string',
        title: 'Name'
      },
      unit: {
        type: 'string',
        title: 'Unit'
      },
      category: {
        type: 'string',
        title: 'Category'
      }
    }
  }
}

export const schemaRepository: SchemaRepository = {
  getSchemaValidator: (schemaName: string) => {
    if (schema[schemaName]) {
      return new JSONSchemaValidator(schemaName, schema[schemaName], null)
    } else {
      throw `Schema ${schemaName} does not exist`
    }
  }
}
