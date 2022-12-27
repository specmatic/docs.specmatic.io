---
layout: default
title: Understanding Errors
parent: Documentation
nav_order: 30
---
Understanding Errors
====================

- [Understanding Errors](#understanding-errors)
  - [Report Format](#report-format)
  - [Error In The Request](#error-in-the-request)
  - [Error in JSON request](#error-in-json-request)

## Report Format

Specmatic strives to pinpoint the location of the error, and tell you exactly what went amiss there.

A report contain 3 components:
1. the scenario
2. the path to the error
3. details about the error

## Error In The Request

Let's assume this contract is running as a stub:

```yaml
#Filename: basic.spec
openapi: 3.0.1
info:
  title: Basic contract
  version: "1"
paths:
  /basic:
    post:
      summary: Basic API
      parameters: []
      requestBody:
        content:
          text/plain:
            schema:
              type: number
      responses:
        "200":
          description: Basic API
```

Here's the output of a curl command that invokes the stub API.

```bash
➜  ~ curl -X POST -H 'Content-Type: text/plain' -d hi http://localhost:9000/basic
In scenario "Basic API"
>> REQUEST.BODY

Expected number, actual was "hi"
```

Let's take this apart.

**Line 1: Scenario name**

```
In scenario "Basic API"
```

This contains the scenario name.

**Line 2: Path to the error**

```
>> REQUEST.BODY
```

The error path pinpoints the location of the error. In this case, the error was found in the request body.

**Line 3 onwards: details about the error**

```
Expected number, actual was "hi"
```

Specmatic helpfully tells you that it expected a number, but the actual value was "hi". It's quoted to indicate that the value was a string.

## Error in JSON request

Let's assume this contract is running as a stub:

```yaml
openapi: 3.0.1
info:
  title: Random API
  version: "1"
paths:
  /number:
    post:
      summary: Random number
      parameters: []
      requestBody:
        content:
          application/json:
            schema:
              required:
              - data
              properties:
                data:
                  type: number
      responses:
        "200":
          description: Random number
          content:
            text/plain:
              schema:
                type: number
```

Here's the output of a curl command that invokes the stub API.

```bash
➜  files git:(master) ✗ curl -X POST -H 'Content-Type: application/json' -d '{"data": "hi"}' http://localhost:9000/number
In scenario "Random number"
>> REQUEST.BODY.data

Expected number, actual was string: "hi"
```

Now let's take this apart.

**Line 1: Scenario name**

```
In scenario "Random number"
```

**Line 2: Path to the error**

```
>> REQUEST.BODY.data
```

The path indicates that the error is in the request body. `REQUEST` and `BODY` are Specmatic keywords.

`data` is inside REQUEST.BODY. This indicates that the request body is a **json object containing the key data**.

**Line 3 onwards: Details about the error**

```
Expected number, actual was string: "hi"
```

This line indicates that the value at key `data` should be a number, but was the string "hi".
