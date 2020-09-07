---
layout: default
title: Authentication
parent: Documentation
nav_order: 16
---
Authentication
==============

### Using Cookies

Since Cookie is an HTTP request header, it can be represented like in the following contract:

```gherkin
Scenario: Perform an arithmetic operation
  When POST /operate
  And request-header Cookie (string)
  And request-body {"val1": "(number)", "val2": "(number)", "operation": "(string)"}
  Then status 200
  And response-body (number)
```

A stub that includes the cookie then looks like this:

```json
{
    "http-request": {
        "method": "POST",
        "path": "/operate",
        "headers": {
            "Cookie": "(string)"
        },
        "body": {
           "val1": 7,
           "val2": 5,
           "operation": "+"
        }
    },
    "http-response": {
        "status": 200,
        "body": 12
    }
}
```