---
layout: default
title: Authentication
parent: Documentation
nav_order: 16
---
Authentication
==============

There are 3 pieces to this puzzle.

1. Each environment will have a differnt set of credentials that must be used for authentication. We'll need to provide the environment-specific credentials in environment configuration.
2. We need to use the credentials by invoking the auth API, and exporting the resulting auth tokens.
3. We need to plug the auth tokens from step 2 into the contract tests.

Let's see how this would work.

### Environment Configuration

`specmatic.json` can hold environment configuration. Take a look at the one in the [sample petstore application](https://github.com/znsio/petstore/blob/master/specmatic.json).

`eat` stands for Environment for Automated Testing. It could as well be named `staging`.

Note how we have declared two variables, username and password.

Note also how we have declared `baseurls`. We shall see why in a moment.

### Invoking the Auth API

Next, we must invoke the auth API. There are two parts to this.

First, we declare the contract of the auth API. You can see a [sample of this here](https://github.com/znsio/petstore-contracts/blob/master/run/qontract/examples/petstore/auth.spec).

#### Variables

Look at the Examples table. We use `$username` and `$password` to refer to the `username` and `password` values declared in the environment config.

#### Exports

Look for the export statement.

```gherkin
And export token = response-body
```

This exports a variable named `token`, the contents of which are the entire reponse body.

If the reponse is JSON, such as `{"token": "abc123"}`, you can export a specific value:

```gherkin
And export token = response-body.token
```

If you wish to export a header, such as the `Cookie` header:

```gherkin
And export cookie = response-header.Cookie
```

#### Wiring up the auth API with the authenticated contract

Next we must connect auth contract with the actual contract that needs it.

Have a look at the [sample petstore contract](https://github.com/znsio/petstore-contracts/blob/master/run/qontract/examples/petstore/api_petstore_v1.spec).

You'll see in the background:

```gherkin
And value auth from auth.spec
```

We declare that the `value` named `auth` comes from `auth.spec`. `auth.spec` in this line is the relative path to the auth spec file. In this example, `auth.spec` is in the same directory as api_1.spec.

#### Using the auth variables
In the sample petstore contract, look at the Examples table for any of the POST APIs, to see how we are using the auth token.

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

#### Specifying the enviornment

Finally, when running the tests, you must specify the environment.

If you're running the tests with the command, `specmatic test --environment=eat specfile.spec`

If you're running the tests from code, set a property named `environments`. Take a look at the [petstore sample](https://github.com/znsio/petstore/blob/master/src/test/java/com/petstore/test/PetStoreContractTest.java) to see an example of this.

Make sure to declare the contract you're running as a test in [specmatic.json](documentation/../specmatic_json.md). Take a look at [specmatic.json in the petstore sample project](https://github.com/znsio/petstore/blob/master/specmatic.json) for an example of this.
