alterschema
===========

Convert between JSON Schema specification versions.

Installation
------------

```sh
npm install --save alterschema
```

Programmatic Use
----------------

#### `alterschema(schema: JSON, from: string, to: string) -> JSON`

Transform the input document `schema` according to the `from` and `to` string
parameters. The supported transformations are as follows:

##### Upgrade

| From    | To      | Type     | Status       | Description                                                      |
|---------|---------|----------|--------------|------------------------------------------------------------------|
| 2019-09 | 2020-12 | Lossless | Partial [^1] | JSON Schema [2019-09][2019-09] to JSON Schema [2020-12][2020-12] |
| draft7  | 2019-09 | Lossless | TODO         | JSON Schema [Draft 7][draft7] to JSON Schema [2019-09][2019-09]  |
| draft6  | draft7  | Lossless | TODO         | JSON Schema [Draft 6][draft6] to JSON Schema [Draft 7][draft7]   |
| draft4  | draft6  | Lossless | TODO         | JSON Schema [Draft 4][draft4] to JSON Schema [Draft 6][draft6]   |

[^1]: Does not handle converting `$recursiveRef` and `$recursiveAnchor` to `$dynamicRef` and `$dynamicAnchor`.

##### Downgrade

| From    | To      | Type     | Status     | Description                                                      |
|---------|---------|----------|------------|------------------------------------------------------------------|
| 2020-12 | 2019-09 | Lossy    | TODO       | JSON Schema [2020-12][2020-12] to JSON Schema [2019-09][2019-09] |
| 2019-09 | draft7  | Lossy    | TODO       | JSON Schema [2019-09][2019-09] to JSON Schema [Draft 7][draft7]  |
| draft7  | draft6  | Lossy    | TODO       | JSON Schema [Draft 7][draft7] to JSON Schema [Draft 6][draft6]   |
| draft6  | draft4  | Lossy    | TODO       | JSON Schema [Draft 6][draft6] to JSON Schema [Draft 4][draft4]   |

Transformations can be transitively applied. For example, transforming from
`draft6` to `2019-09` implies transforming `draft6` to `draft7` and `draft7` to
`2019-09`.

### Example

```js
const alterschema = require('alterschema')
const result = alterschema({ ... }, '2019-09', '2020-12')
console.log(result)
```

Command-line tool
-----------------

The project also ships with a command-line tool:

```sh
# Install globally through npm
npm install --global alterschema
# Run the command-line tool
alterschema --from <from> --to <to> path/to/schema.json
```

[2020-12]: https://json-schema.org/draft/2020-12/json-schema-core.html
[2019-09]: https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-02
[draft7]: https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-00
[draft6]: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-01
[draft4]: https://datatracker.ietf.org/doc/html/draft-zyp-json-schema-04
