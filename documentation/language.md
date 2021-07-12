---
layout: default
title: Language
parent: Documentation
nav_order: 6
---
- [The Contract File](#the-contract-file)
- [Basic structure](#basic-structure)
  - [Slightly More Complex Example](#slightly-more-complex-example)
  - [Built-in Data Types](#built-in-data-types)
  - [Pattern In String](#pattern-in-string)
  - [Explicit Reference To Examples In Type Declarations](#explicit-reference-to-examples-in-type-declarations)
  - [Scenario Outline For Contract Testing](#scenario-outline-for-contract-testing)
- [JSON Syntax](#json-syntax)
  - [Arrays](#arrays)
  - [Variable Length Arrays](#variable-length-arrays)
  - [Objects](#objects)
  - [Defining Types](#defining-types)
  - [Defining Enums](#defining-enums)
  - [Defining Objects As Tables](#defining-objects-as-tables)
  - [Putting Value In Objects](#putting-value-in-objects)
  - [List Operator](#list-operator)
  - [Optional Operator](#optional-operator)
  - [Nullable Operator](#nullable-operator)
  - [Rest Operator](#rest-operator)
  - [Combining *, ? and ...](#combining---and-)
  - [Dictionary](#dictionary)
- [XML Syntax](#xml-syntax)
  - [XML Tags](#xml-tags)
  - [Multiline XML Definitions](#multiline-xml-definitions)
  - [XML Data Types](#xml-data-types)
  - [XML Attributes](#xml-attributes)
  - [Optional Values In XML Tags](#optional-values-in-xml-tags)
  - [Optional Values In XML Attributes](#optional-values-in-xml-attributes)
  - [Optional XML Nodes](#optional-xml-nodes)
  - [Multiple Consecutive XML Nodes](#multiple-consecutive-xml-nodes)
  - [XML Types](#xml-types)
  - [Reusing XML Nodes](#reusing-xml-nodes)
  - [XML Child Nodes](#xml-child-nodes)
- [HTTP Protocol](#http-protocol)
  - [Headers](#headers)
  - [Form Fields](#form-fields)
  - [Multipart Form Data](#multipart-form-data)
- [Kafka Messages](#kafka-messages)
- [The Background section](#the-background-section)
  - [Common Definitions in the Background](#common-definitions-in-the-background)
  - [Overriding The Background](#overriding-the-background)

Specmatic extends the Gherkin syntax by adding some more keywords.

If you are familiar with Gherkin you should feel right at home. If not, don't worry, Gherkin is easy to pick up.

## The Contract File

A contract is an API specification. It describes the provider endpoints, the requests it accepts, the responses it returns and the data types it support etc.

Contracts are text files which you can create with any text editor. Just make sure that the extension is `.spec`.

Visual Studio Code and IntelliJ Idea support [syntax highlighting](syntax_highlighting.html). We recommend setting up an editor if you want to write these contracts on a regular basis.

## Basic structure

Here's a small contract.

```gherkin
Feature: Contract for the petstore service
  Scenario: Should be able to get a pet by petId
      When GET /pets/(petid:number)
      Then status 200
      And response-body {petid: "(number)"}
```

Each Feature can have several scenarios.

Each scenario describes a single interaction with the Provider, using the Given, When and Then Format
* Given - Pre-conditions, data structure definitions, etc.
* When - This represents the request
* Then - Assertions

We'll see more examples of how `Given` is used below.

Next, let us focus on this line:

```gherkin
When GET /pets/(petid:number)
```

The `When` keyword is followed by the Http Method and the URL.

* List of supported Http Methods - GET, POST, PUT, DELETE
* The URL can have multiple path parameters and query parameters. Examples:
  * ```/pets/(petid:number)?name=(string)```
  * ```/pets/(petid:number)/owners/(ownerid:number)?name=(string)&type=(string)```

URL Parameters Definition
* Path Parameters - (\<parameter-name\>:\<data-type\>)
* Query Parameters - \<parameter-name\>=(\<data-type\>)

And finally, `Then`. This section describes the response.

```gherkin
  Then status 200
  And response-body {petid: "(number)"}
```

Note that we added a response body with the `And` clause.

### Slightly More Complex Example

```gherkin
Feature: Contract for the petstore service
  Scenario: Should be able to get a pet by petId
    When POST /pets/
    And request-body {petid: "(number)"}
    And request-header auth-token (string)
    And request-header traceid (number)
    Then status 200
    And response-header token (string)
    And response-header CONTENT-TYPE application/json
```

Note how we add more information to the request and response with the `And` clause.

In above example, there are two more keywords.
* request-body - You can only have one request-body in a scenario
* request-header - You can add as many request headers as you like

The response-body and response-header keywords are similar to request-body and request-header respectively.

As a whole, the contract should read a little like English.

### Built-in Data Types

* number
* string
* boolean
* null
* url
* datetime

So for example:

```gherkin    
Feature: String API

Scenario: Upper case of a string
  When POST /uppercase
  And request-body (string)
  Then status 200
  And response-body (string)
```

number, string, boolean and null are all used the same way.

Note: The number type matches decimals numbers too.

**Length Restrictions**

String and Number support minLength and maxLength when they are declared as a type.

```
Given type <Type Name> <(string)/(number)> minLength <min length> maxLength <max length>
```

Once declared they can be referred in any part of the specification.

Example:

```gherkin    
Feature: Contract for /employees API
  Scenario: api call
    Given type EmployeeName (string) minLength 6 maxLength 12
    And type EmployeeId (number) minLength 8 maxLength 11
    And type Employee
    | name   | (EmployeeName) |
    | id     | (EmployeeId)   |
    When GET /employees
    Then status 200
    And response-body (Employee*)
```

**datetime type**

`(datetime)` matches and generates ISO standard dates within strings. No other primitive data type will be accepted.

**url type**

`(url)` matches and generates valid urls within strings. No other primitive data type will be accepted.

For example, `(url)` will match "http://somedomain.xyz?key=value"

You can also specifically define the following url types:
* `(url-http)` declares an http url
* `(url-https)` declares an https url
* `(url-path)` declares a url path without the scheme prefix

### Pattern In String

We can explicitly describe types in strings. If for example we know that the value is a number, but it will be inside a string:

```gherkin
Given type Id (number in string)
```

### Explicit Reference To Examples In Type Declarations

We can explicitly refer to the example column from within a type declaration.

```gherkin
When POST /
  And request-body (orderid:number)
  Then status 200

Examples:
| orderid |
| 10      |
```

In this example, the request-body looks up the orderid from the examples. When the test request is generated, it contain the value `10` in the request body.

### Scenario Outline For Contract Testing

Let us assume that we need to run below Scenario as a test with two petIds, 2 and 3, instead of autogenerated values.

[Read more about contract tests here.](/documentation/contract_tests.html)

```gherkin
Scenario: Should be able to get a pet by petId
    When GET /pets/(petid:number)
    Then status 200
    And response-body {petid: "(number)"}
```

A way to achieve this is by declaring the same scenario twice.

```gherkin
Scenario: Should be able to get a pet by petId 2
    When GET /pets/2
    Then status 200
    And response-body {petid: "(number)"}

Scenario: Should be able to get a pet by petId 3
    When GET /pets/3
    Then status 200
    And response-body {petid: "(number)"}
```

This can get repetitive. We can leverage "Scenario Outline" to run this "Scenario" as a test twice with different values.

```gherkin
Scenario Outline: Should be able to get a pet by petId
    When GET /pets/(petid:number)
    Then status 200
    And response-body {petid: "(number)"}

    Examples:
    | petid |
    | 2     |
    | 3     |
```

NOTE: Scenario Outline is effective only in the context of request params when running contract as a test.
To return specific values when running the contract leverage [Stub Mode](/documentation/command_line.html#stub-mode).

## JSON Syntax

### Arrays

We can describe an array containing multiple values.

```gherkin
Feature: Arithmetic API

Scenario: Add 2 numbers
  When POST /add
  And request-body ["(number)", "(number)"]
  Then status 200
  And response-body (number)
```

Since we are leveraging native JSON syntax, the type must be placed within a string.

["(number)", "(number)"] would match [1, 2], but not [1], nor [1, 2, 3], and not [1, "2"]

### Variable Length Arrays

We can describe arrays where the type of each element is known, but the length of the array is not fixed.

```gherkin
Feature: Arithmetic API

Scenario: Add all the numbers
  When POST /add
  And request-body ["(number*)"]
  Then status 200
  And response-body (number)
```

Here, ["(number*)"] would match [1], [1, 2], and even the empty array [].

Note that for now, the array operator works only on type names. ["(number)"]* is not valid syntax. See [Defining Types](#defining-types) for more.

### Objects

We can describe JSON objects, and provide type specifiers for their values.

```gherkin
Feature: Arithmetic API

Scenario: Perform an arithmetic operation
  When POST /operate
  And request-body {"val1": "(number)", "val2": "(number)", "operation": "(string)"}
  Then status 200
  And response-body (number)
```

In ```{"val1": "(number)", "val2": "(number)", "operation": "(string)"}``` you can see that the keys are fixed.

This would match ```{"val1": 10, "val2": 20, "operation": "+"}```.

### Defining Types

Sometimes the data structure is too complex to view in place. It helps to be able to pull it out, so that the semantics of the request are not obscured.

```gherkin
Feature: Arithmetic API

Scenario: Perform 2 nested operations
  When POST /operate
  And request-body {"op1": {"val1": "(number)", "val2": "(number)", "operation": "(string)"}, "op2": {"val1": "(number)", "val2": "(number)", "operation": "(string)"}, "operation": "(string)"}
  Then status 200
  And response-body (number)
```

This request body is way too complex. Instead:

```gherkin
Feature: Arithmetic API

Scenario: Perform 2 nested operations
  Given type Operation {"val1": "(number)", "val2": "(number)", "operation": "(string)"}
  And type ContainerOperation {"op1": "(Operation)", "op2": "(Operation)", "operation": "(string)"}

  When POST /operate
  And request-body (ContainerOperation)
  Then status 200
  And response-body (number)
```

This expresses the intent of the structures much more easily.

### Defining Enums

**Declaration Syntax**

```gherkin
Given enum <EnumName> <DataType - String Or Number Only> values <Comma separated values>
```

**Usage Patterns**

Enums can appear as part of url parameters, headers and body.
Below is an example showing various usage patterns.

```gherkin
Feature: Contract for employees API
  Scenario: api call
    Given enum EmployeeType (string) values contract,permanent,trainee
    And enum Rating (number) values 1,2,3
    And enum Organisation (string) values hr,tech,admin
    And enum ClientType (string) values mobile,web
    And type Employee
    | name   | (string)       |
    | id     | (number)       |
    | type   | (EmployeeType) |
    | rating | (Rating?)      |
    When GET /(organisation:Organisation)/employees/?empType=(EmployeeType)
    And request-header client (ClientType)
    Then status 200
    And response-body (Employee*)
```

**Nullable Enum**

To mark an Enum as Nullable, suffix it with a question mark. Example: See "(Rating?)" in above spec.
Note: Marking the Data Type (number and string) as nullable is not allowed within the context of Enum declaration.

### Defining Objects As Tables

We can take readability one step further by using tables.

```gherkin
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
```

And this way each part of the structure is easy to see.

The pipes should be aligned for better readability. Fortunately, modern editors or IDEs like Visual Studio Code and IntelliJ Idea take care of this for you.

### Putting Value In Objects

You can specify values in objects instead of types.

```gherkin
Feature: Arithmetic API

Scenario: Perform 2 nested operations
  Given json Operation
  | val1   | (number) |
  | val2   | (number) |
  | option | "first"  |
```

This matches ```{"val1": 10, "val2": 20, "option": "first" }``` but not ```{"val1": 10, "val2": 20, "option": "something else" }```

### List Operator

We can describe a list of items of a particular type.

```gherkin
Feature: Arithmetic API

Scenario: Add all numbers
  Given type Numbers (number*)

  When POST /sum
  And request-body (Numbers)
  Then status 200
  And response-body (number)
```

(Numbers) is defined as (number*), and this matches [4, 7, 3, 85, 0]

### Optional Operator

We can describe an object in which a key is optional.

```gherkin
Feature: Pet Store API

Scenario: Get pet details
  Given type Pet
    | id           | (number) |
    | name         | (string) |
    | description? | (string) |
  When GET /pet/(id:number)
  Then status 200
  And response-body (Pet)
```

Note the suffix ```?``` attached to the description key, which declares the keyoptional.

The response can now be ```{"id": 10, "name": "Socks", "description": "Brown and white"}```, or just ```{"id": 10, "name": "Socks"}``` without the description field.

However if Pet is in the request, such as:

```gherkin
Feature: Pet Store API

Scenario: Create pet
  Given type Pet
    | name         | (string) |
    | description? | (string) |
  When POST /pets
  Then status 200
  And response-body (number)
```

Cyclomatic complexity here is 2. There are 2 types of structures that could be sent in the request, one with description and one without.

So when running in test mode, specmatic will run 2 tests for this, one with the description key, and one without.

### Nullable Operator

We can represent values that may be null.

```gherkin
Scenario: Create pet
  Given type Pet
    | name         | (string)  |
    | description  | (string?) |
  When POST /pets
  Then status 200
  And response-body (number)
```

The Pet type will permit both ```{"name": "Daisy", "description": "Beautiful dog!"}``` and ```{"name": "Daisy", "description": null}``` to be passed as a request to /pets.

Note that while the value of description can be null, the key itself is compulsory, and must be passed.

Cyclomatic complexity is 2, so when running in test mode, Specmatic will generate two requests, one with description set to a random string, and one with it set to null.

### Rest Operator

```gherkin
Feature: Arithmetic API

Scenario: Arithmetic operation
  Given type Operation ["(string)", "(number...)"]
  When POST /operate
  And request-body (Operation)
  Then status 200
  And response-body (number)
```

Operation would match ["+", 1, 2, 3], ["-", 2, 5, 3, 6], etc.

It can only be used in an array.

### Combining *, ? and ...

These operators can be combined. The operators must be interpreted in reverse order.

So:
* ```(number*)``` means an array of numbers, such as [1, 2, 3]
* ```(numbers*?)``` reading *? backwards, it means a nullable array of numbers, so it matches either [1, 2, 3] or null. For example:
```gherkin
Given type Data
  | numbers | (numbers*?) |
```

...would match both {"numbers": [1, 2, 3]} and {"numbers": null}

* ```(numbers?*)``` is an array of nullable numbers, so it matches [1, 2, null, 4, null]. For example:
```gherkin
Given type Data
  | numbers | (numbers?*) |
```

...would match both {"numbers": [1, 2, 3]} and {"numbers": [1, null, 3, 4, null, null]}

* ```["(string)", "(number?...)"]``` matches ["+", 1, 2, null, 3, 4]. The first is a string. The rest are all nullable numbres. For example:
```gherkin
Given type Operation
  | numbers | (numbers?*) |
```

...would match both {"numbers": [1, 2, 3]} and {"numbers": [1, null, 3, 4, null, null]}

###  Dictionary

Sometimes we don't know the exact keys and values, but we know what their types will be.

For example:

```json
{
  "cart_id": 25,
  "order": {
    "10": {
      "product_id": 174673,
      "quantity": 5
    },
    "20": {
      "product_id": 89374543,
      "quantity": 1
    },
  }
}
```

This is a json object containing a cart. The `order` value is a JSON value, the structure of which is an `order id` and the `details of the product` being ordered.

The `order id`s will always be numbers. But they will change from cart to cart, so we cannot hard code them in the contract. The product details data structure for each `order id` will always be a json object containing product_id and quantity.

We can express the whole thing like this:

```gherkin
Given type ProductDetails
| product_id | (number) |
| quantity   | (number) |

And type Order (dictionary number ProductDetails)

And type Cart
| cart_id | (number) |
| order   | (Order)  |
```

There are 3 parts to this:
1. We first declare the `ProductDetails` entry.
2. Next we declare a dictionary named `Order`, in which all the keys are numbers, and the values are `ProductDetails`.
3. We declare the enclosing `Cart` type, which contains the the `cart id` and the `order`.

## XML Syntax

### XML Tags

We can describe XML tags like this:

```gherkin
When POST /customer
And request-body <customer><name>(string)</name></customer>
Then status 200
```

And this matches the following xml document:

```xml
<customer><name>John Doe</name></customer>
```

### Multiline XML Definitions

```gherkin
When POST /customer
And request-body <customer><name>(string)</name><id>(number)</id></customer>
Then status 200
```

The above contract can also be declared like this:

```gherkin
When POST /customer
And request-body
"""
<customer>
  <name>(string)</name>
  <id>(number)</id>
</customer>
"""
Then status 200
```

### XML Data Types

You can use all the scalar data types described [earlier in this document](built-in-data-types) except for null.

### XML Attributes

Similarly, we can describe XML tags:

```gherkin
When POST /customer
And request-body
"""
<customer enabled="(boolean)">
  <name>(string)</name>
</customer>
"""
Then status 200
```

This matches the following XML document:

```xml
<customer enabled="true"><name>John Doe</name></customer>
```

### Optional Values In XML Tags

```gherkin
When POST /customer
And request-body
"""
<customer>
  <name>(string?)</name>
</customer>
"""
Then status 200
```

And this matches an xml documents containing a name:

```xml
<customer><name>John Doe</name></customer>
```

and one with an empty name tag:

```xml
<customer><name></name></customer>
```

or just:

```xml
<customer><name/></customer>
```

### Optional Values In XML Attributes

```gherkin
When POST /customer
And request-body
"""
<customer enabled="(boolean?)">
  <name>(string)</name>
</customer>
"""
Then status 200
```

This matches a document with a value in enabled tag:

```xml
<customer enabled="true"><name>John Doe</name></customer>
```

and one with an empty enabled tag:

```xml
<customer enabled="true"><name>John Doe</name></customer>
```

Note here that only the value is optional. The tag is not. So the contract does NOT match a document without an enabled tag.

Specifically, the above contract will NOT match the following:

```xml
<customer><name>John Doe</name></customer>
```

### Optional XML Nodes

Consider this XML node for a customer named Jane Holmes:

```xml
<customer>
  <name>Jane Holmes</name>
  <address>Baker Street</address>
</customer>
```

And this one for Sherlock Holmes:

```xml
<customer>
  <name>Sherlock Holmes</name>
</customer>
```

The `address` node is optional. Specmatic can express this like so:

```xml
<customer>
  <name>(string)</name>
  <address qontract_occurs="optional">(string)</address>
</customer>
```

This will match the customer xml data for both Jane and Sherlock Holmes.

### Multiple Consecutive XML Nodes

Consider the following information from a shopping cart:

```xml
<cart>
  <id>10</id>
  <productid>10</productid>
  <productid>20</productid>
  <productid>30</productid>
  <customerid>100</customerid>
</cart>
```

There could be any number of product ids.

The following is how we can put it in Specmatic:

```xml
<cart>
  <id>(number)</id>
  <productid qontract_occurs="multiple">(number)</productid>
  <customerid>(number)</customerid>
</cart>
```

The `productid` can now occur 0 or more times.

### XML Types

Consider the following employee record:

```xml
<employee>
  <name>(string)</name>
  <address>(string)</address>
</employee>
```

And the following manager record:

```xml
<manager>
  <name>(string)</name>
  <address>(string)</address>
</manager>
```

Different node names, but the same tags inside.

We can pull the type out like this:

```gherkin
Given type Person
"""
<SPECMATIC_TYPE>
  <name>(string)</name>
  <address>(string)</address>
</SPECMATIC_TYPE>
"""
And type Manager <manager qontract_type="Person"/>
And type Employee <employee qontract_type="Person"/>
```

The `Manager` type will match the `manager` node, and the `Employee` type will match the `employee` node.

### Reusing XML Nodes

```gherkin
Given type Customer
"""
<customer>
  <name>(string)</name>
</customer>
"""
When POST /customer
And request-body (Customer)
Then status 200
```

This matches the following XML contract:

```xml
<customer><name>John Doe</name></customer>
```

### XML Child Nodes

```gherkin
Given type Name <name>(string)</name>
And type Customer <customer>(Name)</customer>
When POST /customer
And request-body (Customer)
Then status 200
```

This matches the following XML contract:

```xml
<customer><name>John Doe</name></customer>
```

## HTTP Protocol

### Headers

We can describe headers in an HTTP request like this:

```gherkin
When POST /orders
And header Authentication: (string)
```

This matches an HTTP request with a header named `Authentication`.

Specmatic ignores all headers in the HTTP request that are not defined in the contract.

### Form Fields

We can describe form fields in the request like this:

```gherkin
When POST /orders
And form-field name (string)
And form-field address (string)
```

This corresponds Postman's x-www-form-urlencoded in the request body.

### Multipart Form Data

We can describe multipart form data in the request like this:

```gherkin
When POST /orders
And request-part name (string)
And request-part address (string)
```

This corresponds Postman's form-data in the request body.

If the request part contains a file, use the @ symbol to denote the file name, like so:

```gherkin
When POST /orders
And request-part customers @customers.csv
```

When running the test, @customers.csv must actually exist in the working directory.

## Kafka Messages

We can describe Kafka messages.

The syntax:

```gherkin
* kafka-message <topic> <key type> <value type>
```

OR

```gherkin
* kafka-message <topic> <value type>
```

For example:

```gherkin
Given json Customer
  | name  | (string) |
  | phone | (string) |
Then kafka-message customerdata (String) (Customer*)
```

Here the message is expected to be on the customerdata topic, the key should be a string, and the value should be a json string.

## The Background section

If there are multiple APIs using common types, it helps to put them in the Background. All scenarios inherit definitions in the background.

```gherkin
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
```

### Common Definitions in the Background

All Scenarios and Scenario Outlines inherit the Background. So put the parts common to all scenarios into the Background.

For example:

```gherkin
Feature: Customer API
  Scenario: Get customer details
    Given type Customer
    | name    | (string) |
    | address | (string) |
    When GET /customer/(id:number)
    Then status 200
    And response-body (Customer)

  Scenario: Get customer list
    Given type Customer
    | name    | (string) |
    | address | (string) |
    When GET /customers
    Then status 200
    And response-body (Customer*)
```

Let's remove the duplication, by putting the Customer type into the Background.

```gherkin
Feature: Customer API
  Background:
    Given type Customer
    | name    | (string) |
    | address | (string) |

  Scenario: Get customer details
    When GET /customer/(id:number)
    Then status 200
    And response-body (Customer)

  Scenario: Get customer list
    When GET /customers
    Then status 200
    And response-body (Customer*)
```

### Overriding The Background

A scenario can override a type defined in the background. Useful when one scenarios needs a slightly different data structure from the rest.

```gherkin
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
```
Compare the Pet definition in the background, and in the second scenario. The second one lacks an id, since the id is assigned by the application, and the caller will not have the id when invoking the API
