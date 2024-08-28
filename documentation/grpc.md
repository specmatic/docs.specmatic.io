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
    - [Using the Docker Image](#using-the-docker-image)
      - [Starting the Stub Service](#starting-the-stub-service)
      - [Running Tests](#running-tests)
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

Here is a [sample project](https://github.com/znsio/specmatic-order-bff-grpc-kotlin) which has detailed animated architecture diagram along with explanation about how we are isolating the System Under Test during Contract Tests.

1. [Clone the project](https://github.com/znsio/specmatic-order-bff-grpc-kotlin?tab=readme-ov-file#project-setup)
2. [Use Docker to run the contract tests](https://github.com/znsio/specmatic-order-bff-grpc-kotlin?tab=readme-ov-file#using-docker)

Alternatively if you have Java (JDK 17 and above) on your machine, you can [run the contract tests using gradl](https://github.com/znsio/specmatic-order-bff-grpc-kotlin?tab=readme-ov-file#using-gradle) also.

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

### Using the Docker Image

For easy integration and trial purposes, we provide a Docker image that includes the Specmatic gRPC service. You can use this in your projects to quickly get started with Specmatic and gRPC.

The Docker image is available at: `znsio/specmatic-grpc-trial`

#### Starting the Stub Service

To start the stub service for your domain API, use the following command:

```bash
docker run -p 9000:9000 -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" znsio/specmatic-grpc-trial stub
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
docker run -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" znsio/specmatic-grpc-trial test --port=8080
```

This command mounts your `specmatic.yaml` file and runs tests against a service running on port 8080 by generating gRPC requests based on the profiles listed under `provides` section.

### Proto 3 (required, optional) and Proto Validate

Proto 3 dropped required fields. Please see [Github discussion](https://github.com/protocolbuffers/protobuf/issues/2497#issuecomment-267422550) for more details.

Thereby it is hard to communicate constraints such as `required`, ranges (`gte`, `lte`, etc.).
So Specmatic gRPC support is designed to use add on validation mechanisms like [protovalidate](https://github.com/bufbuild/protovalidate). Please refer to our sample projects section below for more details on how this is being used.

## Sample Projects

We have created sample projects to demonstrate how to use Specmatic with gRPC in different languages and scenarios, please follow the link for the latest sample projects 

* [gRPC sample projects](https://specmatic.io/documentation/sample_projects.html#grpc)

These projects provide practical examples of how to integrate Specmatic into your gRPC workflow, including setting up stubs, writing tests, and handling different languages and frameworks.
