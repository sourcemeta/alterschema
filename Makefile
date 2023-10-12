.DEFAULT_GOAL = all
all: lint test

NPM ?= npm
NODE ?= node
INSTALL ?= install
SASSC ?= sassc
MKDIR ?= mkdir
CONVERT ?= convert

node_modules: package.json package-lock.json
	$(NPM) ci

.PHONY: lint
lint: node_modules
	$(NODE) ./$</standard/bin/cmd.js 'bindings/node/*.js' 'www/*.js'

.PHONY: test
test: node_modules bindings/node/test.js
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/walker.json -d walkers/jsonschema-draft4.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/walker.json -d walkers/jsonschema-draft6.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/walker.json -d walkers/jsonschema-draft7.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/walker.json -d walkers/jsonschema-2019-09.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/walker.json -d walkers/jsonschema-2020-12.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/walker-test.json -d test/walkers/jsonschema-draft4.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/walker-test.json -d test/walkers/jsonschema-draft6.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/walker-test.json -d test/walkers/jsonschema-draft7.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/walker-test.json -d test/walkers/jsonschema-2019-09.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/walker-test.json -d test/walkers/jsonschema-2020-12.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule.json -d rules/jsonschema-draft4-to-draft4.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule.json -d rules/jsonschema-draft4-to-draft6.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule.json -d rules/jsonschema-draft6-to-draft6.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule.json -d rules/jsonschema-draft6-to-draft7.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule.json -d rules/jsonschema-draft7-to-draft7.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule.json -d rules/jsonschema-draft7-to-2019-09.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule.json -d rules/jsonschema-2019-09-to-2019-09.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule.json -d rules/jsonschema-2019-09-to-2020-12.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule.json -d rules/jsonschema-2020-12-to-2020-12.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule-test.json -d test/rules/jsonschema-draft4-to-draft6.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule-test.json -d test/rules/jsonschema-draft4-to-draft7.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule-test.json -d test/rules/jsonschema-draft4-to-2019-09.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule-test.json -d test/rules/jsonschema-draft4-to-2020-12.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule-test.json -d test/rules/jsonschema-draft6-to-draft7.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule-test.json -d test/rules/jsonschema-draft6-to-2019-09.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule-test.json -d test/rules/jsonschema-draft6-to-2020-12.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule-test.json -d test/rules/jsonschema-draft7-to-2019-09.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule-test.json -d test/rules/jsonschema-draft7-to-2020-12.json
	$(NODE) ./$</ajv-cli/dist/index.js test --valid --spec=draft2020 -s schemas/rule-test.json -d test/rules/jsonschema-2019-09-to-2020-12.json
	$(NODE) ./$</tap/dist/esm/run.mjs --jobs=1 --reporter=list --coverage-report=none --timeout=0 $(word 2,$^)

dist:
	$(MKDIR) $@
dist/icon-%.png: www/icon.svg | dist
	$(CONVERT) -resize $(basename $(notdir $(subst icon-,,$@))) $< $@
dist/apple-touch-icon.png: dist/icon-180x180.png | dist
	$(INSTALL) -m 0664 $< $@
dist/favicon.ico: dist/icon-32x32.png | dist
	$(CONVERT) $^ $@
dist/main.css: www/main.scss node_modules | dist
	$(SASSC) --style compressed $< $@
dist/main.js: www/app.js node_modules | dist
	$(NODE) $(word 2,$^)/webpack/bin/webpack.js --mode=production ./$< -o $(dir $@)
dist/%: www/% | dist
	$(INSTALL) -m 0664 $< $@

.PHONY: www
www: \
	dist/icon.svg \
	dist/main.css \
	dist/main.js \
	dist/CNAME \
	dist/favicon.ico \
	dist/icon-192x192.png \
 	dist/icon-512x512.png \
	dist/apple-touch-icon.png \
	dist/index.html \
	dist/manifest.webmanifest
