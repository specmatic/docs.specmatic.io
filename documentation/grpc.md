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
  - [Getting Started with Specmatic gRPC](#getting-started-with-specmatic-grpc)
  - [Defining and Managing Contracts](#defining-and-managing-contracts)
  - [Using the Docker Image](#using-the-docker-image)
    - [Starting the Stub Service](#starting-the-stub-service)
    - [Running Tests](#running-tests)
  - [Interpreting Test Results](#interpreting-test-results)
  - [Sample Projects](#sample-projects)
  

## Introduction

Specmatic now supports service virtualization and testing for gRPC APIs, similar to its support for REST and SOAP APIs. This document will guide you through using Specmatic for gRPC services.

## What Can You Achieve with Specmatic's gRPC Support?

Specmatic's gRPC support allows you to:

1. Stub out gRPC services for testing and development
2. Validate requests and responses against your gRPC contracts
3. Generate test cases automatically from your gRPC service definitions
4. Ensure API consistency across your microservices architecture
5. Perform contract testing to catch integration issues early

These capabilities enable you to develop and test gRPC-based applications more efficiently and with greater confidence in your API contracts.

## Getting Started with Specmatic gRPC

To begin using Specmatic with gRPC, you'll need to use our gRPC module. This module enables stubbing and testing of gRPC services.

You can find the module at: [https://github.com/znsio/specmatic-grpc](https://github.com/znsio/specmatic-grpc)

## Defining and Managing Contracts

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

## Using the Docker Image

For easy integration and trial purposes, we provide a Docker image that includes the Specmatic gRPC service. You can use this in your projects to quickly get started with Specmatic and gRPC.

The Docker image is available at: `znsio/specmatic-grpc-trial`

### Starting the Stub Service

To start the stub service for your domain API, use the following command:

```bash
docker run -p 9000:9000 -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" znsio/specmatic-grpc-trial stub
```

This command mounts your local `specmatic.yaml` file into the container and exposes the stub service on port 9000.

### Running Tests

To run tests against your BFF (Backend for Frontend), use this command:

```bash
docker run -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" znsio/specmatic-grpc-trial test --port=8080
```

This command mounts your `specmatic.yaml` file and runs tests against a service running on port 8080.

## Interpreting Test Results

After running tests, Specmatic provides a detailed output of the test results. Here's how to interpret this output:

1. Individual Test Results: For each test, you'll see:
   - The test name and scenario
   - The request sent to your service
   - The response received
   - The test result (PASSED or FAILED)

2. API Coverage Summary: This section shows:
   - Coverage percentage for each gRPC method
   - Number of times each response status was exercised
   - Overall API coverage

3. Summary Statistics:
   - Total number of tests run
   - Number of passed tests
   - Number of failed tests

For example:

```
API COVERAGE SUMMARY
|-------------------------------------------------------------------------------------------------------------------------|
| coverage   | fullMethodName                                           | responseStatusCode   | #exercised   | remarks   |
|------------|----------------------------------------------------------|----------------------|--------------|-----------|
| 100%       | com.store.order.bff.OrderService/findAvailableProducts   | INVALID_ARGUMENT     | 1            | covered   |
|            |                                                          | OK                   | 5            | covered   |
| 100%       | com.store.order.bff.OrderService/createOrder             | INVALID_ARGUMENT     | 4            | covered   |
|            |                                                          | OK                   | 3            | covered   |
| 100%       | com.store.order.bff.OrderService/createProduct           | INVALID_ARGUMENT     | 18           | covered   |
|            |                                                          | OK                   | 24           | covered   |
|-------------------------------------------------------------------------------------------------------------------------|
| 100% API Coverage reported from 3 RPC methods                                                                           |
|-------------------------------------------------------------------------------------------------------------------------|

[Specmatic] Total Tests Run: 55
Passed Tests: 55
Failed Tests: 0
```

This output shows that all 55 tests passed, with 100% API coverage across 3 RPC methods. It also breaks down how many times each response status (OK or INVALID_ARGUMENT) was exercised for each method.

## Sample Projects

We have created sample projects to demonstrate how to use Specmatic with gRPC in different languages and scenarios:

1. Domain Service for gRPC (usable across languages):
   [https://github.com/znsio/specmatic-order-api-grpc-kotlin](https://github.com/znsio/specmatic-order-api-grpc-kotlin)

2. BFF (Backend for Frontend) Apps:
   - Go: [https://github.com/znsio/specmatic-order-bff-grpc-go](https://github.com/znsio/specmatic-order-bff-grpc-go)
   - Kotlin: [https://github.com/znsio/specmatic-order-bff-grpc-kotlin](https://github.com/znsio/specmatic-order-bff-grpc-kotlin)

These projects provide practical examples of how to integrate Specmatic into your gRPC workflow, including setting up stubs, writing tests, and handling different languages and frameworks.

