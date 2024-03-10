// TODO: Find a way to specify transitiveness in a less verbose manner: DONE

// mappers to store all the mappers of all drafts from draft3 to draft7.
const drafts = ["draft3", "draft4", "draft6", "draft7", "2019-09", "2020-12"];
const mappers = drafts.flatMap((draft, index) => {
  const rules = [require(`../../rules/jsonschema-${draft}-to-${draft}.json`)];
  if (index + 1 < drafts.length) {
    rules.push(require(`../../rules/jsonschema-${draft}-to-${drafts[index + 1]}.json`));
  }
  return rules;
});

// index_mapper maps drafts to their index in the mappers array. This is used to find the subarray of mappers to be returned.
const index_mapper = new Map(drafts.map((draft, index) => [draft, index * 2]));

module.exports = (from, to) => {
  if (!index_mapper.has(from)) {
    throw new Error(`Invalid "from": ${from}`);
  } else if (!index_mapper.has(to)) {
    throw new Error(`Invalid "to": ${to}`);
  }

  const fromIndex = index_mapper.get(from);
  const toIndex = index_mapper.get(to);
  return mappers.slice(fromIndex, toIndex + 1);
};
