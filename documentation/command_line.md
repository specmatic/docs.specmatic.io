---
layout: default
title: Command Line
parent: Documentation
nav_order: 4
---
Command Line
============

Qontract Standalone Jar severs two purposes.
* **Zero IDE setup and no code** You can run Contract Tests without a writing a single line of code. Just need to author the Contract to describe your API.
* **Work with several languages and tech stack** Your provider can be a Python Application and the Consumer a JavaScript application. Qontract can work with that setup in the command line mode.

### Introduction

Refer to [getting started](/documentation/getting_started.md)

### In-command help

The qontract command is full of helpful documentation.

You can start with `java -jar qontract.jar` to see help on the sub commands.

Then execute any sub command without parameters to see it. For example, try `java -jar qontract.jar stub`.

### Stub mode

Qontract can be used as a stub.

For example, create the following contract in a file name math.qontract:

```gherkin
Feature: Math API

Scenario: Square of a number
    When POST /square
    And request-body (number)
    Then response-body (number)
```

Now create a directory named math_data. This name is derived from the contract filename, by replacing the extension (.qontract) with _data.

In math_data, create a new file named square.json, containing this json document:

```json
{
    "mock-http-request": {
        "method": "POST",
        "path": "/square",
        "body": 10
    },

    "mock-http-response": {
        "status": 200,
        "body": 100
    }
}
```

Run the stub using `java -jar qontract math.qontract`.

The following commands use curl. This is readily available on Linux, and should be available on Windows using Cygwin, or Windows Subsystem For Linux on Microsoft Windows 10.

Run the command `curl -v -X POST -H "Content-Type: text/plain" -d 10 http://localhost:9000/square`. You should get back 100 as the response.

Then try `curl -v -X POST -H "Content-Type: text/plain" -d 20 http://localhost:9000/square`. Note that the input number has been changed to 20. You should get back a random number every time you run this command. This is because there was no expectation set for the input 10, but it matches the contract request format, so a random response is generated from the contract and returned.

### Stubbing A Type Instead Of A Value

The stub can be configured to always return 100, as long as the request is in the right format.

Your json document should looks like this:

```json
{
    "mock-http-request": {
        "method": "POST",
        "path": "/square",
        "body": "(number)"
    },

    "mock-http-response": {
        "status": 200,
        "body": 100
    }
}
```

This time, `curl -v -X POST -H "Content-Type: text/plain" -d 10 http://localhost:9000/square` and `curl -v -X POST -H "Content-Type: text/plain" -d 20 http://localhost:9000/square` will both get 100 back in the response.

### Test Mode

The command to run test mode is:
`java -jar qontract.jar test --host=<hostname> --port=<port> <qontract filename>.qontract`

For each scenario, Qontract will make a request to the server on host:port, and validate the response. The request is generated from the contract spec. If examples are provided, they are used to generate the request. If not, then the request is generated randomly.

Take the math contract above. Use `java -jar qontract.jar samples math.qontract` to see what a request/response pair from this contract looks like.

Qontract will generate a similar request and send it to host:port, where the server application is expected to be running. The response that comes back from the server will be validated against the contract.

And if the server did not understand the request, it means that the contract request format and the server implementation are out of sync.

### Build Server Integration

Qontract "test" command exits with status 0 or 1 to represent success or failure respectively.
You can configure your Provider builds to fail when it does not satisfy the contract.
