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

## Contract Namespaces And File System Structure

We share contracts by committing them to a git repository.

Here's a sample git repository that contains the math contract:

```
<BASE_DIR>
    /run
        /qontract
            /examples
                /math
                    /1.qontract
                    /2.qontract
```

- The path ./run/qontract/examples/math acts as a namespace, much like a dot separated package name.
- Contract file names should be the same as their version numbers.

All updates to a contract file must be backward compatible.

## Ensuring Backward Compatibility

Since the file is in git, comparing it with it's previous version is easy.

### Compare Working Directory With HEAD

Let's say you have the git repo in your home directory with the directory structure mentioned above.

Make a change to 1.qontract.

To check if the change is considered backward compatible, open a terminal or command prompt and run the command `java -jar qontract.jar compatible git file ./run/qontract/examples/math/1.qontract`. You should see something like this if the change is backward compatible:

```shell
> java -jar qontract.jar compatible git file ./run/qontract/examples/math/1.qontract
Tests run: 1, Passed: 1, Failed: 0

The newer contract is backward compatible
```

If not, you'll see an error report.

The exit status on failure is non zero, so you can use this if you wish to write scripts.

### Compare A Contract In Two Different Commits

This is useful in CI.

If you with to comapare the changes in a contract between two commits, such as HEAD and HEAD^1, try this:

```shell
> java -jar qontract.jar compatible git commits ./remote/random.qontract HEAD HEAD^1
Tests run: 1, Passed: 1, Failed: 0

The newer contract is backward compatible
```

This requires of course that there are two versions at least in the git repository.

You can even use commit hashes here if you wish to compare any other pair of commits.
