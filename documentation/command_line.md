---
layout: default
title: Command Line
parent: Documentation
nav_order: 2
---
Command Line
============

## Introduction

Specmatic Standalone Jar severs two purposes.
* **Zero IDE setup and no code** You can run Contract Tests without a writing a single line of code. Just need to author the Contract to describe your API.
* **Work with several languages and tech stack** Your provider can be a Python Application and the Consumer a JavaScript application. Specmatic can work with that setup in the command line mode.

Refer to [getting started](/getting_started.html) to learn how to download the jar.

## Setting up the specmatic command

### Alias on MacOS / Linux

1. Install java, make sure you can run `java -version` at your shell prompt.
2. Download specmatic to ~/bin
  * Create a directory named bin in your home directory.
  * Download the [specmatic.jar](https://github.com/znsio/specmatic/releases/download/{{ site.latest_release }}/specmatic.jar) file and place it in this bin directory.
  * Test that this is done correctly by running this command: `java -jar ~/bin/specmatic.jar --version`. This should display the version of the specmatic jar.
3. Update your .bashrc or .zshrc file
  * Add this line at the end of your .zshrc or .bashrc file: `alias specmatic='java -jar ~/bin/specmatic.jar'`
  * Zsh users, run this command `source ~/.zshrc`. Bash users: `source ~/.bashrc`
4. Profit! You should now be able to run this: `specmatic --version`

### On Windows

Keep the specmatic.jar file in an easy to access spot, such as C:\bin

That way, it will be easy to run `java -jar c:\bin\specmatic.jar` when needed.

## In-command help

The specmatic command is full of helpful documentation.

You can start with `java -jar specmatic.jar` to see help on the sub commands.

Then execute any sub command without parameters to see it. For example, try `java -jar specmatic.jar stub`.

## Stub mode

Specmatic can be used as a stub, for service virtualisation.

### HTTP stubs

For example, create the following contract in a file name math.spec:

```gherkin
Feature: Math API

Scenario: Square of a number
    When POST /square
    And request-body (number)
    Then response-body (number)
```

Now create a directory named math_data. This name is derived from the contract filename, by replacing the extension (.spec) with _data.

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

Run the stub using `java -jar specmatic math.spec`.

The following commands use curl. This is readily available on Linux, and should be available on Windows using Cygwin, or Windows Subsystem For Linux on Microsoft Windows 10.

Run the command `curl -v -X POST -H "Content-Type: text/plain" -d 10 http://localhost:9000/square`. You should get back 100 as the response.

Then try `curl -v -X POST -H "Content-Type: text/plain" -d 20 http://localhost:9000/square`. Note that the input number has been changed to 20. You should get back a random number every time you run this command. This is because there was no expectation set for the input 10, but it matches the contract request format, so a random response is generated from the contract and returned.

### HTTP stub file format

[Review the file format here](/documentation/service_virtualisation.html#stub-file-format).

### Kafka stubs

Kafka stubs are only generated for stub data provided to Specmatic in stub files.

Run the command `specmatic stub --kafkaHost=<kafka host> --kafkaPort<kafka port> --data=<data dir> contract_file.spec`. This will load the kafka message from the file, validate it against the specified contract file, and publish a message to the specified topic, on the kafka instance specified by the params named `kafkaHost` and `kafkaPort`.

Read more about the --data param [below](#stub-data-from-single-directory).

If you need a local Kafka instance to use in your testing, you can use `specmatic stub --kafkaHost=<kafka host> --kafkaPort<kafka port> --data=<data dir> --startKafka contract_file.spec`.

Note the `--startKafka` flag. Specmatic will start a Kafka instance, load the stub data and validate it, create the needed topic and dump the message onto it.

## Multiple Contracts

To run a stub for multiple contracts, and hit the same end point:

    java -jar specmatic.jar stub payment_api.spec journey_api.spec ticket_api.spec

Specmatic accepts any number of .spec files.

## Stub Data From Single Directory

If needed, you can put all the stub information in a single directory.

    java -jar specmatic.jar stub --data=./stubdata payment_api.spec journey_api.spec ticket_api.spec

The format and file extension of the files in `./stubdata` must be the same as the files described above.

For more information, check out the documentation on [service virtualisation](/documentation/service_virtualisation.html).

## Test Mode

### HTTP test mode
The command to run test mode is:
`java -jar specmatic.jar test --host=<hostname> --port=<port> <specmatic filename>.spec`

For each scenario, Specmatic will make a request to the server on host:port, and validate the response. The request is generated from the contract spec. If examples are provided, they are used to generate the request. If not, then the request is generated randomly.

Take the math contract above. Use `java -jar specmatic.jar samples math.spec` to see what a request/response pair from this contract looks like.

Specmatic will generate a similar request and send it to host:port, where the server application is expected to be running. The response that comes back from the server will be validated against the contract.

And if the server did not understand the request, it means that the contract request format and the server implementation are out of sync.

### Kafka test mode

You can test whether the available values on a Kafka topic meet the contract.

Use `specmatic test --kafkaHost=<kafka host> --kafkaPort=<kafka port> contract_file.spec`. Specmatic will join a Kafka consumer group named `specmatic`, subscribe to the topics mentioned in the contract file, pull the messages from those topics from the Kafka instance running on the specified kafkaHost and kafkaPort, and validate them according to the contract.

The command will exit with a non-zero value if any errors are found.

If you wish to ack the message you have read, use `specmatic test --kafkaHost=<kafka host> --kafkaPort=<kafka port> --commit contract_file.spec`. Note the `--commit` flag. Specmatic will now read and test the message, but will ack them. The next time you run specmatic test, there will be no messages available for reading on that topic.

### Build Server Integration

Specmatic "test" command exits with status 0 or 1 to represent success or failure respectively.
You can configure your Provider builds to fail when it does not satisfy the contract.

For more information, check out the documentation on [running contract tests](/documentation/contract_tests.html).
