const _ = require('lodash')
const jsone = require('json-e')
const assert = require('assert').strict
const jsonschema = require('./jsonschema')
const walker = require('./walker')
const builtin = require('./builtin')

async function transformer (root, path, ruleset) {
  const value = path.length === 0 ? root : _.get(root, path)
  for (const rule of ruleset) {
    // Guard against rules accidentally modifying the input document
    // Its easier than it sounds to make such mistake and JavaScript
    // does not provide true "const" semantics.

    if (await jsonschema.matches(rule.condition, value) &&
      jsonschema.usesVocabulary(root, value, rule.vocabulary)) {
      const output = jsone(rule.transform, {
        schema: value,
        omit: (object, key) => {
          return _.omit(object, _.castArray(key))
        },
        tail: (value) => {
          return value.slice(1)
        }
      })

      assert(!await jsonschema.matches(rule.condition, output),
        'Rule condition must not match after transform')
      const newRoot = path.length === 0 ? output : _.set(root, path, output)
      return transformer(newRoot, path, ruleset)
    }
  }

  return value
}

module.exports = async (value, from, to) => {
  let accumulator = _.cloneDeep(value)
  for (const mapper of builtin.jsonschema[from][to]) {
    const trails = walker(mapper.walker, value, []).sort((a, b) => {
      return b.path.length - a.path.length
    })

    for (const trail of trails) {
      const transform = await transformer(accumulator, trail.path, mapper.rules)
      if (trail.path.length === 0) {
        accumulator = transform
      } else {
        _.set(accumulator, trail.path, transform)
      }
    }
  }

  return accumulator
}
