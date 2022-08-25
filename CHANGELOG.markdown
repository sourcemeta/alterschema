Changelog
=========

All notable changes to this project will be documented in this file.

The format is based on [Keep a
Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[1.1.1] - 2022-08-24
--------------------

### Changed

- Fix `additionalItems` not being transformed to `items` in `$ref`
- Fix `items` not being transformed to `prefixItems` in `$ref`

[1.1.0] - 2022-08-23
--------------------

### Added

- Add support for upgrading `$recursiveRef` and `$recursiveAnchor` to
  `$dynamicRef` and `$dynamicAnchor`

[1.0.6] - 2022-08-15
--------------------

### Changed

- Correctly replace `dependencies` to `dependentRequired`
- Fix sub-schema walking not working correctly in certain structural
  transformations

[1.0.5] - 2022-08-15
--------------------

### Changed

- Upgrade `@hyperjump/json-schema` to fix `rimraf` issue when installing
  `alterschema` with `sudo`

[1.0.4] - 2022-08-10
--------------------

### Changed

- Fix `definitions` not being upgraded to `$defs` in `$ref` JSON Pointers

[1.0.3] - 2022-08-05
--------------------

### Changed

- Fix `enum` being always casted to `const`

[1.0.2] - 2022-08-01
--------------------

### Changed

- Fix Node.js CLI entrypoint

[1.0.1] - 2022-08-01
--------------------

### Changed

- Improve "from" and "to" argument validation

[1.0.0] - 2022-08-01
--------------------

### Added

- Full JSON Schema draft4 to JSON Schema draft6 upgrade support
- Full JSON Schema draft6 to JSON Schema draft7 upgrade support
- Full JSON Schema draft7 to JSON Schema 2019-09 upgrade support

[0.0.1] - 2022-07-01
--------------------

### Added

- Partial JSON Schema 2019-09 to JSON Schema 2020-12 upgrade support

[1.1.1]: https://github.com/sourcemeta/alterschema/releases/tag/v1.1.1
[1.1.0]: https://github.com/sourcemeta/alterschema/releases/tag/v1.1.0
[1.0.6]: https://github.com/sourcemeta/alterschema/releases/tag/v1.0.6
[1.0.5]: https://github.com/sourcemeta/alterschema/releases/tag/v1.0.5
[1.0.4]: https://github.com/sourcemeta/alterschema/releases/tag/v1.0.4
[1.0.3]: https://github.com/sourcemeta/alterschema/releases/tag/v1.0.3
[1.0.2]: https://github.com/sourcemeta/alterschema/releases/tag/v1.0.2
[1.0.1]: https://github.com/sourcemeta/alterschema/releases/tag/v1.0.1
[1.0.0]: https://github.com/sourcemeta/alterschema/releases/tag/v1.0.0
[0.0.1]: https://github.com/sourcemeta/alterschema/releases/tag/v0.0.1
