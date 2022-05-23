import {
  JSONObject
} from './json'

import {
  JSONSchemaSpec
} from './jsonschema'

// TODO: This is a mock implementation. Ideally, we look at the metaschema
export const usesVocabulary = (_value: JSONObject, _spec: JSONSchemaSpec, _vocabulary: string): boolean => {
  return true
}
