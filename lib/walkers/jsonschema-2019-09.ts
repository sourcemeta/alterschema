import {
  JSONValue
} from '../json'

import {
  WalkerVisitor,
  Walker
} from './walker'

const walk: Walker = (value: JSONValue, callback: WalkerVisitor): void => {
  callback(value, 'jsonschema-2019-09')
}

export default walk
