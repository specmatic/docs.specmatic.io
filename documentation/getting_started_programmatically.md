---
layout: default
title: Programmatic Approach
parent: Documentation
nav_order: 3
---
Programmatic Approach
=====================

If you are building your application in a JVM language, you are in luck, because you can run programmatically the contract as a stub server or as tests.

---

### Setup

Add jar dependency. Notice this is test only scope. There is no need to ship Specmatic jar with your production code.

```
<dependency>
    <groupId>in.specmatic</groupId>
    <artifactId>specmatic-core</artifactId>
    <version>{{ site.latest_release }}</version>
    <scope>test</scope>
</dependency>
```

Also add the following dependencies:

```
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>5.3.14</version>
</dependency>
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.8.2</version>
    <scope>test</scope>
</dependency>
```
---

### Author a contract

{% include authoring_contract_introduction.md %}

---

### Consumer - Leveraging Stub Server

Let us try building a Pet Store Consumer through Test First approach.

First add the following json to a stub file named expectation.json, in a directory named petstore_data:

```json
{
  "http-request": {
    "method": "GET",
    "path": "/pets/10"
  },
  "http-response": {
    "status": 200,
    "body": {
      "name": "Archie",
      "type": "dog",
      "status": "available",
      "id": 10
    }
  }
}
```

Then add the test below to your codebase.

```java
package com.petstore.test;

import com.petstore.demo.PetStoreConsumer;
import com.petstore.demo.model.Pet;
import in.specmatic.stub.ContractStub;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static in.specmatic.stub.API.createStubFromContracts;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class PetStoreConsumerTest {
    private static ContractStub petStoreStub;

    @BeforeAll
    public static void setUP() {
        // Path to the contract
        List<String> contracts = new ArrayList<String>();
        contracts.add("/path/to/service/contract/service.spec");

        // Path to stub data directory
        List<String> stubDataDir = new ArrayList<String>();
        stubDataDir.add("/path/to/stub/data/petstore_data");

        //Start the stub server
        petStoreStub = createStubFromContracts(contracts, stubDataDir, "localhost", 9000);
    }

    @Test
    public void shouldGetPetByPetId() {
        PetStoreConsumer petStoreConsumer = new PetStoreConsumer("http://localhost:9000");
        Pet archie = petStoreConsumer.getPet(10);

        assertEquals(10, archie.getId());
        assertEquals("Archie", archie.getName());
    }

    @AfterAll
    public static void tearDown() throws IOException {
        petStoreStub.close();
    }
}
```

Let us take a closer look at the above test.
* The objective of this test is to help us build a PetStoreConsumer (API Client) class.
* The setUP and tearDown methods are responsible for starting a Specmatic Stub server (based on the service.spec) and stopping it respectively.
* In the setUP section, we pass the expectation json file to the stub. This tells it to expect a call to /pets/10, to which it must return the given pet info.
* The assert section verifies that PetStoreConsumer is able to translate the response to Pet object

At this point you will see compilation errors because we do not have PetStoreConsumer and Pet classes. Let us define those.

```java
package com.petstore.demo.model;

public class Pet {
    private Integer id;
    private String name;
    private String type;
    private String status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
```

```java
package com.petstore.demo;

import com.petstore.demo.model.Pet;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.net.URI;

public class PetStoreConsumer {
    private final String petStoreUrl;

    public PetStoreConsumer(String petStoreUrl) {
        this.petStoreUrl = petStoreUrl;
    }

    public Pet getPet(int id) {
        RestTemplate restTemplate = new RestTemplate();
        URI uri = URI.create(petStoreUrl + "/pets/" + id);
        ResponseEntity<Pet> response = restTemplate.getForEntity(uri, Pet.class);
        return response.getBody();
    }
}
```

Now we can run the PetStoreConsumerTest. This test is fast and also does not require the real backend api to be running.

Since this test runs the contract as a stub we can be sure that when there are changes in the contract, this test will fail because of mismatch errors in stub setup section.

This is important because it helps us keep the Consumer in line with the Provider.

---

### Provider - Running Contract as a test

Add JUnit Jar dependency. This lets you run the contract as a JUnit 5 test.

```
<dependency>
    <groupId>in.specmatic</groupId>
    <artifactId>junit5-support</artifactId>
    <version>{{ site.latest_release }}</version>
    <scope>test</scope>
</dependency>
```

Specmatic leverages testing Frameworks to let you run contract as a test.

Also add the junit5 dependency so that we can use the BeforeAll and AfterAll annotations.

```
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.8.2</version>
    <scope>test</scope>
</dependency>
```

At the moment JUnit 5 is supported. Each Scenario in translated to a junit test so that you get IDE support to run your contract.

Add below test in your Provider project.

```java
package com.petstore.test;

import in.specmatic.test.SpecmaticJUnitSupport;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.context.ConfigurableApplicationContext;

import java.io.File;

public class PetStoreContractTest extends SpecmaticJUnitSupport {
    private static ConfigurableApplicationContext context;

    @BeforeAll
    public static void setUp() {
        File contract = new File("/path/to/service.spec");
        System.setProperty("contractPaths", contract.getAbsolutePath());
        System.setProperty("host", "localhost");
        System.setProperty("port", "8080");

        //Optional
        //context = SpringApplication.run(Application.class);
    }

    @AfterAll
    public static void tearDown() {
        //Optional
        context.stop();
    }
}
```

A closer look at above test.
* PetStoreContractTest extends SpecmaticJUnitSupport. SpecmaticJUnitSupport leverages JUnit5 Dynamic Tests to translate scenarios in the contract to tests.
* The setUp method passes the location of contract file, host port etc. to SpecmaticJUnitSupport through System Properties
* Optional - You can start and stop the application in setUp and tearDown. In this example we are starting a Springboot application.
* Note - Please do not add any other unit test to the above class. The above test is only supposed to have setUp and optionally tearDown methods.

To run this test, right click (or use JUnit shortcuts) and run it just like a unit test.

Following the test-first style approach, we haven't written a pet store API yet, so the contract test will fail. We now need to add a pet store API that passes the contract tests. We leave this as an exercise for the reader.
