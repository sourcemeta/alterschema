import {
  JSONValue
} from '../json'

import {
  get
} from 'lodash'

import {
  WalkerElement,
  Walker
} from './walker'

import {
  usesVocabulary
} from '../jsonschema'

const handle = (walker: Walker, root: JSONValue, path: string[], vocabulary: string, keyword: string): WalkerElement[] => {
  const value = path.length === 0 ? root : get(root, path)
  if (typeof value !== 'object' || Array.isArray(value) || value === null) {
    return []
  }

  if (usesVocabulary(root, value, vocabulary) && keyword in value) {
    return walker(root, path.concat([ keyword ]))
  }

  return []
}

const handleArray = (walker: Walker, root: JSONValue, path: string[], vocabulary: string, keyword: string): WalkerElement[] => {
  const value = path.length === 0 ? root : get(root, path)
  if (typeof value !== 'object' || Array.isArray(value) || value === null) {
    return []
  }

  if (usesVocabulary(root, value, vocabulary) && keyword in value) {
    const result = []
    for (const [ index, _item ] of value[keyword].entries()) {
      result.push(...walker(root, path.concat([ keyword, index ])))
    }
    return result
  }

  return []
}

const handleObject = (walker: Walker, root: JSONValue, path: string[], vocabulary: string, keyword: string): WalkerElement[] => {
  const value = path.length === 0 ? root : get(root, path)
  if (typeof value !== 'object' || Array.isArray(value) || value === null) {
    return []
  }

  if (usesVocabulary(root, value, vocabulary) && keyword in value) {
    const result = []
    for (const key of Object.keys(value[keyword])) {
      result.push(...walker(root, path.concat([ keyword, key ])))
    }
    return result
  }

  return []
}

const walk: Walker = (root: JSONValue, path: string[]): WalkerElement[] => {
  // The top-level is always a schema
  const result: WalkerElement[] = [
    {
      type: 'jsonschema-2019-09',
      path
    }
  ]

  result.push(...handleObject(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/core', '$defs'))
  result.push(...handleArray(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'allOf'))
  result.push(...handleArray(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'anyOf'))
  result.push(...handleArray(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'oneOf'))
  result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'not'))
  result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'if'))
  result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'then'))
  result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'else'))
  result.push(...handleObject(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'dependentSchemas'))

  const value = path.length === 0 ? root : get(root, path)
  if (usesVocabulary(root, value, 'https://json-schema.org/draft/2019-09/vocab/applicator')) {
    if ('items' in value) {
      if (Array.isArray(value.items)) {
        result.push(...handleArray(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'items'))
      } else {
        result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'items'))
      }
    }
  }

  result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'additionalItems'))
  result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'unevaluatedItems'))
  result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'contains'))
  result.push(...handleObject(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'properties'))
  result.push(...handleObject(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'patternProperties'))
  result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'additionalProperties'))
  result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'unevaluatedProperties'))
  result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'propertyNames'))
  result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/content', 'contentSchema'))
  return result
}

export default walk
