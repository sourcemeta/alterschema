const _ = require('lodash')
const jsone = require('json-e')
const hash = require('object-hash')
const jsonschema = require('./jsonschema')
const walker = require('./walker')
const builtin = require('./builtin')

async function transformer (root, path, ruleset, trails, originalSchema, from) {
  const value = path.length === 0 ? root : _.get(root, path)
  for (const rule of ruleset) {
    // Guard against rules accidentally modifying the input document
    // Its easier than it sounds to make such mistake and JavaScript
    // does not provide true "const" semantics.

    if (await jsonschema.matches(rule.condition, value) &&
      jsonschema.usesVocabulary(root, value, rule.vocabulary)) {
      const output = jsone(rule.transform, {
        schema: value,
        original: originalSchema,
        jsonHash: (document) => {
          return hash.sha1(document)
        },
        hasContext: (key, value) => {
          for (const trail of trails) {
            const subpath = trail.path.concat(key)
            if (typeof value === 'undefined' && _.has(root, subpath)) {
              return true
            } else if (_.isEqual(_.get(root, subpath), value)) {
              return true
            }

            if (_.has(root, trail.path.concat(from === 'draft4' ? 'id' : '$id'))) {
              return false
            }
          }

          return false
        },

        // TODO: Use standard JSON-e operators instead
        omit: (object, keys) => {
          return _.omit(object, _.castArray(keys))
        },
        replace: (value, regex, replacement) => {
          return value.replace(new RegExp(regex, 'g'), replacement)
        }
      })

      if (await jsonschema.matches(rule.condition, output)) {
        throw new Error('Rule condition must not match after transform')
      }

      const newRoot = path.length === 0 ? output : _.set(root, path, output)
      return transformer(newRoot, path, ruleset, trails, originalSchema, from)
    }
  }

  return value
}

module.exports = async (value, from, to) => {
  let accumulator = _.cloneDeep(value)

  if (!builtin.jsonschema[from]) {
    throw new Error(`Invalid "from": ${from}`)
  } else if (!builtin.jsonschema[from][to]) {
    throw new Error(`Invalid "to": ${to}`)
  }

  for (const mapper of builtin.jsonschema[from][to]) {
    const trails = walker(mapper.walker, accumulator, []).sort((a, b) => {
      return b.path.length - a.path.length
    })

    for (const trail of trails) {
      // The trail might not be valid anymore if there were mid-way
      // transformation rules that changed the layout of the schema
      if (trail.path.length > 0 && !_.has(accumulator, trail.path)) {
        continue
      }

      const transform = await transformer(
        accumulator, trail.path, mapper.rules, trails, value, from)
      if (trail.path.length === 0) {
        accumulator = transform
      } else {
        _.set(accumulator, trail.path, transform)
      }
    }
  }

  return accumulator
}
