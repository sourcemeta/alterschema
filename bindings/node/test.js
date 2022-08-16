const tap = require('tap')
const _ = require('lodash')
const fs = require('fs')
const os = require('os')
const childProcess = require('child_process')
const path = require('path')
const walker = require('./walker')
const builtin = require('./builtin')
const jsonschema = require('./jsonschema')
const alterschema = require('./index')
const packageJSON = require('../../package.json')
const METASCHEMAS = _.invert(require('../../metaschemas.json'))

const JSON_SCHEMA_TEST_SUITE = path.resolve(__dirname, '..', '..', 'vendor', 'json-schema-test-suite')
const TESTS_BASE_DIRECTORY = path.resolve(JSON_SCHEMA_TEST_SUITE, 'tests')

const recursiveReadDirectory = (directory) => {
  return fs.readdirSync(directory).reduce((accumulator, basename) => {
    const fullPath = path.resolve(directory, basename)
    return accumulator.concat(fs.statSync(fullPath).isDirectory()
      ? recursiveReadDirectory(fullPath)
      : fullPath)
  }, [])
}

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

// TODO: Reduce this blacklist to a minimum
const BLACKLIST = [
  'anchor',
  'content',
  'id',
  'recursiveRef',
  'ref',
  'refRemote',
  'unknownKeyword',
  'vocabulary',

  // Optionals
  'dependencies-compatibility',
  'ecmascript-regex',
  'format-assertion',
  'zeroTerminatedFloats',

  // Formats
  'date-time',
  'date',
  'duration',
  'email',
  'hostname',
  'idn-email',
  'idn-hostname',
  'ipv4',
  'ipv6',
  'iri-reference',
  'iri',
  'json-pointer',
  'regex',
  'relative-json-pointer',
  'time',
  'uri-reference',
  'uri-template',
  'uri',
  'uuid'
]

for (const from of Object.keys(builtin.jsonschema)) {
  const testId = from === '2020-12' || from === '2019-09' ? `draft${from}` : from
  const testsPath = path.resolve(TESTS_BASE_DIRECTORY, testId)

  for (const testPath of recursiveReadDirectory(testsPath)) {
    const suiteName = path.basename(testPath, path.extname(testPath))
    if (BLACKLIST.includes(suiteName)) {
      continue
    }

    for (const testCase of require(testPath)) {
      for (const instance of testCase.tests) {
        if (BLACKLIST.includes(`${from}|${suiteName}|${testCase.description}|${instance.description}`)) {
          continue
        }

        const index = testCase.tests.indexOf(instance)
        for (const to of Object.keys(builtin.jsonschema[from])) {
          tap.test(`${suiteName} (${from} -> ${to}) ${testCase.description} #${index}`, async (test) => {
            // We need at least an arbitrary id to make @hyperjump/json-schema work
            const id = `https://alterschema.sourcemeta.com/${_.kebabCase(testCase.description)}/${index}`
            if (from === 'draft4') {
              testCase.schema.id = testCase.schema.id || id
            } else {
              testCase.schema.$id = testCase.schema.$id || id
            }

            const metaschema = METASCHEMAS[from]
            test.ok(metaschema)

            if (typeof testCase.schema === 'boolean') {
              test.equal(testCase.schema, instance.valid)
              const schema = await alterschema(testCase.schema, from, to)
              test.equal(schema, testCase.schema)
            } else {
              testCase.schema.$schema = metaschema
              const beforeResult = await jsonschema.matches(testCase.schema, instance.data)
              test.equal(beforeResult, instance.valid)
              const schema = await alterschema(testCase.schema, from, to)
              const afterResult = await jsonschema.matches(schema, instance.data)
              test.equal(afterResult, instance.valid)
            }

            test.end()
          })
        }
      }
    }
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
    dependentRequired: {
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
