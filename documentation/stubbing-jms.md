---
layout: default
title: Troubleshooting
parent: Documentation
nav_exclude: true
---

# JMS Stubbing

## Introduction

The JMS standard comprises a set of Java interfaces. It is not a wire protocol. Specmatic uses the ActiveMQ implementation of JMS to stub out JMS dependencies. This can be used anywhere JMS is used, regardless of the specific implementation of JMS in the concerned project.

### Pre-requisite Setup

Below-mentioned dependency needs to be in pom.xml

```
<dependency>
    <groupId>in.specmatic</groupId>
    <artifactId>specmatic-jms</artifactId>
    <version>0.0.1</version>
</dependency>
```    

### Start JMS Server

The below code section shows how to start the JMS server.

```
jmsMock = new JmsMock(new ArrayList<String>() {{
    add("src/test/resources/async-api.yaml");
}}, "localhost", 61616);
jmsMock.start();
```

This will start the JMS server running on port: 61616 on localhost.

### Stop JMS Server

The below code section shows how to shut down JMS server.

```
jmsMock.stop();
```

### Creating yaml file

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

Above file serves as a contract for the ActiveMQ server.

### Implementing ActiveMQ server

Create a new [TestInitialContextFactory.java](jms-stub-code/TestInitialContextFactory.java) file into src/test/jms package.

This will create an ActiveMQ server with which clients can interact.

### Changing the JMS Endpoint

Locate the `.properties` file and change the value of the JMS endpoint `spring.jms.jndi-name` or `spring.datasource.jndi-name`
to `jms.TestInitialContextFactory`(fully qualified classpath).
The above approach is specific to JMS with JNDI, the approach would be different for other implementations to consume the ActiveMQ JMS client.
On running the application, JMS calls are redirected to the newly created server.

## Stubbing out interactions

* Verification of stub interactions is coming soon.
* For now, a channel will always represent a queue(e.g. testQueueText represents a queue).
* Update the async-api.yaml and add blocks for all the queues that this application will write to.

## Note

* The current version of `specmatic-jms` at the time of writing is 0.0.1, but expect this to change when more capabilities are added.
