import tap from 'tap'
import walker from '../lib/walkers/jsonschema-2019-09'

tap.test('draft-handrews-json-schema-validation-02 (8.2.4.6)', (test) => {
  const result = walker({
    $id: 'https://example.net/root.json',
    items: {
      type: 'array',
      items: {
        $ref: '#item'
      }
    },
    $defs: {
      single: {
        $anchor: 'item',
        type: 'object',
        additionalProperties: {
          $ref: 'other.json'
        }
      }
    }
  }, [])

  test.strictSame(result, [
    {
      type: 'jsonschema-2019-09',
      path: []
    },
    {
      type: 'jsonschema-2019-09',
      path: [ '$defs', 'single' ]
    },
    {
      type: 'jsonschema-2019-09',
      path: [ '$defs', 'single', 'additionalProperties' ]
    },
    {
      type: 'jsonschema-2019-09',
      path: [ 'items' ]
    },
    {
      type: 'jsonschema-2019-09',
      path: [ 'items', 'items' ]
    }
  ])

  test.end()
})

tap.test('draft-handrews-json-schema-validation-02 (8.6) example 3', (test) => {
  const result = walker({
    type: 'string',
    contentMediaType: 'application/jwt',
    contentSchema: {
      type: 'array',
      minItems: 2,
      items: [
        {
          const: {
            typ: 'JWT',
            alg: 'HS256'
          }
        },
        {
          type: 'object',
          required: [ 'iss', 'exp' ],
          properties: {
            iss: {
              type: 'string'
            },
            exp: {
              type: 'integer'
            }
          }
        }
      ]
    }
  }, [])

  test.strictSame(result, [
    {
      type: 'jsonschema-2019-09',
      path: []
    },
    {
      type: 'jsonschema-2019-09',
      path: [ 'contentSchema' ]
    },
    {
      type: 'jsonschema-2019-09',
      path: [ 'contentSchema', 'items', 0 ]
    },
    {
      type: 'jsonschema-2019-09',
      path: [ 'contentSchema', 'items', 1 ]
    },
    {
      type: 'jsonschema-2019-09',
      path: [ 'contentSchema', 'items', 1, 'properties', 'iss' ]
    },
    {
      type: 'jsonschema-2019-09',
      path: [ 'contentSchema', 'items', 1, 'properties', 'exp' ]
    }
  ])

  test.end()
})
