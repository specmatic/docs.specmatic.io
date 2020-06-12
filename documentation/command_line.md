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

## Introduction

Refer to [getting started](/documentation/getting_started.html)

## In-command help

The qontract command is full of helpful documentation.

You can start with `java -jar qontract.jar` to see help on the sub commands.

Then execute any sub command without parameters to see it. For example, try `java -jar qontract.jar stub`.

## Stub mode

Qontract can be used as a stub, for service virtualisation.

### HTTP stubs

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
    "http-request": {
        "method": "POST",
        "path": "/square",
        "body": 10
    },

    "http-response": {
        "status": 200,
        "body": 100
    }
}
```

Run the stub using `java -jar qontract math.qontract`.

The following commands use curl. This is readily available on Linux, and should be available on Windows using Cygwin, or Windows Subsystem For Linux on Microsoft Windows 10.

Run the command `curl -v -X POST -H "Content-Type: text/plain" -d 10 http://localhost:9000/square`. You should get back 100 as the response.

Then try `curl -v -X POST -H "Content-Type: text/plain" -d 20 http://localhost:9000/square`. Note that the input number has been changed to 20. You should get back a random number every time you run this command. This is because there was no expectation set for the input 10, but it matches the contract request format, so a random response is generated from the contract and returned.

### HTTP stub file format

http-request may contain the following keys:
- method: string - requred, HTTP method of the request
- path: string - requred, path of the request
- headers: json object - optional, keys are header names, values are the corresponding header values
- body: string - optional, body of the request
- form-fields: json object - optional, keys are form field names, values are the corresponding form field values
- multipart-formdata: array of json objects - optional, each contains the following keys
  - name: string - required, the name of the field
  - content: string - optional, used if the content is sent directly
  - filename: string - starts with an @ (e.g. @employee.csv), used if the content is expected to be from a file (provide either content or filename, not both)
  - contentType: string - the Content-Type header to expect
  - contentEncoding: string - the COntent-Encoding header to expect

http-response may contain the following keys:
- status: number - required, the http status in the response
- headers: json object - optional, keys are header names, values are the corresponding header values
- body: string - optional, body of the response

### Kafka stubs

Kafka stubs are only generated for stub data provided to Qontract in stub files.

Run the command `qontract stub --kafkaHost=<kafka host> --kafkaPort<kafka port> --data=<data dir> contract_file.qontract`. This will load the kafka message from the file, validate it against the specified contract file, and publish a message to the specified topic, on the kafka instance specified by the params named `kafkaHost` and `kafkaPort`.

Read more about the --data param [below](#stub-data-from-single-directory).

If you need a local Kafka instance to use in your testing, you can use `qontract stub --kafkaHost=<kafka host> --kafkaPort<kafka port> --data=<data dir> --startKafka contract_file.qontract`.

Note the `--startKafka` flag. Qontract will start a Kafka instance, load the stub data and validate it, create the needed topic and dump the message onto it.

## Multiple Contracts

To run a stub for multiple contracts, and hit the same end point:

    java -jar qontract.jar stub math1.qontract math2.qontract math3.qontract

Qontract accepts any number of .qontract files.

## Stub Data From Single Directory

If needed, you can put all the stub information in a single directory.

    java -jar qontract.jar stub --data=./stubdata math1.qontract math2.qontract math3.qontract

The format and file extension of the files in `./stubdata` must be the same as the files described above.

## Stubbing A Type Instead Of A Value

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

### Dynamically stubbing HTTP requests

While the Qontract instance is running, you can ask it to stub out a request by POSTING the stub to _stub_setup.

`curl -X POST -H 'Content-Type: application/json' -d '{"mock-http-request": {"method": "POST", "path": "/square", "body": 10}, "mock-http-response": {"status": 200, "body": 100}}' http://localhost:9000/_stub_setup`

The payload is follows the same structure as the json posted in the previous section.

## Test Mode

### HTTP test mode
The command to run test mode is:
`java -jar qontract.jar test --host=<hostname> --port=<port> <qontract filename>.qontract`

For each scenario, Qontract will make a request to the server on host:port, and validate the response. The request is generated from the contract spec. If examples are provided, they are used to generate the request. If not, then the request is generated randomly.

Take the math contract above. Use `java -jar qontract.jar samples math.qontract` to see what a request/response pair from this contract looks like.

Qontract will generate a similar request and send it to host:port, where the server application is expected to be running. The response that comes back from the server will be validated against the contract.

And if the server did not understand the request, it means that the contract request format and the server implementation are out of sync.

### Kafka test mode

You can test whether the available values on a Kafka topic meet the contract.

Use `qontract test --kafkaHost=<kafka host> --kafkaPort=<kafka port> contract_file.qontract`. Qontract will join a Kafka consumer group named `qontract`, subscribe to the topics mentioned in the contract file, pull the messages from those topics from the Kafka instance running on the specified kafkaHost and kafkaPort, and validate them according to the contract.

The command will exit with a non-zero value if any errors are found.

If you wish to ack the message you have read, use `qontract test --kafkaHost=<kafka host> --kafkaPort=<kafka port> --commit contract_file.qontract`. Note the `--commit` flag. Qontract will now read and test the message, but will ack them. The next time you run qontract test, there will be no messages available for reading on that topic.

### Build Server Integration

Qontract "test" command exits with status 0 or 1 to represent success or failure respectively.
You can configure your Provider builds to fail when it does not satisfy the contract.
