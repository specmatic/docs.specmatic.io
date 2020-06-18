---
layout: default
title: Service Virtualisation
parent: Documentation
nav_order: 3
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
    - [Strict mode](#strict-mode)
    - [Stub file format](#stub-file-format)

[Read here about contract testing and where Qontract fits in](/contract_testing.html).

### Why Service Virtualisation

It is not easy to develop an application that depends on 3rd party APIs. These APIs never run on the dev laptop or environment. They must be invoked over the network, during the process of coding, debugging or running component tests. But access to the APIs is usually flaky. The network may be down. The dev laptop may be offline. Sometimes an account has to be setup, data within the account has to be created, orders placed, etc.

Instead, we prefer to setup a stub API that appears to act like the real API, and runs on the developer's laptop. Since it is on the developer's laptop, it is never down, and is always available. The application doesn't know that it is talking to a stub, and in fact cannot tell the difference.

### Why Use Qontract

There are many tools you can use for service virtualisation. Qontract however validates the stub setup (called expectatations) with the contract spec to ensure that the stub request and response formats are the same as those of the real API.

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

Sometimes you don't care what values comes back in the response, you just need, say, a string.

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

### Strict mode

If your request doesn't match any of the stubs, but does match one of the contracts, the stub returns a random response that corresponds to the scenario that matched the incoming request.

But if instead, you want to know why the match failed, use strict mode.

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

### Stub file format

Here is a sample json stub file, containing all the keys you can use, with inline comments.

```json
{
    "http-request": {
        "method": "POST",
        "path": "/url/path", // You cannot put a full url here
        "headers": {
            "X-Header-Name": "(string)"
        },
        "query": {
            "id": "(number)",
            "type": "(string)"
        },


        // WARNING You can have either body, form-fields or multipart-formdata, but not all 3
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
        "body": "some value" // can be any json value, but must match the contract
    }
}
```
