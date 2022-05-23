import {
  Rule
} from './rules/rule'

import {
  JSONValue
} from './json'

import {
  strict as assert
} from 'assert'

import {
  cloneDeep
} from 'lodash'

export const transformSchema = (value: JSONValue, root: JSONValue, ruleset: Rule[]): JSONValue => {
  const result = ruleset.reduce((accumulator, rule) => {
    // Guard against rules accidentally modifying the input document
    // Its easier than it sounds to make such mistake and JavaScript
    // does not provide true "const" semantics.

    if (!rule.condition(cloneDeep(accumulator), cloneDeep(root))) {
      return accumulator
    }

    const output = rule.transform(cloneDeep(accumulator))
    assert(!rule.condition(cloneDeep(output), cloneDeep(root)),
      'Rule condition must not match after transform')
    return output
  }, value)

  // If at least one rule still matches the result,
  // then we recurse, until no rule matches again.
  // Conflicting rules that result in infinite
  // cycles clearly result in stack overflows.
  if (ruleset.some((rule) => {
    return rule.condition(cloneDeep(result), cloneDeep(root))
  })) {
    return transformSchema(result, root, ruleset)
  }

  return result
}
