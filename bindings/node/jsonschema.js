const jsonschema = require('@hyperjump/json-schema')
const METASCHEMAS = require('../../metaschemas.json')
jsonschema.setMetaOutputFormat(jsonschema.FLAG)

// TODO: This is a mock implementation. Ideally, we look at the metaschema
exports.usesVocabulary = (_root, value, _vocabulary) => {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return true
  }

  return false
}

exports.matches = async (schema, value) => {
  const idProperty = METASCHEMAS[schema.$schema] === 'draft4' ? 'id' : '$id'
  jsonschema.add(schema)
  const result = await jsonschema.validate(jsonschema.get(schema[idProperty]), value)
  return result.valid
}
