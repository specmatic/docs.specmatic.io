---
layout: default
title: Getting started (in 5 min)
nav_order: 4
---
Getting started
===============

- [Getting started](#getting-started)
    - [Setup](#setup)
    - [Example Application - PetStore](#example-application---petstore)
    - [API Specification](#api-specification)
    - [Provider Side - Contract as a Test](#provider-side---contract-as-a-test)
    - [Consumer Side - Contract As A Stub / Smart Mock](#consumer-side---contract-as-a-stub--smart-mock)

### Setup

The quickest approach to getting started is through the command line.

{% include setup_command_line.md %}

For nodejs projects, please visit [npmjs](https://www.npmjs.com/package/specmatic).

---

### Example Application - PetStore

PetStore application has a backend API (Provider) and a front-end client application (Consumer).
Below is a sequence diagram.

    UI (Consumer)          API (Provider)
          | --- getPetById ---> |
          | <-- {Pet JSON} ---- |

Just to be clear on vocabulary
* Consumer - The application requesting the data (in this case UI)
* Provider - The application responding with the data (in this case API)

---

### API Specification
    
Below is the OpenAPI specification that represents the communication between UI and API in the above sample application. Save this to a file called service.yaml.

```yaml
---
openapi: "3.0.1"
info:
  title: "Contract for the petstore service"
  version: "1"
paths:
  /pets/{petid}:
    get:
      summary: "Should be able to get a pet by petId"
      parameters:
        - name: "petid"
          in: "path"
          required: true
          schema:
            type: "number"
          examples:
            200_OKAY:
              value: 1
      responses:
        "200":
          description: "Should be able to get a pet by petId"
          content:
            application/json:
              schema:
                required:
                  - "id"
                  - "name"
                  - "status"
                  - "type"
                properties:
                  id:
                    type: "number"
                  name:
                    type: "string"
                  type:
                    type: "string"
                  status:
                    type: "string"
              examples:
                200_OKAY:
                  value: '{any}'
```

---

### Provider Side - Contract as a Test

We have a sample API running which you can access through curl or other tools.
```shell
curl https://my-json-server.typicode.com/znsio/specmatic-documentation/pets/1
```

Now lets leverage Specmatic to run the above specification as a test against the Provider / API to see if it is adhering the OpenAPI Specification.
```shell
specmatic test service.yaml --testBaseURL=https://my-json-server.typicode.com/znsio/specmatic-documentation
```

This should print out a result that looks something like this.
```shell

--------------------
  Request to https://my-json-server.typicode.com/znsio/specmatic-documentation at 2022-11-19 4:4:12.154
    GET /znsio/specmatic-documentation/pets/1
    Host: my-json-server.typicode.com
    Accept-Charset: UTF-8
    Accept: */*

  Response at 2022-11-19 4:4:12.165
    200 OK

    {
        "id": 1,
        "name": "Scooby",
        "type": "Golden Retriever",
        "status": "Adopted"
    }

Scenario: Should be able to get a pet by petId. Response: Should be able to get a pet by petId GET /pets/(petid:number) SUCCESSFUL

Tests run: 1, Successes: 1, Failures: 0, Errors: 0
```

How did Specmatic know to make the exact request to ```GET /znsio/specmatic-documentation/pets/1``` with petId as "1"? And not just any other number?

If you notice the OpenAPI, we have an example section for PetId which sets up our petId as per the test data.

```yaml
  - name: "petid"
    in: "path"
    required: true
    schema:
    type: "number"
    examples:
    200_OKAY:
        value: 1
```

Try removing this example value and try running the specmatic test command again.
```shell
specmatic test service.yaml --testBaseURL=https://my-json-server.typicode.com/znsio/specmatic-documentation
```

Specmatic will generate a random petId based on the datatype of the petId path parameter which results in a 404 since test data does not exist.
```shell
--------------------
  Request to https://my-json-server.typicode.com/znsio/specmatic-documentation at 2022-11-19 4:19:18.752
    GET /znsio/specmatic-documentation/pets/616
```

Now lets try something more interesting. Restore the OpenAPI file to its [original state](/getting_started.html#api-specification) (add back the example petId value) and change the datatype of the "status" field of response in OpenAPI file to "number" and save it.

```yaml
  properties:
    status:
      type: "number"
```

Let us run the specmatic test command again.
```shell
specmatic test service.yaml --testBaseURL=https://my-json-server.typicode.com/znsio/specmatic-documentation
```

This time around the test fails because the response from our sample app is not in line with the OpenAPI Specification.
```shell
Unsuccessful Scenarios:
  "Scenario: Should be able to get a pet by petId. Response: Should be able to get a pet by petId GET /pets/(petid:number) FAILED"
        Reason: Testing scenario "Should be able to get a pet by petId. Response: Should be able to get a pet by petId"
    	API: GET /pets/(petid:number) -> 200

    	  >> RESPONSE.BODY.status

    	     Contract expected number but response contained "Adopted"

Tests run: 1, Successes: 0, Failures: 1, Errors: 0
```

This is how Specmatic is able to make sure that your API never deviates from the Specification.

Please refer to below videos for extensive demos on Contract as Test.
* [Video: Boundary Condition Testing](https://youtu.be/U5Agz-mvYIU?t=51) - Verifying edge cases
* [Video: Tracer Bullet Approach](https://youtu.be/U5Agz-mvYIU?t=1112) - Leveraging Contract as Test to Test Drive your Code

[**Learn more about Contract Tests here.**](/documentation/contract_tests.html)

### Consumer Side - Contract As A Stub / Smart Mock

On the Consumer Side, we can now leverage the OpenAPI Specification as a Smart Mock to isolate our UI development and make progress independent of the Provider / API.

    UI (Consumer)         Specmatic Stub <- service.yaml
          | --- getPetById ---> |
          | <-- {Pet JSON} ---- |

Here the Specmatic Stub is emulating the Provide / API.

Before we begin, please make sure that your service.yaml file is restored to its [original shape](/getting_started.html#api-specification).

To spin up a stub server with the service.yaml we authored earlier, run below command.

```shell
specmatic stub service.yaml
```

This should start your stub server on port 9000 by default (you can switch the port number by adding ```--port <port of your choice>``` to the above command).

```shell
specmatic stub service.yaml
Loading service.yaml
Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```

Once the stub server is running you can verify the API by accessing it through Postman, Chrome, Curl etc. to see the response.

```shell
curl http://localhost:9000/pets/123
{
    "id": 864,
    "name": "VRIQA",
    "type": "KPNDQ",
    "status": 990
}
```

The response contains auto-generated values that adhere to the data type defined in the contract. In above output petid "864" is generated by specmatic and will vary with every execution. If you would like to control the value that is being returned you can set up stub / canned responses.
* Create a folder named service_data in the same folder as your service.yaml file (_data suffix is a naming convention that tell Specmatic to look for canned responses in that directory)
* Create a json file with the name scooby.json and add below contents to it

```json
{
    "http-request": {
        "path": "/pets/1",
        "method": "GET"
    },
    "http-response": {
        "status": 200,
        "body": {
            "id": 1,
            "name": "Scooby",
            "type": "Golden Retriever",
            "status": "Adopted"
        },
        "status-text": "OK"
    }
}
```

Now let us run the stub command again.
```shell
specmatic stub service.yaml
```

This time you should see Specmatic load your canned response file also.
```shell
Loading service.yaml
  Loading stub expectations from /<dir with service.yaml>/service_data
  Reading the following stub files:
    /<dir with service.yaml>/service_data/scooby.json
Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```

And let us now run the curl command.
```shell
curl http://localhost:9000/pets/1
{
    "id": 1,
    "name": "Scooby",
    "type": "Golden Retriever",
    "status": "Adopted"
}
```

Specmatic will now return your canned response for petId 1. For any other petId it will continue to return generated values.

So what is so smart about Specmatic Smart Mocks.

Let us try a few experiments. Remove the "status" field in scooby.json and run the stub command again.
```shell
specmatic stub service.yaml
Loading service.yaml
  Loading stub expectations from /<dir with service.yaml>/service_data
  Reading the following stub files:
    /<dir with service.yaml>/service_data/scooby.json
  /<dir with service.yaml>/service_data/scooby.json didnt match service.yaml
    Error from contract service.yaml

      In scenario Should be able to get a pet by petId. Response: Should be able to get a pet by petId
      API: GET /pets/(petid:number) -> 200

        >> RESPONSE.BODY.status

           Key named status in the contract was not found in the stub
Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```

Specmatic rejects the expectation / canned response since it is not in line with the OpenAPI Specification.

To know more about smart mocks please refer to below video demos
* [Video: Smart Mocks](https://youtu.be/U5Agz-mvYIU?t=750)
* [Video: Dynamic Mocking](https://youtu.be/U5Agz-mvYIU?t=908)

We can now start consumer development against this stub without any dependency on the real API.

[**Learn more about Stubbing / Smart Mocks here.**](/documentation/service_virtualization_tutorial.html)
