const _ = require('lodash')
const jsonschema = require('../lib/jsonschema')

// See https://json-schema.org/draft/2020-12/release-notes.html

exports.WALKER = 'jsonschema-2019-09'
exports.RULES = [
  {
    name: 'items to prefix items',
    vocabulary: 'https://json-schema.org/draft/2019-09/vocab/validation',
    condition: (value, root) => {
      return Array.isArray(value.items)
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
