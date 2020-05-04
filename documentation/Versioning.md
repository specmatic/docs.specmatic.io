---
layout: default
title: Versioning
parent: Documentation
nav_order: 7
---
Versioning
==========

## The Versioning Model

Contracts can be versioned. Contracts have a major and minor version. If the contract is changed, and it is backward compatible with the older one, the minor version is incremented. If not, the major version is incremented.

Take for example the math contract for squaring a number.

```gherkin
Feature: Math API

Scenario: Square of a number
When POST /square
And request-body (number)
Then status 200
And response-body (number)
```

If we add a new api for cubing numbers, 
## Filesystem Structure

## Commands

Take for example the math contract for squaring a number.

```gherkin
Feature: Math API

Scenario: Square of a number
When POST /square
And request-body (number)
Then status 200
And response-body (number)
```

Create a directory in <HOME>/contracts/run/qontract/examples/math, and put this contract in a file called 1.qontract.

Let's make a change to the contract, to add a new API to cube numbers.

```gherkin
Feature: Math API

Scenario: Square of a number
When POST /square
And request-body (number)
Then status 200
And response-body (number)

Scenario: Cube of a number
When POST /cube
And request-body (number)
Then status 200
And response-body (number)
```

This can be stored in 1.1.qontract, in the same directory.

To ensure that the contracts are backward compatible before putting the file there:

    java -jar qontract.jar compare <HOME>/contracts/run/qontract/examples/math ./1.1.qontract

This will tell you whether 1.1 is backward compatible, and give you feedback if not.

Alternatively, after putting it in the <HOME>/contracts/run/qontract/examples/math, you can try this:

    cd <HOME>/contracts/run/qontract/examples/math
    java -jar qontract.jar check . 1

This will tell Qontract to check the current directory for all 1.x versions. Qontract will check backward compatibility of 1 to 1.1, 1.1 to 1.2 (if 1.2 exists), and so on to the end. If any successive pair of contracts are not compatible, it will warn you immediately.

In a dynamic environment, people may update a contract without the provider dev knowing about it. If the tests are always using the latest contract in their build pipeline, such an update will break the build. To avoid this, the provider dev may freeze on a specific version to test with, say version 1.1. Harking back to our example from a moment ago, command for this would be `java -jar qontract.jar check . 1.1`. Even if 1.2, 1.3, etc exist, Qontract will check backward compatibility of 1.1 with 1, and stop at that.

You can run the test command in your build pipeline, as mentioned in the [Command Line documentation](/documentation/command_line.html#test-mode). This command has a switch `--check` which can be used to verify backward compatibility of all prior minor versions of the contract. If --check is used and any of the contracts in the chain from the start upto the specified contract break backward compatibility, the command exists with a status value of 1, which can be used in a build pipeline to break the build.
