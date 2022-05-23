import tap from 'tap'

import {
  strict as assert
} from 'assert'

import {
  transformSchema
} from '../lib/transformer'

tap.test('transform a value given no rules', (test) => {
  const root = {
    x: {
      foo: 'bar'
    }
  }

  const result = transformSchema(root.x, root, [])
  test.strictSame(result, {
    foo: 'bar'
  })

  test.end()
})

tap.test('transform a value given one rule', (test) => {
  const root = {
    x: {
      foo: 'bar'
    }
  }

  const result = transformSchema(root.x, root, [
    {
      condition: (value, _root) => {
        return typeof value === 'object' &&
          !Array.isArray(value) &&
          value !== null &&
          value.foo === 'bar'
      },
      transform: (value) => {
        assert(typeof value === 'object' && !Array.isArray(value) && value !== null)
        return Object.assign(value, {
          foo: 'baz'
        })
      }
    }
  ])

  test.strictSame(result, {
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

  const result = transformSchema(root.x, root, [
    {
      condition: (value, _root) => {
        if (typeof value === 'object' &&
          !Array.isArray(value) &&
          value !== null &&
          value.foo === 'bar') {
          // This should take no effect!
          Reflect.deleteProperty(value, 'bar')
          return true
        }

        return false
      },
      transform: (value) => {
        assert(typeof value === 'object' && !Array.isArray(value) && value !== null)
        return Object.assign(value, {
          foo: 'baz'
        })
      }
    }
  ])

  test.strictSame(result, {
    foo: 'baz',
    bar: 'baz'
  })

  test.end()
})
