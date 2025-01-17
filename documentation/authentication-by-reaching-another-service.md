---
layout: default
title: Authentication
parent: Documentation
nav_exclude: true
---
- [Authentication](#authentication)
  - [1. Write the auth contract](#1-write-the-auth-contract)
    - [Setup the auth credentials](#setup-the-auth-credentials)
    - [Setup base urls](#setup-base-urls)
    - [Exporting auth tokens in the contract](#exporting-auth-tokens-in-the-contract)
  - [2. Wire up auth in the application contract](#2-wire-up-auth-in-the-application-contract)
    - [Using the auth variables](#using-the-auth-variables)
  - [3. Run the contract tests](#3-run-the-contract-tests)
    - [Declare the application contract in specmatic.json](#declare-the-application-contract-in-specmaticjson)
    - [Execute the tests](#execute-the-tests)
    - [How Specmatic runs the tests](#how-specmatic-runs-the-tests)

Authentication
==============

Most APIs will not run unless provided a valid authentication token. When running contract tests, Specmatic needs to obtain a valid auth token to call authenticated APIs.

You can see how this in action in the [sample petstore project](https://github.com/znsio/petstore).

Here's a quick walk through of how it works.

## 1. Write the auth contract

First off, write the contract of the auth API, and in it, declare tokens such as cookies, json value in the response, etc as exports.

In step 3, Specmatic will run this as as a test against the auth service to get the auth tokens. So we must provide the base url of the actual auth service in environment configuration.

Here's a [the petstore's auth contract](https://github.com/znsio/petstore-contracts/blob/master/in/specmatic/examples/petstore/auth.spec).

### Setup the auth credentials

Look at the Examples table, in which we use the variables `$username` and `$password`. We do not hardcode them, because each environment (local, staging, etc) will need different auth credentials. These values come from environment configuration, where we can specify the auth credentials needed by each environment. See how this is done in `specmatic.json` in the [sample petstore application](https://github.com/znsio/petstore/blob/master/specmatic.json).

Note how we have declared two variables, username and password, in the staging environment:

```json
  "environments": {
    "staging": {
      "baseurls": {
        "auth.spec": "http://localhost:8080"
      },
      "variables": {
        "username": "jackie",
        "password": "PaSsWoRd"
      }
    }
  }
```

### Setup base urls

In step 3, Specmatic runs this `auth.spec` as a test against the auth service in the environment, and stores the exports declared by `auth.spec` for later.

To run as test, Specmatic needs the base url of the auth service. We put this in the same environment config in `specmatic.json`.

In the snippet above, baseurls contains configuration for `auth.spec`, the name of the auth contract file.

### Exporting auth tokens in the contract

In the `auth.spec` file, we have exported the entire response body.

```gherkin
And export token = response-body
```

This exports a variable named `token`, the contents of which are the entire response body.

If the response is JSON, such as `{"token": "abc123"}`, you can export a specific value:

```gherkin
And export token = response-body.token
```

If you wish to export a header, such as the `Cookie` header:

```gherkin
And export cookie = response-header.Cookie
```

## 2. Wire up auth in the application contract

Next we must connect auth contract with the actual contract that needs it.

Have a look at the sample petstore contract [api_petstore_v1.spec](https://github.com/znsio/petstore-contracts/blob/master/in/specmatic/examples/petstore/api_petstore_v1.spec).

You'll see in the background:

```gherkin
And value auth from auth.spec
```

We declare that the `value` named `auth` comes from `auth.spec`. `auth.spec` in this line is the relative path to the auth spec file. In this example, `auth.spec` is in the same directory as api_1.spec.

### Using the auth variables

In the petstore contract, look at the Examples table for any of the POST APIs, to see how we are using the auth token.

Take for example:

```gherkin
 Scenario Outline: Update pet details
    When POST /pets
    And request-header Authenticate (string)
    And request-body (Pet)
    Then status 200

    Examples:
      | name   | type | status    | id | Authenticate  |
      | Archie | dog  | available | 10 | ($auth.token) |
```

In `($auth.token)`, `auth` is the `value` that we declared above, and `token` is what was exported from auth.spec.

## 3. Run the contract tests

### Declare the application contract in specmatic.json
Make sure to declare the contract you're running as a test in [the Specmatic configuration](documentation/../configuration.html). Take a look at [specmatic.json in the petstore sample project](https://github.com/znsio/petstore/blob/master/specmatic.json) for an example of this. You can read more about [running contract tests using Specmatic here](documentation/../contract_tests.html).

### Execute the tests
Finally, run the tests. You must specify the environment while doing so, for Specmatic to pick up the variables and baseurls relevant to that environment.

If you're running the tests from a terminal, the command is `specmatic test --env=staging specfile.spec`

If you're running the tests from code, set a property named `environments`. Take a look at the [petstore sample](https://github.com/znsio/petstore/blob/master/src/test/java/com/petstore/test/PetStoreContractTest.java) to see an example of this.

### How Specmatic runs the tests
The tests are run in 2 stages.
* Stage 1: The application contract depends on the auth contract. So Specmatic first runs the auth contract as test, and stores all the exported values for the application contract to use.
* Stage 2: Specmatic then plugs the exported values into the application contract where required, and goes on to run the application contract in test mode.
