import {
  JSONValue
} from '../json'

import {
  usesVocabulary
} from '../jsonschema'

import {
  strict as assert
} from 'assert'

export const itemsToPrefixItems = {
  condition: (value: JSONValue): boolean => {
    return typeof value === 'object' && !Array.isArray(value) && value !== null &&
      usesVocabulary(value, '2019-09', 'https://json-schema.org/draft/2020-12/vocab/validation') &&
      'items' in value &&
      Array.isArray(value.items)
  },
  transform: (value: JSONValue): JSONValue => {
    assert(typeof value === 'object' && !Array.isArray(value) && value !== null)
    const items = value.items
    Reflect.deleteProperty(value, 'items')
    return Object.assign(value, { prefixItems: items })
  }
}
