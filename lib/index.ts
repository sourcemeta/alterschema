import WalkerJSONSchema2019_19 from './walkers/jsonschema-2019-09'

import {
  JSONValue
} from './json'

import {
  Rule
} from './rules/rule'

import {
  Walker
} from './walkers/walker'

import {
  SchemaType
} from './schema'

import {
  transformSchema
} from './transformer'

export const walkers = {
  JSONSchema2019_19: WalkerJSONSchema2019_19
}

export const alterSchema = (value: JSONValue, ruleset: Rule[], walker: Walker = WalkerJSONSchema2019_19): JSONValue => {
  walker(value, (input: JSONValue, _type: SchemaType): void => {
    transformSchema(input, value, ruleset)
  })

  return value
}
