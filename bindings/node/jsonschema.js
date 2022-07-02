const jsonschema = require('@hyperjump/json-schema')

// TODO: This is a mock implementation. Ideally, we look at the metaschema
exports.usesVocabulary = (_root, value, _vocabulary) => {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return true
  }

  return false
}

exports.matches = async (schema, value) => {
  jsonschema.add(schema)
  const result = await jsonschema.validate(jsonschema.get(schema.$id), value)
  return result.valid
}
