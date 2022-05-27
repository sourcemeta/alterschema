const _ = require('lodash')
const walker = require('./walker')
const transformer = require('./transformer')
const builtin = require('./builtin')

module.exports = (value, from, to) => {
  const mapper = builtin.jsonschema[from][to]
  return walker(mapper.WALKER, value, []).sort((a, b) => {
    return b.path.length - a.path.length
  }).reduce((accumulator, trail) => {
    const transform = transformer(accumulator, trail.path, mapper.RULES)
    return trail.path.length === 0
      ? transform.output
      : _.set(accumulator, trail.path, transform.output)
  }, _.cloneDeep(value))
}
