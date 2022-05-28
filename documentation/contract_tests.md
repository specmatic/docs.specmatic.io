---
layout: default
title: Contract Tests
parent: Documentation
nav_order: 5
---
Contract Tests
==============

- [Contract Tests](#contract-tests)
    - [About Contract Testing](#about-contract-testing)
    - [Contract Testing By Adding Examples](#contract-testing-by-adding-examples)
    - [Examples For WSDL Contracts](#examples-for-wsdl-contracts)
    - [Homework](#homework)

[Read here about contract testing and where Specmatic fits in](/contract_testing.html).

### About Contract Testing

Specmatic reads the contract and generates tests for each API in the contract. It then runs these tests on your API end point, which you also provide to Specmatic. If your application is built correctly, it will understand the request sent to each test, and send a response back. Specmatic compares the response with the contract, and the test passes if the response format matches the contract.

Contract tests do not validate the values in the responses. That is the the role of API tests, which cover many more scenarios in detail. The developer alone controls the tests completely. The developer can change the tests for legitimate reasons, without realising that there may be changes to the API format, parameters, etc. If there is any such accidental breakage, the contract tests will fail.

The same contract spec that is used for contract testing is also used by the API consumers for [service virtualisation](/documentation/service_virtualisation.html). Since the consumer stubs out the API using the same contract which the provider API adheres to, the integration between the consumer and provider stays intact.

Additionally, the contract spec is human-readable. So contracts can be circulated around by email, chat, etc while the API design is under discussion.

### Contract Testing By Adding Examples

Here's a contract for an API for fetching and updating employee details.

Each API request and response must have named examples. You can see how this looks in the sample contract below.

```yaml
#filename: employees.yaml

openapi: 3.0.0
info:
  title: Employees
  version: '1.0'
servers: []
paths:
  '/znsio/specmatic/employees':
    post:
      summary: ''
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Employee'
              examples:
                updated-employee:
                  value:
                    id: 70
                    name: Jill Doe
                    department: Engineering
                    designation: Director
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Employee'
            examples:
              updated-employee:
                value:
                  id: 70
                  name: Jill Doe
                  department: Engineering
                  designation: Director
  '/znsio/specmatic/employees/{id}':
    parameters:
      - schema:
          type: number
        name: id
        in: path
        required: true
        examples:
          success:
            value: 10
          failure:
            value: 100
          new-employee:
            value: 10
    put:
      summary: ''
      responses:
        '200':
          description: Update employee details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Employee'
              examples:
                new-employee:
                  value:
                    id: 10
                    name: Jill Doe
                    department: Engineering
                    designation: Director
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Employee'
            examples:
              new-employee:
                value:
                  id: 10
                  name: Jill Doe
                  department: Engineering
                  designation: Director
    get:
      summary: Fetch employee details
      tags: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Employee'
              examples:
                success:
                  value:
                    id: 10
                    name: Jane Doe
                    department: Engineering
                    designation: Engineering Manager
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                type: object
                properties: {}
              examples:
                failure:
                  value: {}
components:
  schemas:
    Employee:
      title: Employee
      type: object
      required:
        - id
        - name
        - department
        - designation
      properties:
        id:
          type: integer
        name:
          type: string
        department:
          type: string
        designation:
          type: string
```

Run this command and see what the output looks like: `{{ site.spec_cmd }} test --testBaseURL https://my-json-server.typicode.com employees.yaml`

Here's what is happening.

There are 4 tests: success, failure, new-employee, updated-employee. You will the find these names in the named examples across the different APIs in the contract. Take a moment to look for them in the contract.

A name represents a single contract test. All named examples by that name comprise a single contract test. For each contract test name, an HTTP request is formulated by combining the examples having name in the API request, and sent to the API. When a response is returned, it is compared with the response containing an example of the same name.

### Examples For WSDL Contracts

A WSDL contract cannot hold examples within the contract. The format does not support it.

We can instead add examples to a companion file. The companion file should be in the same directory as the wsdl file. It would look like this:

```gherkin
Feature: WSDL Companion file
  Background:
    Given wsdl ./soap-contract-file.wsdl

  Scenario: Add user
    When POST /soap-service-path
    Then status 200

    Examples:
    | (REQUEST-BODY)        | SOAPAction | Any other headers... |
    | <soapenv>...</soapenv> | "/addUser" | header values        |
```

(REQUEST-BODY) contains the request body in a single line, SOAPAction contains the value value of the SOAPAction header, and additional columns must be included for each header sent by the SOAP service.

### Homework

The above contract matches the dummy API precisely.

Once you are able to run the contract test and see 4 successful tests running, try modifying some of the datatypes and see the different kinds of error responses you get.

Note: If you modify the request, it's possible that the application will respond with a 404 or 500, and you may not see anything more interesting than a mismatched status. But if you modify any response structure in the contract, leaving the request intact, e.g. change an integer to a string or vice versa, the application will send recognize the requests, send response back that do not match the contract which you have modified, and you will see interesting error feedback.
