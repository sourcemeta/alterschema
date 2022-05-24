import {
  Rule
} from './rules/rule'

import {
  get,
  set
} from 'lodash'

import {
  JSONValue
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

export const transformSchema = (root: JSONValue, path: string[], ruleset: Rule[]): TransformResult => {
  const value = get(root, path)
  for (const rule of ruleset) {
    // Guard against rules accidentally modifying the input document
    // Its easier than it sounds to make such mistake and JavaScript
    // does not provide true "const" semantics.

    if (rule.condition(cloneDeep(value), cloneDeep(root))) {
      const output = rule.transform(cloneDeep(value))
      assert(!rule.condition(cloneDeep(output), cloneDeep(root)),
        'Rule condition must not match after transform')

      if (path.length === 0) {
        const subprocess = transformSchema(output, path, ruleset)
        return {
          count: 1 + subprocess.count,
          output: subprocess.output
        }
      } else {
        assert((typeof root === 'object' && !Array.isArray(root) && root !== null) || Array.isArray(root))
        const subprocess = transformSchema(set(cloneDeep(root), path, output), path, ruleset)
        return {
          count: 1 + subprocess.count,
          output: subprocess.output
        }
      }
    }
  }

  return {
    count: 0,
    output: value
  }
}
