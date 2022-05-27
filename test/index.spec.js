const tap = require('tap')
const fs = require('fs')
const path = require('path')
const walker = require('../lib/walker')
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

for (const walkerName of fs.readdirSync(path.resolve(__dirname, 'walkers')).map((name) => {
  return path.basename(name, path.extname(name))
})) {
  for (const testCase of require(`./walkers/${walkerName}.json`)) {
    tap.test(`${walkerName}: ${testCase.name}`, (test) => {
      const result = walker(walkerName, testCase.schema, [])
      test.strictSame(result, testCase.trail)
      test.end()
    })
  }
}
