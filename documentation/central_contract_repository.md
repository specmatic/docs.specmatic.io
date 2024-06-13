---
layout: default
title: Central Contract Repository
parent: Documentation
nav_order: 28
---

# Context

- [Context](#context)
- [Treat Contract as Code](#treat-contract-as-code)
- [Central Contract Repo - Single source of truth](#central-contract-repo---single-source-of-truth)
  - [File organization](#file-organization)
  - [Pull Request / Merge Request Process](#pull-request--merge-request-process)
    - [Pre-merge checks](#pre-merge-checks)
    - [Collaborating over API Design](#collaborating-over-api-design)
  - [Referring to Contracts in Central Contract Repo](#referring-to-contracts-in-central-contract-repo)
    - [Specmatic Configuration](#specmatic-configuration)

**Contract Driven Development** leverages API Specifications as Executable Contracts to keep both consumers and providers working well with each other. If consumers and providers are referring to different versions of the API Specifications then it is not possible to guarantee this. This sort of deviation can happen when API Specifications are shared over documentation sites, email, or other non standard mechanisms.

It is critial to have a **Single Source of Truth** to store the API Specifications for all stakeholders.

Here is a **[video](https://youtu.be/U5Agz-mvYIU?t=1827)** on this.

# Treat Contract as Code

API Specifications are code and they are best stored in a version control system such as Git. This way we can leverage the version control system as a way to collaborate between all stakeholders through mechanisms such as Pull Requests, Merge Requests, etc.

# Central Contract Repo - Single source of truth

## File organization

**[Sample Central Contract Repository](https://github.com/znsio/specmatic-order-contracts)**

* Package Naming Convention - In the [sample repo](https://github.com/znsio/specmatic-order-contracts) we have the OpenAPI API Specifications organized in a manner similar to [package naming convention](https://github.com/znsio/specmatic-order-contracts). This helps in easy identifition of the approapriate files for organizations with large number of microservices and API Specifications.
* Specification file name - It is helpful to have the version number appended to the API Specification file name
* Extracting common schema - We recommend extracting common schema components to avoid duplications. Example: [common.yaml](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/common.yaml) contains only schema components which are leveraged as remote references in [api_order_v1.yaml](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_v1.yaml). This has other advantages too
  * Consistency and standardisation - Commonly used parameter such as traceIds can be defined in one place and used across schemas
  * Avoid duplication related issues - It is common to miss updating / renaming some parts of a schema, by extracting common code we can significantly reduce it

## Pull Request / Merge Request Process

It is a good idea to prevent any direct commits to your master / main branch of Central Contract Repo. All changes have to go through a Pull Request or a Merge Request.

<img alt="Central Contract Repository" src="https://specmatic.in/wp-content/uploads/2022/09/Treat-Contract-as-Code.png" />

### Pre-merge checks

* **Syntax checks and Linting** - We leverage [Spectral](https://stoplight.io/open-source/spectral) for this. Read more about this [here](https://github.com/znsio/specmatic-order-contracts#linting)
* **Specmatic Backward Compatibility Testing** This step is crucial in identifying **backward breaking** changes to the specifications.
  * Specmatic Backward Compatiblity Check can compare the spec files in your Central Contract Repository (Git Repo) to identify the differences. Examples:
    * **Github Action** -  Please see this [Github Workflow file](https://github.com/znsio/specmatic-order-contracts/blob/main/.github/workflows/pull_request_merge_checks.yaml) where we are running the `specmatic backwardCompatibilityCheck` on the central repo. This command does two levels of checks.
      * Any files that have changed in the Pull Request branch and compares them against their respective version in default branch (which is target of the PR)
      * Also any files which refer to the change set are also tested for breaking changes (this is necessary to cover the scenario where common schema has been extracted to a separate file and changes to this file impacts backward compatibility of other files that refer to it)
  * Specmatic returns a 0 or 1 just like any command line tool for success and error respectively based on which we can fail the build. At this point the team can decide if they should version bump the specification or change the code such that it is backward compatible

#### Sample Central Contract Repository with Pre-merge checks
 Here are some sample pre-merge pipelines to disallow merges when specification changes have linter errors or backward breaking changes.

- [Github Action](https://github.com/znsio/specmatic-order-contracts)
- [Gitlab CI](https://gitlab.com/znsio/contract-driven-development/central-contract-repository) - This also uses [Specmatic Docker Image](https://hub.docker.com/r/znsio/specmatic)

### Collaborating over API Design

The goal of Central Contract Repo is to help all stakeholders collaborate over API Specifications thereby fostering better API Design. The Pull Request / Merge Request provides an avenue for anyone to propose an API change and others to review and comment on it. By **automating the backward compatibility** checks with **Specmatic**, the team is now able to focus on their domain and problem statement instead of worrying about accidentaly introducing backward breaking change in the API Design.

## Referring to Contracts in Central Contract Repo

### Specmatic Configuration

Both consumers and providers can leverage the specifications in the Central Contract Repository by listing it in [Specmatic configuration](https://specmatic.in/documentation/configuration.html). Example:
* [Sample Consumer](https://github.com/znsio/specmatic-order-ui) referring to [api_order_v1.yaml](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_v1.yaml) as [Smart Mock](https://github.com/znsio/specmatic-order-ui/blob/main/specmatic.json)
* [Sample Provider / API](https://github.com/znsio/specmatic-order-api) referring [api_order_v1.yaml](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_v1.yaml) as [Contract as Test](https://github.com/znsio/specmatic-order-api)

Specmatic will always pull the latest specification files from the version control system for both applications.

[**Specmatic Configuration in detail**](/documentation/configuration.html)
