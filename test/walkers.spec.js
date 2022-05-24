const tap = require('tap')
const path = require('path')
const fs = require('fs')

for (const walker of [
  {
    name: 'jsonschema-2019-09.json',
    fn: require('../lib/walkers/jsonschema-2019-09')
  }
]) {
  const testCases = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'walkers', walker.name), 'utf8'))
  for (const testCase of testCases) {
    tap.test(`${walker.name}: ${testCase.name}`, (test) => {
      const result = walker.fn(testCase.schema, [])
      test.strictSame(result, testCase.trail)
      test.end()
    })
  }
}
