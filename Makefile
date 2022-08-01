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
	$(NODE) ./$</tap/bin/run.js --reporter=list --no-coverage --no-timeout $(word 2,$^)
