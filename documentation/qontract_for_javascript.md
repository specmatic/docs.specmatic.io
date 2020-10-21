---
layout: default
title: JavaScript
parent: Documentation
nav_order: 18
---
Qontract for JavaScript
==============

### Use Qontract node module

The easiest way to get started with Qontract for JavaScript developers is to use the [qontract node module](https://www.npmjs.com/package/qontract).

## Quick Start
```npm install qontract```  will install the qontract locally to the node project.

### Sample npm scripts to run qontract:

You can just add these npm scripts in your package.json and you should be good to run them using `npm run script-name` in a node environment.

`"qontract-stub": "qontract stub *.qontract --data src/mocks --host=localhost --port=8000"`

`"qontract-test": "qontract test *.qontract --host=localhost --port=8000"`

Here, `*.qontract` is the path of qontract files and `src/mocks` is the path for the stub data directory.

(Check [Documentation](https://qontract.run/documentation.html) for more information on cli commands and arguments.)

## Test helper library

The npm module also provides a set of helper functions to be used in automated tests:

`import { startStubServer, startTestServer, loadDynamicStub } from 'qontract';`

Qontract JS library exposes methods which can be used in your JS project to setup the tests, as well as do advanced things like load stubs dynamically.


`startStubServer(qontractDir: string, stubDir: string, host: string, port: string)`

method to start the stub server.

`startTestServer(qontractDir: string, host: string, port: string)`

method to start test server.

`loadDynamicStub(stubPath: string)`

method to load stub dynamically from inside an automated test.

