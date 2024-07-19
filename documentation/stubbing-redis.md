---
layout: default
title: Redis Stubbing (Private Beta)
parent: Documentation
nav_exclude: true
---

# Redis Stubbing (Private Beta)

> The `specmatic-redis` module described in this document is currently in private beta. Please get in touch with us through the `Contact Us` form at https://specmatic.in if you'd like to try it out.

## Introduction to Redis Stubbing

Redis is an open source, in-memory, key-value data store most commonly used as a primary database, cache, message broker, and queue.

### Pre-requisite Setup

The following dependency needs to be added to pom.xml.

```
<dependency>
    <groupId>io.specmatic</groupId>
    <artifactId>specmatic-redis</artifactId>
    <version>{{ site.redis_release }}</version>
</dependency>
```

### Start Redis Server

The code below starts a Redis stub server:

```java
RedisStub redisStub = new RedisStub();
redisStub.start();
```

To shut down the redis stub server:

```java
redisStub.stop();
```

#### Setting expectation for a string response
```java
redisStub.when("get")
        .with(new String[]{"PO:NAME"})
        .thenReturnString("John Wick");
```

#### Setting expectation for a JSON string response
```java
redisStub.when("get")
        .with(new String[]{"PO:NAME"})
        .thenReturnJsonString("{\"name\": \"test\"}");
```

#### Setting expectation for a Long/Integer response
```java
redisStub.when("decr")
        .with(new String[]{"PO:ID"})
        .thenReturnLong(1234567);
```

#### Setting expectation for an array response
```java
redisStub.when("lrange")
      .with(new String[]{"address", "1", "2"})
      .thenReturnArray(new String[]{"22B Baker Street", "London"});
```
