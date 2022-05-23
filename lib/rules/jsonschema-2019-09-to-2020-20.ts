import {
  JSONValue
} from '../json'

import {
  usesVocabulary
} from '../jsonschema'

import {
  strict as assert
} from 'assert'

import {
  Rule
} from './rule'

// See https://json-schema.org/draft/2020-12/release-notes.html

export const itemsToPrefixItems: Rule = {
  condition: (value: JSONValue, root: JSONValue): boolean => {
    return typeof value === 'object' && !Array.isArray(value) && value !== null &&
      (usesVocabulary(value, '2019-09', 'https://json-schema.org/draft/2019-09/vocab/validation') ||
      usesVocabulary(root, '2019-09', 'https://json-schema.org/draft/2019-09/vocab/validation')) &&
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

export const RULES: Rule[] = [ itemsToPrefixItems ]
