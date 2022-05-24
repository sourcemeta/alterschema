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

const walk: Walker = (root: JSONValue, path: string[]): WalkerElement[] => {
  const result: WalkerElement[] = []
  // The top-level is always a schema
  result.push({
    type: 'jsonschema-2019-09',
    path
  })

  const value = path.length === 0 ? root : get(root, path)

  if (usesVocabulary(root, value, 'https://json-schema.org/draft/2019-09/vocab/core')) {
    if ('$defs' in value) {
      for (const key of Object.keys(value.$defs)) {
        result.push(...walk(root, path.concat([ '$defs', key ])))
      }
    }
  }

  if (usesVocabulary(root, value, 'https://json-schema.org/draft/2019-09/vocab/applicator')) {
    if ('allOf' in value) {
      for (const [ index, _item ] of value.allOf.entries()) {
        result.push(...walk(root, path.concat([ 'allOf', index ])))
      }
    }

    if ('anyOf' in value) {
      for (const [ index, _item ] of value.allOf.entries()) {
        result.push(...walk(root, path.concat([ 'anyOf', index ])))
      }
    }

    if ('oneOf' in value) {
      for (const [ index, _item ] of value.allOf.entries()) {
        result.push(...walk(root, path.concat([ 'oneOf', index ])))
      }
    }

    result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'not'))
    result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'if'))
    result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'then'))
    result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'else'))

    if ('dependentSchemas' in value) {
      for (const key of Object.keys(value.dependentSchemas)) {
        result.push(...walk(root, path.concat([ 'dependentSchemas', key ])))
      }
    }

    if ('items' in value) {
      if (Array.isArray(value.items)) {
        for (const [ index, _item ] of value.items.entries()) {
          result.push(...walk(root, path.concat([ 'items', index ])))
        }
      } else {
        result.push(...walk(root, path.concat([ 'items' ])))
      }
    }

    result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'additionalItems'))
    result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'unevaluatedItems'))
    result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'contains'))

    if ('properties' in value) {
      for (const key of Object.keys(value.properties)) {
        result.push(...walk(root, path.concat([ 'properties', key ])))
      }
    }

    if ('patternProperties' in value) {
      for (const key of Object.keys(value.patternProperties)) {
        result.push(...walk(root, path.concat([ 'patternProperties', key ])))
      }
    }

    result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'additionalProperties'))
    result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'unevaluatedProperties'))
    result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/applicator', 'propertyNames'))
  }

  result.push(...handle(walk, root, path, 'https://json-schema.org/draft/2019-09/vocab/content', 'contentSchema'))
  return result
}

export default walk
