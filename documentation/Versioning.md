---
layout: default
title: Versioning
parent: Documentation
nav_order: 7
---
Versioning
==========

## Versions And Backward Compatibility

Qontract alerts developers to backward compatibility breakage caused by any changes to the API. It detects this breakage by comparing the latest version of the contract with the previous one. For this, Qontract needs to have both versions available.

## The Versioning Model

Contracts have a major and minor version. If the contract is changed, and it is backward compatible with the older one, the minor version is incremented. If not, the major version is incremented.

This is similar to [semantic versioning](https://semver.org).

Take for example the math contract for squaring a number.

```gherkin
Feature: Math API

Scenario: Square of a number
When POST /square
And request-body (number)
Then status 200
And response-body (number)
```

If we add a new api for cubing numbers, the contract may look like this:

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

The old /square remains intact, and the new /cube API is tacked on.

We would consider this version 1.1.

However, if we changed the api of square, to take a json object instead of a value in the response:

```gherkin
Feature: Math API

Scenario: Square of a number
When POST /square
And request-body (number)
Then status 200
And response-body (number)
```

That would not be backward compatible with version 1, and hence this would be version 2, which is an increment to the major version.

## Filesystem Structure

All versions of a contract must be in the same directory.

Take the math API contracts above, and consider the below file system hierarchy.

    <BASE_DIR>
        /contracts
            /math
                /run
                    /qontracts
                        /examples
                            /math
                                /1.qontract
                                /1.1.qontract
                                /2.qontract

- /contracts is the recommended convention for storing contracts in, when the directoy is not managed by contract.
- /math is the directory in which the git repo is checked out. We are assuming here that you will share this contract, and will check it into a git repo for easier sharing.
- The rest (/run/qontracts/examples/math) is much like a namespace. It's likely that you will be sharing multiple contracts out. You should come up with a namespacing scheme to group your contracts meaningfully, and create a directory structure to match that hierarchy.
- Within /run/qontracts/examples/math, the file names are contract versions, and the extensions are .qontract.

## Commands

### compare
To test backward compatibility, use the compare command.

    java -jar qontract.jar compare <BASE_DIR>/run/qontracts/examples/math/1.qontract <BASE_DIR>/run/qontracts/examples/math/1.1.qontract

This will tell you whether 1.1 is backward compatible, and give you feedback if not.

### check

To check whether all version 1 contracts are backward compatible, use the check command

    java -jar qontract.jar check <BASE_DIR>/run/qontracts/examples/math 1

Qontract will verify the backward compatibility of 1 to 1.1, 1.1 to 1.2 (if 1.2 exists), and so on to the end, in the /run/qontracts/examples/math directory. If any successive pair of contracts are not compatible, it will warn you immediately.

In this case, we have only 1 and 1.1. So if 1.1 is not backward compatible with 1, you will be warned.

To check backward compatibility upto a specific version:

    java -jar qontract.jar check <BASE_DIR>/run/qontracts/examples/math 1.1

This is useful when someone accidentally gets an incompatible contract into the repository.

Suppose someone commits a new version 1.2.qontract by accident:

```gherkin
Feature: Math API

Scenario: Square of a number
When POST /square
And request-body (string)
Then status 200
And response-body (number)
```

It is not backward compatible with 1.1, because it describes an API expecting a string in the request body, where a number was expected in 1.1.

And if you specify specify only the major version number, it will return an error. This is not desirable if you have not yet started building support for the latest contract yet.

So specify the minor version to lock the contract version at what you support, and bump it up when you support a higher version.

### test

You can run the test command in your build pipeline:

    java -jar qontract.jar test --check <contract file path>

Run `java -jar qontract.jar test` for more information on the command, and also see [Command Line documentation](/documentation/command_line.html#test-mode).

If `--check` is used and any of the contracts in the chain from the start upto the specified contract break backward compatibility, the command exists with a status value of 1. This can be used in a build pipeline to break a build when contracts are backward compatible for any reason.

This is a safeguard. Ideally, never modify a contract once it's checked in, except if it was broken or backward incompatible, and has been committed by accident.

## Sharing Contracts

Contracts are best used as a lingua franca, a description of the API that is shared by all.

One way of sharing the contracts is to use git. Everyone who needs the contracts should check the repo out on their machine.

Recommendations:
- Create a directory name /contracts in your user home directory. User home is a location on all laptops, and hence will be a convenient place from which to lookup contracts for running tests.
- Checkout the git repo in `/<your home directory>/contracts`, e.g. `/<your home directory>/contracts/math`.

This will achieve the following:
- By using a git repo, all who need the contract will get it from the same place, ensuring that all have the same contract.
- If we keep the contracts in `<user home directory>/contracts`, which is a path that can be created in any dev environment, we will be able to lookup contracts from tests easily without having to make customisations for each individual developer.

## CI / CD

### Test Mode - The API Build Pipeline

Use the command `java -jar qontract.jar test --check <contract file path with minor version> to run your tests.

Qontract exists with a non-zero value if the tests fail, which can be used to break a build.

### Stub Mode - The API Consumer Build Pipeline

In the consumer pipeline when using qontract in stub mode, simply start qontract in stub mode before running your tests.

[Read more about stub mode here](/documentation/command_line.html#stub-mode).
