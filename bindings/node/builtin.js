// mappers to store all the mappers of all drafts from draft3 to draft7
const drafts = ['draft3', 'draft4', 'draft6', 'draft7', '2019-09', '2020-12']
const mappers = drafts.flatMap((draft, index) => {
  const rules = [require(`../../rules/jsonschema-${draft}-to-${draft}.json`)]
  if (index + 1 < drafts.length) {
    rules.push(require(`../../rules/jsonschema-${draft}-to-${drafts[index + 1]}.json`))
  }
  return rules
})

// indexMapper maps drafts to their index in the mappers array. This is used to find the subarray of mappers to be returned.
const indexMapper = new Map(drafts.map((draft, index) => [draft, index * 2]))

exports.builtin = (from, to) => {
  if (!indexMapper.has(from)) {
    throw new Error(`Invalid "from": ${from}`)
  } else if (!indexMapper.has(to)) {
    throw new Error(`Invalid "to": ${to}`)
  }

  const fromIndex = indexMapper.get(from)
  const toIndex = indexMapper.get(to)
  return mappers.slice(fromIndex, toIndex + 1)
}

exports.drafts = drafts
