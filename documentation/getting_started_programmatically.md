---
layout: default
title: Programmatic Approach
parent: Documentation
nav_order: 2
---
Programmatic Approach
=====================

If you are building your application in a JVM language, you are in luck, because you can run programmatically the contract as a stub server or as tests.

---

### Setup

Add jar dependency. Notice this is test only scope. There is no need to ship Qontract jar with your production code.

```
<dependency>
    <groupId>run.qontract</groupId>
    <artifactId>qontract-core</artifactId>
    <version>{{ site.latest_release }}</version>
    <scope>test</scope>
</dependency>
```

---

### Author a contract

{% include authoring_contract_introduction.md %}

---

### Consumer - Leveraging Mock Server

Let us try building a Pet Store Consumer through Test First approach.
Add below test to your codebase.

```java
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import run.qontract.core.HttpRequest;
import run.qontract.core.HttpResponse;
import run.qontract.core.utilities.Utilities;
import run.qontract.mock.ContractMock;
import run.qontract.mock.MockScenario;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class PetStoreConsumerTest {
    private static ContractMock petStoreMock;

    @BeforeAll
    public static void setup() throws Throwable {
        //Start a mock server based on the contract
        String gherkin = Utilities.readFile("<baseDir>/petstore/qontract/service.qontract");
        petStoreMock = new ContractMock(gherkin, 9003);
        petStoreMock.start();
    }

    @Test
    public void shouldGetPetByPetId() throws IOException {
        //Arrange - Setup the mock to respond to the request we expect PetStoreConsumer to make
        HttpRequest httpRequest = new HttpRequest().updateMethod("GET").updatePath("/pets/123");
        HttpResponse httpResponse = HttpResponse.Companion.jsonResponse("{petid:123}");
        Map<String, Object> serverState = new HashMap<>();
        // This line makes sure the request and response we are setting up are in line with the contract
        petStoreMock.createMockScenario(new MockScenario(httpRequest, httpResponse, serverState));

        //Act
        PetStoreConsumer petStoreConsumer = new PetStoreConsumer("http://localhost:9003");
        Pet pet = petStoreConsumer.getPet(123);

        //Assert
        Assert.assertEquals(123, pet.getPetid());
    }

    @AfterAll
    public static void tearDown() {
        petStoreMock.close();
    }
}
```

Let us take a closer look at the above test.
* The objective of this test is to help us build a PetStoreConsumer (API Client) class.
* The setUP and tearDown methods are responsible for starting a Qontract Mock server (based on the service.qontract) and stopping it respectively
* Just like any good unit test has arrange, act and assert sections.
* In the arrange section is setting up the Qontract Mock to expect a request /pets/123 and return { petid: 123 }
* The act section instantiates a PetStoreConsumer with API url (mock server URL) and then we call getPet which is then expected invoke /pets/123.
* The assert section verifies that PetStoreConsumer is able to translate the response to Pet object

At this point you will see compilation errors because we do not have PetStoreConsumer and Pet classes. Let us define those.

```java
public class PetStoreConsumer {
    private String petStoreUrl;

    public PetStoreConsumer(String petStoreUrl) {
        this.petStoreUrl = petStoreUrl;
    }

    public Pet getPet(int petId) {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Pet> response = restTemplate.exchange(URI.create(petStoreUrl + "/pets/" + petId), HttpMethod.GET, null, Pet.class);
        return response.getBody();
    }
}

public class Pet {
    private int petid;

    public void setPetid(int id) {
        this.petid = id;
    }

    public int getPetid() {
        return this.petid;
    }
}
```

Now we can run the PetStoreConsumerTest. This test is fast and also does not require the real backend api to be running.

Since this test exercises contract as a mock we can be sure that when there are changes in the contract, this test will fail because of mismatch errors in mock setup section.
This is important because it helps us keep the Consumer in line with the Provider.

---

### Provider - Running Contract as a test

Add JUnit Jar dependency. This lets you run the contract as a JUnit 5 test.

```
<dependency>
    <groupId>run.qontract</groupId>
    <artifactId>junit5-support</artifactId>
    <version>{{ site.latest_release }}</version>
    <scope>test</scope>
</dependency>
```

Qontract leverages testing Frameworks to let you run contract as a test.
At the moment JUnit 5 is supported. Each Scenario in translated to a junit test so that you get IDE support to run your contract.

Add below test to your Provider.

```java
import run.qontract.test.QontractJUnitSupport;

import java.io.File;

public class PetStoreContractTest extends QontractJUnitSupport {
    private static ConfigurableApplicationContext context;

    @BeforeAll
    public static void setUp() {
        File contract = new File("contract/service.qontract");
        System.setProperty("path", contract.getAbsolutePath());
        System.setProperty("host", "localhost");
        System.setProperty("port", "8080");

        //Optional
        context = SpringApplication.run(Application.class);
    }

    @AfterAll
    public static void tearDown() {
        //Optional
        context.stop();
    }
}
```

A closer look at above test.
* PetStoreContractTest extends QontractJUnitSupport. QontractJUnitSupport leverages JUnit5 Dynamic Tests to translate scenarios in the contract to tests.
* The setUp method passes the location of contract file, host port etc. to QontractJUnitSupport through System Properties
* Optional - You can start and stop the application in setUp and tearDown. In this example we are starting a Springboot application.
* Note - Please do not add any other unit test to the above class. The above test is only supposed to have setUp and optionally tearDown methods.

To run this test, right click (or use JUnit shortcuts) and run it just like a unit test.
