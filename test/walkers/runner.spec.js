const tap = require('tap')
const fs = require('fs')
const path = require('path')

for (const walker of fs.readdirSync(__dirname).filter((name) => {
  return path.extname(name) === '.json'
}).map((name) => {
  return path.basename(name, path.extname(name))
})) {
  for (const testCase of require(`./${walker}.json`)) {
    const fn = require(`../../lib/walkers/${walker}`)
    tap.test(`${walker.name}: ${testCase.name}`, (test) => {
      const result = fn(testCase.schema, [])
      test.strictSame(result, testCase.trail)
      test.end()
    })
  }
}
