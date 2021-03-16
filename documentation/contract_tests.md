---
layout: default
title: Contract Tests
parent: Documentation
nav_order: 5
---
Contract Tests
==============

- [Contract Tests](#contract-tests)
    - [Why Contract Testing](#why-contract-testing)
    - [Why Use Specmatic](#why-use-qontract)
    - [IMPORTANT: Using Stub As A Sample Application API](#important-using-stub-as-a-sample-application-api)
    - [Contract Tests Without Examples](#contract-tests-without-examples)
    - [When The Application Breaks The Contract](#when-the-application-breaks-the-contract)
    - [Contract Tests With Examples](#contract-tests-with-examples)
    - [Contract Tests With Multiple Examples](#contract-tests-with-multiple-examples)
    - [Contract Tests With JSON](#contract-tests-with-json)
    - [When The Example Breaks The Contract](#when-the-example-breaks-the-contract)
    - [When The Application Returns Extra Keys](#when-the-application-returns-extra-keys)
    - [Examples Of Conflicting Keys](#examples-of-conflicting-keys)
    - [External Suggestions](#external-suggestions)
    - [Examples For Other Parts Of The Request](#examples-for-other-parts-of-the-request)
    - [Examples Without Hardcoded Values](#examples-without-hardcoded-values)
    - [Examples Of Only Some Values](#examples-of-only-some-values)
    - [Escaping Pipes In Examples](#escaping-pipes-in-examples)

[Read here about contract testing and where Specmatic fits in](/contract_testing.html).

### Why Contract Testing

Specmatic reads the contract spec and generates tests for each scenario in the spec. It then runs these tests on your API end point, which you also provide to Specmatic. If your application is built right, it will understand the request sent to each test, and send a response back. Specmatic compares the response with the contract spect, and the test passes if they are in sync. These are meant only to test the request and response formats. They do not validate the values in the responses. That is the the role of API tests, which cover many more scenarios in detail.

How then are contract tests different from API tests?

The answer is that the developer alone controls the tests completely. The developer can change the tests for legitimate reasons, without realising that there may be changes to the API format, parameters, etc. If there is any such accidental breakage, the contract tests will fail.

So what prevents the developer from updating the contract to match the API tests, thus breaking downstream consumers?

Well, the contract spec is typically stored in a central repository, which is managed and updated by multiple teams. So at the very least, developers are conscious of this, and will not change the contract without talking to all concerned. To eliminate concerns around integration breakage, make sure that all changes to the contract are back backward compatible, using the tools that Specmatic has provided.

### Why Use Specmatic

The same contract spec that is used for contract testing is also used by the API consumers for [service virtualisation](/documentation/service_virtualisation.html). Since the consumer sets expectations on its stubs that match the contract, and the provider API is built to adhere to the same contract, the integration between the consumer and provider stays intact.

Additionally, the contract spec is human-readable. So contracts can be circulated around by email, chat, etc while the API design is under discussion.

### IMPORTANT: Using Stub As A Sample Application API

We try to provide examples that you can run. Contract tests target a provider API. So the examples in this document need a sample API application to run against. Instead of asking you to download some such sample API code, and setup up a tool chain that you may be unfamiliar with to build and run it, we are going to take a shortcut.

For the purposes of this document, most of our contract test samples will be run against [Specmatic stubs](/documentation/service_virtualisation.html) as the target, and we will provide the needed stub contracts.

### Contract Tests Without Examples

Here's a contract for a simple API that takes a number and returns its square. The contract doesn't validate the value, it just checks that the API takes a number and returns a number.

```gherkin
#filename: numbers.qontract

Feature: Numerical Operations
  Scenario: Square of a number
    When POST /square
    And request-body (number)
    Then status 200
    And response-body (number)
```

Run this: `{{ site.qontract_cmd }} test numbers.qontract`, and you'll get an error because the application doesn't exist yet.

Instead of a sample API to hit, as discussed above let's cheat and setup a stub. The contract test won't know the difference :-)

```gherkin
#filename: sample_application.qontract

Feature: Sample application
  Scenario: Takes and returns a number
    When POST /square
    And request-body (number)
    Then status 200
    And response-body (number)
```

And run it: `{{ site.qontract_cmd }} stub sample_application.qontract`.

In another tab, run the test command again against the "sample" application :-)

```
> qontract test numbers.qontract
>> Request Start At Fri Jun 19 12:35:50 IST 2020
-> POST /square
-> Accept-Charset: UTF-8
-> Accept: */*
->
-> 255
<- 200 OK
<- Vary: Origin
<- X-Specmatic-Result: success
<- Content-Length: 3
<- Content-Type: text/plain
<- Connection: keep-alive
<-
<- 779
<< Response At Fri Jun 19 12:35:51 IST 2020 ==


Scenario: Square of a number POST /square SUCCESSFUL

Tests run: 1, Failures: 0
```

All's well, the "application" is in sync with the contract.

### When The Application Breaks The Contract

Take the same numbers contract again.

```gherkin
#filename: numbers.qontract

Feature: Numerical Operations
  Scenario: Square of a number
    When POST /square
    And request-body (number)
    Then status 200
    And response-body (number)
```

This time let's modify the "sample" application to return a string instead of a number.

```gherkin
#filename: sample_application.qontract

Feature: Sample application
  Scenario: Takes and returns a number
    When POST /square
    And request-body (number)
    Then status 200
    And response-body (string)
```

As before, run the stub: `{{ site.qontract_cmd }} stub sample_application.qontract`.

And in another tab, run the contract test.

    > qontract test numbers.qontract
    >> Request Start At Fri Jun 19 12:42:49 IST 2020
    -> POST /square
    -> Accept-Charset: UTF-8
    -> Accept: */*
    ->
    -> 454
    <- 200 OK
    <- Vary: Origin
    <- X-Specmatic-Result: success
    <- Content-Length: 5
    <- Content-Type: text/plain
    <- Connection: keep-alive
    <-
    <- CPRTP
    << Response At Fri Jun 19 12:42:49 IST 2020 ==


    Scenario: Square of a number POST /square FAILED
    Reason: Testing scenario "Square of a number"
        >> RESPONSE.BODY

        Expected number, actual was string: "CPRTP"


    Tests run: 1, Failures: 1

The contract test generated a request with a random number that matched the contract, and sent it to the "sample" application. The test expected a numerical response, but got a string instead. Since the applications response did not not match the contract spec, Specmatic reported the problem.

### Contract Tests With Examples

Consider this contract for getting the username for a given id.

```gherkin
Feature: User API
  Scenario: Get User Name
    When GET /user/(id:number)
    Then status 200
    And response-body (string)
```

By default, the test will randomly generated the user id number in the url on the fly just before running the test. So the application won't have a user with that id, and hence when it receives this GET request, it will not be able to return a username.

We have to help things along. The application will have to be setup with a user, and the contract test will have to be fed this pre-existing user id, so that it can generate a request that the application can respond to.

Let's use the Examples feature for this.

We shall first setup the "sample" application, in which querying for a user with id 10 will get back the username jane_doe:

```gherkin
#filename: sample_application.qontract

Feature: Sample applicatioon
  Scenario: Returns username
    When GET /user/10
    Then status 200
    And response-body jane_doe
```

Then let's create the contract.

```gherkin
#filename: user.qontract

Feature: User API
  Scenario: Get User Name
    When GET /user/(id:number)
    Then status 200
    And response-body (string)

  Examples:
  | id |
  | 10 |
```

Note that the id in the URL retains the type. By using types instead of hardcoded values, the contract becomes useful for the consumer as well, for the purpose of [service virtualisation](/documentation/service_virtualisation.html).

However, to avoid randomly generated values, we provide concrete examples. Specmatic looks up the url parameter name "id" in the example, and it finds a column named "id" as well. It picks up the value 10.

First it checks that the example matches the contract, which it does here. The id must be a number, and the example is a number. It then formulates the request (GET /user/10) and sends it to the "sample" application.

Let's run this. Run the "sample" using `{{ cmd.qontract_run }} stub sample_application.qontract`.

In a new tab, run the test:

```
> qontract test user.qontract
>> Request Start At Fri Jun 19 13:14:38 IST 2020
-> GET /user/10
-> Accept-Charset: UTF-8
-> Accept: */*
->
->
<- 200 OK
<- Vary: Origin
<- X-Specmatic-Result: success
<- Content-Length: 8
<- Content-Type: text/plain
<- Connection: keep-alive
<-
<- jane_doe
<< Response At Fri Jun 19 13:14:39 IST 2020 ==


Scenario: Get User Name GET /user/(id:number) SUCCESSFUL

Tests run: 1, Failures: 0
```

### Contract Tests With Multiple Examples

Why stop at 1 example. You can specify multiple examples, if needed.

```gherkin
#filename: user.qontract

Feature: User API
  Scenario: Get User Name
    When GET /user/(id:number)
    Then status 200
    And response-body (string)

  Examples:
  | id |
  | 10 |
  | 20 |
  | 30 |
```

Let's setup the "sample" application to handle all the user ids.

```gherkin
#filename: sample_application.qontract

Feature: Sample applicatioon
  Scenario: Returns username
    When GET /user/10
    Then status 200
    And response-body jane_doe

  Scenario: Returns username
    When GET /user/20
    Then status 200
    And response-body joan_doe

  Scenario: Returns username
    When GET /user/30
    Then status 200
    And response-body john_doe
```

Let's run the "sample", as usual, using `{{ cmd.qontract_run }} stub sample_application.qontract`.

Now run the tests.

```
> qontract test user.qontract
>> Request Start At Fri Jun 19 13:32:03 IST 2020
-> GET /user/10
-> Accept-Charset: UTF-8
-> Accept: */*
->
->
<- 200 OK
<- Vary: Origin
<- X-Specmatic-Result: success
<- Content-Length: 8
<- Content-Type: text/plain
<- Connection: keep-alive
<-
<- jane_doe
<< Response At Fri Jun 19 13:32:04 IST 2020 ==


Scenario: Get User Name GET /user/(id:number) SUCCESSFUL

>> Request Start At Fri Jun 19 13:32:04 IST 2020
-> GET /user/20
-> Accept-Charset: UTF-8
-> Accept: */*
->
->
<- 200 OK
<- Vary: Origin
<- X-Specmatic-Result: success
<- Content-Length: 8
<- Content-Type: text/plain
<- Connection: keep-alive
<-
<- joan_doe
<< Response At Fri Jun 19 13:32:04 IST 2020 ==


Scenario: Get User Name GET /user/(id:number) SUCCESSFUL

>> Request Start At Fri Jun 19 13:32:04 IST 2020
-> GET /user/30
-> Accept-Charset: UTF-8
-> Accept: */*
->
->
<- 200 OK
<- Vary: Origin
<- X-Specmatic-Result: success
<- Content-Length: 8
<- Content-Type: text/plain
<- Connection: keep-alive
<-
<- john_doe
<< Response At Fri Jun 19 13:32:04 IST 2020 ==


Scenario: Get User Name GET /user/(id:number) SUCCESSFUL

Tests run: 3, Failures: 0
```

### Contract Tests With JSON

Let's try a simple example with JSON.

```gherkin
#filename: user.qontract

Feature: User API
  Scenario: Update user
    When POST /users
    And request-body
      | id   | (number) |
      | name | (string) |
    Then status 200
    And response-body success

  Examples:
  | id  | name     |
  | 10 | Jane Doe |
```

And the "sample" application that accepts information about Jane Doe:

```gherkin
#filename: sample_application.qontract

Feature: User info
  Scenario: Info about Jane
    When POST /users
    And request-body
      | id   | (number) |
      | name | Jane Doe |
    Then status 200
    And response-body success
```

Run the stub using `{{ site.qontract_cmd }} stub sample_application.qontract.

Let's try running user.qontract as a test.

```
> qontract test user.qontract
>> Request Start At Fri Jun 19 16:23:43 IST 2020
-> POST /users
-> Accept-Charset: UTF-8
-> Accept: */*
->
-> {
->     "name": "Jane Doe",
->     "id": 10
-> }
<- 200 OK
<- Vary: Origin
<- X-Specmatic-Result: success
<- Content-Length: 7
<- Content-Type: text/plain
<- Connection: keep-alive
<-
<- success
<< Response At Fri Jun 19 16:23:43 IST 2020 ==


Scenario: Update user POST /users SUCCESSFUL

Tests run: 1, Failures: 0
```

### When The Example Breaks The Contract

```gherkin
#filename: user.qontract

Feature: User API
  Scenario: Update user
    When POST /users
    And request-body
      | id   | (number) |
      | name | (string) |
    Then status 200
    And response-body success

  Examples:
  | id  | name     |
  | ten | Jane Doe |
```

Look closely:
- The request body json has a key id, whose value must be a number.
- The example provided for id however is "ten", which is definitely not a number.

Let's see what happens:

```shell
> qontract test user.qontract
In scenario "Update user"
>> REQUEST.BODY.id

Format error in example of "id"
Expected number, actual was "ten"
Tests run: 0, Failures: 0
```

Specmatic didn't even run the test. Instead, it flagged the error in the example.

### When The Application Returns Extra Keys

The contract documents that which the consumer and provider must be in sync about, no more, no less.

Therefore if the application returns keys in a json object that the contract does not know about, it ignores them.

Here's the "sample" application:

```gherkin
#filename: sample_application.qontract

Feature: User information
  Scenario: Get user info for id 10
    When GET /user/10
    Then status 200
    And response-body
      | id      | (number) |
      | name    | (string) |
      | address | (string) |
```

Actually, we only care about the id and name. So although the application returns an address, the contract doesn't care, and looks like this:

```gherkin
#filename: user.qontract

Feature: User information
  Scenario: Get user info
    When GET /user/(id:number)
    Then status 200
    And response-body
      | id      | (number) |
      | name    | (string) |

  Examples:
  | id | name |
  | 10 | John |
```

Run the stub using `{{ site.qontract_cmd }} stub sample_application.qontract.

In a new tab, let's try running user.qontract as a test.

```
> qontract test user.qontract
>> Request Start At Fri Jun 19 16:30:36 IST 2020
-> GET /user/10
-> Accept-Charset: UTF-8
-> Accept: */*
->
->
<- 200 OK
<- Vary: Origin
<- X-Specmatic-Result: success
<- Content-Length: 62
<- Content-Type: application/json
<- Connection: keep-alive
<-
<- {
<-     "id": 119,
<-     "name": "HFIHJ",
<-     "address": "SYMNQ"
<- }
<< Response At Fri Jun 19 16:30:37 IST 2020 ==


Scenario: Get user info GET /user/(id:number) SUCCESSFUL

Tests run: 1, Failures: 0
```

### Examples Of Conflicting Keys

Supposing we have the same key in two parts of the request.

```gherkin
Feature: Order API
  Scenario: Add order for product to a customer
    When POST /customer/(id:number)
    And request-body
      | id  | (number) | #product id
      | qty | (number) |
    Then status 200

  Examples:
  | id | qty |
  | 10 | 10  |
# The id will be picked up by both url and request body
```

There are 2 id fields we have to give. One in the url, one in the body. How do we provide different examples for both?

You can specify another key in the json body instead.

```gherkin
Feature: Order API
  Scenario: Add order for product to a customer
    When POST /customer/(id:number)
    And request-body
      | id  | (productid:number) |
      | qty | (number)           |
    Then status 200

  Examples:
  | id | productid | qty |
  | 10 | 123       | 10  |
```

See how productid is used both in the value and the example.

When the value contains its own key, the json key is ignored.

### External Suggestions

Sometimes, you need different examples in different environments. If so, the examples can't be part of the contract. Read up on [suggestions](/documentation/suggestions.html) to learn how to load examples from outside the contract.

### Examples For Other Parts Of The Request

So far we have seen how to use examples for json objects and url path elements.

But you can use examples for anything that has a key or a name, including headers (use the header name as the example column name), query parameters (use the query parameter name), form fields (use the form field name), multipart (use the part name).

To illustrate:

```gherkin
Feature: Examples
  Scenario: With query params
    When GET /data?type=(string)
    Then status 200
  Examples:
  | type      |
  | important |

  Scenario: With headers
    When GET /data
    And request-header X-Request-Id (number)
    Then status 200
  Examples:
  | X-Request-Id |
  | 10           |

  Scenario: With form field
    When POST /data
    And form-field name (string)
    Then status 200
  Examples:
  | name |
  | Jill |

  Scenario: With multipart
    When POST /data
    And multipart-formdata name (string)
    Then status 200
  Examples:
  | name |
  | Jack |
```

### Examples Without Hardcoded Values

Sometimes you may want to provide specific values for some examples because you don't care about the rest.

```gherkin
#filename: user.qontract

Feature: User information
  Scenario: Get user info
    When GET /user/(id:number)
    Then status 200
    And response-body
      | id      | (number) |
      | name    | (string) |

  Examples:
  | id       | name     |
  | 10       | (string) |
  | (number) | John     |
```

In the first example, id is hardcoded but the name will be autogenerated. And in the second, the id will be auto generated, while the name is hardcoded.

### Examples Of Only Some Values

You can provide examples for only the keys you care about. Where there is a type but no example, Specmatic will generate it.

```gherkin
#filename: user.qontract

Feature: User information
  Scenario: Get user info
    When POST /user/(id:number)
    And request-body
      | id      | (number) |
      | name    | (string) |
    Then status 200

  Examples:
  | id |
  | 10 |
```

There is an example for the id but not the name. So when generating a test, qontract will generate the name.

Let's run this as a test against a stub of the same contract.

To run the stub: `{{ site.contract_cmd }} stub user.qontract`

And then the test.

```
> qontract test user.qontract
>> Request Start At Fri Jun 19 16:56:02 IST 2020
-> POST /user/10
-> Accept-Charset: UTF-8
-> Accept: */*
->
-> {
->     "name": "UYJAA",
->     "id": 10
-> }
<- 200 OK
<- Vary: Origin
<- X-Specmatic-Result: success
<- Content-Length: 0
<- Content-Type: text/plain
<- Connection: keep-alive
<-
<-
<< Response At Fri Jun 19 16:56:03 IST 2020 ==


Scenario: Get user info POST /user/(id:number) SUCCESSFUL

Tests run: 1, Failures: 0
```

### Escaping Pipes In Examples

If we want to put pipes in the examples, we must escape the pipes.

```gherkin
Feature: Data
  Scenario: Add data
    When POST /data
      And request-body (data:string)
    Then status 200
  Examples:
  | data    |
  | 1\|2\|3 |
```

Let's run this contract as a test against its own stub.

To run the stub: `{{ site.contract_cmd }} stub user.qontract`

And then the test.

```
> qontract test data.qontract
>> Request Start At Fri Jun 19 16:58:41 IST 2020
-> POST /data
-> Accept-Charset: UTF-8
-> Accept: */*
->
-> 1|2|3
<- 200 OK
<- Vary: Origin
<- X-Specmatic-Result: success
<- Content-Length: 0
<- Content-Type: text/plain
<- Connection: keep-alive
<-
<-
<< Response At Fri Jun 19 16:58:41 IST 2020 ==


Scenario: Add data POST /data SUCCESSFUL

Tests run: 1, Failures: 0
```
