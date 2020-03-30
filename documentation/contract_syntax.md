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

A contract is an API specification. It describes the provider endpoints, the requests it accepts, the responses it returns and the data types it support etc.

Contracts are text files which you can create with any text editor. IDE setup is optional.

Just make sure that the extension is ".qontract".

---

### IDE Setup

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
