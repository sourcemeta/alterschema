const _ = require('lodash')
const walker = require('./walker')
const transformer = require('./transformer')

const BUILTIN_RULES = {
  'jsonschema-2019-09-to-2020-12': require('./rules/jsonschema-2019-09-to-2020-12')
}

const getRules = (name) => {
  return BUILTIN_RULES[name].RULES.map((rule) => {
    return Object.assign(BUILTIN_RULES[name][rule], { name })
  })
}

module.exports = (value, type, rules) => {
  return walker(type, value, []).sort((a, b) => {
    return b.path.length - a.path.length
  }).reduce((accumulator, trail) => {
    const transform = transformer(accumulator, trail.path, rules)
    return trail.path.length === 0
      ? transform.output
      : _.set(accumulator, trail.path, transform.output)
  }, _.cloneDeep(value))
}

console.log(JSON.stringify(module.exports({
  type: 'array',
  items: [
    { type: 'string' }
  ]
}, 'jsonschema-2019-09', getRules('jsonschema-2019-09-to-2020-12')), null, 2))
