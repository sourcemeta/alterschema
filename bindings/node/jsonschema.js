const jsonschema = require('@hyperjump/json-schema')
const METASCHEMAS = require('../../metaschemas.json')
jsonschema.setMetaOutputFormat(jsonschema.FLAG)

exports.implementation = jsonschema

// TODO: This is a mock implementation. Ideally, we look at the metaschema
exports.usesVocabulary = (_root, value, _vocabulary) => {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return true
  }

  return false
}

exports.getIdProperty = (version) => {
  return ['draft3', 'draft4'].includes(version) ? 'id' : '$id'
}

exports.matches = async (schema, value) => {
  const idProperty = exports.getIdProperty(METASCHEMAS[schema.$schema])
  jsonschema.add(schema)
  const result = await jsonschema.validate(jsonschema.get(schema[idProperty]), value)
  return result.valid
}
