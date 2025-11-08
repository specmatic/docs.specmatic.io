---
layout: default
title: JMS Stubbing
parent: Documentation
nav_exclude: true
---

# JMS Stubbing 
{: .d-inline-block }
Commercial
{: .label }

- [JMS Stubbing](#jms-stubbing)
    - [Introduction](#introduction)
    - [Pre-requisite Setup](#pre-requisite-setup)
    - [Start the JMS Server](#start-the-jms-server)
    - [Set Expectations](#set-expectations)
    - [Verify Expectations](#verify-expectations)
    - [Stop the JMS Server](#stop-the-jms-server)
    - [Inject an ActiveMQ JMS client using JNDI](#inject-an-activemq-jms-client-using-jndi)
    - [Sample Applications](#sample-applications)

{: .note}
The `specmatic-jms` module described in this document is available in the [Pro plan](https://specmatic.io/pricing/) or higher. Please get in touch with us through the `Contact Us` form at [specmatic.io](https://specmatic.io) if you'd like to try it out.

### Introduction

Specmatic spins up an ActiveMQ server, and expects the system under test to use an ActiveMQ JMS client when running tests. This is both vendor-agnostic and easy to do, given that all JMS clients implement a Java JMS interface.

The crux of the solution is, when running tests, to use the ActiveMQ JMS client and point the application at the ActiveMQ server started by Specmatic. This enables Specmatic to both see the messages sent by the system-under-test and send contract-valid message to the system-under-test.

This document describes how to stub out JMS in applications that use JNDI with Spring Boot, as we have found this to be a common enough case. However, when you can, we recommend that in your tests you disable JNDI and use Spring annotations to instantiate the application's JMS client object.

### Pre-requisite Setup

The below-mentioned dependency needs to be in your application's `build.gradle` or `pom.xml`

{% tabs dependencies %}
{% tab dependencies maven %}
```xml
<dependency>
    <groupId>io.specmatic.jms</groupId>
    <artifactId>specmatic-jms-min</artifactId>
    <version>{{ site.specmatic-jms-version }}</version>
</dependency>
```
{% endtab %}
{% tab dependencies gradle %}
```shell
implementation("io.specmatic.jms:specmatic-jms-min:{{ site.specmatic-jms-version }}")
```
{% endtab %}
{% endtabs %}

### Start the JMS Server

The code below shows how to start the JMS server.

{% tabs start %}
{% tab start java %}
```java
JmsMock jmsMock = JmsMock.fromAsyncApiFiles(List.of("src/test/resources/async-api.yaml"), "localhost", 61616);
jmsMock.start();
```
{% endtab %}
{% tab start kotlin %}
```kotlin
val jmsMock = JmsMock.fromAsyncApiFiles(listOf("src/test/resources/async-api.yaml"), "localhost", 61616)
jmsMock.start()
```
{% endtab %}
{% endtabs %}
{: .note}
If you have the [Specmatic Config](/documentation/configuration.html) set up, you can define the specifications in the `consumes` section and utilize `JmsMock.create(host, port)` in your test setup to create the JMS mock.

This will start the JMS server running on port: 61616 on localhost.

### Set Expectations

The code below shows how to set expectations on the JMS mock. You can specify the number of messages to be received on a specific channel.

{% tabs setExpectations %}
{% tab setExpectations java %}
```java
jmsMock.setExpectations(List.of(new Expectation("product-queries", 2)));
```
{% endtab %}
{% tab setExpectations kotlin %}
```kotlin
jmsMock.setExpectations(listOf(Expectation(channel = "product-queries", count = 2)))
```
{% endtab %}
{% endtabs %}


### Verify Expectations

At then end of the test, the code below shows how to check if the expectations have been met.
This returns `VerificationResult` which contains `success` boolean and `errors` list of string errors

{% tabs verifyExpectations %}
{% tab verifyExpectations java %}
```java
VerificationResult result = jmsMock.verifyExpectations();    
assertThat(result.success).isTrue();
assertThat(result.errors).isEmpty();
```
{% endtab %}
{% tab verifyExpectations kotlin %}
```kotlin
val results = jmsMock.verifyExpectations()
assertThat(result.success).isTrue
assertThat(result.errors).isEmpty()
```
{% endtab %}
{% endtabs %}

You can also verify if a specific `ObjectMessage` or `TextMessage` has been received by the JMS mock on a specific channel.

{% tabs checkMessage %}
{% tab checkMessage java %}
```java
assertThat(jmsMock.objectMessageReceivedOnChannel("product-queries", new ProductMessage(1, "Iphone", 10))).isTrue();
assertThat(jmsMock.textMessageReceivedOnChannel("product-queries", "Hello JMS")).isTrue();
```
{% endtab %}
{% tab checkMessage kotlin %}
```kotlin
assertThat(jmsMock.objectMessageReceivedOnChannel("product-queries", ProductMessage(1, "Iphone", 10))).isTrue
assertThat(jmsMock.textMessageReceivedOnChannel("product-queries", "Hello JMS")).isTrue
```
{% endtab %}
{% endtabs %}

### Stop the JMS Server

The code below shows how to shut down JMS mock.

{% tabs stopServer %}
{% tab stopServer java %}
```java
jmsMock.stop();
```
{% endtab %}
{% tab stopServer kotlin %}
```kotlin
jmsMock.stop()
```
{% endtab %}
{% endtabs %}

### Inject an ActiveMQ JMS client using JNDI

Create a new [TestInitialContextFactory.java](jms-stub-code/TestInitialContextFactory.java) file into src/test/jms package.

This will create an ActiveMQ server with which clients can interact.

Locate the `.properties` file and change the value of the JMS endpoint `spring.jms.jndi-name` or `spring.datasource.jndi-name` to `jms.TestInitialContextFactory`(fully qualified classpath).

On running the application, JMS calls are redirected to the newly created server.

Depending on your context, you may need to additional methods in TestInitialContextFactory.

### Sample Applications

Please have a look at the following sample project to understand how to utilize `Specmatic-JMS` in your application:

- [specmatic-order-bff-jms](https://github.com/specmatic/specmatic-order-bff-jms/tree/main/src/test/kotlin/com/component/orders)