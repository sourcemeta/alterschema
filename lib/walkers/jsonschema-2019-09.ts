import {
  JSONValue
} from '../json'

import {
  WalkerVisitor,
  Walker
} from './walker'

const walk: Walker = (value: JSONValue, callback: WalkerVisitor): void => {
  callback(value, 'json-schema-2019-09')
}

export default walk
