---
layout: default
title: JMS Stubbing (Private Beta)
parent: Documentation
nav_exclude: true
---

# JMS Stubbing (Private Beta)

> The `specmatic-jms` module described in this document is currently in private beta. Please get in touch with us through the `Contact Us` form at https://specmatic.in if you'd like to try it out.

## Introduction

Specmatic spins up an ActiveMQ server, and expects the system under test to use an ActiveMQ JMS client when running tests. This is both vendor-agnostic and easy to do, given that all JMS clients implement a Java JMS interface.

The crux of the solution is, when running tests, to use the ActiveMQ JMS client and point the application at the ActiveMQ server started by Specmatic. This enables Specmatic to both see the messages sent by the system-under-test, as well as send contract-valid message to the system-under-test.

This document describes how to stub out JMS in applications that use JNDI with Spring Boot, as we have found this to be a common enough case. However when you can, we recommend that in your tests you disable JNDI and use Spring annotations to instantiate the application's JMS client object.

### Pre-requisite Setup

The below-mentioned dependency needs to be in pom.xml:

```
<dependency>
    <groupId>io.specmatic</groupId>
    <artifactId>specmatic-jms</artifactId>
    <version>{{ site.jms_release }}</version>
</dependency>
```    

### Start the JMS Server

The code below shows how to start the JMS server.

```
jmsMock = new JmsMock(new ArrayList<String>() {{
    add("src/test/resources/async-api.yaml");
}}, "localhost", 61616);
jmsMock.start();
```

This will start the JMS server running on port: 61616 on localhost.

### Stop the JMS Server

The code below shows how to shut down JMS server.

```
jmsMock.stop();
```

### Create the specification file

Create a file called `async-api.yaml` in `src/test/resources`(use the same path in step 2) with
the following content.

```
asyncapi: 2.0.0
    info:
        title: JMS Queue Example
        version: '1.0.0'
    servers:
        activemq:
            url: tcp://localhost:61616
            protocol: jms
    channels:
        taskQueueText:
            publish:
                operationId: publishStringMessage
                message:
                    payload:
                        type: string
            bindings:
                amqp:
                    is: queue
```

This file serves as the specification that declares what a JMS message being sent to the queue will look like.

### Inject an ActiveMQ JMS client using JNDI

Create a new [TestInitialContextFactory.java](jms-stub-code/TestInitialContextFactory.java) file into src/test/jms package.

This will create an ActiveMQ server with which clients can interact.

Locate the `.properties` file and change the value of the JMS endpoint `spring.jms.jndi-name` or `spring.datasource.jndi-name` to `jms.TestInitialContextFactory`(fully qualified classpath).

On running the application, JMS calls are redirected to the newly created server.

Depending on your context, you may need to additional methods in TestInitialContextFactory.

## Stub out interactions

* Verification of stub interactions is coming soon.
* For now, a channel will represents a queue (e.g. testQueueText represents a queue).
* Update the async-api.yaml and add channels for all the queues that this application will write to.
