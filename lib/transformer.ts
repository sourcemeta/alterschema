import {
  Rule
} from './rules/rule'

import {
  get,
  set
} from 'lodash'

import {
  JSONValue,
  JSONObject
} from './json'

import {
  strict as assert
} from 'assert'

import {
  cloneDeep
} from 'lodash'

export interface TransformResult {
  readonly count: number;
  readonly output: JSONValue;
}

export const transformSchema = (
  root: JSONObject | JSONValue[],
  path: string[],
  ruleset: Rule[]
): TransformResult => {
  const result = ruleset.reduce((accumulator, rule) => {
    // Guard against rules accidentally modifying the input document
    // Its easier than it sounds to make such mistake and JavaScript
    // does not provide true "const" semantics.

    if (!rule.condition(cloneDeep(accumulator.value), cloneDeep(root))) {
      return accumulator
    }

    const output = rule.transform(cloneDeep(accumulator.value))
    assert(!rule.condition(cloneDeep(output), cloneDeep(root)),
      'Rule condition must not match after transform')
    return {
      count: accumulator.count + 1,
      value: output
    }
  }, {
    count: 0,
    value: get(root, path)
  })

  // If at least one rule still matches the result,
  // then we recurse, until no rule matches again.
  // Conflicting rules that result in infinite
  // cycles clearly result in stack overflows.
  if (ruleset.some((rule) => {
    return rule.condition(cloneDeep(result), cloneDeep(root))
  })) {
    const newRoot = set(cloneDeep(root), path, result)
    const subresult: TransformResult = transformSchema(newRoot, path, ruleset)
    return {
      count: result.count + subresult.count,
      output: subresult.output
    }
  }

  return {
    count: result.count,
    output: result.value
  }
}
