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
    - [Why Use Specmatic](#why-use-specmatic)
    - [IMPORTANT: Using Stub As A Sample Application API](#important-using-stub-as-a-sample-application-api)
    - [Contract Tests Without Examples](#contract-tests-without-examples)
    - [When The Application Breaks The Contract](#when-the-application-breaks-the-contract)
    - [Contract Tests With Examples](#contract-tests-with-examples)
    - [Contract Tests With JSON](#contract-tests-with-json)
    - [External Suggestions](#external-suggestions)

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

```yaml
#filename: numbers.yaml

---
openapi: "3.0.1"
info:
  title: "Numerical Operations"
  version: "1"
paths:
  /square:
    post:
      summary: "Square of a number"
      parameters: []
      requestBody:
        content:
          text/plain:
            schema:
              type: "number"
      responses:
        "200":
          description: "Square of a number"
          content:
            text/plain:
              schema:
                type: "number"
```

Run this: `{{ site.spec_cmd }} test numbers.yaml`, and you'll get an error because the application doesn't exist yet.

Instead of a sample API to hit, as discussed above let's cheat and setup a stub. The contract test won't know the difference :-)

```yaml
#filename: sample_application.yaml

---
openapi: "3.0.1"
info:
  title: "Sample application"
  version: "1"
paths:
  /square:
    post:
      summary: "Takes and returns a number"
      parameters: []
      requestBody:
        content:
          text/plain:
            schema:
              type: "number"
      responses:
        "200":
          description: "Takes and returns a number"
          content:
            text/plain:
              schema:
                type: "number"
```

And run it: `{{ site.spec_cmd }} stub sample_application.yaml`.

In another tab, run the test command again against the "sample" application.

```
> specmatic test numbers.yaml
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

```yaml
#filename: numbers.yaml

---
openapi: "3.0.1"
info:
  title: "Numerical Operations"
  version: "1"
paths:
  /square:
    post:
      summary: "Square of a number"
      parameters: []
      requestBody:
        content:
          text/plain:
            schema:
              type: "number"
      responses:
        "200":
          description: "Square of a number"
          content:
            text/plain:
              schema:
                type: "number"
```

This time let's modify the "sample" application to return a string instead of a number.

```yaml
#filename: sample_application.yaml

---
openapi: "3.0.1"
info:
  title: "Sample application"
  version: "1"
paths:
  /square:
    post:
      summary: "Takes and returns a number"
      parameters: []
      requestBody:
        content:
          text/plain:
            schema:
              type: "number"
      responses:
        "200":
          description: "Takes and returns a number"
          content:
            text/plain:
              schema:
                type: "string"
```

As before, run the stub: `{{ site.spec_cmd }} stub sample_application.yaml`.

And in another tab, run the contract test.

```
    > specmatic test numbers.yaml
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
```

The contract test generated a request with a random number that matched the contract, and sent it to the "sample" application. The test expected a numerical response, but got a string instead. Since the applications response did not not match the contract spec, Specmatic reported the problem.

### Contract Tests With Examples

Consider this contract for getting the username for a given id.

```yaml
---
openapi: "3.0.1"
info:
  title: "User API"
  version: "1"
paths:
  /user/{id}:
    get:
      summary: "Get User Name"
      parameters:
      - name: "id"
        in: "path"
        required: true
        schema:
          type: "number"
      responses:
        "200":
          description: "Get User Name"
          content:
            text/plain:
              schema:
                type: "string"
```

By default, the test will randomly generated the user id number in the url on the fly just before running the test. So the application won't have a user with that id, and hence when it receives this GET request, it will not be able to return a username.

We have to help things along. The application will have to be setup with a user, and the contract test will have to be fed this pre-existing user id, so that it can generate a request that the application can respond to.

Let's use the Examples feature for this.

We shall first setup the "sample" application, in which querying for a user with id 10 will get back the username jane_doe:

```yaml
#filename: sample_application.yaml

---
openapi: "3.0.1"
info:
  title: "Sample application"
  version: "1"
paths:
  /user/10:
    get:
      summary: "Returns username"
      parameters: []
      responses:
        "200":
          description: "Returns username"
          content:
            text/plain:
              schema:
                type: "string"
                enum:
                - "jane_doe"
```

Then let's create the contract.

```yaml
#filename: user.yaml

---
openapi: "3.0.1"
info:
  title: "User API"
  version: "1"
paths:
  /user/{id}:
    get:
      summary: "Get User Name"
      parameters:
      - name: "id"
        in: "path"
        required: true
        schema:
          type: "number"
        examples:
          validid:
            value: 10
      responses:
        "200":
          description: "Get User Name"
          content:
            text/plain:
              schema:
                type: "string"
              examples:
                validid:
                  value: "Jane Doe"
```

Note that the id in the URL retains the type. By using types instead of hardcoded values, the contract becomes useful for the consumer as well, for the purpose of [service virtualisation](/documentation/service_virtualisation.html).

However, to avoid randomly generated values, we provide concrete examples. Specmatic looks up the url parameter name "id" in the example, and it finds a column named "id" as well. It picks up the value 10.

First it checks that the example matches the contract, which it does here. The id must be a number, and the example is a number. It then formulates the request (GET /user/10) and sends it to the "sample" application.

Let's run this. Run the "sample" using `{{ cmd.spec_run }} stub sample_application.yaml`.

In a new tab, run the test:

```
> specmatic test user.yaml
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

### Contract Tests With JSON

Let's try a simple example with JSON.

```gherkin
#filename: user.yaml

---
openapi: "3.0.1"
info:
  title: "User API"
  version: "1"
paths:
  /users:
    post:
      summary: "Update user"
      parameters: []
      requestBody:
        content:
          application/json:
            examples:
              validuser:
                value:
                  id: 10
                  name: "Jane Doe"
            schema:
              required:
              - "id"
              - "name"
              properties:
                id:
                  type: "number"
                name:
                  type: "string"
      responses:
        "200":
          description: "Update user"
          content:
            text/plain:
              schema:
                type: "string"
                enum:
                - "success"
              examples:
                validuser:
                  value: "success"
```

And the "sample" application that accepts information about Jane Doe:

```gherkin
#filename: sample_application.yaml

---
openapi: "3.0.1"
info:
  title: "User info"
  version: "1"
paths:
  /users:
    post:
      summary: "Info about Jane"
      parameters: []
      requestBody:
        content:
          application/json:
            schema:
              required:
              - "id"
              - "name"
              properties:
                id:
                  type: "number"
                name:
                  type: "string"
      responses:
        "200":
          description: "Info about Jane"
          content:
            text/plain:
              schema:
                type: "string"
                enum:
                - "success"
```

Run the stub using `{{ site.spec_cmd }} stub sample_application.spec.

Let's try running user.spec as a test.

```
> specmatic test user.yaml
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
### External Suggestions

Sometimes, you need different examples in different environments. If so, the examples can't be part of the contract. Read up on [suggestions](/documentation/suggestions.html) to learn how to load examples from outside the contract.
