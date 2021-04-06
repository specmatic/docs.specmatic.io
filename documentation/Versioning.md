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
  - [Contract Namespaces And File System Structure](#contract-namespaces-and-file-system-structure)
  - [Ensuring Backward Compatibility](#ensuring-backward-compatibility)
    - [Compare Working Directory With HEAD](#compare-working-directory-with-head)
    - [Compare A Contract In Two Different Commits](#compare-a-contract-in-two-different-commits)
  - [Handling Contracts in progress](#handling-contracts-in-progress)

## Backward Compatibility

An API is backward compatible between releases if the clients are able to work with a new version of the API seamlessly.

Specmatic lets you ensure backward compatibility, you can validate contracts across versions allowing consumers to work with different versions of provider APIs.

Let’s understand this with an example. Assume that you have a math contract for squaring a number shown in the code snippet below.

```gherkin
#Version 1
Feature: Math API

Scenario: Square of a number
When POST /square
And request-body (number)
Then status 200
And response-body (number)
```

Now if we add a new API for cubing numbers to the same API, the contract will change to accommodate this:

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

Since the old `scenario` for square remains intact, and the new `scenario` for cube API is added to it, the newer contract is backward compatible with the older one, and so is still referred to as version 1.

However, if we change the API of square to take a json object instead of a value in the response, that will not be backward compatible with version 1, and hence the version number must be incremented to 2:

```gherkin
Feature: Math API

Scenario: Square of a number
When POST /square
And request-body (number)
Then status 200
And response-body (number)
```

## Contract Namespaces And File System Structure

<<<<<<< HEAD
When you will use a git repository for tracking changes in Contracts (like in examples above for math), the system structure may look like this:
=======
We share contracts by committing them to a git repository. Refer [Manage Your Contracts](/documentation/manage_contracts.html)

Here's a sample git repository that contains the math contract:
>>>>>>> Add references of Versioning and Manage contracts

```
<BASE_DIR>
    /in
        /specmatic
            /examples
                api_math_v1.spec
                api_math_v2.spec
```

<<<<<<< HEAD
- The path ./in/specmatic/examples acts as a namespace, much like a dot separated package name.
- Contract file names have 4 parts:
    1. They should start with the prefix `api_`. This indicates that the file contains a contract.
    2. The second part should be a meaningful name, which would indicate the API being referred to clearly to someone reading the file name.
    3. The third part should be a version number, such as v1, v2, etc.
    4. All Specmatic contract files names bear the extension `.spec`
    5. The underscore separates the name of the contract and version number
=======
- The path ./run/specmatic/examples acts as a namespace, much like a dot separated package name.
- Contract file names can begin with any text (no spaces)
    - The underscore separates the name of the contract and version number
    - In above example the name of contract is math and there are two versions of this API.
>>>>>>> Add references of Versioning and Manage contracts

In above example the name of contract is math and there are two versions of this API.
  

## Ensuring Backward Compatibility

Now that we know all updates to a contract file must be backward compatible, comparing a contract with its previous version is easy when the contract is stored in a git repo, which acts as a single source of truth.

This brings us to the convenience of getting feedback on incompatible changes by running "Contract Vs Contract"
tests on a developer's machine or in CI pipeline.

### Compare Working Directory With HEAD

Let's see this working with an example, say you have the git repo in your home directory with the directory structure
mentioned above.

Changes are made to math_1.spec, Now to check if the change is backward compatible, a simple command on a terminal or command prompt will do the trick.

`java -jar specmatic.jar compatible git file ./run/specmatic/examples/math_1.spec`

In case the changes made are backward compatible, you'll see something like this:

```shell
> java -jar specmatic.jar compatible git file ./run/specmatic/examples/math_1.spec
Tests run: 1, Passed: 1, Failed: 0

The newer contract is backward compatible
```

If not, there will be an error report having a non-zero exit status, which also makes it easy to write scripts around it.

### Compare A Contract In Two Different Commits

To compare a contract against multiple commits - for example between two commits, such as HEAD and HEAD^1, which can be easily done by passing names as shown below :

```shell
> java -jar specmatic.jar compatible git commits ./remote/random.spec HEAD HEAD^1
Tests run: 1, Passed: 1, Failed: 0

The newer contract is backward compatible
```

You can observe how specmatic identifies and call out the specific contract which is compatible backwards. 

For this to happen its imperative to have at least two versions in the git repository, Also you can even use commit hashes here to compare any other pair of commits.

## Handling Contracts in progress

Specmatic helps you manage contracts which are still a work in progress.

You can annotate any scenario with the `@WIP` tag before the scenario line. This annotation does two things:
- When running the backward compatibility check as a command, if any failure is encountered for this scenario, the error will be logged, but the command will terminate with an exit code of 0, just as if no error was seen.
- Similarly, while running the contract as a test using SpecmaticJUnitSupport (programmatically in Java), if this scenario fails, the test will be marked as `ignored`. JUnit will not report a failure, but it will report that some tests were ignored. The API developer should understand that any Specmatic test marked as ignored is actually a failed test which was annotated with @WIP, and needs looking into.

After a contract is complete you can remove the @WIP tag, allowing specmatic to include the contract for tests.

```gherkin
@WIP
Scenario: Should be able to get a pet by petId
  When GET /pets/(petid:number)
  Then status 200
  And response-body {petid: "(number)"}
```

