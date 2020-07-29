---
layout: default
title: Language
parent: Documentation
nav_order: 6
---
Language
========

- [Language](#language)
  - [The Contract File](#the-contract-file)
  - [Syntax Reference](#syntax-reference)
    - [Feature](#feature)
    - [Scenario](#scenario)
    - [Given](#given)
    - [When](#when)
    - [Then](#then)
    - [Built-in Data Types](#built-in-data-types)
      - [datetime type](#datetime-type)
      - [url type](#url-type)
    - [Arrays](#arrays)
    - [Variable Length Arrays](#variable-length-arrays)
    - [Objects](#objects)
    - [Defining Types](#defining-types)
    - [Defining Objects As Tables](#defining-objects-as-tables)
    - [Putting Value In Objects](#putting-value-in-objects)
    - [List Operator](#list-operator)
    - [Types In Background](#types-in-background)
    - [Overriding Types](#overriding-types)
    - [Optional Operator](#optional-operator)
    - [Nullable Operator](#nullable-operator)
    - [Rest Operator](#rest-operator)
    - [Combining *, ? and ...](#combining---and-)
    - [Pattern in string](#pattern-in-string)
    - [Explicit reference to examples in type declarations](#explicit-reference-to-examples-in-type-declarations)
    - [Dictionary](#dictionary)
    - [Form fields](#form-fields)
    - [Multipart form data](#multipart-form-data)
    - [Kafka messages](#kafka-messages)

Qontract extends the Gherkin syntax by adding some more keywords.

If you are familiar with Gherkin you should feel right at home. But if not, don't worry, Gherkin is easy to pick up. You'll learn as you go.

## The Contract File

A contract is an API specification. It describes the provider endpoints, the requests it accepts, the responses it returns and the data types it support etc.

Contracts are text files which you can create with any text editor. Just make sure that the extension is ".qontract".

Visual Studio Code and IntelliJ Idea support [syntax highlighting](syntax_highlighting.html). We recommend setting up an editor if you want to write these contracts on a regular basis.

## Syntax Reference

### Feature

A Contract File starts with the Feature at the top.

    Feature: Contract for the petstore service

This line describes what the API is about.

### Scenario

Each Feature can have several scenarios. Each scenario describes a single interaction with the Provider.
It is written in the Given, When and Then Format
* Given - Pre-conditions, Data setup etc. You can leave this out if you do not have to setup any data etc.
* When - This represents the request
* Then - Assertions

```
Scenario: Should be able to get a pet by petId
    When GET /pets/(petid:number)
    Then status 200
    And response-body {petid: "(number)"}
```

### Given

As mentioned, Given section is optional and is only necessary if you need to setup data.

### When

In the above example, let us focus on below line.

    When GET /pets/(petid:number)
    
When keyword is followed by the Http Method and the URL.

* List of supported Http Methods - GET, POST, PUT, DELETE
* The URL can have multiple path parameters and query parameters. Examples:
  * ```/pets/(petid:number)?name=(string)```
  * ```/pets/(petid:number)/owners/(ownerid:number)?name=(string)&type=(string)```

URL Parameters Definition
* Path Parameters - (<parameter-name>:<data-type>)
* Query Parameters - <parameter-name>=(<data-type>)

You can also append more information to the the request with the "And clause"

    When POST /pets/
      And request-body {petid: "(number)"}
      And request-header auth-token (string)
      And request-header traceid (number)

In above example, there are two more keywords.
* request-body - As you may have guessed you can only have one request-body for a request
* request-header - You can add as many request headers as you like

### Then

This section describes response.

    Then status 200
      And response-body {petid: "(number)"}
      And response-header token (string)
      And response-header CONTENT-TYPE application/json
      
The response-body and response-header keywords are similar to request-body and request-header respectively.

### Built-in Data Types

* number
* string
* boolean
* null
* url
* datetime

So for example:
    
    Feature: String API

    Scenario: Upper case of a string
      When POST /uppercase
      And request-body (string)
      Then status 200
      And response-body (string)

number, string, boolean and null are all used the same way.

Note: The number type matches decimals numbers too.

#### datetime type

`(datetime)` matches and generates ISO standard dates within strings. No other primitive data type will be accepted.

#### url type

`(url)` matches and generates valid urls within strings. No other primitive data type will be accepted.

For example, `(url)` will match "http://somedomain.xyz?key=value"

You can also specifically define the following url types:
* `(url-http)` declares an http url
* `(url-https)` declares an https url
* `(url-path)` declares a url path without the scheme prefix

### Arrays

We can describe an array containing multiple values.

    Feature: Arithmetic API
    
    Scenario: Add 2 numbers
      When POST /add
      And request-body ["(number)", "(number)"]
      Then status 200
      And response-body (number)

Since we are leveraging native JSON syntax, the type must be placed within a string.

["(number)", "(number)"] would match [1, 2], but not [1], nor [1, 2, 3], and not [1, "2"]

### Variable Length Arrays

We can describe arrays where the type of each element is known, but the length of the array is not fixed.

    Feature: Arithmetic API
    
    Scenario: Add all the numbers
      When POST /add
      And request-body ["(number*)"]
      Then status 200
      And response-body (number)

Here, ["(number*)"] would match [1], [1, 2], and even the empty array [].

Note that for now, the array operator works only on type names. ["(number)"]* is not valid syntax. See [Defining Types](#defining-types) for more.

### Objects

We can describe JSON objects, and provide type specifiers for their values.

    Feature: Arithmetic API

    Scenario: Perform an arithmetic operation
      When POST /operate
      And request-body {"val1": "(number)", "val2": "(number)", "operation": "(string)"}
      Then status 200
      And response-body (number)

In ```{"val1": "(number)", "val2": "(number)", "operation": "(string)"}``` you can see that the keys are fixed.

This would match ```{"val1": 10, "val2": 20, "operation": "+"}```.

### Defining Types

Sometimes the data structure is too complex to view in place. It helps to be able to pull it out, so that the semantics of the request are not obscured.

    Feature: Arithmetic API

    Scenario: Perform 2 nested operations
      When POST /operate
      And request-body {"op1": {"val1": "(number)", "val2": "(number)", "operation": "(string)"}, "op2": {"val1": "(number)", "val2": "(number)", "operation": "(string)"}, "operation": "(string)"}
      Then status 200
      And response-body (number)

This request body is way too complex. Instead:

    Feature: Arithmetic API

    Scenario: Perform 2 nested operations
      Given type Operation {"val1": "(number)", "val2": "(number)", "operation": "(string)"}
      And type ContainerOperation {"op1": "(Operation)", "op2": "(Operation)", "operation": "(string)"}

      When POST /operate
      And request-body (ContainerOperation)
      Then status 200
      And response-body (number)

This expresses the intent of the structures much more easily.

### Defining Objects As Tables

We can take readability one step further by using tables.

    Feature: Arithmetic API

    Scenario: Perform 2 nested operations
      Given json Operation
      | val2      | (number) |
      | val1      | (number) |
      | operation | (string) |
      
      And json ContainerOperation
      | op1       | (Operation) |
      | op2       | (Operation) |
      | operation | (string)    |

      When POST /operate
      And request-body (ContainerOperation)
      Then status 200
      And response-body (number)

And this way each part of the structure is easy to see.

The pipes should be aligned for better readability. Fortunately, modern editors or IDEs like Visual Studio Code and IntelliJ Idea take care of this for you.

### Putting Value In Objects

You can specify values in objects instead of types.

    Feature: Arithmetic API

    Scenario: Perform 2 nested operations
      Given json Operation
      | val1   | (number) |
      | val2   | (number) |
      | option | "first"  |

This matches ```{"val1": 10, "val2": 20, "option": "first" }``` but not ```{"val1": 10, "val2": 20, "option": "something else" }```

### List Operator

We can describe a list of items of a particular type.

    Feature: Arithmetic API

    Scenario: Add all numbers
      Given type Numbers (number*)

      When POST /sum
      And request-body (Numbers)
      Then status 200
      And response-body (number)

(Numbers) is defined as (number*), and this matches [4, 7, 3, 85, 0]

### Types In Background

If there are multiple APIs using common types, it helps to put them in the Background. All scenarios inherit definitions in the background.

    Feature: Arithmetic API

    Background:
      Given type Numbers (number*)
    
    Scenario: Add numbers
      When POST /sum
      And request-body (Numbers)
      Then status 200
      And response-body (number)

    Scenario: multiply numbers
      When POST /product
      And request-body (Numbers)
      Then status 200
      And response-body (number)

### Overriding Types

A scenario can override a type defined in the background. Useful when one scenarios needs a slightly different data structure from the rest.

    Feature: Pet Store API

    Background:
      Given type Pet
        | id   | (number) |
        | name | (string) |
        | type | (string) |

    Scenario: Get details of a pet
      When GET /pet/(id:number)
      Then status 200
      And response-body (Pet)

    Scenario: Create pet
      Given type Pet
        | name | (string) |
        | type | (string) |
      When POST /pet
      And request-body (Pet)
      Then status 200
      And response-body (number)

Compare the Pet definition in the background, and in the second scenario. The second one lacks an id, since the id is assigned by the application, and the caller will not have the id when invoking the API

### Optional Operator

We can describe an object in which a key is optional.

    Feature: Pet Store API

    Scenario: Get pet details
      Given type Pet
        | id           | (number) |
        | name         | (string) |
        | description? | (string) |
      When GET /pet/(id:number)
      Then status 200
      And response-body (Pet)

Note the suffix ```?``` attached to the description key, which declares the keyoptional.

The response can now be ```{"id": 10, "name": "Socks", "description": "Brown and white"}```, or just ```{"id": 10, "name": "Socks"}``` without the description field.

However if Pet is in the request, such as:

    Feature: Pet Store API

    Scenario: Create pet
      Given type Pet
        | name         | (string) |
        | description? | (string) |
      When POST /pets
      Then status 200
      And response-body (number)

Cyclomatic complexity here is 2. There are 2 types of structures that could be sent in the request, one with description and one without.

So when running in test mode, qontract will run 2 tests for this, one with the description key, and one without.

### Nullable Operator

We can represent values that may be null.

    Scenario: Create pet
      Given type Pet
        | name         | (string)  |
        | description  | (string?) |
      When POST /pets
      Then status 200
      And response-body (number)

The Pet type will permit both ```{"name": "Daisy", "description": "Beautiful dog!"}``` and ```{"name": "Daisy", "description": null}``` to be passed as a request to /pets.

Note that while the value of description can be null, the key itself is compulsory, and must be passed.

Cyclomatic complexity is 2, so when running in test mode, Qontract will generate two requests, one with description set to a random string, and one with it set to null.

### Rest Operator

    Feature: Arithmetic API

    Scenario: Arithmetic operation
      Given type Operation ["(string)", "(number...)"]
      When POST /operate
      And request-body (Operation)
      Then status 200
      And response-body (number)

Operation would match ["+", 1, 2, 3], ["-", 2, 5, 3, 6], etc.

It can only be used in an array.

### Combining *, ? and ...

These operators can be combined. The operators must be interpreted in reverse order.

So:
* ```(number*)``` means an array of numbers, such as [1, 2, 3]
* ```(numbers*?)``` reading *? backwards, it means a nullable array of numbers, so it matches either [1, 2, 3] or null
For example:
    Given type Data
      | numbers | (numbers*?) |

...would match both {"numbers": [1, 2, 3]} and {"numbers": null}

* ```(numbers?*)``` is an array of nullable numbers, so it matches [1, 2, null, 4, null]
For example:

    Given type Data
      | numbers | (numbers?*) |

...would match both {"numbers": [1, 2, 3]} and {"numbers": [1, null, 3, 4, null, null]}

* ```["(string)", "(number?...)"]``` matches ["+", 1, 2, null, 3, 4]. The first is a string. The rest are all nullable numbres.

For example:

    Given type Operation
      | numbers | (numbers?*) |

...would match both {"numbers": [1, 2, 3]} and {"numbers": [1, null, 3, 4, null, null]}

### Pattern in string

We can explicitly describe types in strings. If for example we know that the value is a number, but it will be inside a string:

    Given type Id (number in string)

### Explicit reference to examples in type declarations

We can explicitly refer to the example column from within a type declaration.

    When POST /
      And request-body (orderid:number)
      Then status 200

    Examples:
    | orderid |
    | 10      |

In this example, the request-body looks up the orderid from the examples. When the test request is generated, it contain the value `10` in the request body.

###  Dictionary

Sometimes we don't know the exact keys and values, but we know what their types will be.

For example, a json object of order details, where the keys are product ids and the values are json objects containing quantity and discount.

We can express it like this:

```
Given type ProductInfo
| product_id | (number) |
| quantity   | (number) |
And type Order (dictionary number ProductInfo)
```

The first type in the dictionary refers to the key. The key is always a string, and the type refers to what should be in the string, which in this example is a number.

The value will be another json object, containing the product info described above.

### Form fields

We can describe form fields in the request like this:

```
When POST /orders
And form-field name (string)
And form-field address (string)
```

This corresponds Postman's x-www-form-urlencoded in the request body.

### Multipart form data

We can describe multipart form data in the request like this:

```
When POST /orders
And request-part name (string)
And request-part address (string)
```

This corresponds Postman's form-data in the request body.

If the request part contains a file, use the @ symbol to denote the file name, like so:

```
When POST /orders
And request-part customers @customers.csv
```

When running the test, @customers.csv must actually exist in the working directory.

### Kafka messages

We can describe Kafka messages.

The syntax:

    * kafka-message <topic> <key type> <value type>

OR

    * kafka-message <topic> <value type>

For example:

    Given json Customer
      | name  | (string) |
      | phone | (string) |
    Then kafka-message customerdata (String) (Customer*)

Here the message is expected to be on the customerdata topic, the key should be a string, and the value should be a json string.
