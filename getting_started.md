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
    - [PetStore API Specification](#petstore-api-specification)
    - [Provider Side - Contract as a Test](#provider-side---contract-as-a-test)
      - [Understanding the output](#understanding-the-output)
      - [Where did Specmatic get the test data to generate the HTTP request](#where-did-specmatic-get-the-test-data-to-generate-the-http-request)
      - [How does this all work?](#how-does-this-all-work)
      - [What happens when OpenAPI goes out of sync with the application or vice versa?](#what-happens-when-openapi-goes-out-of-sync-with-the-application-or-vice-versa)
    - [Consumer Side - Contract As A Stub / Intelligent Service Virtualization](#consumer-side---contract-as-a-stub--intelligent-service-virtualization)
      - [**Intelligent Service Virtualization**](#intelligent-service-virtualization)
      - [**Externalizing stub responses**](#externalizing-stub-responses)

### Setup

{% include setup_command_line.md %}

---

### Example Application - PetStore

PetStore application has a backend API (Provider) and a front-end client application (Consumer).
Here is a sequence diagram representing the `getPetById` operation.

    UI (Consumer)          API (Provider)
          | --- getPetById ---> |
          | <-- {Pet JSON} ---- |

Before we get started, here is a quick refresher on the terminology used in the documentation.
* Consumer - The application requesting the data (in this case UI)
* Provider - The application responding with the data (in this case API)

---

### PetStore API Specification
    
Below is the OpenAPI specification that represents the communication between UI and Backend in the above example application. Please save this to a file called `service.yaml`.

```yaml
openapi: 3.0.1
info:
  title: Contract for the petstore service
  version: '1'
paths:
  /pets/{petid}:
    get:
      summary: Should be able to get a pet by petId
      parameters:
        - name: petid
          in: path
          required: true
          schema:
            type: number
          examples:
            SCOOBY_200_OK:
              value: 1
      responses:
        '200':
          description: Should be able to get a pet by petId
          content:
            application/json:
              schema:
                required:
                  - id
                  - name
                  - status
                  - type
                properties:
                  id:
                    type: number
                  name:
                    type: string
                  type:
                    type: string
                  status:
                    type: string
              examples:
                SCOOBY_200_OK:
                  value:
                    id: 1
                    name: Scooby
                    type: Golden Retriever
                    status: Adopted
```

---

### Provider Side - Contract as a Test

We have a sample implementation of the PetStore API running which you can access through curl or any other tool of your choice.
```shell
curl https://my-json-server.typicode.com/znsio/specmatic-documentation/pets/1
```

Now lets use Specmatic to run the above **API specification as a contract test** against the Provider / API to see if it is adhering the OpenAPI Specification.
{% tabs test %}
{% tab test java %}
```shell
specmatic test service.yaml --testBaseURL=https://my-json-server.typicode.com/znsio/specmatic-documentation
```
{% endtab %}
{% tab test npm %}
```shell
npx specmatic test service.yaml --testBaseURL=https://my-json-server.typicode.com/znsio/specmatic-documentation
```
{% endtab %}
{% tab test docker %}
```shell
 docker run -v "/local-directory/service.yaml:/service.yaml" znsio/specmatic test "/service.yaml" --testBaseURL=https://my-json-server.typicode.com/znsio/specmatic-documentation
```
{% endtab %}
{% endtabs %}

Your output will look as shown in below (a few lines have been deleted in the interest of brevity).
```
API Specification Summary: service.yaml
  OpenAPI Version: 3.0.1
  API Paths: 1, API Operations: 1

Executing 1 tests

--------------------
  Request to https://my-json-server.typicode.com/znsio/specmatic-documentation at 2024-2-12 1:54:58.570
    GET /znsio/specmatic-documentation/pets/1
    

  Response at 2024-2-12 1:54:58.572
    200 OK
    Content-Type: application/json; charset=utf-8
    {
        "id": 1,
        "name": "Scooby",
        "type": "Golden Retriever",
        "status": "Adopted"
    }


Tests run: 1/1 (100%)

 Scenario: GET /pets/(petid:number) -> 200 | EX:SCOOBY_200_OK has SUCCEEDED

Could not load report configuration, coverage will be calculated but no coverage threshold will be enforced
|----------------------------------------------------------------------|
| API COVERAGE SUMMARY                                                 |
|----------------------------------------------------------------------|
| coverage | path          | method | response | # exercised | remarks |
|----------|---------------|--------|----------|-------------|---------|
|     100% | /pets/{petid} | GET    |      200 |           1 | covered |
|----------------------------------------------------------------------|
| 100% API Coverage reported from 1 path                               |
|----------------------------------------------------------------------|


Saving Open API Coverage Report json to ./build/reports/specmatic ...
Tests run: 1, Successes: 1, Failures: 0, Errors: 0
```

#### Understanding the output

* Specmatic parsed your API specification and printed a brief `API Specification Summary`
* Then it generated and started `Executing 1 tests` because our API specification contains only one endpoint with a single GET operation
* Specmatic then logged the `HTTP Request` that it generated and the `HTTP response` it received from the API implementation
* And finally it prints out the test results along with an API Coverage Report (Read our detailed post on [API Coverage Report](https://specmatic.in/updates/detect-mismatches-between-your-api-specifications-and-implementation-specmatic-api-coverage-report/#gsc.tab=0) to know more.)

#### Where did Specmatic get the test data to generate the HTTP request

How did Specmatic know to make the exact request to ```GET /znsio/specmatic-documentation/pets/1``` with petId as "1"? And not just any other number?

In the OpenAPI spec you may have noticed that there is an examples section for `petid` with a named example called `SCOOBY_200_OK`.

```yaml
  - name: "petid"
    in: "path"
    required: true
    schema:
      type: "number"
    examples:
      SCOOBY_200_OK:
        value: 1
```

Remove the examples section such that the `petid` param look as shown below.

```yaml
  - name: "petid"
    in: "path"
    required: true
    schema:
      type: "number"
```

And try running the specmatic test command again.

{% tabs test3 %}
{% tab test3 java %}
```shell
specmatic test service.yaml --testBaseURL=https://my-json-server.typicode.com/znsio/specmatic-documentation
```
{% endtab %}
{% tab test3 npm %}
```shell
npx specmatic test service.yaml --testBaseURL=https://my-json-server.typicode.com/znsio/specmatic-documentation
```
{% endtab %}
{% tab test3 docker %}
```shell
 docker run -v "/local-directory/service.yaml:/service.yaml" znsio/specmatic test "/service.yaml" --testBaseURL=https://my-json-server.typicode.com/znsio/specmatic-documentation
```
{% endtab %}
{% endtabs %}

This will result in a test failure because the sample application returns a `404`.

```
Unsuccessful Scenarios:
  " Scenario: GET /pets/(petid:number) -> 200 FAILED"
        Reason: Testing scenario "Should be able to get a pet by petId. Response: Should be able to get a pet by petId"
        API: GET /pets/(petid:number) -> 200
  
          >> RESPONSE.STATUS
          
             Expected status 200, actual was status 404

Tests run: 1, Successes: 0, Failures: 1, Errors: 0
```

This is because we removed the named example `SCOOBY_200_OK`, Specmatic generated a random petId based on the datatype of the petId path parameter. And since test data does not exist for this petId in the sample application, we get a 404.
```shell
--------------------
  Request to https://my-json-server.typicode.com/znsio/specmatic-documentation at 2024-2-11 5:44:5.791
    GET /znsio/specmatic-documentation/pets/318
```

Once you restore the OpenAPI file to its [original state](/getting_started.html#api-specification) (add back the example petId value) the tests should start passing again.

#### How does this all work?

* Specmatic is able to tie the **named example** `SCOOBY_200_OK` listed under the request parameters and the response sections of the OpenAPI spec to create a test.
* This is also reflected in the name of the test where Specmatic displays the `SCOOBY_200_OK` in the test logs

`Scenario: GET /pets/(petid:number) -> 200 | EX:SCOOBY_200_OK has SUCCEEDED`

#### What happens when OpenAPI goes out of sync with the application or vice versa?

Now lets try something more interesting and change the datatype of the "status" field of response in OpenAPI file to "number" and save it.

```yaml
  properties:
    status:
      type: "number"
```

Let us run the specmatic test command again.
{% tabs test2 %}
{% tab test2 java %}
```shell
specmatic test service.yaml --testBaseURL=https://my-json-server.typicode.com/znsio/specmatic-documentation
```
{% endtab %}
{% tab test2 npm %}
```shell
npx specmatic test service.yaml --testBaseURL=https://my-json-server.typicode.com/znsio/specmatic-documentation
```
{% endtab %}
{% tab test2 docker %}
```shell
 docker run -v "/local-directory/service.yaml:/service.yaml" znsio/specmatic test "/service.yaml" --testBaseURL=https://my-json-server.typicode.com/znsio/specmatic-documentation
```
{% endtab %}
{% endtabs %}
This time around the test fails because the response from our sample app is not in line with the OpenAPI Specification.
```shell
Unsuccessful Scenarios:
  " Scenario: GET /pets/(petid:number) -> 200 | EX:SCOOBY_200_OK FAILED"
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

### Consumer Side - Contract As A Stub / Intelligent Service Virtualization

We have so far established that Specmatic will keep OpenAPI spec and the API implementation in sync. This gives us the confidence to use the same OpenAPI spec `service.yaml` on the Consumer side for **Intelligent Service Virtualization** with Specmatic. This will help us isolate our UI development and make progress independent of the Provider / API. Here is a sequence diagram illustrating the same where UI no longer has to interact with the real backend for testing purposes. UI can instead rely on Specmatic Stub which is emulating the Provider / API.

    UI (Consumer)         Specmatic Stub <- service.yaml
          | --- getPetById ---> |
          | <-- {Pet JSON} ---- |

Before we begin, please make sure that your `service.yaml` file is restored to its [original state](/getting_started.html#api-specification).

To spin up a stub server with the service.yaml we authored earlier, run below command.
{% tabs stub %}
{% tab stub java %}
```shell
specmatic stub service.yaml
```
{% endtab %}
{% tab stub npm %}
```shell
npx specmatic stub service.yaml
```
{% endtab %}
{% tab stub docker %}
```shell
docker run -v "/local-directory/service.yaml:/service.yaml" -p 9000:9000 znsio/specmatic stub "/service.yaml"
```
{% endtab %}
{% endtabs %}

This should start your stub server on port 9000 by default as below.

```shell
Loading service.yaml
API Specification Summary: service.yaml
  OpenAPI Version: 3.0.1
  API Paths: 1, API Operations: 1


Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```

**Tip:** You can switch the port number by adding ```--port <port of your choice>``` in the command.

{% tabs stub-custom-port %}
{% tab stub-custom-port java %}
```shell
specmatic stub service.yaml --port 9002
```
{% endtab %}
{% tab stub-custom-port npm %}
```shell
npx specmatic stub service.yaml --port 9002
```
{% endtab %}
{% tab stub-custom-port docker %}
```shell
# Note that --port 9002 at the end of the command is crucial. It ensures that the stub 
# server inside the Docker container is listening on the same port (9002) that's being
# mapped to port 9000 on your machine. If these ports don't match, you won't be able to
# access the stub server from your machine.
docker run -v "/local-directory/service.yaml:/service.yaml" -p 9000:9002 znsio/specmatic stub "/service.yaml" --port 9002
```
{% endtab %}
{% endtabs %}

Once the stub server is running you can verify the API by accessing it through Postman, Chrome, Curl etc.

```shell
curl http://localhost:9000/pets/123
```

You should now be able to see the response that matches the schema defined in your OpenAPI spec.

```shell
{
    "id": 864,
    "name": "VRIQA",
    "type": "KPNDQ",
    "status": 990
}
```

The response contains auto-generated values that adhere to the data type defined in the contract. In above output petid "864" is generated by specmatic and will vary with every execution.

However for petId 1, it will always return below values.
```shell
{
    "id": 1,
    "name": "Scooby",
    "type": "Golden Retriever",
    "status": "Adopted"
}
```

This is because the example `SCOOBY_200_OK` in the `service.yaml` spec file, which we earlier saw being used while running contract test, also serves a stub data when we run Specmatic stub.

With this we have effectively archived three goals in one go.
* Examples serve as sample data for people referring to the API specification as documentation
* The same examples are used in contract tests to create the HTTP request
* And these examples also serve as stub data when we run Spemcatic stub command

#### **Intelligent Service Virtualization**

Let us try a few experiments. Remove the `status` field in the `200_OKAY` response example in `service.yaml` (the very last line in that file) and run the stub command again.

```yaml
examples:
  200_OKAY:
    value:
      id: 1
      type: "Golden Retriever"
      name: "Scooby"
      status: "Adopted" # Remove this line
```

The stub server will auto reload your `service.yaml` file as soon as you save it. And you should see an output as shown below.

```bash
Loading service.yaml
API Specification Summary: service.yaml
  OpenAPI Version: 3.0.1
  API Paths: 1, API Operations: 1


[Example SCOOBY_200_OK]: Error from contract service.yaml

  In scenario "Should be able to get a pet by petId. Response: Should be able to get a pet by petId"
  API: GET /pets/(petid:number) -> 200
  
    >> RESPONSE.BODY.status
  
       key named status in the spec was not found in the "SCOOBY_200_OK" example
```

Specmatic rejects the expectation / canned response since it is not in line with the OpenAPI Specification.

#### **Externalizing stub responses**

Please restore `service.yaml` to its [original state](/getting_started.html#api-specification)(by adding back the `status` field in the `SCOOBY_200_OK` example) before proceeding with this section.

If you would like to add more stub responses, however you do not wish to bloat your specification with a lot of examples, we can also externalize the stub / canned responses to json files also.
* Create a folder named `service_data` in the same folder as your `service.yaml` file (`_data` suffix is a naming convention that tell Specmatic to look for canned responses in that directory)
* Create a json file with the name `togo.json` and add below contents to it

```json
{
    "http-request": {
        "path": "/pets/2",
        "method": "GET"
    },
    "http-response": {
        "status": 200,
        "body": {
            "id": 2,
            "name": "Togo",
            "type": "Siberian Husky",
            "status": "Adopted"
        },
        "status-text": "OK"
    }
}
```

Now let us run the stub command again.
{% tabs stub2 %}
{% tab stub2 java %}
```shell
specmatic stub service.yaml
```
{% endtab %}
{% tab stub2 npm %}
```shell
npx specmatic stub service.yaml
```
{% endtab %}
{% tab stub2 docker %}
```shell
# Please note docker command here has to volume map the directory containing service.yaml 
# to a directory within the container so that both service.yaml and folder service_data along 
# with togo.json are available to Specmatic docker container
docker run -v "/local-directory/:/specs" -p 9000:9000 znsio/specmatic stub "/specs/service.yaml"
```
{% endtab %}
{% endtabs %}

This time you should see Specmatic load your canned response file also.
```shell
Loading service.yaml
API Specification Summary: service.yaml
  OpenAPI Version: 3.0.1
  API Paths: 1, API Operations: 1

  Loading stub expectations from /Users/harikrishnan/projects/agilefaqs/ContractTesting/ExamplesAsTestAndStub/service_data
  Reading the following stub files:
    /Users/harikrishnan/projects/agilefaqs/ContractTesting/ExamplesAsTestAndStub/service_data/togo.json

Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```

Once the stub server is running you can verify the API by accessing it through Postman, Chrome, Curl etc.

```shell
curl http://localhost:9000/pets/2
```

You should now be able to see the data pertaining to the `togo.json` file that you added.

```shell
{
    "id": 2,
    "name": "Togo",
    "type": "Siberian Husky",
    "status": "Adopted"
}
```

Specmatic validates this externalized stub JSON file `togo.json` against the `service.yaml`. Let us try this by removing the `status` field within http-response body in `togo.json` and run the stub command again. 

{% tabs stub3 %}
{% tab stub3 java %}
```shell
specmatic stub service.yaml
```
{% endtab %}
{% tab stub3 npm %}
```shell
npx specmatic stub service.yaml
```
{% endtab %}
{% tab stub3 docker %}
```shell
# Please note docker command here has to volume map the directory containing service.yaml 
# to a directory within the container so that both service.yaml and folder service_data along 
# with togo.json are available to Specmatic docker container
docker run -v "/local-directory/:/specs" -p 9000:9000 znsio/specmatic stub "/specs/service.yaml"
```
{% endtab %}
{% endtabs %}

You should see an output like below.

```shell
Loading stub expectations from /Users/harikrishnan/projects/agilefaqs/ContractTesting/ExamplesAsTestAndStub/service_data
  Reading the following stub files:
    /Users/harikrishnan/projects/agilefaqs/ContractTesting/ExamplesAsTestAndStub/service_data/togo.json
  /Users/harikrishnan/projects/agilefaqs/ContractTesting/ExamplesAsTestAndStub/service_data/togo.json didn't match service.yaml
    Error from contract service.yaml
  
      In scenario "Should be able to get a pet by petId. Response: Should be able to get a pet by petId"
      API: GET /pets/(petid:number) -> 200
  
        >> RESPONSE.BODY.status
  
           Key named status in the contract was not found in the stub

Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```

Specmatic again rejects the expectation / canned response since it is not in line with the OpenAPI Specification.

We can now start consumer development against this stub without any dependency on the real API.

To know more about **Intelligent Service Virtualization** please refer to below video demos
* [Video: Intelligent Service Virtualization](https://youtu.be/U5Agz-mvYIU?t=750)
* [Video: Dynamic Mocking](https://youtu.be/U5Agz-mvYIU?t=908)

[**Learn more about Stubbing / Smart Mocks here.**](/documentation/service_virtualization_tutorial.html)
