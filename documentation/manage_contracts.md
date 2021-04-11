---
layout: default
title: Manage Your Contracts
parent: Documentation
nav_order: 7
---
Manage Your Contracts
========
- [Manage Your Contracts](#manage-your-contracts)
  - [Naming Convention for contracts](#naming-convention-for-contracts)
  - [Single Source Of Truth](#single-source-of-truth)
    - [Directory Structure](#directory-structure)
    - [Shared Repo](#shared-repo)
    - [Run Your Contracts](#run-your-contracts)
    - [locally](#locally)
    - [Configure in CI](#configure-in-ci)
    - [Environments](#environments)
    - [Spec Updates](#spec-updates)
      - [Versioning of Spec & Review](#versioning-of-spec--review)
      - [Review Contracts](#review-contracts)
    - [Backward Compatibility](#backward-compatibility)

We have seen how to write a contract for a single service, and how a producer and a consumer can use it [Getting Started in 5 min](/documentation/getting_started_programmatically.html).

In reality, organizations deploy complex, interdependent microservices, and different teams work on the different pieces.

A few simple practices can help make the most of contracts for multiples services in the organization.

## Naming Convention for contracts

Filename for a contract: 
```gherkin
<api_ServiceName_version>.spec
```
e.g. If the service *loginService* has a downstream API -> *validateNumber* & *getOTP* then, the spec files will be named as below:

```gherkin
api_validateNumber_loginService_v1.spec

api_getOTP_loginService_v1.spec
```

Test data files for each API will have files names as below:
```gherkin
<TestScenarioName>.json
```

e.g. the API getOTP needs to be tested with specific scenarios for a suspended user with an Authorized session 
```gherkin
suspendedUserSession.json
```
 
This naming convention helps make clear:
   - Which service the contract is for,
   - Which version of contract

Anyone looking at the shared contracts repo can find API/services relevant to them.

## Single Source Of Truth

A contract is an API specification. It describes the provider endpoints, the requests it accepts, the responses it returns, and the data types it support etc.

In the earlier section we defined 1 service and its 2 downstream APIs. In reality there will be many such services dependent on other services, and owned by multiple teams.

Each service may have many endpoints, complex data, as well as multiple consumers or providers.

Importantly, these contracts are shared among different teams, Having single source of truth helps in collaborating as well as responding to the changes early in development cycle.

How different teams will know where to find their relevant contracts?

### Directory Structure

Maintaining all the `.spec` for relevant services along with its `.json` expectation files in an organized manner helps individual teams *manage their contracts* and *share them effectively* among different stakeholders.

The directory structure for `loginService` example might look something like this:

```
loginService  [directory]
| getOTP_loginService                         [directory]
 \_ api_getOTP_loginService_v1.spec [file]
 \_ api_getOTP_loginService_data     [directory]
    |
     \_ suspendedUserSession.json [file]
     \_ OAUTHTokenlogin.json [file]
 | api_validateNumber_loginService  [directory]
 \_ api_validateNumber_loginService_v1.spec [file]
 \_ validateNumber_loginService_data          [directory]
    |
     \_ UnregisteredNumber.json [file]
     \_ test.json [file]    
```

To learn how to create `.spec` and relevant test data `.json`, refer to [Specmatic language](/documentation/language.html).

### Shared Repo

A contract `.spec` file is defined in collaboration with the consumer and provider.
 e.g. Frontend and Backend developers define the contract together as per the requirement and design.

Once the contract is defined, both backend and frontend teams start working independently. If these parties don't use a single source of truth throughout, the chance of breech of contract `.spec` increases.

Such discrepancies found late in process will be costly to respond to and fix.

Hence, the agreed upon contract should be kept in a common place for reference. The best way is to keep it in common `repo` on Git.

This repo acts as a common point of reference for all parties.

For example, if the shared repo is: `https://github.com/contracts/`, the directory containing the contract file might be: `https://github.com/contracts/AUTH/loginService/api_loginService_v1.spec`.

There must be one contract (.spec file) for each endpoint, and all developers should consume and update the same file.

Moreover, for the entire API, one repo to store all the services `.spec` confers the following benefits:
- It provides a mechanism for discoverability,
- It reduces the time needed to search and maintain different contracts,
- It makes it easy to consume many contracts when they are in the same repo,
- Updates to a contract are reported immediately as tests that are referring to the contract at shared repo location will fail when they run next

### Run Your Contracts
One can run contracts directly on their system to get immediate feedback.

### locally
One can locally build and use the contracts using SpecMatic. Refer [Getting Started in 5 min](/documentation/getting_started_programmatically.html)


### Configure in CI
Having all contracts (stub and test both) configured to run in CI with auto-triggers set across the organisation is clean and efficient.

- CI for shared contracts repo
  - Change in contract should trigger a backward compatibility test
  - Later it triggers producer service build to run API tests present in the contract file against the provider

The contracts are stored in a shared repo which are referenced in code for stub/test creation. Hence any changes in contract repo triggers
*CI for backward compatibility*.

- CI For consumer service codebase
  -  Provider API contracts '.spec' file run *as stubs* in consumer API tests

- CI For provider service codebase
  -  Contracts must be configured to run as test in the provider build pipeline.

Ideally all of the above are done first on the developer's laptop. But if it has for any reason been missed, as often happens, CI provides a safety net, ensuring that the tests pass and contracts are honored.

### Environments
- Dev Environment
  Developer has to just build .spec and run specmatic.jar locally. For more information, refer to [Getting Started in 5 Minutes](documentation/../../getting_started.html). The dev Can use the provider contracts as stubs for building features and running tests locally. The provider runs contract `.spec` files as a test to validate changes.

- Automated Test Environment
  Deploy the API into the test environment. Stub all dependent downstream dependencies using the contract. Keep all contracts on a common repo for immediate feedback in case of changes.

### Spec Updates

#### Versioning of Spec & Review
Once these `.spec` files are defined, provider and consumer teams can independently work on their respectives pieces.

Later on, further development and defect fixes may require changes to existing contracts. No team wants to know the change in contracts at the end. They would rather have it immediately, which would enable them to fix it faster, or perhaps even challenge the change.

The contract is shared amongst many teams, so one team cannot start changing the `.spec` even, however valid the reason. Some discipline on shared contract repo management helps make changes to the contract without breaking consumers. We recommend to build some of these traps in CI pipeline itself.

For major changes in contracts where structural changes are done change in versioning is recommended. It helps dependent services to still continue using old version till they upgrade with new contract version.

Read more on [Versioning here](/documentation/Versioning.html).

#### Review Contracts
For any team to make any change into the contract, an agreement between a provider and the consumer is required.

Changes can be initiated by either party (consumer or provider), but the `.spec` file should be PR reviewed by the other party before being merged.

As a practice PR merge to the Master for contract repo must have mandatory reviewers from both consumer and provider.

### Backward Compatibility

Given an older and a newer contract, Specmatic will spin up a stub of the new one, and run the old contract in test mode against it. If all the tests pass, the new contract is considered backward compatible with the old.

Both the Version of Contracts are maintained in the shared repo.

Refer to the documentation on [Versioning](/documentation/Versioning.html) for details.
