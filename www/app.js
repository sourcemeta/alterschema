const CodeMirror = require('codemirror')
const codemirrorJSON = require('@codemirror/lang-json')
const codemirrorLint = require('@codemirror/lint')
const builtin = require('../bindings/node/builtin')
const alterschema = require('../bindings/node')
const packageJSON = require('../package.json')
const METASCHEMAS = require('../metaschemas.json')

const SPECIFICATION_NAMES = {
  draft3: 'Draft 3',
  draft4: 'Draft 4',
  draft6: 'Draft 6',
  draft7: 'Draft 7'
}

function safeJSONParse(string) {
  try {
    return JSON.parse(string)
  } catch (error) {
    return null
  }
}

function appendOption(selectElement, name, value, isSelected = false) {
  const option = document.createElement('option')
  option.innerText = name
  option.setAttribute('value', value)
  if (isSelected) {
    option.setAttribute('selected', '')
  }

  selectElement.appendChild(option)
}

function getSelectValue(element) {
  return element.selectedIndex === -1
    ? null
    : element.options[element.selectedIndex].value
}

function setSpecificationOptions(element, options, expected) {
  const currentValue = expected || getSelectValue(element)
  element.innerHTML = ''
  for (const option of options) {
    appendOption(element, SPECIFICATION_NAMES[option] || option,
      option, currentValue === option)
  }
}

const from = document.getElementById('from')
const to = document.getElementById('to')
const input = document.getElementById('input')
const output = document.getElementById('output')
const transform = document.getElementById('upgrade')

function onError(error) {
  output.value = `ERROR: ${error.message}`
}

function refreshFrom(spec) {
  setSpecificationOptions(from, builtin.drafts, spec)
  from.dispatchEvent(new Event('change'))
}

const DEFAULT_SCHEMA = {
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
}

const editor = new CodeMirror.EditorView({
  doc: JSON.stringify(DEFAULT_SCHEMA, null, 2),
  extensions: [
    CodeMirror.basicSetup,
    codemirrorJSON.json(),
    codemirrorLint.linter(codemirrorJSON.jsonParseLinter()),
    CodeMirror.EditorView.updateListener.of((event) => {
      const types = event.transactions.reduce((accumulator, transaction) => {
        const annotations = transaction.annotations.filter((annotation) => {
          return typeof annotation.value === 'string'
        }).map((annotation) => {
          return annotation.value
        })

        return accumulator.concat(annotations)
      }, [])

      if (types.length === 0) {
        return
      } else if (types.length === 1) {
        if (types[0] === 'select.pointer' || types[0] === 'select') {
          return
        }
      }

      const jsonValue = safeJSONParse(event.state.doc.toString())
      if (jsonValue === null) {
        return
      }

      const spec = METASCHEMAS[jsonValue.$schema]
      if (!spec) {
        return
      }

      refreshFrom(spec)
    })
  ],
  parent: input
})

transform.addEventListener('click', () => {
  const fromValue = getSelectValue(from)
  const toValue = getSelectValue(to)
  const inputValue = editor.state.doc.toString()
  const jsonValue = safeJSONParse(inputValue)
  if (jsonValue === null) {
    window.plausible('Invalid')
    return onError(new Error('Invalid input JSON'))
  }

  window.plausible('Transform', {
    props: {
      from: fromValue,
      to: toValue
    }
  })

  alterschema(jsonValue, fromValue, toValue).then((result) => {
    output.value = JSON.stringify(result, null, 2)
  }).catch(onError)
})

from.addEventListener('change', (event) => {
  setSpecificationOptions(to,
    builtin.drafts.slice(builtin.drafts.indexOf(event.target.value) + 1).reverse())
})

document.getElementById('version').innerText = `v${packageJSON.version}`
refreshFrom(METASCHEMAS[DEFAULT_SCHEMA.$schema])
editor.focus()
transform.dispatchEvent(new Event('click'))
