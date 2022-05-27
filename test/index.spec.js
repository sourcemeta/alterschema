const tap = require('tap')
const fs = require('fs')
const path = require('path')
const walker = require('../lib/walker')
const builtin = require('../lib/builtin')
const alterschema = require('..')

for (const from of Object.keys(builtin.jsonschema)) {
  for (const to of Object.keys(builtin.jsonschema[from])) {
    const tests = require(`./rules/jsonschema-${from}-to-${to}.json`)
    for (const testCase of tests) {
      tap.test(`${from} => ${to}: ${testCase.name}`, async (test) => {
        const result = await alterschema(testCase.schema, from, to)
        test.strictSame(result, testCase.expected)
        test.end()
      })
    }
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

for (const name of fs.readdirSync(path.resolve(__dirname, '..', 'rules'))) {
  for (const rule of require(`../rules/${name}`).rules) {
    tap.test(`$id: (${name}) ${rule.condition.$id}`, (test) => {
      const basename = path.basename(name, path.extname(name))
      const prefix = `https://github.com/jviotti/alterschema/rules/${basename}/`
      test.ok(rule.condition.$id.startsWith(prefix), `Must start with ${prefix}`)
      test.end()
    })
  }
}
