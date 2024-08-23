alterschema
===========

[<img src="./assets/logo.svg" align="right" width="100">](https://json-schema.org)

This project implements a language-independent [set of formal
transformations](https://github.com/jviotti/alterschema/tree/master/rules) to
automatically transform [JSON Schema](https://json-schema.org) documents across
versions of the specification.

**Try the web playground at:
[https://alterschema.sourcemeta.com](https://alterschema.sourcemeta.com)**

Coverage
--------

| From    | To      | Type     | Status       | Description                                                      |
|---------|---------|----------|--------------|------------------------------------------------------------------|
| 2019-09 | 2020-12 | Lossless | Full         | JSON Schema [2019-09][2019-09] to JSON Schema [2020-12][2020-12] |
| draft7  | 2019-09 | Lossless | Full         | JSON Schema [Draft 7][draft7] to JSON Schema [2019-09][2019-09]  |
| draft6  | draft7  | Lossless | Full         | JSON Schema [Draft 6][draft6] to JSON Schema [Draft 7][draft7]   |
| draft4  | draft6  | Lossless | Full         | JSON Schema [Draft 4][draft4] to JSON Schema [Draft 6][draft6]   |
| draft3  | draft4  | Lossless | Minimal [^1] | JSON Schema [Draft 3][draft3] to JSON Schema [Draft 4][draft4]   |

[^1]: This is a heavy work-in-progress. Subscribe to https://github.com/sourcemeta/alterschema/issues/83 for the latest updates.

Transformations are transitively applied. For example, transforming from
`draft6` to `2019-09` implies transforming `draft6` to `draft7` and `draft7` to
`2019-09`.

Bindings
--------

### JavaScript

```js
// (1) Install by running "npm install --save alterschema"
const alterschema = require('alterschema')

// (2) alterschema(schema: JSON, from: string, to: string) -> JSON
// Transform the input document `schema` according to the
// `from` and `to` string parameters.
const result = await alterschema({ ... }, '2019-09', '2020-12')

console.log(result)
```

#### Command-line tool

```sh
# (1) Install globally through npm
npm install --global alterschema
# (2) Run the command-line tool
alterschema --from <from> --to <to> path/to/schema.json
```

### Others

We accept contributions to implement `alterschema` in any programming language.
To produce an `alterschema` implementation, your programming language of choice
must support a JSON Schema 2020-12 validator and a
[JSON-e](https://json-e.js.org) interpreter.

Acknowledgements
----------------

Special thanks to [@gregdeniss](https://github.com/gregsdennis) for curating
the initial set of upgrade rules.

[2020-12]: https://json-schema.org/draft/2020-12/json-schema-core.html
[2019-09]: https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-02
[draft7]: https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-00
[draft6]: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-01
[draft4]: https://datatracker.ietf.org/doc/html/draft-zyp-json-schema-04
[draft3]: https://datatracker.ietf.org/doc/html/draft-zyp-json-schema-03
