---
layout: default
title: Getting Started with OpenAPI
parent: Documentation
nav_order: 24
---
Getting Started with OpenAPI
============================

## Command Line Setup

The quickest approach to getting started is through the command line.

{% include setup_command_line.md %}

## Sample OpenAPI spec to get you started

Create a file named "products.yaml" with below contents. This is a fairly simple API spec with a GET and POST operation to get a product by id and create a new Product. You can import it into Postman as a Collection or copy paste the contents and view it [editor.swagger.io](://editor.swagger.io).

```yaml
openapi: 3.0.0
info:
  title: Order API
  version: '1.0'
servers:
  - url: 'http://localhost:3000'
paths:
  '/products/{id}':
    parameters:
      - schema:
          type: number
        name: id
        in: path
        required: true
    get:
      summary: Fetch product details
      tags: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          description: Not Found
  /products:
    post:
      summary: Add new product
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductId'
      parameters:
        - schema:
            type: string
          in: header
          name: Authenticate
          required: true
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductDetails'
components:
  schemas:
    ProductDetails:
      title: Product Details
      type: object
      properties:
        name:
          type: string
        type:
          $ref: '#/components/schemas/ProductType'
        inventory:
          type: integer
      required:
        - name
        - type
        - inventory
    ProductType:
      type: string
      title: Product Type
      enum:
        - book
        - food
        - gadget
        - other
    ProductId:
      title: Product Id
      type: object
      properties:
        id:
          type: integer
      required:
        - id
    Product:
      title: Product
      allOf:
        - $ref: '#/components/schemas/ProductId'
        - $ref: '#/components/schemas/ProductDetails'
```

## Stub mode - Smart Service Virtualisation

Now you can run a stub server by running below command.

```shell
$ java -jar <path to specmatic jar>/specmatic.jar stub products.yaml
Loading products.yaml
Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```

You should now be able to see the stub server running on your local machine on port 9000 as shown above.

Run below curl command or hit the URL [http://localhost:9000/products/1](http://localhost:9000/products/1) to get an auto-generated stub response.

```shell
$ curl -X GET http://localhost:9000/products/1                                              
{
    "id": 408,
    "name": "DKKJF",
    "type": "book",
    "inventory": 321
}
```

Now you can try the POST call. Experiment with below call by removing headers, changing data types etc. in the request and observe the errors.

```shell
$ curl -X POST --header "Content-Type: application/json" --header "Authenticate: token" --header "Accept: application/json" -d '{"name": "transmogrifier", "type": "gadget", "inventory": 93412555}' http://localhost:9000/products
{
    "id": 478
}
```

You can also [import the "products.yaml" into Postman](https://blog.postman.com/postman-supports-openapi-3-0/) as a Collection. Just remember to set base URL to host and port where Specmatic is running.

### Static Stub Responses

In certain use cases it may be necessary to set up the Specmatic Stub server to return a specific response given a combination of request parameters.
* Create a folder with name "products_data" in the same location where the "products.yaml" file exists.
* Specmatic will be able to associate this folder with the spec file based on naming convention and load any stub files within that folder.
* Create a json file below content inside "products_data". For example: "air-jordans.json"
```json
{
    "http-request": {
        "path": "/products/1",
        "method": "GET"
    },
    "http-response": {
        "status": 200,
        "body": {
            "id": 1,
            "name": "Air Jordan Sports Sneakers",
            "type": "gadget",
            "inventory": 6
        },
        "status-text": "OK",
        "headers": {
            "Content-Type": "application/json"
        }
    }
}
```
* Start Specmatic Stub Server and you will notice the stub file being read.
```shell
$ java -jar <path to specmatic jar>/specmatic.jar stub products.yaml
Loading products.yaml
  Loading stub expectations from <path to openapi spec>/products_data
  Reading the following stub files:
    <path to openapi spec>/air-jordans.json
Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```
* Now when you run a curl to get Product Id 1, you will always get the response that you have added in JSON file. Any Product Id other than 1 will continue to return auto-generated response.
```shell
$ curl -X GET http://localhost:9000/products/1                                             
{
    "id": 1,
    "name": "Air Jordan Sports Sneakers",
    "type": "gadget",
    "inventory": 6
}
```
* Update the "air-jordans.json" file and change type attribute value from "gadget" to "shoe".
* Now if you start the Specmatic Server (if it is already running just observe the shell) you will notice that "air-jordans.json" will throw an error because it is not as the "products.yaml" ("type" enum does not have "shoe").
```shell
$ java -jar <path to specmatic jar>/specmatic.jar stub products.yaml
Loading products.yaml
  Loading stub expectations from <path to openapi spec>/products_data
  Reading the following stub files:
    <path to openapi spec>/products_data/air-jordans.json
  <path to openapi spec>/products_data/air-jordans.json didn\'t match products.yaml
    In scenario "Open API - Operation Summary: Fetch product details. Response: OK"
    >> RESPONSE.BODY.type

    Expected ("book" or "food" or "gadget" or "other"), Actual was string: "shoe"
Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```
* By verifying stub jsons against their corresponding OpenAPI specs Specmatic makes sure the spec and stub data remain in sync

**Error Response**

* Create a json file below content inside "products_data". For example: "404.json"
```json
{
    "http-request": {
        "path": "/products/0",
        "method": "GET"
    },
    "http-response": {
        "status": 404,
        "status-text": "NOT FOUND",
        "headers": {
            "Content-Type": "application/json"
        }
    }
}
```
* Start Specmatic Stub Server and you will notice both stub files being read.
```shell
$ java -jar <path to specmatic jar>/specmatic.jar stub products.yaml --verbose
Loading products.yaml
Parsing contract file products.yaml, absolute path <path to openapi spec>/products.yaml
  Loading stub expectations from <path to openapi spec>/products_data
  Reading the following stub files:
    <path to openapi spec>/products_data/air-jordans.json
    <path to openapi spec>/products_data/404.json
Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```
* Now when you run a curl to get Product Id 0, you will always get the 404 NOT FOUND response that you have added in JSON file.
* You can only stub the errors that are already in OpenAPI spec. Example: Specmatic will not allow you to stub a 403 response until you add it to the "products.yaml" as a possible response.

## OpenAPI File Upload and Multipart Forms

The support is as per [OpenAPI specification standards for file upload](https://swagger.io/docs/specification/describing-request-body/file-upload/).

Here is a sample OpenAPI File which is posting an order with a file field.

```yaml
openapi: 3.0.0
info:
  title: Sample API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9
servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
paths:
  /orders:
    post:
      summary: create order
      description: upload order file
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              required:
                - "orderId"
                - "userId"
                - "fileName"
              properties:
                orderId:
                  type: integer
                userId:
                  type: integer
                fileName:
                  type: string
                  format: binary
      responses:
        '200':
          description: Says hello
          content:
            application/json:
              schema:
                type: string
```

### Contract as Test

When you run the above file as a test, Specmatic generates random byte array for the file field and sets default content type ```application/octet-stream```.

If you want to run tests with specific files, then you can leverage examples to provide the location of the file that needs to be sent as part of the test.

```yaml
openapi: 3.0.0
info:
  title: Sample API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9
servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
paths:
  /hello:
    post:
      summary: Create order
      description: upload order file
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              required:
                - "orderId"
                - "userId"
                - "fileName"
              properties:
                orderId:
                  type: integer
                userId:
                  type: integer
                fileName:
                  type: string
                  format: binary
            examples:
              200_OKAY:
                value:
                  orderId: 1
                  userId: 2
                  fileName:
                    externalValue: "<fully qualified path / relative path>/input.txt"
      responses:
        '200':
          description: Says hello
          content:
            application/json:
              schema:
                type: string
              examples:
                200_OKAY:
                  value: {string}
```
