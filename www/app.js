const CodeMirror = require('codemirror')
const codemirrorJSON = require('@codemirror/lang-json')
const codemirrorLint = require('@codemirror/lint')
const builtin = require('../bindings/node/builtin')
const alterschema = require('../bindings/node')
const packageJSON = require('../package.json')

const SPECIFICATION_NAMES = {
  draft4: 'Draft 4',
  draft6: 'Draft 6',
  draft7: 'Draft 7'
}

function safeJSONParse (string) {
  try {
    return JSON.parse(string)
  } catch (error) {
    return null
  }
}

function appendOption (selectElement, name, value, isSelected = false) {
  const option = document.createElement('option')
  option.innerText = name
  option.setAttribute('value', value)
  if (isSelected) {
    option.setAttribute('selected', '')
  }

  selectElement.appendChild(option)
}

function getSelectValue (element) {
  return element.selectedIndex === -1
    ? null
    : element.options[element.selectedIndex].value
}

function setSpecificationOptions (element, options) {
  const currentValue = getSelectValue(element)
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

function onError (error) {
  output.value = `ERROR: ${error.message}`
}

const editor = new CodeMirror.EditorView({
  doc: JSON.stringify({
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
  }, null, 2),
  extensions: [
    CodeMirror.basicSetup,
    codemirrorJSON.json(),
    codemirrorLint.linter(codemirrorJSON.jsonParseLinter())
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
    Object.keys(builtin.jsonschema[event.target.value]).reverse())
})

document.getElementById('version').innerText = `v${packageJSON.version}`
setSpecificationOptions(from, Object.keys(builtin.jsonschema))
from.dispatchEvent(new Event('change'))
editor.focus()
transform.dispatchEvent(new Event('click'))
