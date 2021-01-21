---
layout: default
title: Service Virtualisation
parent: Documentation
nav_order: 4
---
Service Virtualisation
======================

- [Service Virtualisation](#service-virtualisation)
    - [Why Service Virtualisation](#why-service-virtualisation)
    - [Why Qontract](#why-qontract)
    - [First Define The Contract](#first-define-the-contract)
    - [Basic stub using just the contract](#basic-stub-using-just-the-contract)
    - [Stubbing out specific responses to specific requests](#stubbing-out-specific-responses-to-specific-requests)
    - [Stubbing requests and responses with complex data](#stubbing-requests-and-responses-with-complex-data)
    - [Errors when stubbing requests or reponses that do not match the contract](#errors-when-stubbing-requests-or-reponses-that-do-not-match-the-contract)
    - [Match not found: wrong URL or method in the request](#match-not-found-wrong-url-or-method-in-the-request)
    - [Stubbing out multiple contracts in one Qontract instance](#stubbing-out-multiple-contracts-in-one-qontract-instance)
    - [Lenient stubbing](#lenient-stubbing)
    - [Strict mode](#strict-mode)
    - [Matching Path and Query Parameters in stub data json](#matching-path-and-query-parameters-in-stub-data-json)
    - [Datatype matching in stubs](#datatype-matching-in-stubs)
    - [Stub without hardcoding values in the response](#stub-without-hardcoding-values-in-the-response)
    - [Creating dynamic stubs](#creating-dynamic-stubs)
    - [Altering the stubbed response to a request](#altering-the-stubbed-response-to-a-request)
    - [Introducing a delay in the Stub Response](#introducing-a-delay-in-the-stub-response)
    - [Forward Unstubbed Requests To An Actual Service](#forward-unstubbed-requests-to-an-actual-service)
    - [Stub file format](#stub-file-format)

[Read here about contract testing and where Qontract fits in](/contract_testing.html).

### Why Service Virtualisation

It is not easy to develop an application that depends on 3rd party APIs. These APIs typically run in a staging environment. They must be invoked over the network, during the process of coding, debugging or running component tests. But sometimes the staging environment is down. The local internet connection may be offline. Sometimes an account has to be setup, data within the account has to be created, orders placed, etc and different developers on the same project overwrite eachother's test data.

All this is outside our control. Tests can fail for any of these reasons, over and above actual logical errors, which can make running them quite frustrating.

The solution is to simulate the 3rd party APIs, and run the simulations on the developer's laptop. A service virtualization tool provides this capability. A quick google search will yield several such tools. You feed such a tool all the requests your application makes to the 3rd party service, and all the respective responses expected from the service. With this information, the tool will completely simulate the 3rd party service for your application to run on. Since it runs on the developer's laptop, it will never be slow or go offline.

### Why Qontract

If the API ever adds a parameter, changes a type, etc. the simulation will be out of sync, and the consumer application will not integrate with the provider API in higher environments.

One solution is to define the API first as a specification, and then use it to simulate the provider. For this to be effective, the provider dev must [run the same contract spec to test their API](/documentation/contract_tests.html). This way, the provider cannot deviate from the contract, assuring consumers of the fidelity of the simulation.

Qontract can be used to define such an API specification.

### First Define The Contract

[Read more about how to define a contract here.](/documentation/language.html)

### Basic stub using just the contract

A simulation is also called a stub.

In it's most basic form, you only need the contract.

```gherkin
# filename: random.qontract

Feature: Random API
  Scenario: Random number
    When POST /number
    And request-body
      | number | (number) |
    Then status 200
    And response-body (number)
```

You can run this in stub mode by itself: `{{ site.qontract_cmd }} stub random.qontract`

You now have an http server running on port 9000 that responds to requests, such as:

```shell
> curl -X POST -H 'Content-Type: application/json' -d '{"number": 10}' http://localhost:9000/number
436
```

Any request that matches the contract request will be accepted.

The response will be randomly generated, based on the contract. The contract defines the response as a number, so the response was a randomly generated number. In every run, you will get a different, randomly generated response that matches the contract.

The file extension is `.qontract` by convention, and is enforced by the stub command.
When contract files with extensions other than '.qontract' are supplied as input the command will exit and print all the files that have erroneous extensions
```shell
> {{ site.qontract_cmd }} stub random.contract
The following files do not end with qontract and cannot be used:
random.contract
```

### Stubbing out specific responses to specific requests

Often, you'll need the stub to return a specific response for a given request.

For example:
```gherkin
# filename: square.qontract

Feature: Square API
  Scenario: Square of a number
    When POST /square
    And request-body (number)
    Then status 200
    And response-body (number)
```

A useful stub might be that when we post the number 5, we get 25 back.

Follow these steps:
- Create a directory named square_data, in the same directory as the square.qontract file.
- In that directory, create a json file, name it what you like. For example, square_of_5.json
- Put in that file the following text:

```json
{
    "http-request": {
        "method": "POST",
        "path": "/square",
        "body": 5
    },
    "http-response": {
        "status": 200,
        "body": 25
    }
}
```

- Create a json file named square_of_6.json
- Put in that file the following text:

```json
{
    "http-request": {
        "method": "POST",
        "path": "/square",
        "body": 6
    },
    "http-response": {
        "status": 200,
        "body": 36
    }
}
```

The directory structure now looks like this:

```
|
 \_ square.qontract [file]
 \_ square_data     [directory]
    |
     \_ square_of_5.json [file]
     \_ square_of_6.json [file]
```

Try running the stub now:

```shell
> {{ site.qontract_cmd }} stub square.qontract
Reading the stub files below:
./square_data/square_of_5.json
./square_data/square_of_6.json
Stub server is running on http://localhost:9000. Ctrl + C to stop.
```

Qontract looks for a directory with the filename of the qontract file, + the suffix "_data". It found it in this case, and loaded it.

In another tab, let's post 5 to the stub and see what happens:

```shell
> curl -X POST -H 'Content-Type: text/plain' -d 5 http://localhost:9000/square
25
```

Try posting 6 to the stub:

```shell
> curl -X POST -H 'Content-Type: text/plain' -d 6 http://localhost:9000/square
36
```

Let's post 10 to the stub and see:

```shell
> curl -X POST -H 'Content-Type: text/plain' -d 10 http://localhost:9000/square
384
```

We did not have a stub with 10 in the request, but it matched the ontract. Qontract did not have a stubbed response, so it generated one and returned it.

### Stubbing requests and responses with complex data

The contract:

```gherkin
# filename: customer.qontract

Feature: Customer API
  Scenario: Add customer
    Given type Customer
      | name    | (string) |
      | address | (string) |
    When POST /customers
    And request-body (Customer)
    Then status 200
```

Create a directory named customer_data, and put this stub in it:

```json
// filename: new_customer.json
{
    "http-request": {
        "method": "POST",
        "path": "/customers",
        "body": {
            "name": "Sherlock Holmes",
            "address": "22 Baker Street"
        }
    },
    "http-response": {
        "status": 200
    }
}
```

Run the stub:

```shell
> {{ site.qontract_cmd }} stub customer.qontract
Reading the stub files below:
/path/to/customer_data/new_customer.json
Stub server is running on http://localhost:9000. Ctrl + C to stop.
```

Invoke it in another tab:

```shell
> curl -X POST -H 'Content-Type: application/json' -d '{"name": "Sherlock Holmes", "address": "22 Baker Street"}' http://localhost:9000/customers
success
```

### Errors when stubbing requests or reponses that do not match the contract

The contract:

```gherkin
# filename: customer.qontract

Feature: Customer API
  Scenario: Add customer
    Given type Customer
      | name    | (string) |
      | address | (string) |
    When POST /customers
    And request-body (Customer)
    Then status 200
    And response-body (string)
```

Create a directory named customer_data, and put this stub in it:

```json
// filename: new_customer.json
{
    "http-request": {
        "method": "POST",
        "path": "/customers",
        "body": {
            "name": "Sherlock Holmes",
            "address": 10
        }
    },
    "http-response": {
        "status": 200,
        "body": "success"
    }
}
```

Run the stub:

```
> {{ site.qontract_cmd }} stub customer.qontract
Reading the stub files below:
/path/to/customer_data/new_customer.json
/path/to/customer_data/new_customer.json didn't match customer.qontract
In scenario "Add customer"
>> REQUEST.BODY.address

Expected string, actual was number: 10
Stub server is running on http://localhost:9000. Ctrl + C to stop.
```

You can read more about [Qontract reports here](documtation/../reading_reports.html).

You are warned here that the address was supposed to be a string, but was a number, 10.

Qontract will not load this stub. But it will still load and stub out customer.qontract. So you will get random responses matching the contract back for any request that matches the contract.

Try invoking the stub now:

```shell
> curl -X POST -H 'Content-Type: application/json' -d '{"name": "Sherlock Holmes", "address": "22 Baker Street"}' http://localhost:9000/customers
YHTHY
```

### Match not found: wrong URL or method in the request

When the stub gives you this error, it means that the url in your request does not match the contract or any of the stubs that you have setup.

Let's try this with an example.

File: square.qontract
```gherkin
Feature: Square API
  Scenario: Square number
    When POST /square
    And request-body (number)
    Then status 200
    And response-body (number)
```

Create a stub for it:

File: square_data/stub.json
```json
{
    "http-request": {
        "method": "POST",
        "path": "/square",
        "body": 10
    },
    "http-response": {
        "status": 200,
        "body": 100
    }
}
```

Run the stub:

```bash
> qontract stub square.qontract
Loading square.qontract
  Loading stub expectations from /Users/joelrosario/tmp/square_data
  Reading the following stub files:
    /Users/joelrosario/tmp/square_data/stub.json
Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```

And in a new tab, let's make an API call with the number we stubbed out:
```bash
> curl -X POST -H 'Content-Type: text/plain' -d 10 http://localhost:9000/square
100
```

Let's pass a number we did not stub out, say 20:
```bash
> curl -X POST -H 'Content-Type: text/plain' -d 20 http://localhost:9000/square
263
```

Let's even try with the the wrong method. The API expects POST, let's try with GET:

```bash
curl -X GET -H 'Content-Type: text/plain' -d 20 http://localhost:9000/square
In scenario "Square number"
>> REQUEST.METHOD

Expected POST, actual was GET
```

But now, let's try with a URL that does not feature in the contract at all:

```bash
curl -X POST -H 'Content-Type: text/plain' -d 20 http://localhost:9000/number
Match not found
```

Without the URL, Qontract has no clue how to correlate the request with either the contract or it's stubs, and simply responds saying "Match not found".

### Stubbing out multiple contracts in one Qontract instance

If you want to stub out multiple contracts together:

```shell
> {{ site.qontract_cmd }} stub customer.qontract order.qontract
```

If the customer_data and order_data directories exist, stub data will be loaded from them automatically.

### Lenient stubbing

So far we have been using examples of lenient stubbing. To reiterate, by default in lenient stubbing, if your request matches the contract, but none of the stubs, contract generates a response using the format defined in the contract. The values in the response are randomised.

Consider this contract:

```gherkin
# filename: customer.qontract

Feature: Customer API
  Scenario: Add customer
    When GET /customers?name=(string)
    Then status 200
    And response-body (string)
```

Create a directory named customer_data, and inside it a file named stub.json, with the following contents:

```json
// filename: customer_data/stub.json
{
    "http-request": {
        "method": "GET",
        "path": "/customers",
        "query": {
            "name": "Sherlock"
        }
    },
    "http-response": {
        "status": 200,
        "body": "22 Baker Street"
    }
}
```

Now start the stub, and in a new tab or window, invoke the API passing Sherlock:

```shell
> curl http://localhost:9000/customers\?name\=Sherlock
22 Baker Street%
```

Which is what we expect.

But let's try the wrong name now:

```
curl http://localhost:9000/customers\?name\=Jane
ILXWG
```

Note that the stub was expecting Sherlock but not Jane. However, the `name` query parameter can take a string according to the contract and Jane is a string.

So while Qontract doesn't know what to reply in response to the request for a customer named Jane, the request does meet the contract.

In this case, Qontract generated a randomised response based on the format in the contract and returned it.

### Strict mode

Sometimes when we send a request we thought we had stubbed, we get a randomised response because of lenient stubbing. But we do want the specific response we had stubbed out, and would like Qontract to tell us why it is not returning it.

To do this, we must turn strict mode **on**.

```
java -jar path/to/qontract.jar stub customer.qontract --strict
```

Invariably this happens when the request matches the contract, but does not match any of the stubs. Perhaps it's a small difference, which is why we missed it.

Let's try this with the same contract as above:

```gherkin
# filename: customer.qontract

Feature: Customer API
  Scenario: Add customer
    When GET /customers?name=(string)
    Then status 200
    And response-body (string)
```

Create a directory named customer_data, and inside it a file named stub.json, with the following contents:

```json
// filename: customer_data/stub.json
{
    "http-request": {
        "method": "GET",
        "path": "/customers",
        "query": {
            "name": "Sherlock"
        }
    },
    "http-response": {
        "status": 200,
        "body": "22 Baker Street"
    }
}
```

Now start the stub, and in a new tab, invoke the API with the name Jane instead of Sherlock and see the result:

```shell
> curl http://localhost:9000/customers\?name\=Jane
STRICT MODE ON

>> REQUEST.URL.QUERY-PARAMS.name

Expected string: "Sherlock", actual was string: "Jane"
```

This is exactly the same command we ran at the end of the previous section but we were not running in strict mode then.

Now in strict mode, Qontract returns an error indicating what was wrong with our request.

### Matching Path and Query Parameters in stub data json

Consider this contract file.

File: petstore.qontract
```gherkin
Feature: Contract for the petstore service

    Scenario: Fetch pet details
        When GET /pets/(id:number)?name=(string)
        Then status 200
        And response-body (string)
```

The path parameter id and query parameter name can be setup in the corresponding data json file with below syntax.

File: petstore_data/petstore.json
```json
{
     "http-request": {
         "method": "GET",
         "path": "/pets/2",
         "query": {
             "name": "Archie"
         }
     },
     "http-response": {
        "status": 200,
        "body": "Golden Retriever"
    }
}
```

The path parameter, id is set up to match the number 2. Query parameters cannot be mentioned as is, they have to separately setup under the "query" section.

So even below curl request will return "Golden Retriever" as long as path and query parameters matches.

```bash
> curl -vs http://0.0.0.0:9000/pets/2\?name\=Archie 2>&1 | less

Golden Retriever
``` 

If the path and query parameters do not match the stub, then a generated response will be returned.
```bash
> curl -vs http://0.0.0.0:9000/pets/2\?name\=Shiro 2>&1 | less
MJUKU
```

In strict mode (running the stub command with --strict option), the entire URL is matched.

```bash
> java -jar ~/Downloads/qontract.jar stub ~/test.qontract --strict
```

And in a new tab:

```bash
> curl -vs http://0.0.0.0:9000/pets/2\?name\=Archie 2>&1 | less
Golden Retriever

curl -vs http://0.0.0.0:9000/pets/2\?name\=Shiro 2>&1 | less
STRICT MODE ON
>> REQUEST.URL.QUERY-PARAMS.name
Expected string: "Archie", actual was string: "Shiro"* Closing connection 0
```

### Datatype matching in stubs

Let us assume in the above example you are not interested in matching the pet id. As long as the name is "Archie" you want to return "Golden Retriever".

```json
{
     "http-request": {
         "method": "GET",
         "path": "/pets/(id:number)",
         "query": {
             "name": "Archie"
         }
     },
     "http-response": {
        "status": 200,
        "body": "Golden Retriever"
    }
}
```

Another example where we can match any string in the query parameter "name" and only the number 2 for id.

```json
{
     "http-request": {
         "method": "GET",
         "path": "/pets/2",
         "query": {
             "name": "(string)"
         }
     },
     "http-response": {
        "status": 200,
        "body": "Golden Retriever"
    }
}
```

The Datatype matching works in ("--strict")[#strict-mode] mode also.

### Stub without hardcoding values in the response

Sometimes you don't care what values come back in the response, you just need, say, a string.

```gherkin
# filename: customer.qontract

Feature: Customer API
  Scenario: Add customer
    Given type Customer
      | name    | (string) |
      | address | (string) |
    When POST /customers
    And request-body (Customer)
    Then status 200
    And response-body (string)
```

Create a directory named customer_data, and a file named stub.json within it that contains this:

```json
// filepath: customer_data/stub.json
{
    "http-request": {
        "method": "POST",
        "path": "/customers",
        "body": {
            "name": "Sherlock Holmes",
            "address": "22 Baker Street"
        }
    },
    "http-response": {
        "status": 200,
        "body": "(string)"
    }
}
```

And the result:

```shell
> curl -X POST -H 'Content-Type: application/json' -d '{"name": "Sherlock Holmes", "address": "22 Baker Street"}' http://localhost:9000/customers
TPVNQ
```

The response is a random one, generated by Qontract.

### Creating dynamic stubs

You can setup a stub over HTTP, after Qontract has been started.

Let's try this out with a simple contract:

```gherkin
# filename: customer.qontract

Feature: Customer API
  Scenario: Add customer
    Given type Customer
      | name    | (string) |
      | address | (string) |
    When POST /customers
    And request-body (Customer)
    Then status 200
    And response-body (string)
```

Start it as a stub:

```bash
> qontract stub customer.qontract
Loading customer.qontract
Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```

Now run the following curl command:

```bash
> curl -X POST -H 'Content-Type: application/json' -d '{"http-request": {"method": "POST", "path": "/customers", "body": {"name": "Jane Doe", "address": "12B Baker Street"}}, "http-response": {"status": 200, "body": "success"}}' http://localhost:9000/_qontract/expectations
```

We just posted the stub content using the POST verb to Qontract at the path /_qontract/expectations.

Now the stub is setup with real values.

Note that the contents of the body, specified by the -d parameter, follows the same format as the sample stub json files that we have seen before.

Let's invoke the stub now.

```bash
> curl -X POST -H 'Content-Type: application/json' -d '{"name": "Jane Doe", "address": "12B Baker Street"}' http://localhost:9000/customers
success
```

The stub returns success, just like we told it.

### Altering the stubbed response to a request

Sometimes, in the same test suite, different tests may require different responses for the same request parameters.

Consider the following contract, in which we have scenarios for success as well as failure.

```gherkin
# filename: customer.qontract

Feature: Customer API
  Background:
    Given type Customer
      | name    | (string) |
      | address | (string) |
    When POST /customers
    And request-body (Customer)

  Scenario: Update customer address
    Then status 200
    And response-body (string)

  Scenario: Customer not found
    Then status 404
    And response-body (string)
```

Start it as a stub:

```bash
> qontract stub customer.qontract
Loading customer.qontract
Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```

Suppose our first test expects to get success back, we can set it up dynamically using this curl command (which we already know from before):

```bash
> curl -X POST -H 'Content-Type: application/json' -d '{"http-request": {"method": "POST", "path": "/customers", "body": {"name": "Jane Doe", "address": "12B Baker Street"}}, "http-response": {"status": 200, "body": "success"}}' http://localhost:9000/_qontract/expectations
```

And we will be able to invoke the stub:

```bash
> curl -X POST -H 'Content-Type: application/json' -d '{"name": "Jane Doe", "address": "12B Baker Street"}' http://localhost:9000/customers
success
```

Now, suppose our next test expects `name not found` for Jane Doe at 12B Baker Street.

For the second test to work, the stub can't return `success` anymore. We need to alter it, so that given the old request body `{"name": "Jane Doe", "address": "12B Baker Street"}`, it provides the new response needed by the second test.

To do this, just call the dynamic expectaion API again.

```bash
> curl -X POST -H 'Content-Type: application/json' -d '{"http-request": {"method": "POST", "path": "/customers", "body": {"name": "Jane Doe", "address": "12B Baker Street"}}, "http-response": {"status": 404, "body": "name not found"}}' http://localhost:9000/_qontract/expectations
```

Let's try invoking the /customers API again:

```bash
curl -H 'Content-Type: application/json' -d '{"name": "Jane Doe", "address": "12B Baker Street"}' http://localhost:9000/customers
name not found
```

We get the new stubbed response back.

Note that in both curl calls to /_qontract/expectations, the request is the same, but the response status and body are different.

In short, the newer expectation overrides the older one with the same request parameters.

### Introducing a delay in the Stub Response

At times, it is necessary to simulate a slow response from the application we are stubbing.

```bash
> curl -X POST -H 'Content-Type: application/json' -d '{"http-request": {"method": "POST", "path": "/customers", "body": {"name": "Jane Doe", "address": "12B Baker Street"}}, "http-response": {"status": 404, "body": "name not found"}, "delay-in-seconds": 15}' http://localhost:9000/_qontract/expectations
```

The above dynamics expectation is exactly as in the previous section except the "delay-in-seconds" param. Every request that matches this specific expectation will respond with a 15 second delay.
On all other requests, Qontract responds immediately.

### Forward Unstubbed Requests To An Actual Service

You can provide a URL to which Qontract will forward all requests which have not been stubbed out.

This is done by start the stub like this:

```bash
> qontract stub --passThroughTargetBase http://third-party-service.com customer-service.qontract
```

Since nothing is stubbed at this point, Qontract will forward all requests as is to `http://third-party-service.com`, and relay the request back. In doing so, it acts as a plain vanilla proxy.

But if you create a stub:

```bash
> curl -X POST -H 'Content-Type: application/json' -d '{"http-request": {"method": "POST", "path": "/customers", "body": {"name": "Jane Doe", "address": "12B Baker Street"}}, "http-response": {"status": 200, "body": "success"}}' http://localhost:9000/_qontract/expectations
```

Qontract will handle the request:

```bash
> curl -X POST -H 'Content-Type: application/json' -d '{"name": "Jane Doe", "address": "12B Baker Street"}' http://localhost:9000/customers
success
```

### Stub file format

Here is a sample json stub file, containing all the keys you can use, with inline comments.

```json
{
    "http-request": {
        "method": "POST",
        "path": "/url/path/(number)/some/more/path", // Path parameters can appear inline, query parameters need to mentioned separately in the query section below.
        "headers": {
            "X-Header-Name1": "(string)",
            "X-Header-Name2": "(string)"
        },
        "query": {
            "id": "(number)",
            "type": "(string)"
        },


        // IMPORTANT You can have either body, form-fields or multipart-formdata, but not all 3
        "form-fields": {
            "Data": "(PredefinedJsonType)",
            "MoreData": "some hardcoded value"
        },
        "multipart-formdata": [
            {
                "name": "customers",

                // either content or filename, but not both
                "content": "(string)",
                "filename": "@data.csv", // must start with @
                "contentType": "text/plain", // optional, to be used with filename, matched against Content-Type header
                "contentEncoding": "gzip" // optional, matched against Content-Encoding header
            }
        ]
        "body": { // Body can also just be a string, such "Hello world", or an array, such as [1, 2, 3]
            "name": "Jane Doe",
            "address": "22 Baker Street"
        }
    },

    "http-response": {
        "status": 200, // http status expected in the response
        "headers": { // same as request headers
            "X-Header-Name": "(string)",
            "X-Header-Name2": "(string)"
        }
        "body": "some value" // can be any json value, but must match the contract
    }
}
```
