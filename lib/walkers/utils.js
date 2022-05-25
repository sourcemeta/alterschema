const _ = require('lodash')
const jsonschema = require('../jsonschema')

const handler = (root, path, vocabulary, keyword, callback) => {
  const value = path.length === 0 ? root : _.get(root, path)
  return jsonschema.usesVocabulary(root, value, vocabulary) &&
    typeof value[keyword] !== 'undefined'
    ? callback(value[keyword]) : []
}

exports.handleValue = (walker, root, path, vocabulary, keyword) => {
  return handler(root, path, vocabulary, keyword, () => {
    return walker(root, path.concat([ keyword ]))
  })
}

exports.handleArray = (walker, root, path, vocabulary, keyword) => {
  return handler(root, path, vocabulary, keyword, (value) => {
    const result = []
    for (const [ index, _item ] of value.entries()) {
      result.push(...walker(root, path.concat([ keyword, String(index) ])))
    }
    return result
  })
}

exports.handleValueOrArray = (walker, root, path, vocabulary, keyword) => {
  return handler(root, path, vocabulary, keyword, (value) => {
    if (Array.isArray(value)) {
      return exports.handleArray(walker, root, path, vocabulary, keyword)
    } else {
      return exports.handleValue(walker, root, path, vocabulary, keyword)
    }
  })
}

exports.handleObject = (walker, root, path, vocabulary, keyword) => {
  return handler(root, path, vocabulary, keyword, (value) => {
    const result = []
    for (const key of Object.keys(value)) {
      result.push(...walker(root, path.concat([ keyword, key ])))
    }
    return result
  })
}
