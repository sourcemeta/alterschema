const tap = require('tap')
const transformer = require('../lib/transformer')

tap.test('transform a value given no rules', (test) => {
  const root = {
    x: {
      foo: 'bar'
    }
  }

  const result = transformer(root, [ 'x' ], [])
  test.is(result.count, 0)
  test.strictSame(result.output, {
    foo: 'bar'
  })

  test.end()
})

tap.test('transform a value given one matching rule', (test) => {
  const root = {
    x: {
      foo: 'bar'
    }
  }

  const result = transformer(root, [ 'x' ], [
    {
      condition: (value, _root) => {
        return value.foo === 'bar'
      },
      transform: (value) => {
        return Object.assign(value, {
          foo: 'baz'
        })
      }
    }
  ])

  test.is(result.count, 1)
  test.strictSame(result.output, {
    foo: 'baz'
  })

  test.end()
})

tap.test('guard against condition modifications', (test) => {
  const root = {
    x: {
      foo: 'bar',
      bar: 'baz'
    }
  }

  const result = transformer(root, [ 'x' ], [
    {
      condition: (value, _root) => {
        if (value.foo === 'bar') {
          // This should take no effect!
          Reflect.deleteProperty(value, 'bar')
          return true
        }

        return false
      },
      transform: (value) => {
        return Object.assign(value, {
          foo: 'baz'
        })
      }
    }
  ])

  test.is(result.count, 1)
  test.strictSame(result.output, {
    foo: 'baz',
    bar: 'baz'
  })

  test.end()
})
