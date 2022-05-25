const tap = require('tap')
const fs = require('fs')
const path = require('path')
const walker = require('../../lib/walker')

for (const walkerName of fs.readdirSync(__dirname).filter((name) => {
  return path.extname(name) === '.json'
}).map((name) => {
  return path.basename(name, path.extname(name))
})) {
  for (const testCase of require(`./${walkerName}.json`)) {
    tap.test(`${walker.name}: ${testCase.name}`, (test) => {
      const result = walker(walkerName, testCase.schema, [])
      test.strictSame(result, testCase.trail)
      test.end()
    })
  }
}
