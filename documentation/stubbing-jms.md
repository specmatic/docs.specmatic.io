---
layout: default
title: JMS Stubbing
parent: Documentation
---
# JMS Stubbing

## Introduction

JMS (Java Message Service) is an API that allows application components based on the Java Platform to create, send, receive, and read messages.

Using specmatic we can stub out JMS & run the AUT (application under test) independently & below are the steps.

1. Add the following dependency to the project `pom.xml`
    ```xml
    <dependency>
        <groupId>in.specmatic</groupId>
        <artifactId>specmatic-jms</artifactId>
        <version>0.0.1</version>
    </dependency>
    ```
   
2. In the `@BeforeAll` method in the `ContractTests` class, add the following snippet.
    ```java
    jmsMock = new JmsMock(new ArrayList<String>() {{
        add("src/test/resources/async-api.yaml");
    }}, "localhost", 61616);
    jmsMock.start();
    ```
   Above code is responsible for starting mocked JMS API on port 61616


3. In the `@AfterAll` method, add the following.
    ```java
    jmsMock.stop();
    ```
   This command closes connection


4. Create a file called `async-api.yaml` in `src/test/resources`(path should be same while creating jmsMock object) with the following content.
    ```yaml
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
   Above file serves as contract for JMS stubbing


6. Add the [TestInitialContextFactory.java](jms-stub-code/TestInitialContextFactory.java) class into src/test, and make sure that the namespace is com.jio.jms.stub. Once done, the fully qualified name of the class should therefore be com.jio.jms.stub.TestInitialContextFactory.


7. Changing the JMS endpoint in
     `application-contract-tests.properties`, set the value of JMS endpoint `digital.api.platform.app.jmsconfig.jndi.context-factory` or `spring.jms.jndi-name` to `com.jio.jms.stub.TestInitialContextFactory`

## Stubbing out interactions

* Verification of stub interactions is coming soon.
* For now, a channel represents a queue (e.g. tastQueueText represents a queue).
* Update the above file and add blocks for all the queues that this application will write to.

## Read about AsyncAPI (contracts for message queues)

* [asyncapi.com](https://asyncapi.com)

## Note

* The current version of `specmatic-jms` at time of writing is 0.0.1, but expect this to change when more capabilities are added.
