import {
  JSONValue
} from '../json'

import {
  WalkerElement,
  Walker
} from './walker'

const walk: Walker = (_value: JSONValue): WalkerElement[] => {
  return [
    {
      type: 'jsonschema-2019-09',
      path: []
    }
  ]
}

export default walk
