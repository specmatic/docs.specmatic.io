---
layout: default
title: Redis Stubbing
parent: Documentation
nav_exclude: true
---

# Redis Stubbing
{: .d-inline-block }
Commercial
{: .label }

- [Redis Stubbing](#redis-stubbing)
    - [Introduction to Redis Stubbing](#introduction-to-redis-stubbing)
    - [Pre-requisite Setup](#pre-requisite-setup)
    - [Managing Redis Server](#managing-redis-server)
    - [Setting Expectations](#setting-expectations)
      - [Setting expectation for a string response](#setting-expectation-for-a-string-response)
      - [Setting expectation for a JSON string response](#setting-expectation-for-a-json-string-response)
      - [Setting expectation for a Long/Integer response](#setting-expectation-for-a-longinteger-response)
      - [Setting expectation for an array response](#setting-expectation-for-an-array-response)
    - [Sample Applications](#sample-applications)

{: .note}
The `specmatic-redis` module described in this document is available in the [Pro plan](https://specmatic.io/pricing/) or higher. Please get in touch with us through the `Contact Us` form at [specmatic.io](https://specmatic.io) if you'd like to try it out.

### Introduction to Redis Stubbing

Redis is an open source, in-memory, key-value data store most commonly used as a primary database, cache, message broker, and queue.

### Pre-requisite Setup

The following dependency needs to be added to your application's `build.gradle` or `pom.xml`

{% tabs dependencies %}
{% tab dependencies maven %}
```xml
<dependency>
    <groupId>io.specmatic</groupId>
    <artifactId>specmatic-redis</artifactId>
    <scope>test</scope>
    <version>{{ site.specmatic-redis-version }}</version>
</dependency>
```
{% endtab %}
{% tab dependencies gradle %}
```shell
testImplementation("io.specmatic:specmatic-redis:{{ site.specmatic-redis-version }}")
```
{% endtab %}
{% endtabs %}

{: .note}
`Specmatic-Redis` can be used not only in JVM environments but also via Docker images, making it possible to use it with other languages like Python through Redis clients.
For more information, please refer to [specmatic-redis-python-sample](https://github.com/specmatic/specmatic-redis-python-sample/tree/main/tests/redis)

### Managing Redis Server

The code below starts a Redis stub server:

```java
RedisStub redisStub = new RedisStub();
redisStub.start();
```

To shut down the redis stub server:

```java
redisStub.stop();
```

### Setting Expectations

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

### Sample Applications

Please have a look at one of the below-mentioned sample applications to understand how to utilize `Specmatic-Redis` in your application:
- [specmatic-redis-sample](https://github.com/specmatic/specmatic-redis-sample/tree/main/src/test/java/io/specmatic/redis/example)
- [specmatic-redis-python-sample](https://github.com/specmatic/specmatic-redis-python-sample/tree/main/tests/redis)