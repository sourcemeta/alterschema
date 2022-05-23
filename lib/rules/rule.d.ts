import {
  JSONValue
} from '../json'

export type RuleCondition = (value: JSONValue) => boolean
export type RuleTransform = (value: JSONValue) => JSONValue
export interface Rule {
  readonly condition: RuleCondition;
  readonly transform: RuleTransform;
}
