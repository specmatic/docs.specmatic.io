---
layout: default
title: Service Virtualization Tutorial
parent: Documentation
---
Service Virtualization Tutorial
===============================

- [Service Virtualization Tutorial](#service-virtualization-tutorial)
  - [Pre-requisites](#pre-requisites)
  - [Stub Out The Product Service](#stub-out-the-product-service)
  - [Fix The Response To /products/10](#fix-the-response-to-products10)
  - [Add A Second Expectation](#add-a-second-expectation)
  - [Generate The SKU](#generate-the-sku)
  - [Try Setting Up An Invalid Expectation](#try-setting-up-an-invalid-expectation)
  - [Stubbing Out The Request](#stubbing-out-the-request)
  - [Accept Any Value For "name" and "sku" And Return A Random Id](#accept-any-value-for-name-and-sku-and-return-a-random-id)
  - [Generating Expecations / Stub JSONs](#generating-the-stub-files)
  - [SSL / Https support](#ssl--https--stubbing)
  - [Sample Java Project](#sample-java-project)

## Pre-requisites

Let's prepare to try out service virtaulization step-by-step.

- [Download the latest version of Specmatic](https://specmatic.in/download/latest.html).
- Create a file named products-api.yaml on your laptop with the following contents.

```yaml
openapi: 3.0.0
info:
  title: Sample Product API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9
servers:
  - url: http://localhost:8080
    description: Local
paths:
  /products/{id}:
    get:
      summary: Get Products
      description: Get Products
      parameters:
        - in: path
          name: id
          schema:
            type: number
          required: true
          description: Numerical Product Id
      responses:
        '200':
          description: Returns Product With Id
          content:
            application/json:
              schema:
                type: object
                required:
                  - name
                  - sku
                properties:
                  name:
                    type: string
                  sku:
                    type: string
  /products:
    post:
      summary: Add Product
      description: Add Product
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - sku
              properties:
                name:
                  type: string
                sku:
                  type: string
      responses:
        '200':
          description: Returns Product With Id
          content:
            application/json:
              schema:
                type: object
                required:
                  - id
                properties:
                  id:
                    type: integer

```

- Create a directory named products-api_data in which we will place these stubs.

## Stub Out The Product Service

* Run `java -jar specmatic.jar product-api.yaml`
* Use postman to make a request to http://localhost:9000/products/10

Specmatic returns a contract valid response. The values are randomly generated. We have not yet told Specmatic how to handle this request.

## Fix The Response To /products/10

* Create a file named expectation.json, inside products-api_data, with the following contents:

```json
{
  "http-request": {
    "method": "GET",
    "path": "/products/10"
  },
  "http-response": {
    "status": 200,
    "body": {
      "name": "Soap",
      "sku": "abc123"
    }
  }
}
```

* Wait a few seconds for Specmatic to load the file.
* Make the above request again from Postman.

## Add A Second Expectation

* Rename the above json file to soap.expectation
* Create a new json file named batteries.json in the same directory with the following data:

```json
{
  "http-request": {
    "method": "GET",
    "path": "/products/20"
  },
  "http-response": {
    "status": 200,
    "body": {
      "name": "Batteries",
      "sku": "abc123"
    }
  }
}
```

* Make a request to http://localhost:9000/products/20.

## Generate The SKU

We don't care at the moment what the SKU is, but the one for Batteries is the same as the one for SOAP, and they should be different. Let's fix that.

* In soap.json, put the value "(string)" against "sku" instead of "abc123".
* Do the same in batteries.json.

Make an API call to http://localhost:9000/products/10 and then http://localhost:9000/products/20. Note that their SKUs are now randomly generated, and different.

## Try Setting Up An Invalid Expectation

Let's see what happens when our expectations of the API response do not align with the contract.

* Create a third file named pencils.json, with the following contents.

```json
{
  "http-request": {
    "method": "GET",
    "path": "/products/30"
  },
  "http-response": {
    "status": 200,
    "body": {
      "name": "Pencils",
      "sku": 12345
    }
  }
}
```

* Wait for Specmatic to pick up the new file.

Note how Specmatic highlights
* The path to the error
* The reason for the error.

## Stubbing Out The Request

* Create a new file named book.json

```json
{
  "http-request": {
    "method": "POST",
    "path": "/products",
    "body": {
      "name": "Book",
      "sku": "pqr456"
    }
  },
  "http-response": {
    "status": 200,
    "body": {
      "id": 40
    }
  }
}
```

* Make a POST API call to http://localhost:9000/products, with the JSON body {"name": "Book", "sku": "pqr456"}

You should get a 200 response with a json body containing "id" 40.

## Accept Any Value For "name" and "sku" And Return A Random Id

* Create a new file named any.json

```json
{
  "http-request": {
    "method": "POST",
    "path": "/products",
    "body": {
      "name": "(string)",
      "sku": "(string)"
    }
  },
  "http-response": {
    "status": 200,
    "body": {
      "id": "(number)"
    }
  }
}
```

* Make a POST API call to http://localhost:9000/products, with the JSON body {"name": "any name here", "sku": "any sku value here"}

You should get a 200 response with a JSON body containing a randomized "id".

## Generating the stub files

Authoring the expecations / stub jsons by hand may be hard / time consuming when the API operation has a large response. Instead you can run the stub server with below option to log the request and response data sample which you can then leverage as a starting point to create custom expectations.

```shell
java -jar specmatic.jar stub products-api.yaml --jsonConsoleLog
```

Send a request to this server.

```shell
curl http://localhost:9000/products/1
```

And you can now see the request and response logged in the console where Specmatic stub server is running.

```shell
{
    #...
    "http-request": {
        "path": "/products/1",
        "method": "GET",
        "headers": {
            "Host": "localhost:9000",
            "User-Agent": "curl/7.84.0",
            "Accept": "*/*"
        },
        "body": ""
    },
    "http-response": {
        "status": 200,
        "body": {
            "name": "HCCPY",
            "sku": "CYCOA"
        },
        "status-text": "OK",
        "headers": {
            "X-Specmatic-Result": "success",
            "Content-Type": "application/json",
            "X-Specmatic-Type": "random"
        }
    },
    #...
}
```

This log contains the entire information about the request and response. We just need to copy the "http-request" and "http-response", remove non-mandatory headers etc. and modify it as per our needs.  

## SSL / Https  stubbing

There are multiple ways to run the Specmatic Stub with SSL.

### Autogenerated Cert Store

This is the quickest approach.

```shell
java -jar specmatic.jar stub --httpsKeyStoreDir=<directory to create keysore> --port=443 product-api.yaml
```

This will create a `specmatic.jks` file in the dir that you mentioned above and you can now access the stub over https.

### Bring your own key store

If you already have a keystore and self signed certificate you can pass it to Specmatic through below command options.

```shell
% specmatic stub --help
...
      --httpsKeyStore=<keyStoreFile>
                             Run the proxy on https using a key in this store
      --httpsKeyStorePassword=<keyStorePassword>
                             Run the proxy on https, password for pre-existing
                               key store
      --httpsPassword=<keyPassword>
                             Key password if any
```

## Sample Java Project

https://github.com/znsio/specmatic-order-ui

