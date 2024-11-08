---
layout: default
title: GraphQL 
parent: Documentation
nav_order: 18
---

# GraphQL

- [GraphQL](#graphql)
  - [Introduction](#introduction)
  - [What Can You Achieve with Specmatic's GraphQL Support?](#what-can-you-achieve-with-specmatics-graphql-support)
  - [Quick Start](#quick-start)
  - [Detailed explanation](#detailed-explanation)
    - [Using your GraphQL files as your API Contracts from Central Contract Repository](#using-your-graphql-files-as-your-api-contracts-from-central-contract-repository)
    - [Using externalised examples as test / stub data to be used as part of contract tests and service virtualization respectively](#using-externalised-examples-as-test--stub-data-to-be-used-as-part-of-contract-tests-and-service-virtualization-respectively)
      - [HTTP Headers](#http-headers)
      - [GraphQL Variables](#graphql-variables)
      - [Multi-Query Requests](#multi-query-requests)
    - [Dynamic Field Selection From Example Responses](#dynamic-field-selection-from-example-responses)
    - [GraphQL Scalar Types](#graphql-scalar-types)
    - [Using the Docker Image](#using-the-docker-image)
      - [Starting the Stub / Service Virtualization Service](#starting-the-stub--service-virtualization-service)
      - [Running Tests](#running-tests)
  - [Sample Projects](#sample-projects)

## Introduction

Specmatic supports service virtualization, contract testing and backward compatibility for GraphQL APIs based on [GraphQL SDL (Schema Definition Language)](https://www.apollographql.com/tutorials/lift-off-part1/03-schema-definition-language-sdl) files, similar to its support for REST (OpenAPI).

## What Can You Achieve with Specmatic's GraphQL Support?

With Specmatic GraphQL support you will be to leverage your GraphQL SDL files as executable contracts.

1. Intelligent Service Virtualisation: Stub out GraphQL services for testing and development
2. Contract Testing: Validate requests and responses against your GraphQL SDL files
3. Backward Compatibility Checks: Compare two versions of your GraphQL SDL files to identify breaking changes without writing any code
4. Central Contract Repo: Store your GraphQL SDL files in central Git repo which will serve as single source of truth for both providers and consumers
5. API resiliency : Generate negative and edge cases to verify the resiliency of your API impementation based on your GraphQL SDL files.

## Quick Start

Here is a [sample project](https://github.com/znsio/specmatic-order-bff-graphql-java) which has a detailed animated architecture diagram along with explanations about how we are isolating the System Under Test when running Contract Tests.

[Clone the project](https://github.com/znsio/specmatic-order-bff-graphql-java) and follow the instructions in the README.

## Detailed explanation

### Using your GraphQL files as your API Contracts from Central Contract Repository

1. Store your GraphQL SDL files in a central repository for easy access and version control.
2. Create a `specmatic.yaml` file in the root of your project to reference these contracts. Here's an example:

```yaml
contract_repositories:
  - type: git
    repository: https://github.com/znsio/specmatic-order-contracts.git
    provides:
      - io/specmatic/examples/store/graphql/products_bff.graphqls
    consumes:
      - io/specmatic/examples/store/openapi/api_order_v3.yaml
```

Make sure to update the `repository`, `provides` and `consumes` sections to reflect your actual contract repository and .graphqls file locations.

### Using externalised examples as test / stub data to be used as part of contract tests and service virtualization respectively

Suppose you have a GraphQL SDL file as shown below.

```graphql
enum ProductType {
  gadget
  book
  food
  other
}

type Query {
  findAvailableProducts(type: ProductType!, pageSize: Int): [Product]
}

type Product {
  id: ID!
  name: String!
  inventory: Int!
  type: ProductType!
}
```

In order to provide appropriate example values, you can create an example YAML file that has test/stub data pertaining to the `findAvailableProducts` query.

```yaml
request: 
  httpHeaders:
    X-region: north-west 
  body: |
    query {
        findAvailableProducts(type: gadget, pageSize: 10) { id name inventory type }
    }

response: [
  {
    "id": "10",
    "name": "The Almanac",
    "inventory": 10,
    "type": "book"
  },
  {
    "id": "20",
    "name": "iPhone",
    "inventory": 15,
    "type": "gadget"
  }
]
```

This file can either be stored in a directory that is colocated with the GraphQL SDL file with the naming convention `<GraphQL SDL file without extension>_examples`, or alternatively you can pass it as an argument programmatically or through CLI args while running tests or service virtualisation.

Let us now take deeper look at the external example format.
* At the top level we have two YAML root nodes called `request` and `response`
* `request` can hold the following keys:
  * `body`: this can contain either `query`s or `mututation`s with exact values where necessary
  * `headers`: you can add your `HTTP` headers here
* `response` holds responses with JSON syntax for readability, syntax highlighting and also as an aid to copy and paste of real responses from actual application logs etc.

#### HTTP Headers

Although GraphQL SDL files do not support HTTP request headers, you may directly add them to your Specmatic example files in `httpHeaders` under the `request` key, as seen in the example yaml in the previous section. The headers will be leveraged if present both by the contract tests as well as service virtualization.

#### GraphQL Variables

Specmatic supports usage of GraphQL variables seamlessly. You only need to make sure that the externalised example is structured such that it uses the actual field values inline instead of variables in the query. Here is an example.

Say suppose, below request is that is being sent by your GraphQL Consumer to Specmatic GraphQL service virtualization server.

```json
{
   "operationName": "FindAvailableProducts",
   "variables": {
       "type": "gadget",
       "pageSize": 10
   },
   "query": "query FindAvailableProducts($type: ProductType!, $pageSize: Int!) { findAvailableProducts(type: $type, pageSize: $pageSize) { id name inventory type } }"
}
```

As you can see, the above request from GraphQL consumer includes a variable called `$pageSize`. However in our example we will not be using it, instead we will be using the actual value (`pageSize: 10`) to match a request that comes with that value.

```yaml
request:
  body: |
    findAvailableProducts(type: "gadget", pageSize: 10) { 
      id 
      name 
      inventory 
      type 
    }
response: [
    {
        "id": "10",
        "name": "The Almanac",
        "inventory": 10,
        "type": "book"
    },
    {
        "id": "20",
        "name": "iPhone",
        "inventory": 15,
        "type": "gadget"
    }
]
```

**Note**: It is recommended to specify the type of the variable e.g. `$pageSize: Int!`. If the type is not specified explicitly you may face some issues since Specmatic will implicitly cast the variable to a certain type which may be invalid sometimes.

### Dynamic Field Selection from Example Responses

When running a GraphQL stub using Specmatic, you can provide an example query that includes all possible fields and sub-selections. Specmatic uses this example to generate the stub response.

If a request is made using the exact query provided in the example, Specmatic will return the full response as defined. However, if a request is made with a subset of the fields specified in the original example, **Specmatic will automatically tailor the response to include only those requested fields**.

This means that a comprehensive example (an "uber example") covering all fields can be reused by Specmatic to generate responses for queries that request only a subset of those fields.

Here are some simple steps to try this out:

1. Create a GraphQL SDL file named `product-api.graphql` with the following content:
   ```graphql
   schema {
       query: Query
       mutation: Mutation
   }

   enum ProductType {
     gadget
     book
     food
     other
   }

   type Query {
     findAvailableProducts(type: ProductType!, pageSize: Int): [Product]
   }

   type Product {
     id: ID!
     name: String!
     inventory: Int!
     type: ProductType!
   }
   ```

2. Create a folder named `examples`.

3. Create an example file named `find_available_gadgets.yaml` in the `examples` folder with the following content:
   ```yaml
   request:
     body: |
       query {
         findAvailableProducts(type: gadget, pageSize: 10) { 
           id 
           name 
           inventory 
           type 
         }
       }
   response: [
       {
           "id": "10",
           "name": "The Almanac",
           "inventory": 10,
           "type": "book"
       },
       {
           "id": "20",
           "name": "iPhone",
           "inventory": 15,
           "type": "gadget"
       }
   ]
   ```

4. Create a `specmatic.yaml` file with the following content in the root folder where `product-api.graphql` file is present:

   ```yaml
   contract_repositories:
     - type: filesystem
       consumes:
         - product-api.graphql
   ```

5. Run the following command to start the GraphQL stub on `localhost:9000/graphql`:
   ```bash
   docker run -v "$PWD/product-api.graphql:/usr/src/app/product-api.graphql" \
     -v "$PWD/examples:/usr/src/app/examples" \
     -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" \
     -p 9000:9000 znsio/specmatic-graphql-trial virtualize --port=9000 --examples=examples
   ```

6. Make a request to query all the sub-selected fields specified in the example. You will get the exact response specified in the example. Use the following `curl` command to make this request:
   ```bash
   curl -X POST http://localhost:9000/graphql \
     -H "Content-Type: application/json" \
     -d '{
       "query": "query { findAvailableProducts(type: gadget, pageSize: 10) { id name inventory type } }"
     }'
   ```
   **Expected Response:**
   ```json
   {
     "data": {
       "findAvailableProducts": [
         {
           "id": "10",
           "name": "The Almanac",
           "inventory": 10,
           "type": "book"
         },
         {
           "id": "20",
           "name": "iPhone",
           "inventory": 15,
           "type": "gadget"
         }
       ]
     }
   }
   ```

7. Make a request to query only a subset of the sub-selected fields specified in the example. You will get a response with only those sub-selected fields with values picked up from the response. Use the following `curl` command to make this request:
   ```bash
   curl -X POST http://localhost:9000/graphql \
     -H "Content-Type: application/json" \
     -d '{
       "query": "query { findAvailableProducts(type: gadget, pageSize: 10) { id name } }"
     }'
   ```
   **Expected Response:**
   ```json
   {
     "data": {
       "findAvailableProducts": [
         {
           "id": "10",
           "name": "The Almanac"
         },
         {
           "id": "20",
           "name": "iPhone"
         }
       ]
     }
   }
   ```

---
This setup allows you to test how Specmatic reuses the example provided, adapting the response to the requested fields.

### Multi-Query Requests 

The Specmatic GraphQL stub server supports multi-query requests, allowing you to send a single request with multiple queries and receive a consolidated response. This feature is useful when you want to retrieve data from different queries in a single API call. Additionally, **multi-query requests with variables** are supported, making it flexible for dynamic requests.

To showcase this, let's reuse the folder structure established in the previous section on dynamic field selection.

#### Steps to Try Out Multi-Query Requests

1. **Create the GraphQL SDL File**: Create a file named `product-api.graphql` with the following schema:
   ```graphql
   schema {
       query: Query
       mutation: Mutation
   }

   enum ProductType {
     gadget
     book
     food
     other
   }

   type Query {
     findAvailableProducts(type: ProductType!, pageSize: Int): [Product]
     productById(id: ID!): Product
   }

   type Product {
     id: ID!
     name: String!
     inventory: Int!
     type: ProductType!
   }
   ```

2. **Set Up Example Files**: In the `examples` folder, create two example files:

   - **`find_available_gadgets.yaml`**:
     ```yaml
     request:
       body: |
         query {
           findAvailableProducts(type: gadget, pageSize: 10) { 
             id 
             name 
             inventory 
             type 
           }
         }
     response: [
         {
             "id": "10",
             "name": "The Almanac",
             "inventory": 10,
             "type": "book"
         },
         {
             "id": "20",
             "name": "iPhone",
             "inventory": 15,
             "type": "gadget"
         }
     ]
     ```

   - **`product_by_id.yaml`**:
     ```yaml
     request:
       body: |
         query {
           productById(id: "10") { 
             id 
             name 
             type 
           }
         }
     response: {
         "id": "10",
         "name": "The Almanac",
         "type": "book"
     }
     ```

3. **Create `specmatic.yaml` File**: Add the following `specmatic.yaml` file to the root folder:

   ```yaml
   contract_repositories:
     - type: filesystem
       consumes:
         - product-api.graphql
   ```

4. **Run the GraphQL Stub**:
   ```bash
   docker run -v "$PWD/product-api.graphql:/usr/src/app/product-api.graphql" \
     -v "$PWD/examples:/usr/src/app/examples" \
     -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" \
     -p 9000:9000 znsio/specmatic-graphql-trial virtualize --port=9000 --examples=examples
   ```

5. **Send a Multi-Query Request**:
   Use the following `curl` command to make a multi-query request:
   ```bash
   curl -X POST http://localhost:9000/graphql \
     -H "Content-Type: application/json" \
     -d '{
       "query": "query { findAvailableProducts(type: gadget, pageSize: 10) { id name inventory type } productById(id: \"10\") { id name type } }"
     }'
   ```

   **Expected Response:**
   ```json
   {
     "data": {
       "findAvailableProducts": [
         {
           "id": "10",
           "name": "The Almanac",
           "inventory": 10,
           "type": "book"
         },
         {
           "id": "20",
           "name": "iPhone",
           "inventory": 15,
           "type": "gadget"
         }
       ],
       "productById": {
         "id": "10",
         "name": "The Almanac",
         "type": "book"
       }
     }
   }
   ```
Here's an example of a multi-query request using variables. This demonstrates how Specmatic can handle a single request with multiple queries, where each query may use variables.

7. **Send a Multi-Query Request with Variables**:
   Use the following `curl` command:

   ```bash
   curl -X POST http://localhost:9000/graphql \
     -H "Content-Type: application/json" \
     -d '{
       "query": "query($type: ProductType!, $pageSize: Int, $id: ID!) { findAvailableProducts(type: $type, pageSize: $pageSize) { id name inventory type } productById(id: $id) { id name type } }",
       "variables": {
         "type": "gadget",
         "pageSize": 10,
         "id": "10"
       }
     }'
   ```

   **Expected Response:**
   ```json
   {
     "data": {
       "findAvailableProducts": [
         {
           "id": "10",
           "name": "The Almanac",
           "inventory": 10,
           "type": "book"
         },
         {
           "id": "20",
           "name": "iPhone",
           "inventory": 15,
           "type": "gadget"
         }
       ],
       "productById": {
         "id": "10",
         "name": "The Almanac",
         "type": "book"
       }
     }
   }
   ```

In this example:
- The variable `$type` is used to specify the `ProductType` for `findAvailableProducts`.
- `$pageSize` controls the number of products returned.
- `$id` is used to fetch a specific product by ID in the `productById` query.

This request showcases how Specmatic's GraphQL stub server can process multi-query requests with variables, offering flexibility and efficiency in response generation.

This example demonstrates how Specmatic processes multiple queries in a single request and returns the expected responses for each query. You can adapt this setup for various use cases, leveraging the existing folder structure for organizing examples.

### GraphQL Scalar Types

In GraphQL, you can define [custom scalar types](https://graphql.org/learn/schema/#scalar-types) to handle specialized data, such as dates or monetary values, that require specific serialization and deserialization logic. For example:

```graphql
schema {
  query: Query
  mutation: Mutation
}

scalar Date

type Offer {
  offerCode: String!
  validUntil: Date!
}

type Query {
  findOffersForDate(date: Date!): [Offer]!
}
```

In this schema, `Date` is a custom scalar. While GraphQL doesn't provide details on how this scalar is serialized or deserialized, your application code defines the logic. 

When testing queries like `findOffersForDate` using Specmatic, the tool doesn't know how to correctly handle the `Date` scalar and might pass an incorrect value, such as a random string, leading to test failures.

To guide Specmatic, you can provide externalized examples that specify valid inputs for custom scalars like `Date`. For instance:

```yaml
request:
  body: |
    query {
      findOffersForDate(date: "2024/12/31") { offerCode, validUntil }
    }

response: [
  {
    "offerCode": "WKND30",
    "validUntil": "2024/12/12"
  },
  {
    "offerCode": "SUNDAY20",
    "validUntil": "2024/12/25"
  }
]
```

Here, the `Date` scalar is provided with a valid value (`"2024/12/31"`). This ensures that during testing, Specmatic uses the correct format for the `Date` argument, allowing your tests to run smoothly without failures caused by incorrect data types.

### Using the Docker Image

So far in the above explanation the sample project is invoking Specmatic GraphQL support programmatically. However if you wish to run the same using the CLI then the Docker image below wraps the same Specmatic GraphQL capabilities.

[`znsio/specmatic-graphql-trial`](https://hub.docker.com/r/znsio/specmatic-graphql-trial)

Also the Specmatic GraphQL Docker image, by nature, is completely language and tech stack agnostic.

#### Starting the Stub / Service Virtualization Service

To start the stub service, use the following command:

```shell
docker run --network host -p 8090:8090 -v "$(pwd)/specmatic.yml:/usr/src/app/specmatic.yml" znsio/specmatic virtualize --port=8090
```

This command mounts your local `specmatic.yaml` file into the container, exposes the stub service on port 8090, and uses the GraphQL SDL files listed under `consumes` section for starting up a service virtualisation server.

#### Running Tests

To run contract test:

```shell
docker run --network host -v "$(pwd)/specmatic.yml:/usr/src/app/specmatic.yml" -v "$(pwd)/build/reports/specmatic:/usr/src/app/build/reports/specmatic"  -e SPECMATIC_GENERATIVE_TESTS=true znsio/specmatic-graphql-trial test --port=8080
```

This command mounts your `specmatic.yaml` file and runs tests against a service running on port 8080 by generating GraphQL requests based on the GrapqhQL SDL files listed under `provides` section along with examples if any provided in the colocated directory named `<GraphQL SDL file without extension>_examples`.
Also, it mounts the build artifacts from the docker container onto your local machine once the test run is completed.

## Sample Projects

We have created sample projects to demonstrate the above in different languages and scenarios. Please follow the link for the latest sample projects .

* [GraphQL sample projects](https://specmatic.io/documentation/sample_projects.html#graphql)

These projects provide practical examples of how to integrate Specmatic GraphQL support into your workflow, including setting up stubs, writing tests, handling different languages, frameworks and running them on CI like Github actions.
