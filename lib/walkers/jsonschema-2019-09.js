const utils = require('./utils')

module.exports = (root, path) => {
  // The top-level is always a schema
  const result = [
    {
      type: 'jsonschema-2019-09',
      path
    }
  ]

  result.push(...utils.handleObject(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/core', '$defs'))
  result.push(...utils.handleArray(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'allOf'))
  result.push(...utils.handleArray(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'anyOf'))
  result.push(...utils.handleArray(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'oneOf'))
  result.push(...utils.handleValue(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'not'))
  result.push(...utils.handleValue(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'if'))
  result.push(...utils.handleValue(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'then'))
  result.push(...utils.handleValue(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'else'))
  result.push(...utils.handleObject(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'dependentSchemas'))
  result.push(...utils.handleValueOrArray(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'items'))
  result.push(...utils.handleValue(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'additionalItems'))
  result.push(...utils.handleValue(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'unevaluatedItems'))
  result.push(...utils.handleValue(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'contains'))
  result.push(...utils.handleObject(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'properties'))
  result.push(...utils.handleObject(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'patternProperties'))
  result.push(...utils.handleValue(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'additionalProperties'))
  result.push(...utils.handleValue(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'unevaluatedProperties'))
  result.push(...utils.handleValue(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'propertyNames'))
  result.push(...utils.handleValue(module.exports, root, path, 'https://json-schema.org/draft/2019-09/vocab/content', 'contentSchema'))
  return result
}
