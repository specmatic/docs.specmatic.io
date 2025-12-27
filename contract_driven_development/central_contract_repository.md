---
layout: default
title: Central Contract Repository
parent: Contract Driven Development
nav_order: 4
redirect_from:
  - /documentation/central_contract_repository.html
  - /documentation/tutorials/central_contract_repository.html
---

# Central Contract Repository

<img alt="Central Contract Repository" src="/images/Central-Contract-Repo.png" style="max-width: 100%; height: auto;" />

<!-- TOC -->
* [Central Contract Repository](#central-contract-repository)
* [Treat Contract as Code](#treat-contract-as-code)
* [Central Contract Repo - Single source of truth](#central-contract-repo---single-source-of-truth)
  * [File organization](#file-organization)
    * [Setting up a sample central contract repository](#setting-up-a-sample-central-contract-repository)
  * [Pull Request / Merge Request Process](#pull-request--merge-request-process)
    * [Pre-merge checks](#pre-merge-checks)
    * [Collaborating over API Design](#collaborating-over-api-design)
  * [Referring to Contracts in Central Contract Repo](#referring-to-contracts-in-central-contract-repo)
    * [Specmatic Configuration](#specmatic-configuration)
<!-- TOC -->

**Contract Driven Development** leverages API Specifications as Executable Contracts to keep both consumers and providers working well with each other. If consumers and providers are referring to different versions of the API Specifications then it is not possible to guarantee this. This sort of deviation can happen when API Specifications are shared over documentation sites, email, or other non-standard mechanisms.

It is critical to have a **Single Source of Truth** to store the API Specifications for all stakeholders.

Here is a **[video](https://youtu.be/U5Agz-mvYIU?t=1827)** on this.

# Treat Contract as Code

API Specifications are code, and they are best stored in a version control system such as Git. This way we can leverage the version control system as a way to collaborate between all stakeholders through mechanisms such as Pull Requests, Merge Requests, etc.

# Central Contract Repo - Single source of truth

## File organization

**[Sample Central Contract Repository](https://github.com/specmatic/specmatic-order-contracts)**

* Package Naming Convention - In the [sample repo](https://github.com/specmatic/specmatic-order-contracts) we have the API Specifications organized in a manner similar to [package naming convention](https://github.com/specmatic/specmatic-order-contracts). This helps in easy identification of the appropriate files for organizations with large number of microservices and API Specifications.
* Specification file name - It is helpful to have the version number appended to the API Specification file name
* Extracting common schema - We recommend extracting common schema components to avoid duplications. Example: [common.yaml](https://github.com/specmatic/specmatic-order-contracts/blob/main/io/specmatic/examples/store/openapi/common.yaml) contains only schema components which are leveraged as remote references in [api_order_v3.yaml](https://github.com/specmatic/specmatic-order-contracts/blob/main/io/specmatic/examples/store/openapi/api_order_v3.yaml). This has other advantages too
  * Consistency and standardisation - Commonly used parameter such as traceIds can be defined in one place and used across schemas
  * Avoid duplication related issues - It is common to miss updating / renaming some parts of a schema, by extracting common code we can significantly reduce it

### Setting up a sample central contract repository

1. Create a new Git repository named "api-contracts".
2. In this repository, create a folder structure to organize your OpenAPI specifications. For our example, we will do it as follows:

      ```
      api-contracts/
      ├── orders/
      │   ├── order_bff.yaml
      │   └── order_api.yaml
      └── other-services/
      ```

3. Download and add the following OpenAPI specifications to the repository as depicted above

- [Order BFF OpenAPI Spec](ccr_tutorial_spec_files/order_bff.yaml)
- [Order Domain API OpenAPI Spec](ccr_tutorial_spec_files/order_api.yaml)

## Pull Request / Merge Request Process

It is a good idea to prevent any direct commits to your master / main branch of Central Contract Repo. All changes have to go through a Pull Request or a Merge Request.

### Pre-merge checks

* **Syntax checks and Linting** - We leverage open-source packages like [Spectral](https://github.com/stoplightio/spectral) or [Vacuum](https://quobix.com/vacuum/) for linting the API Specifications. This helps in maintaining consistency and standardization across the specifications. You can also create your own custom rules to enforce organizational standards.
* **Example Validation** - It is common to have examples defined in the API Specifications (inline examples) or have the request/response captured in JSON file as [external examples](/features/external_examples.html). Examples help your API consumers understand the request and response structures. However, over time these examples can go out of sync with the actual schema defined in the specification. Specmatic's example validate command can check if all the examples are in line with their respective schema in the Specification.
* **Specmatic Backward Compatibility Testing** This step is crucial in identifying **backward breaking** changes to the specifications.
  * Specmatic Backward Compatibility check can compare the spec files in your Central Contract Repository (Git Repo) to identify the differences. Examples:
    * **GitHub Action** -  Please see this [GitHub Workflow file](https://github.com/specmatic/specmatic-order-contracts/blob/main/.github/workflows/pull_request_merge_checks.yaml) where we are running the `specmatic backward-compatibility-check` on the central repo. This command does two levels of checks.
      * Any files that have changed in the Pull Request branch and compares them against their respective version in default branch (which is target of the PR)
      * Also, any files which refer to the change set are also tested for breaking changes (this is necessary to cover the scenario where common schema has been extracted to a separate file and changes to this file impacts backward compatibility of other files that refer to it)
  * Specmatic returns a 0 or 1 just like any command line tool for success and error respectively based on which we can fail the build. At this point the team can decide if they should version bump the specification or change the code such that it is backward compatible

Please refer to the documentation on [CI Pipeline Setup](/references/continuous_integration.html#ci-pipeline-setup) for more details.

### Collaborating over API Design

The goal of Central Contract Repo is to help all stakeholders collaborate over API Specifications thereby fostering better API Design. The Pull Request / Merge Request provides an avenue for anyone to propose an API change and others to review and comment on it. By **automating the backward compatibility** checks with **Specmatic**, the team is now able to focus on their domain and problem statement instead of worrying about accidentally introducing backward breaking change in the API Design.

## Referring to Contracts in Central Contract Repo

### Specmatic Configuration

Both consumers and providers can leverage the specifications in the Central Contract Repository by listing it in [Specmatic configuration](/references/configuration/). Example:
* [Sample Consumer](https://github.com/specmatic/specmatic-order-bff-java) referring to [api_order_v3.yaml](https://github.com/specmatic/specmatic-order-contracts/blob/main/io/specmatic/examples/store/openapi/api_order_v3.yaml) as [Smart Mock](https://github.com/specmatic/specmatic-order-bff-java/blob/main/src/test/resources/specmatic.yaml)
* [Sample Provider / API](https://github.com/specmatic/specmatic-order-api-java) referring [api_order_v3.yaml](https://github.com/specmatic/specmatic-order-contracts/blob/main/io/specmatic/examples/store/openapi/api_order_v3.yaml) as [Contract Tests](https://github.com/specmatic/specmatic-order-api-java/blob/main/specmatic.yaml)

Specmatic will always pull the latest specification files from the version control system for both applications.

[**Specmatic Configuration in detail**](/references/configuration/)
