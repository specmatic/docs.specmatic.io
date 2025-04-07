---
layout: default
title: Generating API Specifications
parent: Documentation
nav_order: 11
---
Generating API Specifications
=============================

- [Generating API Specifications](#generating-api-specifications)
  - [From an existing application using Proxy Mode](#from-an-existing-application-using-proxy-mode)
    - [Step 1: Start the Proxy Server](#step-1-start-the-proxy-server)
    - [Step 2: Verify Proxy Health (Optional)](#step-2-verify-proxy-health-optional)
    - [Step 3: Send Test Requests](#step-3-send-test-requests)
        - [Request 1: Get pet with ID 1](#request-1-get-pet-with-id-1)
        - [Request 2: Get pet with ID 100](#request-2-get-pet-with-id-100)
    - [Step 4: Generate the Contract and Examples](#step-4-generate-the-contract-and-examples)
    - [Generated Contract Example](#generated-contract-example)
    - [Final Directory Structure](#final-directory-structure)
  - [What You've Accomplished](#what-youve-accomplished)
  - [Next Steps](#next-steps)
  - [From a sample request and response](#from-a-sample-request-and-response)
    - [Create the sample file](#create-the-sample-file)
    - [Convert the sample into a contract](#convert-the-sample-into-a-contract)
  - [Importing a Postman collection](#importing-a-postman-collection)
    - [Export the collection](#export-the-collection)
    - [Generate the contract](#generate-the-contract)
    - [Authenticated APIs in Postman](#authenticated-apis-in-postman)

## From an existing application using Proxy Mode
---

![](/images/specmatic-reverse-proxy.svg)

Specmatic acts as a transparent proxy between the client (Postman, your application, etc) & the API.

### Step 1: Start the Proxy Server
Let's begin by setting up Specmatic as a proxy between your client and the API:

Using CLI:
```shell
specmatic proxy --target https://dummyjson.com ./specification
```

OR

Using docker:
```shell
docker run -p 9000:9000 -v "$PWD/specification:/specification" znsio/specmatic proxy --target=https://dummyjson.com /specification
```

You will get following confirmation message: <br> `Proxy server is running on http://localhost:9000. Ctrl + C to stop.`

🐳 Docker Usage Tip: When running the Proxy command with Docker, ensure the target URL matches your Docker network mode. For example, use host.docker.internal to refer to a server running on the host machine (Windows and Mac).

💡 Specification Directory Reminder: Ensure the specification directory does not exist before starting. Specmatic will generate specifications here.

### Step 2: Verify Proxy Health (Optional)
You can confirm the proxy server is running properly by checking its health status:

```shell
curl -X GET http://localhost:9000/actuator/health
```
```
# Expected Response:
{
    "status": "UP"
}
```

### Step 3: Send Test Requests
Let's send a couple of requests through the proxy to help Specmatic identify path parameters. Here are two example requests:

##### Request 1: Get pet with ID 1
```bash
curl -X GET http://localhost:9000/todos/1
```

##### Request 2: Get pet with ID 100
```bash
curl -X GET http://localhost:9000/todos/100
```

### Step 4: Generate the Contract and Examples
You have two options to generate the specification:

1. **Option A**: Kill the proxy server using `Ctrl + C`
2. **Option B**: Hit the dump endpoint:
   ```bash
   curl -X POST http://localhost:9000/_specmatic/proxy/dump
   ```
In case the specification and examples are not generated in the output directory, look at the proxy server logs to debug the same.

By using the `/_specmatic/proxy/dump` endpoint, you can efficiently generate and review specification without interrupting the proxy server.

🎉 **Success!** You should see output like this:
```bash
Writing stub data to todos_1_GET_200_1.json
Writing stub data to todos_100_GET_200_2.json
Writing specification to proxy_generated.yaml
```

**Note:** The HTTP server sometimes sends back additional data such as additional headers which may or may not be useful depending on the use-case. So you can remove those additional keys from the specification and stub data recorded by the proxy.

### Generated Contract Example
Here's what your generated specification might look like:

```yaml
openapi: 3.0.1
info:
  title: New feature
  version: "1"
paths:
  /todos/{id}:
    get:
      summary: GET /todos/1
      parameters:
      - name: id
        in: path
        required: true
        schema:
          type: number
      responses:
        "200":
          description: GET /todos/1
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/1_ResponseBody"
components:
  schemas:
    "1_ResponseBody":
      required:
      - completed
      - id
      - todo
      - userId
      properties:
        id:
          type: number
        todo:
          type: string
        completed:
          type: boolean
        userId:
          type: number

```

### Final Directory Structure
```
specification/
├── proxy_generated.yaml               # Main specification file
└── proxy_generated_examples/          # Folder containing examples 
    ├── todos_1_GET_200_1.json                     
    └── todos_100_GET_200_2.json                     
```

Example stub content might look like the following (todos_1_GET_200_1.json):
```json
{
    "http-request": {
        "path": "/todos/1",
        "method": "GET"
    },
    "http-response": {
        "status": 200,
        "body": {
            "id": 1,
            "todo": "Do something nice for someone you care about",
            "completed": false,
            "userId": 152
        },
        "status-text": "OK"
    }
}
```

💡 **Note**: The more traffic routed through the proxy, the better it becomes at accurately defining data types for the specification.

## What You've Accomplished
✔️ Set up a Specmatic proxy server  
✔️ Verified the proxy's health status  
✔️ Generated test traffic with multiple request examples  
✔️ Created OpenAPI specifications automatically  
✔️ Generated stub response files for testing  

## Next Steps
- Try adding more complex requests with different HTTP methods (POST, PUT, etc.)
- Customize the generated specifications
- Use the generated specification for API testing or documentation

Need help troubleshooting or have questions? Reach out to us [Specmatic support](https://specmatic.io/contact-us/).

---

## From a sample request and response

If you know what the request and response should look like, you can start by creating a file with the sample request and response.

### Create the sample file

The file must contain a single JSON object using the [Specmatic stub file format](/documentation/test_data_format.html).

Here's a sample file that contains a request for the name of a customer by id:

File: customer_stub.json
```json
{
  "http-request": {
    "method": "GET",
    "path": "/customer/name",
    "query": {
      "name": 10
    }
  },
  "http-response": {
    "status": 200,
    "body": "Jane Doe"
  }
}
```

### Convert the sample into a contract

Now run the `specmatic import stub` command on it:

```bash
> specmatic import <stub file>.json
Written to file /Users/xyz/customer_stub.yaml
```

## Importing a Postman collection

This is useful when you have a Postman collection which you use to test your service. Well now you can also convert that collection into a contract.

### Export the collection

First you must [export the collection to a file](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#exporting-postman-data). Use v2.1 when doing so.

Here's a sample Postman collection that you can use:

File: employee_postman_collection.json
```json
{
        "info": {
                "_postman_id": "042689b4-61dc-4697-85e6-72d47adc0678",
                "name": "Free Test API",
                "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "item": [
                {
                        "name": "Employee data",
                        "request": {
                                "method": "GET",
                                "header": [],
                                "url": {
                                        "raw": "http://dummy.restapiexample.com/api/v1/employees",
                                        "protocol": "http",
                                        "host": [
                                                "dummy",
                                                "restapiexample",
                                                "com"
                                        ],
                                        "path": [
                                                "api",
                                                "v1",
                                                "employees"
                                        ]
                                }
                        },
                        "response": []
                }
        ],
        "protocolProfileBehavior": {}
}
```

### Generate the contract

```bash
> specmatic import <postman collection file>.json
```
_*Note:*_ The file name should end with `postman_collection.json` like `employee_postman_collection.json`.

This command will read the Postman collection, and write the new specmatic file into "specmatic file.json" as specified in the command.

### Authenticated APIs in Postman

If any of the APIs in the Postman collection require authentication, Specmatic will not be able to invoke them directly with the needed credentials.

Instead, from within Postman, plug in in the required credentials, invoke the API, and save the request and response as an example.

Then export the collection, and import it into Specmatic.

Specmatic will still fail to invoke the API, but it will see and convert the examples. You can then adjust the contract as needed.
