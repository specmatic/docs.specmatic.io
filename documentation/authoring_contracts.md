---
layout: default
title: Authoring Contracts
parent: Documentation
nav_order: 11
---
Authoring Contracts
===================

- [Authoring Contracts](#authoring-contracts)
  - [Running Specmatic](#running-specmatic)
  - [By hand](#by-hand)
    - [The contract file](#the-contract-file)
    - [Stub files that accompany the contract file](#stub-files-that-accompany-the-contract-file)
  - [From a sample request and response](#from-a-sample-request-and-response)
    - [Create the sample file](#create-the-sample-file)
    - [Convert the sample into a contract](#convert-the-sample-into-a-contract)
  - [From an existing application using outbound proxy mode](#from-an-existing-application-using-outbound-proxy-mode)
    - [Start the proxy](#start-the-proxy)
    - [Proxy setup](#proxy-setup)
    - [Generate contracts](#generate-contracts)
  - [From an existing application using reverse proxy mode](#from-an-existing-application-using-reverse-proxy-mode)
    - [Start the proxy](#start-the-proxy-1)
    - [Generate contracts](#generate-contracts-1)
  - [Importing a Postman collection](#importing-a-postman-collection)
    - [Export the collection](#export-the-collection)
    - [Generate the contract](#generate-the-contract)
  - [Importing a WSDL file](#importing-a-wsdl-file)

## Running Specmatic

All the contracts below assume that you have an alias or script setup to run specmatic as a command. For example, you should be able to run `specmatic --version`.

If not, check out the documentation on [Command Line](documentation/../command_line.html) to see how to setup your OS to run Specmatic easily.

## By hand

You could simply write the contract yourself. This is usually done when you don't have a service and are describing a fresh API from scratch.

### The contract file

A contract file contains a description of an API or a set of APIs using the [Specmatic language](/documentation/language.html). Contract files must have the extension `.spec`.

### Stub files that accompany the contract file

To learn more about stub files, read about [service virtualisation](/documentation/service_virtualisation.html), and within that, about [stubbing specific requests for specific responses](documentation/service_virtualisation.html#stubbing-out-specific-responses-to-specific-requests).

Stub files accompanying a contract can be easily used by anyone referring to the contract who needs to run a quick stub.

Stub files must be placed in a directory with the same name as the contract file, suffixed with _data.

For example, given a contract file named orderservice.spec:
* create a directory named orderservice_data in the same directory as the contract file
* put the stub files in that directory

The resulting directory structure might look something like this:

```
|
 \_ orderservice.spec [file]
 \_ orderservice_data     [directory]
    |
     \_ placing_an_order.json [file]
     \_ listing_all_orders.json [file]
```

## From a sample request and response

If you know what the request and response should look like, you can start by creating a file with the sample request and response.

### Create the sample file

The file must contain a single json object using the [Specmatic stub file format](documentation/service_virtualisation.html#stub-file-format).

Here's a sample file that contains a request for the name of a customer by id:

File: customer_stub.json
```json
{
  "http-request": {
    "method": "GET",
    "path": "/customer/name",
    "query": {
      "name": 10
    }
  },
  "http-response": {
    "status": 200,
    "body": "Jane Doe"
  }
}
```

### Convert the sample into a contract

Now run the `specmatic import stub` command on it:

```bash
> specmatic import stub -o <specmatic file>.json <stub file>.json
Written to file /Users/xyz/customer_stub.spec

> cat customer_stub.spec
Feature: New Feature
  Scenario: New scenario
    When GET /customer/name?id=(number)
    Then status 200
    And response-body (string)

    Examples:
    | id |
    | 10 |
```

The generated contract matches the sample.

In fact we can use the [sample as a stub](/documentation/service_virtualisation.html). To do so:

```bash
> mv customer_stub.spec customer.spec
> mkdir customer_data
> mv customer_stub.json customer_data
> specmatic stub customer.spec
Loading customer.spec
  Loading stub expectations from /Users/joelrosario/tmp/customer_data
  Reading the following stub files:
    /Users/joelrosario/tmp/customer_data/customer_stub.json
Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```

You can now make a call to this stub in a new tab:

```bash
> curl 'http://localhost:9000/customer/name?id=10'
Jane Doe
```

You can read more about [service virtualization here](/documentation/service_virtualisation.html).

Note the examples, which are used only when running [contract tests](documentation/../contract_tests.html). Examples have no part to play in service virtualisation (stubbing).

## From an existing application using outbound proxy mode

\
![](/images/specmatic-proxy.svg)

This tool will help you generate contract specs when the API exists in some environment and can be invoked.

### Start the proxy

As an example, let's generate a contract for the /employee API from this helpfully provided set of dummy APIs: http://dummy.restapiexample.com

First let's start the proxy:

```bash
> specmatic proxy ./contracts
Proxy server is running on http://localhost:9000. Ctrl + C to stop.
```

Make sure the contracts directory does not exist before you start the proxy.

### Proxy setup

We'll take Postman as an example. Setup proxy in Postman's settings with the proxy host as localhost and the proxy port as 9000.

Here's the documentation on [proxy settings in Postman](https://learning.postman.com/docs/sending-requests/capturing-request-data/proxy/). Use Specmatic Proxy as an HTTP proxy, with localhost as the host and 9000 as the port.

Note: All operating systems have a system wide configuration settings for configuring an HTTP proxy. Many applications (such as Postman) provide their own proxy configuration settings.

### Generate contracts

Create a new Postman request to send a GET request to http://dummy.restapiexample.com/api/v1/employees.

Finally, kill the proxy using Ctrl+C on the command prompt, and it will generate contracts from all the reqeusts and responses it has seen.

You will see something like this:
```bash
Writing contract to ./data/new_feature.spec
Writing stub data to ./data/stub0.json
```

When it does, the proxy generates contracts and stubs out of all the request-response exchanges it has seen, and we will see something like this:

```bash
> ls ./contracts
new_feature.spec stub0.json
```

Let's see what's in them.

```bash
> cat contracts/new_feature.spec
Feature: New feature
  Scenario: GET http://dummy.restapiexample.com/api/v1/employees
    Given type Data
      | id | (string) |
      | employee_name | (string) |
      | employee_salary | (string) |
      | employee_age | (string) |
      | profile_image | (string) |
    And type ResponseBody
      | status | (string) |
      | data | (Data*) |
    When GET http://dummy.restapiexample.com/api/v1/employees
    And request-header User-Agent (string)
    And request-header Accept (string)
    And request-header Postman-Token (string)
    And request-header Host (string)
    And request-header Accept-Encoding (string)
    And request-header Connection (string)
    Then status 200
    And response-header Cache-Control (string)
    And response-header Date (string)
    And response-header Display (string)
    And response-header Referrer-Policy (string)
    And response-header Response (number)
    And response-header Server (string)
    And response-header X-Ezoic-Cdn (string)
    And response-header X-Middleton-Display (string)
    And response-header X-Middleton-Response (number)
    And response-header X-Sol (string)
    And response-body (ResponseBody)

    Examples:
    | User-Agent | Accept | Postman-Token | Host | Accept-Encoding | Connection |
    | PostmanRuntime/7.26.3 | */* | 162f2e8b-e3c2-48d8-9db7-0541daa8325a | dummy.restapiexample.com | gzip, deflate, br | keep-alive |
```

Note that examples are use for [contract testing](/documentation/contract_tests.html). They have no bearing on service virtualization (stubbing).

Similarly, take a look at the stub. Here is a shortened version of it:

```bash
{
    "http-request": {
        "path": "/api/v1/employees",
        "method": "GET",
        "headers": {
            "User-Agent": "PostmanRuntime/7.26.3",
            "Accept": "*/*",
            "Postman-Token": "4e20854c-86dc-454e-a1a1-09f79321072a",
            "Host": "localhost:9000",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive"
        },
        "body": ""
    },
    "http-response": {
        "status": 200,
        "body": {
            "status": "success",
            "data": [
                {
                    "id": "1",
                    "employee_name": "Tiger Nixon",
                    "employee_salary": "320800",
                    "employee_age": "61",
                    "profile_image": ""
                },
                {
                    "id": "2",
                    "employee_name": "Garrett Winters",
                    "employee_salary": "170750",
                    "employee_age": "63",
                    "profile_image": ""
                }
            ]
        },
        "status-text": "OK",
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Expose-Headers": "Content-Type, X-Requested-With, X-authentication, X-client",
            "Cache-Control": "max-age=31536000",
            "Content-Encoding": "gzip",
            "Content-Type": "application/json;charset=utf-8",
            "Date": "Fri, 11 Sep 2020 15:37:11 GMT",
            "Display": "staticcontent_sol",
            "Referrer-Policy": "",
            "Response": "200",
            "Server": "nginx/1.16.0",
            "Vary": "Accept-Encoding",
            "X-Ezoic-Cdn": "Hit ds;mm;64e5dcd8fd074fe044e20470a9643699;2-133674-2;11eea874-25cc-4a8a-4a7a-e7fd9bafe9d8",
            "X-Middleton-Display": "staticcontent_sol",
            "X-Middleton-Response": "200",
            "X-Sol": "pub_site",
            "Content-Length": "595"
        }
    }
}
```

There are many unnecessary headers being declared in the contract and stubbed out as well. Specmatic just puts outputs it finds, leaving it you to decide what's important and what isn't.

So here's an improved version of the above contract without the unnecessary headers:

```gherkin
Feature: New feature
  Scenario: GET /api/v1/employees
    Given type Data
      | id | (string) |
      | employee_name | (string) |
      | employee_salary | (string) |
      | employee_age | (string) |
      | profile_image | (string) |
    And type ResponseBody
      | status | (string) |
      | data | (Data*) |
    When GET /api/v1/employees
    Then status 200
    And response-body (ResponseBody)
```

And similarly, and improved stub file:
```json
{
    "http-request": {
        "path": "/api/v1/employees",
        "method": "GET"
    },
    "http-response": {
        "status": 200,
        "body": {
            "status": "success",
            "data": [
                {
                    "id": "1",
                    "employee_name": "Tiger Nixon",
                    "employee_salary": "320800",
                    "employee_age": "61",
                    "profile_image": ""
                },
                {
                    "id": "2",
                    "employee_name": "Garrett Winters",
                    "employee_salary": "170750",
                    "employee_age": "63",
                    "profile_image": ""
                }
            ]
        }
    }
}
```

## From an existing application using reverse proxy mode

\
![](/images/specmatic-reverse-proxy.svg)

If your remote service runs over HTTPS, use Inbound Proxy Mode. Specmatic acts as a transparent proxy between the client (Postman, your application, etc) and the API.

Let's use the same freely provided (again many thanks to its maintainer) test employee API that we used above.

### Start the proxy

```bash
> specmatic proxy --target http://dummy.restapiexample.com ./contracts
Proxy server is running on http://localhost:9000. Ctrl + C to stop.```
```

Make sure the contracts directory does not exist.

### Generate contracts

Now use Postman to send a request to Specmatic. Create a new Postman request to make a GET request to http://localhost:9000/api/v1/employees

Finally, kill the proxy using Ctrl+C on the command prompt, and it will generate contracts from all the reqeusts and responses it has seen.

You will see something like this:
```bash
Writing contract to ./data/new_feature.spec
Writing stub data to ./data/stub0.json
```

When it does, the proxy generates contracts and stubs out of all the request-response exchanges it has seen, and we will see something like this:

```bash
> ls ./contracts
new_feature.spec stub0.json
```

These files will look just like what is generated by the outbound proxy mode. So take a look at the previous section to see what is in them, and what to do once you have these files.

## Importing a Postman collection

This is useful when you have a Postman collection which you use to test your service. Well now you can also convert that collection into a contract.

### Export the collection

First you must [export the collection to a file](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#exporting-postman-data). Use v2.1 when doing so.

Here's a sample Postman collection that you can use:

File: postman_employee.json
```json
{
        "info": {
                "_postman_id": "042689b4-61dc-4697-85e6-72d47adc0678",
                "name": "Free Test API",
                "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "item": [
                {
                        "name": "Employee data",
                        "request": {
                                "method": "GET",
                                "header": [],
                                "url": {
                                        "raw": "http://dummy.restapiexample.com/api/v1/employees",
                                        "protocol": "http",
                                        "host": [
                                                "dummy",
                                                "restapiexample",
                                                "com"
                                        ],
                                        "path": [
                                                "api",
                                                "v1",
                                                "employees"
                                        ]
                                }
                        },
                        "response": []
                }
        ],
        "protocolProfileBehavior": {}
}
```

### Generate the contract

```bash
> specmatic import postman -o . <postman collection file>.json
```

This command will read the Postman collection, and write the new specmatic file into "specmatic file.json" as specified in the command.

It will also output logs of the requests it made and responses it received.

The `-o .` option tells Specmatic to write the contract into the current directory.

Take a look at the resulting contract:

```gherkin
> cat postman_employee-dummy.restapiexample.com.spec
Feature: Free Test API
  Scenario: Employee data
    Given type Data
      | id | (string) |
      | employee_name | (string) |
      | employee_salary | (string) |
      | employee_age | (string) |
      | profile_image | (string) |
    And type ResponseBody
      | status | (string) |
      | data | (Data*) |
    When GET /api/v1/employees
    Then status 200
    And response-header Cache-Control (string)
    And response-header Date (string)
    And response-header Display (string)
    And response-header Referrer-Policy (string)
    And response-header Response (number)
    And response-header Server (string)
    And response-header X-Ezoic-Cdn (string)
    And response-header X-Middleton-Display (string)
    And response-header X-Middleton-Response (number)
    And response-header X-Sol (string)
    And response-header Transfer-Encoding (string)
    And response-body (ResponseBody)
```

We can immediately see a numer of headers in the contract that have nothing to do with the AIP. Specmatic dumps them all into the contract and leaves it to you to keep what's important.

You should simply remove the unnecessary headers, like so:

```gherkin
Feature: Free Test API
  Scenario: Employee data
    Given type Data
      | id | (string) |
      | employee_name | (string) |
      | employee_salary | (string) |
      | employee_age | (string) |
      | profile_image | (string) |
    And type ResponseBody
      | status | (string) |
      | data | (Data*) |
    When GET /api/v1/employees
    Then status 200
    And response-body (ResponseBody)
  ```

Now with this contract, even if the actual response had those headers, Specmatic will in future not concern itself with the unknown headers.

## Importing a WSDL file

The command for this is `specmatic import wsdl <wsdlfilename>`

[Here's a WDSL file](https://raw.githubusercontent.com/strongloop/strong-soap/master/example/wsdls/stockquote.wsdl) for you to try this on.

Download that file, and run this command:
```bash
❯ specmatic import wsdl stockquote.wsdl
Written to file stockquote.spec
```

Now open the stockquote.spec file and see what it contains.

You can read more about the language 