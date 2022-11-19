---
layout: default
title: Contract Tests
parent: Documentation
nav_order: 5
---
Contract Tests
==============

- [Contract Tests](#contract-tests)
    - [Overview](#overview)
    - [The Specmatic Command](#the-specmatic-command)
    - [JUnit Output From The Command](#junit-output-from-the-command)
    - [When The API Does Not Match The Contract](#when-the-api-does-not-match-the-contract)
    - [Declaring Contracts In Configuration](#declaring-contracts-in-configuration)
    - [The Java Helper For Java Projects](#the-java-helper-for-java-projects)
    - [Contracts In A Mono-Repo](#contracts-in-a-mono-repo)
    - [Authentication In CI For HTTPS Git Source](#authentication-in-ci-for-https-git-source)
    - [Authentication In CI For SSH Git Source](#authentication-in-ci-for-ssh-git-source)
    - [Examples For WSDL Contracts](#examples-for-wsdl-contracts)

[Read here about contract testing and where Specmatic fits in](/contract_testing.html).

### Overview

Specmatic reads the contract and generates tests for each API in the contract. It then runs these tests on your API end point, which you also provide to Specmatic. If your application is built correctly, it will understand the request sent to each test, and send a response back. Specmatic compares the response with the contract, and the test passes if the response format matches the contract.

The same contract spec that is used for contract testing is also used by the API consumers for [service virtualisation](/documentation/service_virtualisation.html). Since the consumer stubs out the API using the same contract which the provider API adheres to, the integration between the consumer and provider stays intact.

### The Specmatic Command

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

Run this command: `{{ site.spec_cmd }} test --testBaseURL https://my-json-server.typicode.com employees.yaml`

Here's what is happening.

There are 4 tests: success, failure, new-employee, updated-employee. You will the find these names in the named examples across the different APIs in the contract. Take a moment to look for them in the contract.

A name represents a single contract test. All named examples by that name comprise a single contract test. For each contract test name, an HTTP request is formulated by combining the examples having name in the API request, and sent to the API. When a response is returned, it is compared with the response containing an example of the same name.

### JUnit Output From The Command

You can get the JUnit output from the Specmatic command using an extra parameter.

`{{ site.spec_cmd }} --testBaseURL https://my-json-server.typicode.com --junitReportDir ./test-output`

The command will create JUnit test xml output in the specified directory.

### When The API Does Not Match The Contract

The above contract matches the dummy API precisely.

Once you are able to run the contract test and see 4 successful tests running, try modifying some of the datatypes and see the different kinds of error responses you get.

Note: If you modify the request, it's possible that the application will respond with a 404 or 500, and you may not see anything more interesting than a mismatched status. But if you modify any response structure in the contract, leaving the request intact, e.g. change an integer to a string or vice versa, the application will send recognize the requests, send response back that do not match the contract which you have modified, and you will see interesting error feedback.

### Declaring Contracts In Configuration

In the last example, we ran run contract tests above by passing the contract path to Specmatic. The drawback here is that the command is not easily machine parseable. It will not be easy for tools to find out which contract is being run as test on which service, and do further analysis. Updating the command to add more contracts will also be more error prone.

So instead:

* Create a file named specmatic.json. 

```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "https://github.com/your-username-or-org/your-repo.git",
      "test": [
        "path/to/employees.yaml"
      ]
    }
  ]
}
```

* Create a git repository and push the employees.yaml contract into it.
* Update the value of "repository" to the url of the git repo. This should be a url that could be used by git checkout.
* Update the contract path in "test" to the relative path of employees.yaml within the git repository.

Specmatic will use the git command to checkout the git repository provided in specmatic.json. So make sure that the `git` command works on your laptop.

On the command line, `cd` into the directory containing specmatic.json.

Run this command: `{{ site.spec_cmd }} --testBaseURL https://my-json-server.typicode.com`

Note that no contracts are passed to Specmatic. Since no contracts have been passed, Specmatic looks for specmatic.json in the current working directory, checks out the contract repo, and runs the specified contracts as contract tests.

Since Specmatic uses specmatic.json in the current working directory, it's important to use `cd` into the directory containing specmatic.json. For Java projects, specmatic.json should be in the same directory as the pom.xml or build.gradle file.

Since Specmatic uses git under-the-hood, any authentication requirements of your git server will be handled by the underlying git command.

Note:
1. The value of "repository" is the git repository in which the contracts are declared. It can be any git repo, not just github.
2. The value of "test" is a list of contract paths, relative to the repository root, which should be run as contract tests.
3. You may declare multiple contracts in the "test" list.
4. "sources" holds a list. You may declare multiple sources if required. However we recommend using a single contract repository to be shared across your organisation, or ecosystem within the organisation (if your org is large).

### The Java Helper For Java Projects

For Java projects, you can use the Java helper that ships with Specmatic.

Add the following dependencies to your pom.xml file.

```xml
<dependency>
    <groupId>in.specmatic</groupId>
    <artifactId>junit5-support</artifactId>
    <version>{{ site.latest_release }}</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.8.2</version>
    <scope>test</scope>
</dependency>
```

Add a class that inherits from SpecmaticJUnitSupport. See how this is done [here](https://github.com/znsio/specmatic-order-api/blob/main/src/test/java/com/store/ContractTests.java).

In it, set the "host" and "port" properties to tell Specmatic where to find the application. You can also start the application in that class.

Add specmatic.json at the project root, as described in the previous section.

SpecmaticJUnitSupport is a dynamic JUnit5 test. It will read the contracts from specmatic.json, and run them.

Since it is a JUnit5 test, you can run it in all the ways you are used to. If you run it in the IDE, you'll see the results in your IDEs GUI. If you run `mvn test`, Surefire will store the results of the contract tests in the JUnit xml output file alongside any other JUnit tests in your project. The same applies to `./gradlew test`.

### Contracts In A Mono-Repo

If you are using a mono-repo, in which all the projects in the ecosystem are in the same repository, the contracts used by these projects may also be kept in the same repository.

specmatic.json may look like this:

```json
{
  "sources": [
    {
      "provider": "git",
      "test": [
        "contracts/path/to/employees.yaml"
      ]
    }
  ]
}
```

Note that "repository" is missing. Specamtic will look for the contract in the git repository containing specmatic.json. It's presumed that specmatic.json would be in a git repository, as the project would have to be pushed into some git repository.

### Authentication In CI For HTTPS Git Source

Specmatic does a checkout of the git repository given in specmatic.json. On your laptop, the git command will take care of authentication and prompt you for a password. But a build on a CI server runs headless without no chance for a user to enter credentials.

Instead, Specmatic can do the checkout using OAuth2 authentication, which is also supported by most git providers.

Add a key named "auth" to specmatic.json, as seen in the example below.

```json
{
  "auth": {
    "bearer-file": "bearer.txt"
  },
  "sources": [
    {
      "provider": "git",
      "repository": "https://github.com/your-username-or-org/your-repo.git",
      "test": [
        "path/to/employees.yaml"
      ]
    }
  ]
}
```

In CI, the necessary oauth2 token must be fetched and stored in a file named bearer.txt (as configured) side-by-side with specmatic.json, before running contract tests.

If you are using Microsoft Azure as both your git provider as well as CI, you can use a secret build variable named System.AccessToken, provided by Microsoft Azure, as your OAuth2 bearer token. Before running the tests, use a script to place the value of this variable in a file. For example:

```yaml
# Sample azure pipeline snippet
steps:
  - bash: |
      echo $(System.AccessToken) > bearer.txt
    displayName: Create auth token file
  - bash: |
      mvn test
```

You could also use an environment variable to pass the token.

```json
{
  "auth": {
    "bearer-environment-variable": "BEARER"
  },
  "sources": [
    {
      "provider": "git",
      "repository": "https://github.com/your-username-or-org/your-repo.git",
      "test": [
        "path/to/employees.yaml"
      ]
    }
  ]
}
```

Again, using an example for Microsoft Azure:

```yaml
# Sample azure pipeline snippet
steps:
  - bash: |
      mvn test
    env:
      BEARER: $(System.AccessToken)
```

We have provided samples for Azure, but the same can be done easily in any build system.

 Note that if you are using different systems for git and CI, the two will not be integrated. The first step is to fetch the OAuth2 token from the git repo. The second step is to create the file or environment variable as described above, and finally, you may run the contract tests.

### Authentication In CI For SSH Git Source

You can also use an ssh url as your git source. Take the help of your DevOps team to generate SSH keys locally and on your CI server, and place the local and CI public keys in .ssh/authorized_keys your git server. This will enable the git command to handle authentication seamlessly via SSH authentication.

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
