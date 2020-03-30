---
layout: default
title: Contract Syntax
parent: Documentation
nav_order: 3
---
Contract Syntax
===============

Qontract extends the Gherkin syntax by adding some more keywords.
However for the most part if you are familiar with Gherkin you should feel right at home.

That said, if you are not familiar with Gherkin, no need to worry. Gherkin knowledge is not a pre-requisite.

---

### What is a Contract?

A contract in short is an API specification. It describes the provider endpoints, the requests they accept, the responses they return and the data types they support etc.

It is a simple text file which you can create with any text editor. You do not need any IDE or environment.

Just make sure that the extension is ".qontract".

We are working on syntax highlighting and formatting support for the same. In the mean time if you already have a Gherkin or Cucumber plugin in your IDE / Text editor please do leverage it.

---

### Basics

A Contract File starts with the Feature at the top.

    Feature: Contract for the petstore service

This line describes what the API is about.

---

### Scenarios

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
* exact
