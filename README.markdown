alterschema
===========

Convert between JSON Schema specification versions.

Installation
------------

```sh
npm install --save alterschema
```

Documentation
-------------

### `alterschema(schema: JSON, from: string, to: string) -> JSON`

Transform the input document `schema` across JSON Schema versions denoted by
`from` and `to`. The supported transformations are:

| From    | To      | Description                                |
|---------|---------|--------------------------------------------|
| 2019-09 | 2020-12 | JSON Schema 2019-09 to JSON Schema 2020-12 |

Example
-------

```js
const alterschema = require('alterschema')
const result = alterschema({ ... }, '2019-09', '2020-12')
console.log(result)
```

CLI
---

```sh
npm install --global alterschema
alterschema --from <from> --to <to> path/to/schema.json
```
