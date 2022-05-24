const tap = require('tap')

for (const walker of [ 'jsonschema-2019-09' ]) {
  for (const testCase of require(`./${walker}.json`)) {
    const fn = require(`../../lib/walkers/${walker}`)
    tap.test(`${walker.name}: ${testCase.name}`, (test) => {
      const result = fn(testCase.schema, [])
      test.strictSame(result, testCase.trail)
      test.end()
    })
  }
}
