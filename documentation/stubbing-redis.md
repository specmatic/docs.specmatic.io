---
layout: default
title: Troubleshooting
parent: Documentation
nav_exclude: true
---

## Introduction to Redis Stubbing

Redis is an open source, in-memory, key-value data store most commonly used as a primary database, cache, message broker, and queue.

### Pre-requisite Setup

The following dependency needs to be added to pom.xml.

```
<dependency>
    <groupId>in.specmatic</groupId>
    <artifactId>specmatic-redis</artifactId>
    <version>{{ site.jms_release }}</version>
</dependency>
```

### Start Redis Server

The code below starts a Redis mock server:

```
@BeforeAll
public void startRedis() throws Exception {
    RedisMock redisMock = new RedisMock();
    redisMock.start();
}
```

* This will start two servers:

  * A mock redis server running on port 6379 on localhost,
  * An internal specmatic stub server running on port 9000 on localhost.
* You can override the default host/port values of redis server by providing them if required:

    ```
    RedisMock redisMock = new RedisMock("localhost", 61919);
    ```

### Stop Redis Server

The code below shuts down the Redis mock server:

```
@AfterAll
public void stopRedis() throws Exception {
    redisMock.stop();
}
```

### Set Redis Expectations

Below code sections shows how to set expectation for Redis
```
redisMock.setExpectation("/path/to/expectation.json");
```

Redis calls are translated by Specmatic into Specmatic stub expectations which are very similar to the format used for stubbing out HTTP services.

For example, here's the expectation for stubbing a key lookup.

```json
{
    "http-request": {
        "method": "POST",
        "path": "/redis",
        "body": {
            "operation": "get",
            "params": ["NAME"]
        }
    },
    "http-response": {
        "status": 200,
        "body": {
            "type": "string",
            "value": "Sherlock Holmes"
        }
    }
}
```

Note the path and method.

This stubs out a GET NAME operation, which returns the string `Sherlock Holmes`.

Here's how you can stub out a number:

```json
{
    "http-request": {
        "method": "POST",
        "path": "/redis",
        "body": {
            "operation": "get",
        "params": ["HEIGHT"]
        }
    },
    "http-response": {
        "status": 200,
        "body": {
            "type": "long",
            "value": "10"
        }
    }
}
```

An array:

```json
{
    "http-request": {
        "method": "POST",
        "path": "/redis",
        "body": {
            "operation": "lrange",
            "params": ["address", "1", "2"]
        }
    },
    "http-response": {
        "status": 200,
        "body": {
            "type": "array",
            "value": [
                {
                    "type": "string",
                    "value": "22B Baker Street"
                },
                {
                    "type": "string",
                    "value": "London"
                }
            ]
        }
    }
}
```

A map:

```json
{
  "http-request": {
    "method": "POST",
    "path": "/redis",
    "body": {
      "operation": "hgetall",
      "params": [
        "data"
      ]
    }
  },
  "http-response": {
    "status": 200,
    "body": {
      "type": "array",
      "value": [
        {
          "type": "string",
          "value": "Key1"
        },
        {
          "type": "string",
          "value": "Value1"
        },
        {
          "type": "string",
          "value": "Key2"
        },
        {
          "type": "string",
          "value": "Value2"
        }
      ]
    }
  }
}
```
