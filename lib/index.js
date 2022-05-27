const _ = require('lodash')
const jsone = require('json-e')
const assert = require('assert').strict
const jsonschema = require('./jsonschema')
const walker = require('./walker')
const builtin = require('./builtin')

function transformer (root, path, ruleset) {
  const value = path.length === 0 ? root : _.get(root, path)
  for (const rule of ruleset) {
    // Guard against rules accidentally modifying the input document
    // Its easier than it sounds to make such mistake and JavaScript
    // does not provide true "const" semantics.

    if (rule.condition(_.cloneDeep(value), _.cloneDeep(root)) &&
      jsonschema.usesVocabulary(root, value, rule.vocabulary)) {
      const output = jsone(rule.transform, {
        schema: value,
        omit: (object, key) => {
          return _.omit(object, _.castArray(key))
        }
      })

      assert(!rule.condition(_.cloneDeep(output), _.cloneDeep(root)),
        'Rule condition must not match after transform')

      const newRoot = path.length === 0 ? output : _.set(root, path, output)
      return transformer(newRoot, path, ruleset)
    }
  }

  return value
}

module.exports = (value, from, to) => {
  const mapper = builtin.jsonschema[from][to]
  return walker(mapper.WALKER, value, []).sort((a, b) => {
    return b.path.length - a.path.length
  }).reduce((accumulator, trail) => {
    const transform = transformer(accumulator, trail.path, mapper.RULES)
    return trail.path.length === 0
      ? transform
      : _.set(accumulator, trail.path, transform)
  }, _.cloneDeep(value))
}
