---
layout: default
title: JavaScript
parent: Documentation
nav_order: 18
---
Specmatic for JavaScript
==============

### Use Specmatic node module

The easiest way to get started with Specmatic for JavaScript developers is to use the [specmatic node module](https://www.npmjs.com/package/specmatic).

## Quick Start
```npm install specmatic```  will install the specmatic locally to the node project.

### Sample npm scripts to run specmatic:

You can just add these npm scripts in your package.json and you should be good to run them using `npm run script-name` in a node environment.

`"specmatic-stub": "specmatic stub *.spec --data src/mocks --host=localhost --port=8000"`

`"specmatic-test": "specmatic test *.spec --host=localhost --port=8000"`

Here, `*.spec` is the path of specmatic files and `src/mocks` is the path for the stub data directory.

(Check [Documentation](https://specmatic.in/documentation.html) for more information on cli commands and arguments.)

## Test helper library

The npm module also provides a set of helper functions to be used in automated tests:

`import { startStubServer, startTestServer, loadDynamicStub } from 'specmatic';`

Specmatic JS library exposes methods which can be used in your JS project to setup the tests, as well as do advanced things like load stubs dynamically.


`startStubServer(specmaticDir: string, stubDir: string, host: string, port: string)`

method to start the stub server.

`startTestServer(specmaticDir: string, host: string, port: string)`

method to start test server.

`loadDynamicStub(stubPath: string)`

method to load stub dynamically from inside an automated test.

