---
layout: default
title: Programmatic Approach
parent: Documentation
nav_order: 2
---
Programmatic Approach
=====================

If you are building your application in a JVM language, you are in luck, because you can spawn the stub / mock server or run the contract as test programmatically.

### Author a contract

Refer to [authoring a contract](/documentation/authoring_contract_introduction.html) page.

### Consumer - Leveraging Mock Server

TODO: Stub vs Mock explanation

Let us try building a Pet Store Consumer through Test First appraoch.

Add jar dependency.

```
<dependency>
    <groupId>run.qontract</groupId>
    <artifactId>qontract-core</artifactId>
    <version>0.0.1</version>
</dependency>
```

```java
public class PetStoreConsumerTest {
    private static ContractMock petStoreMock;

    @BeforeAll
    public static void setup() throws Throwable {
        //Start a mock server based on the contract
        String gherkin = Utilities.readFile("<baseDir>/petstore/qontract/service.qontract");
        petStoreMock = ContractMock.fromGherkin(gherkin, 9003);
        petStoreMock.start();
    }

    @Test
    public void shouldGetPetByPetId() throws IOException {
        //Arrange - Setup the mock to respond to the request we expect PetStoreConsumer to make
        HttpRequest httpRequest = new HttpRequest().setMethod("GET").updatePath("/pets/123");
        HttpResponse httpResponse = HttpResponse.Companion.jsonResponse("{petid:123}");
        Map<String, Object> serverState = new HashMap<>();
        // This line makes sure the request and response we are setting up are in line with the contract
        petStoreMock.tryToMockExpectation(new MockScenario(httpRequest, httpResponse, serverState));

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

The test injects mock pet store service url to the PetStoreConsumer. Let us now look at how the PetStoreConsumer and Pet code looks.

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

### Provider - Runinng Contract as a test

Qontract leverages testing Frameworks to let you run contract as a test.
At the moment JUnit is supported. Each Scenario in translated to a junit test so that you get IDE support to run your contract.

Add a test class that extends "run.qontract.test.ContractAsATest". In the setUp method point to the location of the contract file and host and port of the provider.

```java
public class PetStoreContractTest extends QontractJUnitSupport {
    @BeforeAll
    public static void setUp() {
        File contract = new File("contract/service.contract");
        System.setProperty("path", contract.getAbsolutePath());
        System.setProperty("host", "localhost");
        System.setProperty("port", "port");
    }
}
```

Now all you have to do is make sure your provider app is running and then run your PetStoreContractTest just like any other JUnit test suite.
And results are displayed like JUnit tests.

You can also start and stop your application in the setUp and tearDown. Example: Here we are starting a Spring Provider Application.

```java
public class PetStoreContractTest extends QontractJUnitSupport {
    private static ConfigurableApplicationContext context;

    @BeforeAll
    public static void setUp() {
        File contract = new File("contract/service.contract");
        System.setProperty("path", contract.getAbsolutePath());
        System.setProperty("host", "localhost");
        System.setProperty("port", "8080");

        context = SpringApplication.run(Application.class);
    }

    @AfterAll
    public static void tearDown() {
        context.stop();
    }
}
```