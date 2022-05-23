export type JSONNumber = number
export type JSONBoolean = boolean
export type JSONString = string
export type JSONNull = null

export type JSONScalar = JSONNumber | JSONBoolean | JSONString | JSONNull

export interface JSONObject {
  // eslint-disable-next-line no-use-before-define
  readonly [key: string]: JSONValue;
}

export type JSONValue =
  JSONObject | JSONValue[] | JSONScalar
