---
layout: default
title: Contract Syntax
parent: Documentation
nav_order: 3
---
Contract Syntax
===============

Qontract extends the Gherkin syntax by adding some more keywords.

If you are familiar with Gherkin you should feel right at home. But if not, don't worry, Gherkin is easy to pick up. You'll learn as you go.

---

### What is a Contract?

A contract is an API specification. It describes the provider endpoints, the requests it accepts, the responses it returns and the data types it support etc.

Contracts are text files which you can create with any text editor. IDE setup is optional.

Just make sure that the extension is ".qontract".

---

### Syntax Highlighting

This is an optional step. Jump to [syntax reference](/documentation/contract_syntax.html#basics) if you want to skip this step.

Since majority of qontract's syntax is just Gherkin, you can leverage Cucumber plugins for syntax highlighting.
Below steps helps you work with the .qontract files in Intellij Idea with syntax highlighting, auto-suggest (only Gherkin keywords) and formatting.

* Install [Cucumber Plugin](https://plugins.jetbrains.com/plugin/7212-cucumber-for-java)
* Go to Preference > Editor > File Types and under recognized file types select "Cucumber Scenario"
* Under "Registered Patterns" add "*.qontract" as shown below

![](/images/ide_setup.jpg)

This should highlight the Gherkin keywords in your qontract file.

Similarly you should be able to setup your favourite IDE or text editor.

---

### Feature

A Contract File starts with the Feature at the top.

    Feature: Contract for the petstore service

This line describes what the API is about.

---

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

---

### Given

As mentioned, Given section is optional and is only necessary if you need to setup data.

---

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

---

### Then

This section describes response.

    Then status 200
      And response-body {petid: "(number)"}
      And response-header token (string)
      And response-header CONTENT-TYPE application/json
      
The response-body and response-header keywords are similar to request-body and request-header respectively.

---

### Primitive Data Types

* number
* string
* boolean
* null

So for example:
    
    Feature: String API

    Scenario: Upper case of a string
      When POST /uppercase
      And request-body (string)
      Then status 200
      And response-body (string)

number, string, boolean and null are all used the same way.

---

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

---

### Variable Length Arrays

We can describe arrays where the type of each element is known, but the length of the array is not fixed.

    Feature: Arithmetic API
    
    Scenario: Add all the numbers
      When POST /add
      And request-body ["(number*)"]
      Then status 200
      And response-body (number)

Here, ["(number*)"] would match [1], [1, 2], and even the empty array [].

Note that for now, the array operator works only on type names. ["(number)"]* is not valid syntax. See [Defining Patterns](#defining-patterns) for more.

---

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

---

### Defining Patterns

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
      Given pattern Operation {"val1": "(number)", "val2": "(number)", "operation": "(string)"}
      And pattern ContainerOperation {"op1": "(Operation)", "op2": "(Operation)", "operation": "(string)"}

      When POST /operate
      And request-body (ContainerOperation)
      Then status 200
      And response-body (number)

This expresses the intent of the structures much more easily.

---

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

---

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
      Given pattern Numbers (number*)

      When POST /sum
      And request-body (Numbers)
      Then status 200
      And response-body (number)

(Numbers) is defined as (number*), and this matches [4, 7, 3, 85, 0]

### Types In Background

If there are multiple APIs using common types, it helps to put them in the Background. All scenarios inherit definitions in the background.

    Feature: Arithmetic API

    Background:
      Given pattern Numbers (number*)
    
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

A scenario can override a pattern defined in the background. Useful when one scenarios needs a slightly different data structure from the rest.

    Feature: Pet Store API

    Background:
      Given pattern Pet
        | id   | (number) |
        | name | (string) |
        | type | (string) |

    Scenario: Get details of a pet
      When GET /pet/(id:number)
      Then status 200
      And response-body (Pet)

    Scenario: Create pet
      Given pattern Pet
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
      Given pattern Pet
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
      Given pattern Pet
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
      Given pattern Pet
        | name         | (string)  |
        | description  | (string?) |
      When POST /pets
      Then status 200
      And response-body (number)

The Pet type will permit both ```{"name": "Daisy", "description": "Beautiful dog!"}``` and ```{"name": "Daisy", "description": null}``` to be passed as a request to /pets.

Note that while the value of description can be null, the key itself is compulsory, and must be passed.

Cyclomatic complexity is 2, so when running in test mode, Qontract will generate two requests, one with description set to a random string, and one with it set to null.

### Slice Operator

    Feature: Arithmetic API

    Scenario: Arithmetic operation
      Given pattern Operation ["(string)", "(number...)"]
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
