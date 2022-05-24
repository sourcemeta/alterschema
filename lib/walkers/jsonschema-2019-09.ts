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

    if ('not' in value) {
      result.push(...walk(root, path.concat([ 'not' ])))
    }

    if ('if' in value) {
      result.push(...walk(root, path.concat([ 'if' ])))
    }

    if ('then' in value) {
      result.push(...walk(root, path.concat([ 'then' ])))
    }

    if ('else' in value) {
      result.push(...walk(root, path.concat([ 'else' ])))
    }

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

    if ('additionalItems' in value) {
      result.push(...walk(root, path.concat([ 'additionalItems' ])))
    }

    if ('unevaluatedItems' in value) {
      result.push(...walk(root, path.concat([ 'unevaluatedItems' ])))
    }

    if ('contains' in value) {
      result.push(...walk(root, path.concat([ 'contains' ])))
    }

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

    if ('additionalProperties' in value) {
      result.push(...walk(root, path.concat([ 'additionalProperties' ])))
    }

    if ('unevaluatedProperties' in value) {
      result.push(...walk(root, path.concat([ 'unevaluatedProperties' ])))
    }

    if ('propertyNames' in value) {
      result.push(...walk(root, path.concat([ 'propertyNames' ])))
    }
  }

  if (usesVocabulary(root, value, 'https://json-schema.org/draft/2019-09/vocab/content')) {
    if ('contentSchema' in value) {
      result.push(...walk(root, path.concat([ 'contentSchema' ])))
    }
  }

  return result
}

export default walk
