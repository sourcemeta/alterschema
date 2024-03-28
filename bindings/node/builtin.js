const drafts = ['draft3', 'draft4', 'draft6', 'draft7', '2019-09', '2020-12']
// indexMapper maps drafts to their index in the mappers array. This is used to find the subarray of mappers to be returned.
const indexMapper = new Map(drafts.map((draft, index) => [draft, index * 2]))
const loadRequiredRules = (fromIndex, toIndex) => {
  const mappers = [];
  for (let index = fromIndex; index <= toIndex; index++) {
    const draft = drafts[index];
    const rule = require(`../../rules/jsonschema-${draft}-to-${draft}.json`);
    mappers.push(rule);
    if (index < toIndex) {
      const nextDraft = drafts[index + 1];
      const nextRule = require(`../../rules/jsonschema-${draft}-to-${nextDraft}.json`);
      mappers.push(nextRule);
    }
  }
  return mappers;
};
exports.builtin = (from, to) => {
  if (!indexMapper.has(from)) {
    throw new Error(`Invalid "from": ${from}`)
  }
  if (!indexMapper.has(to)) {
    throw new Error(`Invalid "to": ${to}`)
  }
  const fromIndex = indexMapper.get(from)
  const toIndex = indexMapper.get(to)
  return loadRequiredRules(fromIndex, toIndex);
};
exports.drafts = drafts