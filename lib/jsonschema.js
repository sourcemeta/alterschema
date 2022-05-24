// TODO: This is a mock implementation. Ideally, we look at the metaschema
exports.usesVocabulary = (_root, value, _vocabulary) => {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return true
  }

  return false
}
