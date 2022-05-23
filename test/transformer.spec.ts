import tap from 'tap'

import {
  strict as assert
} from 'assert'

import {
  transformSchema
} from '../lib/transformer'

tap.test('transform a value given no rules', (test) => {
  const result = transformSchema({
    foo: 'bar'
  }, [])

  test.strictSame(result, {
    foo: 'bar'
  })

  test.end()
})

tap.test('transform a value given one rule', (test) => {
  const result = transformSchema({
    foo: 'bar'
  }, [
    {
      condition: (value) => {
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
