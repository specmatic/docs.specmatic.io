---
layout: default
title: Generating API Specifications
parent: Documentation
nav_order: 11
---
Generating API Specifications
=============================

- [Generating API Specifications](#generating-api-specifications)
  - [From an existing application using proxy mode](#from-an-existing-application-using-proxy-mode)
    - [Start the proxy](#start-the-proxy)
    - [Generate contracts](#generate-contracts)
  - [From a sample request and response](#from-a-sample-request-and-response)
    - [Create the sample file](#create-the-sample-file)
    - [Convert the sample into a contract](#convert-the-sample-into-a-contract)
  - [Importing a Postman collection](#importing-a-postman-collection)
    - [Export the collection](#export-the-collection)
    - [Generate the contract](#generate-the-contract)
    - [Authenticated APIs in Postman](#authenticated-apis-in-postman)

## From an existing application using proxy mode

\
![](/images/specmatic-reverse-proxy.svg)

Specmatic acts as a transparent proxy between the client (Postman, your application, etc) and the API.

Let's use the freely provided (again many thanks to its maintainer) test employee API that we used above.

### Start the proxy

```bash
> specmatic proxy --target http://dummy.restapiexample.com ./contracts
Proxy server is running on http://localhost:9000. Ctrl + C to stop.```
```

Make sure the contracts directory does not exist.

### Check the health status of the proxy server (Optional)


You can use the `/actuator/health` endpoint to verify if the proxy server is operational. To do this, send a GET request to this endpoint using Postman or a curl command. 

The response will provide the current health status of the proxy server, indicating whether it is **ready to handle requests**. 
This allows you to confirm that the proxy server is up before routing any traffic through it.

#### Example curl Request:
```shell
curl -X GET http://localhost:9000/actuator/health
# Example successful response:
# {
#   "status": "UP"
# }
```

Here's the OpenAPI specification describing the `/actuator/health` endpoint.
```yaml
openapi: 3.0.3
info:
  title: Health Check API
  description: API for checking the health status of the proxy server.
  version: 1.0.0
paths:
  /actuator/health:
    get:
      description: Returns the health status of the proxy server.
      responses:
        '200':
          description: Health status of the proxy server.
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum:
                      - UP
                    example: UP
```

### Generate contracts

Now use Postman to send a request to Specmatic. Create a new Postman request to make a GET request to http://localhost:9000/api/v1/employees

Finally, kill the proxy using Ctrl+C on the command prompt, and it will generate contracts from all the reqeusts and responses it has seen, in the directory that you specify (which is ./contracts in the above example).

You will see something like this:
```bash
Writing contract to ./contracts/new_feature.yaml
Writing stub data to ./contracts/stub0.json
```

You can alternatively hit the [/_specmatic/proxy/dump](#dumping-the-contracts-and-examples-using-the-dump-endpoint) endpoint without killing the proxy server to dump this data into the output directory (e.g. `./contracts`).

Specmatic can identify parameters in URL path based on the traffic passing through it.
For example: If you send two requests, ```/employees/10``` and ```/employees/20```, Specmatic will figure out that URL path should be ```/empoyees/{id}``` where id could be any number, and will add an appropriate path parameter in the specification.

So we recommend making atleast two requests in such cases to provide Specmatic with enough data to idenitify such path parameters.

## Dumping the contracts and examples using the dump endpoint

To dump the contracts and examples while the proxy server is running, use the `/_specmatic/proxy/dump` endpoint. When a POST request is made to this endpoint, it triggers Specmatic to generate and save the current contracts and examples into the specified output directory.

**OpenAPI Specification for `/_specmatic/proxy/dump` Endpoint:**

```yaml
openapi: 3.0.3
info:
  title: Specmatic Proxy API
  description: API for interacting with the Specmatic proxy server.
  version: 1.0.0
paths:
  /_specmatic/proxy/dump:
    post:
      summary: Start Dump Process for Contract and Examples
      description: Initiates the process to dump the current state of the contract and examples into the specified output directory. The process is handled in the background.
      responses:
        '202':
          description: Dump process started
          content:
            text/plain:
              schema:
                type: string
                example: "Dump process of spec and examples has started in the background"
```

**Sample `curl` Command:**

To trigger the dump of contracts and examples, use the following `curl` command:

```bash
curl -X POST http://localhost:9000/_specmatic/proxy/dump
```

This command sends a POST request to the `/_specmatic/proxy/dump` endpoint, which will result in Specmatic generating and saving the contracts and examples into the specified output directory.
In case the contracts and examples are not generated in the output directory, look at the proxy server logs to debug the same.

By using the `/_specmatic/proxy/dump` endpoint, you can efficiently generate and review contracts without interrupting the proxy server.

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
