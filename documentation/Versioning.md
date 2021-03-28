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

Specmatic seamlessly ensures Compatibility testing, It can validate cross version backward compatibility amongst the contracts.  This allows Consumers to work with different versions of provider APIs.

In other words, an API is backward compatible between releases if the clients are able to work with a new version of the API seamlessly.

Let’s understand this with an example, Assume that you have a math contract for squaring a number shown in the code snippet below.

```gherkin
#Version 1
Feature: Math API

Scenario: Square of a number
When POST /square
And request-body (number)
Then status 200
And response-body (number)
```

Now if we add a new api for cubing numbers to the same API, the contract will change to accommodate this and hence may look like this:

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

We can notice that the old contract for square remains intact, and the new contract for cube API is added on it, hence for the API the newer contract is backward compatible with the older one, and hence is still referred to as version 1.

However, if we had changed the API of square, to take a json object instead of a value in the response, That would not be backward compatible with version 1, and hence would have been versioned 2:

```gherkin
Feature: Math API

Scenario: Square of a number
When POST /square
And request-body (number)
Then status 200
And response-body (number)
```


## Contract Namespaces And File System Structure

When you will use a git repository for tracking changes in any set of Contracts (like in examples above for math), the system structure can look like this:

```
<BASE_DIR>
    /run
        /specmatic
            /examples
                math_1.spec
                math_2.spec
```

- The path ./run/specmatic/examples acts as a namespace, much like a dot separated package name.
- Contract file names can begin with any text (no spaces)
    - If there is a version number, then they must include version number at the end of the name before ".spec" extension.
    - The underscore separates the name of the contract and version number
    - In above example the name of contract is math and there are two versions of this API.
  

## Ensuring Backward Compatibility

Now that we know that it should be always ensured that all updates to a contract file must be backward compatible, comparing a contract with its previous version is easy in git,
The git repository containing contracts (specs) and so acts as a single source of truth.

which leads us to the convenience of getting feedback on incompatible changes by running "Contract Vs Contract"
tests on developers machine or in CI pipeline.


### Compare Working Directory With HEAD

Let's see this working with an example, say you have the git repo in your home directory with the directory structure same as
mentioned above.

Changes are made to math_1.spec, Now to check if the change is backward compatible, a simple command on a terminal or command prompt can do the trick.

`java -jar specmatic.jar compatible git file ./run/specmatic/examples/math_1.spec`

In case the changes made are backward compatible, the message will assert it with run and status information:

```shell
> java -jar specmatic.jar compatible git file ./run/specmatic/examples/math_1.spec
Tests run: 1, Passed: 1, Failed: 0

The newer contract is backward compatible
```

If not, there will be an error report having a non-zero exit status, making it easy to write scripts around it.

### Compare A Contract In Two Different Commits

Now a scenario which is most likely to encounter in CI is:

To compare a contract against multiple commits - lets take an example between two commits, 
such as HEAD and HEAD^1, which can be easily done by passing names as shown below :

```shell
> java -jar specmatic.jar compatible git commits ./remote/random.spec HEAD HEAD^1
Tests run: 1, Passed: 1, Failed: 0

The newer contract is backward compatible
```

You can observe how specmatic identifies and call out the specific contract which is compatible backwards. 
For this to happen its imperative to have at least two versions in the git repository, Also you can even use commit hashes here if you wish to compare any other pair of commits.

## Handling Contracts in progress

Specmatic manages your contracts which are being worked upon - in progress or not finalized yet.
You can easily annotate them as "work in progress" with a tag @WIP before the scenario line, This annotation tag will ensure that the backward 
compatibility check for such contract is skipped baring extraneous noise in results.

Once the contract is complete you can remove the @WIP tag, allowing specmatic to include the contracts for tests.

```gherkin
@WIP
Scenario: Should be able to get a pet by petId
  When GET /pets/(petid:number)
  Then status 200
  And response-body {petid: "(number)"}
```

