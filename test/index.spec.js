const tap = require('tap')
const alterschema = require('..')

tap.test('basic JSON Schema 2019-09 to 2020-12', (test) => {
  const schema = {
    type: 'array',
    items: [
      { type: 'string' }
    ]
  }

  const result = alterschema(schema, '2019-09', '2020-12')
  test.strictSame(result, {
    type: 'array',
    prefixItems: [
      { type: 'string' }
    ]
  })

  test.end()
})
