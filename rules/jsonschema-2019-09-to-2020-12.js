// See https://json-schema.org/draft/2020-12/release-notes.html

exports.WALKER = 'jsonschema-2019-09'
exports.RULES = [
  {
    vocabulary: 'https://json-schema.org/draft/2019-09/vocab/validation',
    condition: {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      $id: 'https://github.com/jviotti/alterschema/rules/jsonschema-2019-19-to-2020-12/items-to-prefix-items',
      type: 'object',
      required: [ 'items' ],
      properties: {
        items: {
          type: 'array'
        }
      }
    },
    transform: {
      $merge: [
        { $eval: 'omit(schema, "items")' },
        {
          prefixItems: {
            $eval: 'schema.items'
          }
        }
      ]
    }
  }
]
