const tap = require('tap')
const fs = require('fs')
const os = require('os')
const childProcess = require('child_process')
const path = require('path')
const walker = require('./walker')
const builtin = require('./builtin')
const alterschema = require('./index')
const packageJSON = require('../../package.json')

for (const from of Object.keys(builtin.jsonschema)) {
  for (const to of Object.keys(builtin.jsonschema[from])) {
    const tests = require(`../../test/rules/jsonschema-${from}-to-${to}.json`)
    for (const testCase of tests) {
      tap.test(`${from} => ${to}: ${testCase.name}`, async (test) => {
        const result = await alterschema(testCase.schema, from, to)
        test.strictSame(result, testCase.expected)
        test.end()
      })

      tap.test(`(CLI) ${from} => ${to}: ${testCase.name}`, (test) => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), packageJSON.name))
        const schema = path.join(tmp, 'schema.json')
        fs.writeFileSync(schema, JSON.stringify(testCase.schema, null, 2))
        const cli = path.resolve(__dirname, 'cli.js')
        const result = childProcess.spawnSync('node',
          [cli, '--from', from, '--to', to, schema])
        fs.rmdirSync(tmp, { recursive: true })
        test.strictSame(JSON.parse(result.stdout.toString()), testCase.expected)
        test.is(result.stderr.toString(), '')
        test.is(result.status, 0)
        test.end()
      })
    }
  }
}

for (const walkerName of fs.readdirSync(path.resolve(__dirname, '..', '..', 'test', 'walkers')).map((name) => {
  return path.basename(name, path.extname(name))
})) {
  for (const testCase of require(`../../test/walkers/${walkerName}.json`)) {
    tap.test(`${walkerName}: ${testCase.name}`, (test) => {
      const result = walker(walkerName, testCase.schema, [])
      test.strictSame(result, testCase.trail)
      test.end()
    })
  }
}

for (const name of fs.readdirSync(path.resolve(__dirname, '..', '..', 'test', 'rules'))) {
  for (const rule of require(`../../rules/${name}`).rules) {
    tap.test(`$id: (${name}) ${rule.condition.$id}`, (test) => {
      const basename = path.basename(name, path.extname(name))
      const prefix = `https://github.com/jviotti/alterschema/rules/${basename}/`
      test.ok(rule.condition.$id.startsWith(prefix), `Must start with ${prefix}`)
      test.end()
    })
  }
}
