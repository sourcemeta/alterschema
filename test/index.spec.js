const tap = require('tap')
const alterschema = require('..')

for (const suite of [
  {
    from: '2019-09',
    to: '2020-12',
    tests: require('./jsonschema-2019-19-to-2020-12.json')
  }
]) {
  for (const testCase of suite.tests) {
    tap.test(`${suite.from} => ${suite.to}: ${testCase.name}`, (test) => {
      const result = alterschema(testCase.schema, suite.from, suite.to)
      test.strictSame(result, testCase.expected)
      test.end()
    })
  }
}
