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

import {
  handleValue,
  handleObject,
  handleArray
} from './utils'

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
  result.push(...handleValue(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'not'))
  result.push(...handleValue(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'if'))
  result.push(...handleValue(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'then'))
  result.push(...handleValue(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'else'))
  result.push(...handleObject(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'dependentSchemas'))

  const value = path.length === 0 ? root : get(root, path)
  if (usesVocabulary(root, value, 'https://json-schema.org/draft/2019-09/vocab/applicator')) {
    if ('items' in value) {
      if (Array.isArray(value.items)) {
        result.push(...handleArray(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'items'))
      } else {
        result.push(...handleValue(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'items'))
      }
    }
  }

  result.push(...handleValue(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'additionalItems'))
  result.push(...handleValue(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'unevaluatedItems'))
  result.push(...handleValue(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'contains'))
  result.push(...handleObject(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'properties'))
  result.push(...handleObject(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'patternProperties'))
  result.push(...handleValue(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'additionalProperties'))
  result.push(...handleValue(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'unevaluatedProperties'))
  result.push(...handleValue(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'propertyNames'))
  result.push(...handleValue(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/content', 'contentSchema'))
  return result
}

export default walk
