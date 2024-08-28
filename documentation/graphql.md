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

Although GraphQL SDL files do not support HTTP headers, you may directly add them to your Specmatic example files in `httpHeaders` under the `request` key, as seen in the example yaml in the previous section. The headers will be leveraged if present both by the contract tests as well as service virtualization.

#### GraphQL Variables

Specmatic supports usage of GraphQL variables seamlessly. You only need to make sure that the externalised example is structured such that it uses the actual field values inline instead of variables in the query. Here is an example.

Say suppose, below request is that is being sent by your GraphQL Consumer to Specmatic GraphQL service virtualization server.

```JSON
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

```YAML
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

### Using the Docker Image

So far in the above explanation the sample project is invoking Specmatic GraphQL support programmatically. However if you wish to run the same using the CLI then the Docker image below wraps the same Specmatic GraphQL capabilities.

[`znsio/specmatic-graphql-trial`](https://hub.docker.com/r/znsio/specmatic-graphql-trial)

Also the Specmatic GraphQL Docker image, by nature, is completely language and tech stack agnostic.

#### Starting the Stub / Service Virtualization Service

To start the stub service, use the following command:

```shell
docker run --network host -v "$(pwd)/specmatic.yml:/usr/src/app/specmatic.yml" znsio/specmatic virtualize --port=8090
```

This command mounts your local `specmatic.yaml` file into the container, exposes the stub service on port 8090, and uses the GraphQL SDL files listed under `consumes` section for starting up a service virtualisation server.

#### Running Tests

To run contract test:

```shell
docker run --network host -v "$(pwd)/specmatic.yml:/usr/src/app/specmatic.yml" -e SPECMATIC_GENERATIVE_TESTS=true znsio/specmatic-graphql-trial test --port=8080
```

This command mounts your `specmatic.yaml` file and runs tests against a service running on port 8080 by generating GraphQL requests based on the GrapqhQL SDL files listed under `provides` section along with examples if any provided in the colocated directory named `<GraphQL SDL file without extension>_examples`.

## Sample Projects

We have created sample projects to demonstrate the above in different languages and scenarios. Please follow the link for the latest sample projects .

* [GraphQL sample projects](https://specmatic.io/documentation/sample_projects.html#graphql)

These projects provide practical examples of how to integrate Specmatic GraphQL support into your workflow, including setting up stubs, writing tests, handling different languages, frameworks and running them on CI like Github actions.
