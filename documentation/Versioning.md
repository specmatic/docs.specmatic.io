---
layout: default
title: Versioning
parent: Documentation
nav_order: 10
---
Versioning
==========

- [Versioning](#versioning)
  - [Backward Compatibility](#backward-compatibility)
  - [Versioning Naming Convention](#versioning-naming-convention)
  - [Ensuring Backward Compatibility](#ensuring-backward-compatibility)
    - [Compare Working Directory With HEAD](#compare-working-directory-with-head)
    - [Compare A Contract In Two Different Commits](#compare-a-contract-in-two-different-commits)
  - [Handling Contracts in progress](#handling-contracts-in-progress)

## Backward Compatibility

Take for example the math contract for squaring a number.

```gherkin
#Version 1
Feature: Math API

Scenario: Square of a number
When POST /square
And request-body (number)
Then status 200
And response-body (number)
```

If we add a new api for cubing numbers, the contract may look like this:

```gherkin
#Version 1
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

The newer contract is backward compatible with the older, and hence is still referred to as version 1.

However, if we changed the api of square, to take a json object instead of a value in the response:

```gherkin
Feature: Math API

Scenario: Square of a number
When POST /square
And request-body (number)
Then status 200
And response-body (number)
```

That would not be backward compatible with version 1, and hence this would be version 2.

## Versioning Naming Convention

We share contracts by committing them to a shared git repository. Refer [Manage Your Contracts](/documentation/manage_contracts.html)

Here's a sample git repository that contains the math contract with two different Versions:

```
<BASE_DIR>
    /run
        /specmatic
            /examples
                api_math_v1.spec
                api_math_v2.spec
```

  The underscore separates the name of the contract and version number. All updates to a contract file must be backward compatible.

## Ensuring Backward Compatibility
 
Since the file is in git, comparing it with its previous version is easy.

### Compare Working Directory With HEAD

Let's say you have the git repo in your home directory with the directory structure mentioned above.

Make a change to api_math_1.spec.

To check if the change is backward compatible, open a terminal or command prompt and run the command `java -jar specmatic.jar compatible git file ./run/specmatic/examples/api_math_v1.spec`. You should see something like this if the change is backward compatible:

```shell
> java -jar specmatic.jar compatible git file ./run/specmatic/examples/api_math_v1.spec
Tests run: 1, Passed: 1, Failed: 0

The newer contract is backward compatible
```

If not, you'll see an error report.

The exit status on failure is non zero, so you can use this if you wish to write scripts.

### Compare A Contract In Two Different Commits

This is useful in CI.

If you wish to compare the changes in a contract between two commits, such as HEAD and HEAD^1, try this:

```shell
> java -jar specmatic.jar compatible git commits ./remote/random.spec HEAD HEAD^1
Tests run: 1, Passed: 1, Failed: 0

The newer contract is backward compatible
```

This requires of course that there are two versions at least in the git repository.

You can even use commit hashes here if you wish to compare any other pair of commits.

## Handling Contracts in progress

For contracts which are not finalized yet and are in progress, you can annotate them as @WIP. This annotation tag will skip backward compatibility check for the contract. 

```gherkin
@WIP
Scenario: Should be able to get a pet by petId
  When GET /pets/(petid:number)
  Then status 200
  And response-body {petid: "(number)"}
```
Once the contract is complete you can remove the @WIP tag.
