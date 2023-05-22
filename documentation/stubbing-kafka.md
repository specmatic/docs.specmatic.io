---
layout: default
title: Kafka Stubbing
parent: Documentation
nav_exclude: true
---

# KAFKA Stubbing

## Introduction

1. Add the specification file (which will be used to stub kafka) in the src/test/resources directory.
2. See a sample specification here-
    ```yaml
    1  asyncapi: 2.0.0
    2  info:
    3    title: Kafka Queue Example
    4    version: '1.0.0'
    5  servers:
    6    activemq:
    7      url: tcp://localhost:61616
    8      protocol: amqp
    9  channels:
    10   taskQueueObject:
    11     publish:
    12       operationId: publishObjectMessage
    13       message:
    14         payload:
    15           $ref: "#/components/messages/Task"
    16     bindings:
    17       amqp:
    18         is: queue
    19 components:
    20   messages:
    21     Task:
    22       name: Task
    23       title: A Task to be processed
    24       summary: Inform about a new user task in the system
    25       contentType: application/json
    26       payload:
    27         type: object
    28         properties:
    29           id:
    30             type: integer
    31           name:
    32             type: string
    ```

#### Note the following:

* Protocol for now should be amqp (line 8)
* The block on line 10 is an example of how the queue is declared. The key name is the queue name.
* The payload (line 14) should define the structure of a message on the queue.
* The payload specification format is the same as how the structure is declared in an OpenAPI specification.
* The AMQP Bindings on lines 16-18 should be declared in all queues (we will use AMQP bindings to declare Kafka queues).


## Pre-requisite Setup

**There are 2 ways to stub out Kafka.**

### I) Self-managed Kafka instance

Use this when the `kafka-clients` package in the project has the same major version as Specmatic's Kafka (`kafka_2.13` 2.8.0).
Also in this approach specmatic will automatically pick the kafka yaml from the specified file path.(src/test/resources/kafka.yaml)
In this approach, Specmatic manages an in-memory instance of Kafka that the system-under-test can send messages to.

1. Add the specmatic Kafka dependency to `pom.xml`:
    ```xml
        <dependency>
            <groupId>in.specmatic</groupId>
            <artifactId>specmatic-kafka</artifactId>
            <version>0.3.0</version>
        </dependency>
    ```
2. Use the following code in `@BeforeAll` to start up the Kafka stub:
    ```java
    // kafkaMock is a static variable
    kafkaMock =
        KafkaMock.fromAsyncAPIFiles(
            listOf("src/test/resources/kafka.yaml"),
            9092,
            2171,
            "./kafka-logs");

    kafkaMock.start();
    ```
3. In the `@AfterAll` method, use the following code to stop the mock.
    ```java
    kafkaMock.close();
    ```

### II) External Kafka instance

Use this when the `kafka-clients` package in the project has a *different* major version from Specmatic's Kafka (`kafka_2.13` 2.8.0). Specmatic may not be able to start its own Kafka service due to this library conflict.

Use the code below to start up a Kafka server, and let Specmatic mock subscribe to it to verify interactions with it.

1. Add the following to `pom.xml` (the version should match that of `kafka-clients` version which would already be in the projects' pom or parent pom)
    ```xml
    <dependency>
        <groupId>org.apache.kafka</groupId>
        <artifactId>kafka_2.13</artifactId>
        <version>2.8.0</version>
        <scope>test</scope>
    </dependency>
    ```
   when facing issues with kafka version in the setting up externalKafkaServer then you can explicitly provide kafka version as 2.8.0 in properties in pom.xml as
   ```xml
   <kafka.version>2.8.0</kafka.version>
   ```
2. Use the following code in `@BeforeAll` to start up the Kafka stub:
    ```java
        // Start the Kafka mock instance.
        // We won't start it though, we will just use some utils.
   
        // kafkaMock is a static variable
        kafkaMock = 
            KafkaMock.fromAsyncAPIFiles(
                new ArrayList<String>() {{
                    add("src/test/resources/kafka.yaml");
                }}, 9092, 2181, "./kafka-logs");

        // Without this, the Kafka server may not start
        kafkaMock.cleanupLogDir();

        // Start Zookeeper
        // zkServer is a static variable
        zkServer = kafkaMock.startZooKeeper();

        // Start a new Kafka server using the Kafka dependency already added to the pom
        externalKafkaServer = new KafkaServer(
            kafkaMock.getKafkaConfigInstance(), 
            Time.SYSTEM, 
            Option.empty(), 
            scala.collection.JavaConverters.asScalaBuffer(
                new ArrayList<KafkaMetricsReporter>()).toList());

        externalKafkaServer.startup();

        // point the KafkaMock instance at the 
        kafkaMock.subscribeToExternalKafka(null);

    ```
3. In the `@AfterAll` method, add the following code:

    ```
    if(zkServer != null)
        zkServer.close();
    if(externalKafkaServer != null)
        externalKafkaServer.shutdown();
    ```