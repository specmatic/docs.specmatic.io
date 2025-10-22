---
layout: default
title: gRPC
parent: Documentation
nav_order: 18
---

# gRPC

- [gRPC](#grpc)
  - [Introduction](#introduction)
  - [What Can You Achieve with Specmatic's gRPC Support?](#what-can-you-achieve-with-specmatics-grpc-support)
  - [Quick Start](#quick-start)
  - [Detailed explanation](#detailed-explanation)
    - [Using your proto files as your API Contracts](#using-your-proto-files-as-your-api-contracts)
    - [Using Externalized Examples as Test/Stub Data for gRPC in Contract Tests and Service Virtualization](#using-externalized-examples-as-teststub-data-for-grpc-in-contract-tests-and-service-virtualization)
    - [Using the Docker Image](#using-the-docker-image)
      - [Starting the Stub Service](#starting-the-stub-service)
      - [Running Tests](#running-tests)
    - [Proto 3 (required, optional) and Proto Validate](#proto-3-required-optional-and-proto-validate)
  - [Sample Projects](#sample-projects)

## Introduction

Specmatic supports service virtualization, contract testing and backward compatibility for gRPC APIs, similar to its support for REST (OpenAPI) and SOAP APIs. This document will guide you through using Specmatic for gRPC services.

## What Can You Achieve with Specmatic's gRPC Support?

With Specmatic gRPC support you will be to leverage your proto files as executable contracts.

1. Intelligent Service Virtualisation: Stub out gRPC services for testing and development
2. Contract Testing: Validate requests and responses against your proto files
3. Backward Compatibility Checks: Compare two versions of your proto files to identify breaking changes without writing any code
4. Central Contract Repo: Store your proto files in central Git repo which will serve as single source of truth for both providers and consumers
5. API resiliency : Generate negative and edge cases to verify the resiliency of your API impementation again based on your proto files and validations rules within them.

These capabilities enable you to develop and test gRPC-based applications more efficiently and with greater confidence in your API contracts.

## Quick Start

Here is a [sample project](https://github.com/specmatic/specmatic-order-bff-grpc-kotlin) which has detailed animated architecture diagram along with explanation about how we are isolating the System Under Test during Contract Tests.

1. [Clone the project](https://github.com/specmatic/specmatic-order-bff-grpc-kotlin?tab=readme-ov-file#project-setup)
2. [Use Docker to run the contract tests](https://github.com/specmatic/specmatic-order-bff-grpc-kotlin?tab=readme-ov-file#using-docker)

Alternatively if you have Java (JDK 17 and above) on your machine, you can [run the contract tests using gradle](https://github.com/specmatic/specmatic-order-bff-grpc-kotlin?tab=readme-ov-file#using-gradle) also.

## Detailed explanation

### Using your proto files as your API Contracts

Before you can use Specmatic with your gRPC services, you need to define your service contracts using Protocol Buffer (.proto) files. Here's how to manage these contracts:

1. Store your .proto files in a central repository for easy access and version control.
2. Create a `specmatic.yaml` file in the root of your project to reference these contracts. Here's an example:

```yaml
sources:
  - provider: git
    repository: https://your-central-contract-repo.com
    consumes:
      - /path/to/your/service.proto
```

Make sure to update the `repository` and `consumes` sections to reflect your actual contract repository and .proto file locations.

### Using Externalized Examples as Test/Stub Data for gRPC in Contract Tests and Service Virtualization

Suppose you have a gRPC service definition as shown below:

```protobuf
syntax = "proto3";

package com.store.order.bff;

service OrderService {
  rpc createOrder (CreateOrderRequest) returns (CreateOrderResponse);
}

message CreateOrderRequest {
  int32 productId = 1;
  int32 count = 2;
}

message CreateOrderResponse {
  int32 id = 1;
}
```

To provide example values for testing and stubbing, you can create a JSON file containing data for the `createOrder` method:

```json
{
  "fullMethodName": "com.store.order.bff.OrderService/createOrder",
  "request": {
    "productId": 10,
    "count": 8
  },
  "response": {
    "id": 21
  }
}
```

You can also define example data to simulate error scenarios for the same method. For example:

```json
{
  "fullMethodName": "com.store.order.bff.OrderService/createOrder",
  "request": {
    "productId": 50000,
    "count": 8
  },
  "response": {
    "errorCode": 5,
    "errorMessage": "Product with ID 50000 was not found"
  }
}
```

Here, the `errorCode` field should use one of the standard [google.rpc.Code](https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto) status codes.

These example files should be stored in a directory named `<file_name_without_extension>_examples`, located in the same directory as the corresponding `.proto` file. This structure keeps your example data organized and easily discoverable alongside the service definitions.

Alternatively, you can configure the example directories programmatically or via command-line arguments, depending on your setup and deployment needs.

* **Programmatic Approach:**
  Set the `EXAMPLES_DIR` system property with a comma-separated list of directory paths, where each path points to a directory containing your example files. For example:

  ```java
  System.setProperty("EXAMPLES_DIR", "path/to/dir1,path/to/dir2");
  ```

  This will include both `path/to/dir1` and `path/to/dir2` as example sources.

* **CLI Approach:**
  Specify example directories using the `--examples` argument. You can include multiple directories by repeating the argument:

  ```bash
  --examples=path/to/dir1 --examples=path/to/dir2
  ```

  Both approaches allow flexible configuration of example file locations.

#### Understanding the Example Format

Each example file follows a simple, structured JSON format:

* The top-level object contains three keys: `fullMethodName`, `request`, and `response`.
* `fullMethodName` specifies the complete gRPC method name, including the package, service, and method.
* `request` represents the input message fields sent to the service.
* `response` represents the expected output or error response from the service.

This format makes it straightforward to create reusable test and stub data that works seamlessly for both contract testing and service virtualization. It’s also designed to be human-readable, making it easy to copy real request/response data directly from logs or runtime traces.

> **Note:**
> You can refer to [this example](https://github.com/specmatic/specmatic-order-api-grpc-kotlin/blob/main/src/test/resources/specmatic/order_examples/getOrder.json) for a standard scenario, and [this example](https://github.com/specmatic/specmatic-order-api-grpc-kotlin/blob/main/src/test/resources/specmatic/order_examples/getOrderNotFound.json) for an error scenario.
> Try running [the contract test](https://github.com/specmatic/specmatic-order-api-grpc-kotlin/blob/main/src/test/kotlin/com/store/specmatic_order_api_grpc/ContractTest.kt) to see how Specmatic uses these examples in action.

### Using the Docker Image

So far in the above explanation the sample project is invoking Specmatic gRPC support programmatically. However if you wish to run the same from CLI then below Docker image wraps the same Specmatic gRPC capabilities.

[`specmatic/specmatic-grpc`](https://hub.docker.com/r/specmatic/specmatic-grpc)

Also the Specmatic gRPC Docker image, by nature, is completely language and tech stack agnostic.

#### Starting the Stub Service

To start the stub/service virtualization service, use the following command:

```bash
docker run -p 9000:9000 -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" specmatic/specmatic-grpc virtualize
```

This command mounts your local `specmatic.yaml` file into the container and exposes the stub service on port 9000. And uses the proto files listed under `consumes` section for starting up a service virtualisation server.

#### Running Tests

To run tests, again update your `specmatic.yaml` to include a `provides` section.

```yaml
sources:
  - provider: git
    repository: https://your-central-contract-repo.com
    consumes:
      - /path/to/your/dependency_service.proto
    provides:
      - /path/to/your/your_service.proto
```

To run tests against your BFF (Backend for Frontend), use this command:

```bash
docker run --network host -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" -v "$(pwd)/build/reports/specmatic:/usr/src/app/build/reports/specmatic" -e SPECMATIC_GENERATIVE_TESTS=true specmatic/specmatic-grpc test --port=8080 --host=host.docker.internal
```

This command mounts your `specmatic.yaml` file and runs tests against a service running on port 8080 by generating gRPC requests based on the profiles listed under `provides` section.

### Proto 3 (required, optional) and Proto Validate

Proto 3 dropped required fields. Please see [Github discussion](https://github.com/protocolbuffers/protobuf/issues/2497#issuecomment-267422550) for more details.

Thereby it is hard to communicate constraints such as `required`, ranges (`gte`, `lte`, etc.).
So Specmatic gRPC support is designed to use add on validation mechanisms like [protovalidate](https://github.com/bufbuild/protovalidate). Please refer to our sample projects section below for more details on how this is being used.

## Sample Projects

We have created sample projects to demonstrate how to use Specmatic with gRPC in different languages and scenarios, please follow the link for the latest sample projects

* [gRPC sample projects](https://specmatic.io/documentation/sample_projects.html#grpc)

These projects provide practical examples of how to integrate Specmatic gRPC support into your workflow, including setting up stubs, writing tests, and handling different languages, frameworks and running them on CI like Github actions.
