import {
  JSONValue
} from '../json'

import {
  strict as assert
} from 'assert'

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

type Handler = (value: JSONValue) => WalkerElement[]
const genericHandle = (root: JSONValue, path: string[], vocabulary: string, keyword: string, callback: Handler): WalkerElement[] => {
  const value = path.length === 0 ? root : get(root, path)
  if (typeof value !== 'object' || Array.isArray(value) || value === null) {
    return []
  }

  if (usesVocabulary(root, value, vocabulary) && keyword in value) {
    return callback(value[keyword])
  }

  return []
}

export const handleValue = (walker: Walker, root: JSONValue, path: string[], vocabulary: string, keyword: string): WalkerElement[] => {
  return genericHandle(root, path, vocabulary, keyword, (_value): WalkerElement[] => {
    return walker(root, path.concat([ keyword ]))
  })
}

export const handleArray = (walker: Walker, root: JSONValue, path: string[], vocabulary: string, keyword: string): WalkerElement[] => {
  return genericHandle(root, path, vocabulary, keyword, (value): WalkerElement[] => {
    assert(Array.isArray(value))
    const result: WalkerElement[] = []
    for (const [ index, _item ] of value.entries()) {
      result.push(...walker(root, path.concat([ keyword, String(index) ])))
    }
    return result
  })
}

export const handleValueOrArray = (walker: Walker, root: JSONValue, path: string[], vocabulary: string, keyword: string): WalkerElement[] => {
  return genericHandle(root, path, vocabulary, keyword, (value): WalkerElement[] => {
    if (Array.isArray(value)) {
      return handleArray(walker, root, path, vocabulary, keyword)
    } else {
      return handleValue(walker, root, path, vocabulary, keyword)
    }
  })
}

export const handleObject = (walker: Walker, root: JSONValue, path: string[], vocabulary: string, keyword: string): WalkerElement[] => {
  return genericHandle(root, path, vocabulary, keyword, (value): WalkerElement[] => {
    assert(typeof value === 'object' && !Array.isArray(value) && value !== null)
    const result: WalkerElement[] = []
    for (const key of Object.keys(value)) {
      result.push(...walker(root, path.concat([ keyword, key ])))
    }
    return result
  })
}
