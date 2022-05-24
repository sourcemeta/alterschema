import tap from 'tap'
import jsonschema201909 from '../lib/walkers/jsonschema-2019-09'

import {
  resolve
} from 'path'

import {
  JSONValue
} from '../lib/json'

import {
  WalkerElement
} from '../lib/walkers/walker'

import {
  readFileSync
} from 'fs'

export interface WalkerTestCase {
  readonly name: string;
  readonly schema: JSONValue;
  readonly trail: WalkerElement[];
}

for (const walker of [
  {
    name: 'jsonschema-2019-09.json',
    fn: jsonschema201909
  }
]) {
  const testCases: WalkerTestCase[] =
    JSON.parse(readFileSync(resolve(__dirname, 'walkers', walker.name), 'utf8'))
  for (const testCase of testCases) {
    tap.test(`${walker.name}: ${testCase.name}`, (test) => {
      const result = walker.fn(testCase.schema, [])
      test.strictSame(result, testCase.trail)
      test.end()
    })
  }
}
