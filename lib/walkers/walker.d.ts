import {
  JSONValue
} from '../json'

import {
  SchemaType
} from '../schema'

export interface WalkerElement {
  readonly type: SchemaType;
  readonly path: string[];
}

export type Walker = (value: JSONValue, path: string[]) => WalkerElement[]
