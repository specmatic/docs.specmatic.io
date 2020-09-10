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
    - [Why Use Qontract](#why-use-qontract)
    - [Stub without expectations](#stub-without-expectations)
    - [Stub with expectations](#stub-with-expectations)
    - [Stub with json](#stub-with-json)
    - [Stub contains incorrect data](#stub-contains-incorrect-data)
    - [Stub with multiple contracts](#stub-with-multiple-contracts)
    - [Keeping all the expectations in a single directory](#keeping-all-the-expectations-in-a-single-directory)
    - [Stub without hardcoding values in the request](#stub-without-hardcoding-values-in-the-request)
    - [Stub without hardcoding values in the response](#stub-without-hardcoding-values-in-the-response)
    - [Debugging your stub using strict mode](#debugging-your-stub-using-strict-mode)
    - [Dynamic stubbing over HTTP](#dynamic-stubbing-over-http)
    - [Stub file format](#stub-file-format)

[Read here about contract testing and where Qontract fits in](/contract_testing.html).

### Why Service Virtualisation

It is not easy to develop an application that depends on 3rd party APIs. These APIs never run on the dev laptop or environment. They must be invoked over the network, during the process of coding, debugging or running component tests. But access to the APIs is usually flaky. The network may be down. The dev laptop may be offline. Sometimes an account has to be setup, data within the account has to be created, orders placed, etc.

Instead, we prefer to set up a stub API that appears to act like the real API, and runs on the developer's laptop. Since it is on the developer's laptop, it is never flaky, and always available. The consuming application that is being developed on that laptop doesn't know that it is talking to a local stub, and in fact cannot tell the difference.

### Why Use Qontract

There are many tools you can use for service virtualisation. Qontract however compares the stub setup (called expectations) with the given contract to ensure that they are in sync. The same contract is used by the provider when running [contract tests](/documentation/contract_tests.html). Since the consumer sets expectations on it's stubs that match the contract, and the provider API is built to adhere to the same contract, the integration between the consumer and provider stays intact.

Additionally, the contract spec is human-readable. So contracts can be circulated around by email, chat, etc when the API design is under discussion.

### Stub without expectations

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

You can run this as a stub by itself: `{{ site.qontract_cmd }} stub random.qontract`

You now have an http server running on port 9000 that responds to requests, such as:

```shell
> curl -X POST -H 'Content-Type: application/json' -d '{"number": 10}' http://localhost:9000/number
436
```

Any request that matches the contract request will be accepted.

The response will be randomly generated, based on the contract. The contract defines the response as a number, so the response was a randomly generated number. In every run, you will get a different, randomly generated response that matches the contract.

Try this out with a more complex json response and see how it works.

### Stub with expectations

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

The directory structure now looks like this:

```
|
 \_ square.qontract [file]
 \_ square_data     [directory]
    |
     \_ square_of_5.json [file]
```

Try running the stub now:

```shell
> {{ site.qontract_cmd }} stub square.qontract
Reading the stub files below:
./square_data/square_of_5.json
Stub server is running on http://localhost:9000. Ctrl + C to stop.
```

Qontract looks for a directory with the filename of the qontract file, + the suffix "_data". It found it in this case, and loaded it.

In another tab, let's post 5 to the stub and see what happens:

```shell
> curl -X POST -H 'Content-Type: text/plain' -d 5 http://localhost:9000/square
25
```

Let's post 10 to the stub and see:

```shell
> curl -X POST -H 'Content-Type: text/plain' -d 10 http://localhost:9000/square
384
```

We did not have a stub with 10 in the request, but it matched the ontract. Qontract did not have a stubbed response, so it generated one and returned it.

### Stub with json

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

### Stub contains incorrect data

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

### Stub with multiple contracts

If you want to stub out multiple contracts together:

```shell
> {{ site.qontract_cmd }} stub customer.qontract order.qontract
```

If the customer_data and order_data directories exist, stub data will be loaded from them automatically.

### Keeping all the expectations in a single directory

If you want to organise all your stubs into a single directory, so that you can manage them more easily, you'll need to pass that directory to the stub, like this:

```shell
> {{ site.qontract_cmd }} stub --data /path/to/stub/directory customer.qontract order.qontract
```

Stubs matching either of the two contracts will be loaded, the rest will be rejected and the mismatch reports will be written to the console.

### Stub without hardcoding values in the request

What if you want to match any value of the right type.

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

Suppose you want to create a stub in which any address is accepted, but the name must be Sherlock Holmes.

Create a directory named customer_data, and a file named stub.json within it that contains this:

```json
// filepath: customer_data/stub.json
{
    "http-request": {
        "method": "POST",
        "path": "/customers",
        "body": {
            "name": "Sherlock Holmes",
            "address": "(string)"
        }
    },
    "http-response": {
        "status": 200
    }
}
```

Note that the address key in the stub is (string), which matches the contract exactly.

Note how this works. We can pass anything in the address and it's accepted by the stub.

```shell
> curl -X POST -H 'Content-Type: application/json' -d '{"name": "Sherlock Holmes", "address": "22 Baker Street"}' http://localhost:9000/customers
success
> curl -X POST -H 'Content-Type: application/json' -d '{"name": "Sherlock Holmes", "address": "1000 Baker Street"}' http://localhost:9000/customers
success
> curl -X POST -H 'Content-Type: application/json' -d '{"name": "Sherlock Holmes", "address": "1000000 Baker Street"}' http://localhost:9000/customers
success
```

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

### Debugging your stub using strict mode

If your request doesn't match any of the stubs, but does match one of the contracts, the stub returns a random response that corresponds to the scenario that matched the incoming request.

But if instead, you want to know why the match failed, use strict mode.
```
java -jar path/to/qontract.jar stub customer.qontract --strict
```

Try the same contract as above:

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

Create a directory named customer_data, and inside it a file named stub.json, with the following contents:

```json
// filename: customer_data/stub.json
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

And see the results:

```shell
> curl -X POST -H 'Content-Type: application/json' -d '{"name": "Sherlock Holmes", "address": "New York"}' http://localhost:9000/customers
>> REQUEST.BODY.address

Expected string: "22 Baker Street", actual was string: "New York"
```

Without strict mode on, the stub would have returned the string "success", as you can see in examples above.

### Matching Path and Query Parameters in stub data json

Consider below contract file.

File: petstore.contract
```gherkin
Feature: Contract for the petstore service

    Scenario: Fetch pet details
        When GET /pets/(id:number)?name=(string)
        Then status 200
        And response-body (name:string)
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

```
curl -vs http://0.0.0.0:9000/pets/2\?name\=Archie 2>&1 | less

Golden Retriever
``` 

If the path and query parameters do not match the stub, then a generated response will be returned.
```
curl -vs http://0.0.0.0:9000/pets/2\?name\=Shiro 2>&1 | less
MJUKU
```

In strict mode (running the stub command with --strict option), the entire URL is matched.
```
java -jar ~/Downloads/qontract.jar stub ~/test.qontract --strict

curl -vs http://0.0.0.0:9000/pets/2\?name\=Archie 2>&1 | less
Golden Retriever

curl -vs http://0.0.0.0:9000/pets/2\?name\=Shiro 2>&1 | less
STRICT MODE ON
>> REQUEST.URL.QUERY-PARAMS.name
Expected string: "Archie", actual was string: "Shiro"* Closing connection 0

```

### Datatype matching in Stubs

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

The Datatype matching works in "--strict" mode also.

### Dynamic stubbing over HTTP

You can setup a stub over HTTP, after Qontract has been started.

Post the stub content using the POST verb to Qontract at the path /_qontract/expectations

The content of the POST request will be the stub data, just like you would put into a stub json file.

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
