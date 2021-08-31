---
layout: default
title: OpenAPI Support
parent: Documentation
nav_order: 20
---

OpenAPI Support
---------------

Specmatic supports OpenAPI 3.0.x

At the time of writing, OpenAPI 3.1.x is new, and many tools are still catching up. The library we use — [swagger-parser](https://github.com/swagger-api/swagger-parser) — currently does not support it either. We will add support as soon as possible.

## Writing Contracts
[Stoplight Studio](https://stoplight.io/studio/) is a GUI editor for OpenAPI contracts. It is powerful and very easy to use. You can start with the free download, or even just the online version.

Make sure to select OpenAPI 3.0.x when creating a new contract in Stoplight Studio.

## Stubbing Out Contracts
You can use it to run contract-based stubs just like you would use a spec file. Simply use the name of the OpenAPI yaml file wherever you would normally use the spec file, in `specmatic.json`. You may also pass the yaml file to the Specmatic stub command — `specmatic stub api_order_v1.yaml`. Nothing else changes.

The `_data` directory works the same way it did with .spec files.

To see this in action, take a look at the [sample consumer project](https://github.com/znsio/specmatic-order-ui).

## Contract Tests
To run contract tests, you'll need to wrap the openapi yaml file in a thin Gherkin wrapper.

See the [yaml contract](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_v1.spec) projects, and the [thin wrapper](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_v1.spec) spec file.

Note the line in the `Background` saying `Given openapi ./api_order_v1.yaml`.

The rest of the file merely provides examples for the APIs found in `api_order_v1.yaml`.

An API is identified by 3 identifiers:
1. The URL path
2. The method
3. The response code

Each scenario in the wrapper must specify which the APIs it is providing examples for. To do this, it must provide the 3 identifiers to Specmatic.

All the Scenario Outlines in the sample spec file provide these 3 identifiers, examples for running the tests, and nothing more. No data structure definitions are needed in the spec file. Those are all imported from the yaml file declared in the `Backgroun`d section.

To see this in action, take a look at the [sample API project](https://github.com/znsio/specmatic-order-api).
