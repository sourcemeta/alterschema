import {
  JSONValue
} from '../json'

import {
  SchemaType
} from '../schema'

export type WalkerVisitor = (value: JSONValue, type: SchemaType) => void
export type Walker = (value: JSONValue, callback: WalkerVisitor) => void
