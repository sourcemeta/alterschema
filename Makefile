.DEFAULT_GOAL = all
all: lint test

NPM ?= npm
NODE ?= node

node_modules: package.json package-lock.json
	$(NPM) ci

.PHONY: lint
lint: node_modules
	$(NODE) ./$</standard/bin/cmd.js 'bindings/node/*.js'

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
	$(NODE) ./$</tap/bin/run.js --reporter=list --no-coverage --no-timeout $(word 2,$^)