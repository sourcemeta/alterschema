const _ = require('lodash')
const jsonschema = require('./jsonschema')

module.exports = (walker, root, path) => {
  const value = path.length === 0 ? root : _.get(root, path)
  return _.reduce(require(`../walkers/${walker}.json`), (accumulator, definition, keyword) => {
    if (typeof value[keyword] === 'undefined' || !jsonschema.usesVocabulary(root, value, definition.vocabulary)) {
      return accumulator
    }

    for (const type of _.castArray(definition.type)) {
      if (type === 'array' && Array.isArray(value[keyword])) {
        // eslint-disable-next-line no-unused-vars
        for (const [index, _item] of value[keyword].entries()) {
          accumulator.push(...module.exports(definition.walker, root, path.concat([keyword, index])))
        }
      } else if (type === 'object' && _.isPlainObject(value[keyword])) {
        for (const key of Object.keys(value[keyword])) {
          accumulator.push(...module.exports(definition.walker, root, path.concat([keyword, key])))
        }
      } else if (type === 'value' && !Array.isArray(value[keyword])) {
        accumulator.push(...module.exports(definition.walker, root, path.concat([keyword])))
      }
    }

    return accumulator
  }, [{ type: walker, path }])
}
