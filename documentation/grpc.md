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

1. Central Contract Repo: Single source of truth for both providers and consumers
2. Intelligent Service Virtualisation: Stub out gRPC services for testing and development
3. Contract Testing: Validate requests and responses against your gRPC contracts
4. Backward Compatibility Checks and Linting (for specification standards)
5. API resiliency : Generate negative and edge cases to test against them and accomplish resilient APIs

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

## Sample Projects

We have created sample projects to demonstrate how to use Specmatic with gRPC in different languages and scenarios, please follow the link for the latest sample projects 

* [gRPC sample projects](https://specmatic.io/documentation/sample_projects.html#grpc)

These projects provide practical examples of how to integrate Specmatic into your gRPC workflow, including setting up stubs, writing tests, and handling different languages and frameworks.

