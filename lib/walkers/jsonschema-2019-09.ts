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

const visit = (path: string[]): WalkerElement => {
  return {
    type: 'jsonschema-2019-09',
    path
  }
}

const walk: Walker = (root: JSONValue, path: string[]): WalkerElement[] => {
  const result: WalkerElement[] = []
  // The top-level is always a schema
  result.push(visit(path))
  const value = path.length === 0 ? root : get(root, path)

  if (usesVocabulary(root, value, 'https://json-schema.org/draft/2019-09/vocab/core')) {
    if ('$defs' in value) {
      for (const key of Object.keys(value.$defs)) {
        result.push(...walk(root, path.concat([ '$defs', key ])))
      }
    }
  }

  if (usesVocabulary(root, value, 'https://json-schema.org/draft/2019-09/vocab/applicator')) {
    if ('items' in value) {
      result.push(...walk(root, path.concat([ 'items' ])))
    }

    if ('additionalProperties' in value) {
      result.push(...walk(root, path.concat([ 'additionalProperties' ])))
    }
  }

  return result
}

export default walk
