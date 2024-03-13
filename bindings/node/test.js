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
const { log } = require('console')
const METASCHEMAS = _.invert(require('../../metaschemas.json'))
<<<<<<< HEAD
const drafts = builtin.drafts
=======
const drafts = builtin.drafts;
>>>>>>> dc64ea550b0f50f4c6edd89fc258906db03f241c

const JSON_SCHEMA_TEST_SUITE = path.resolve(__dirname, '..', '..', 'vendor', 'json-schema-test-suite')
const TESTS_BASE_DIRECTORY = path.resolve(JSON_SCHEMA_TEST_SUITE, 'tests')
const REMOTES_BASE_DIRECTORY = path.resolve(JSON_SCHEMA_TEST_SUITE, 'remotes')

const recursiveReadDirectory = (directory) => {
  return fs.readdirSync(directory).reduce((accumulator, basename) => {
    const fullPath = path.resolve(directory, basename)
    return accumulator.concat(fs.statSync(fullPath).isDirectory()
      ? recursiveReadDirectory(fullPath)
      : fullPath)
  }, [])
}

<<<<<<< HEAD
for (const [draftIndex, from] of drafts.entries()) {
  for (const to of drafts.slice(draftIndex + 1)) {
=======
for (const [draft_index, from] of drafts.entries()) {
  for (const to of drafts.slice(draft_index + 1)) {
>>>>>>> dc64ea550b0f50f4c6edd89fc258906db03f241c
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
  // The JSON Schema implementation used by this module cannot
  // ignore keywords in locations that are not subschemas.
  // See https://github.com/hyperjump-io/json-schema-validator/blob/7b352e75b2d2e37b54e854b2289ec137507bb174/lib/json-schema-test-suite.spec.ts#L32-L36
  'draft4|id|id inside an enum is not a real identifier|exact match to enum, and type matches',
  'draft4|id|id inside an enum is not a real identifier|match $ref to id',
  'draft4|id|id inside an enum is not a real identifier|no match on enum or $ref to id',
  'draft6|id|id inside an enum is not a real identifier|exact match to enum, and type matches',
  'draft6|id|id inside an enum is not a real identifier|match $ref to id',
  'draft6|id|id inside an enum is not a real identifier|no match on enum or $ref to id',
  'draft7|id|id inside an enum is not a real identifier|exact match to enum, and type matches',
  'draft7|id|id inside an enum is not a real identifier|match $ref to id',
  'draft7|id|id inside an enum is not a real identifier|no match on enum or $ref to id',
  '2019-09|id|$id inside an enum is not a real identifier|exact match to enum, and type matches',
  '2019-09|id|$id inside an enum is not a real identifier|match $ref to $id',
  '2019-09|id|$id inside an enum is not a real identifier|no match on enum or $ref to $id',
  'draft6|id|non-schema object containing a plain-name $id property|skip traversing definition for a valid result',
  'draft6|id|non-schema object containing a plain-name $id property|const at const_not_anchor does not match',
  'draft7|id|non-schema object containing a plain-name $id property|skip traversing definition for a valid result',
  'draft7|id|non-schema object containing a plain-name $id property|const at const_not_anchor does not match',
  'draft6|unknownKeyword|$id inside an unknown keyword is not a real identifier|type matches second anyOf, which has a real schema in it',
  'draft6|unknownKeyword|$id inside an unknown keyword is not a real identifier|type matches non-schema in third anyOf',
  'draft7|unknownKeyword|$id inside an unknown keyword is not a real identifier|type matches second anyOf, which has a real schema in it',
  'draft7|unknownKeyword|$id inside an unknown keyword is not a real identifier|type matches non-schema in third anyOf',
  '2019-09|unknownKeyword|$id inside an unknown keyword is not a real identifier|type matches second anyOf, which has a real schema in it',
  '2019-09|unknownKeyword|$id inside an unknown keyword is not a real identifier|type matches non-schema in third anyOf',
  '2019-09|anchor|$anchor inside an enum is not a real identifier|exact match to enum, and type matches',
  '2019-09|anchor|$anchor inside an enum is not a real identifier|in implementations that strip $anchor, this may match either $def',
  '2019-09|anchor|$anchor inside an enum is not a real identifier|match $ref to $anchor',

  // TODO: Make these pass
  'ref',
  'refRemote'
]

<<<<<<< HEAD
for (const [draftIndex, from] of drafts.entries()) {
=======
for (const [draft_index, from] of drafts.entries()) {
>>>>>>> dc64ea550b0f50f4c6edd89fc258906db03f241c
  // TODO: Support running draft3 tests
  if (from === 'draft3') {
    continue
  }

  const testId = from === '2020-12' || from === '2019-09' ? `draft${from}` : from
  const testsPath = path.resolve(TESTS_BASE_DIRECTORY, testId)

  for (const remote of recursiveReadDirectory(REMOTES_BASE_DIRECTORY)) {
    const relativePath = path.relative(REMOTES_BASE_DIRECTORY, remote)
    const schema = require(remote)
    const schemaId = path.posix.join('http://localhost:1234', relativePath)
    const dialect = METASCHEMAS[from]
    try {
      jsonschema.implementation.add(schema, schemaId, dialect)
    } catch (error) {
      console.error(`Cannot add remote ${relativePath} for ${dialect}`)
    }
  }

  for (const testPath of recursiveReadDirectory(testsPath)) {
    // We don't consider optional suites
    if (path.basename(path.dirname(testPath)) === 'optional' ||
      path.basename(path.dirname(path.dirname(testPath))) === 'optional') {
      continue
    }

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
<<<<<<< HEAD
        for (const to of drafts.slice(draftIndex + 1)) {
=======
        for (const to of drafts.slice(draft_index + 1)) {
>>>>>>> dc64ea550b0f50f4c6edd89fc258906db03f241c
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
              testCase.schema.$schema = testCase.schema.$schema || metaschema
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
