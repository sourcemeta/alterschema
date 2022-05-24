import {
  JSONValue
} from './json'

// TODO: This is a mock implementation. Ideally, we look at the metaschema
export const usesVocabulary = (_root: JSONValue, value: JSONValue, _vocabulary: string): boolean => {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return true
  }

  return false
}
