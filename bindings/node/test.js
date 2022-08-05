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
  const rulesetPath = path.resolve(__dirname, '..', '..', 'rules', name)
  if (!fs.existsSync(rulesetPath)) {
    continue
  }

  for (const rule of require(rulesetPath).rules) {
    tap.test(`$id: (${name}) ${rule.condition.$id}`, (test) => {
      const basename = path.basename(name, path.extname(name))
      const prefix = `https://github.com/sourcemeta/alterschema/rules/${basename}/`
      test.ok(rule.condition.$id.startsWith(prefix), `Must start with ${prefix}`)
      test.end()
    })
  }
}

tap.test('(CLI) draft4 => 2020-12', (test) => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), packageJSON.name))
  const schema = path.join(tmp, 'schema.json')
  fs.writeFileSync(schema, JSON.stringify({
    id: 'http://example.com/schema',
    $schema: 'http://json-schema.org/draft-04/schema#',
    dependencies: {
      foo: ['bar']
    },
    properties: {
      foo: {
        enum: ['single-value']
      },
      bar: {
        type: 'number',
        minimum: 5,
        exclusiveMinimum: true
      }
    }
  }, null, 2))

  const cli = path.resolve(__dirname, 'cli.js')
  const result = childProcess.spawnSync('node',
    [cli, '--from', 'draft4', '--to', '2020-12', schema])
  fs.rmdirSync(tmp, { recursive: true })
  test.strictSame(JSON.parse(result.stdout.toString()), {
    $id: 'http://example.com/schema',
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    dependentProperties: {
      foo: ['bar']
    },
    properties: {
      foo: {
        const: 'single-value'
      },
      bar: {
        type: 'number',
        exclusiveMinimum: 5
      }
    }
  })

  test.is(result.stderr.toString(), '')
  test.is(result.status, 0)
  test.end()
})
