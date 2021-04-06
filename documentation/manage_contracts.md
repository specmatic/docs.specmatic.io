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
  - [Multiple Services handling](#multiple-services-handling)
    - [Directory Structure](#directory-structure)
    - [Shared Repo](#shared-repo)
    - [Run Your Contracts](#run-your-contracts)
    - [locally](#locally)
    - [Configure in CI](#configure-in-ci)
    - [Environments](#environments)
    - [Spec Updates](#spec-updates)
      - [Versioning of Spec & Review](#versioning-of-spec--review)
      - [Review Contracts](#review-contracts)
    - [backward compatibility](#backward-compatibility)

We have seen writing Contract for single service, and how to use it from Producer and Consumer side in [Getting Started in 5 min](/documentation/getting_started_programmatically.html).

In reality organization have complex Services and dependencies, also different teams work on different pieces. Each Service may have different consumers, Downstream Services and dependencies as well .
Simple Practices can Help to manage contracts `.spec` well for multiples services in the organization.

## Naming Convention for contracts

Filename for Contracts Specification: 
```gherkin
<api_ServiceName_version>.spec
```
e.g. If Service *loginService* have downstream API -> *validateNumber* & *getOTP* then, spec files will be named as below:

```gherkin
api_validateNumber_loginService_v1.spec

api_getOTP_loginService_v1.spec
```

Test Data Files for each API will have filesNames as below:
```gherkin
<TestScenarioName>.json
```

e.g.
API getOTP needs to be tested with specific scenario for suspended user with Authorized session 
```gherkin
suspendedUserSession.json
```
 
- Naming Convention Helps in clarity for:
   - Which service 
   - Which endpoint
   - Which version of Spec
   - Any Architects looking at contracts Shared Repo can find API/Services relevant to them

## Multiple Services handling

A contract is an API specification. It describes the provider endpoints, the requests it accepts, the responses it returns, and the data types it support etc.
In Earlier section we defined 1 service and its 2 downstream APIs. In reality there will be many such services dependent on other services, and owned by multiple teams.
Each Service may have many endpoints, complex data, as well as multiple consumers or providers.

Importantly these Contracts are shared among different teams, Having single source of truth helps in collaborating as well as responding to the changes early in development cycle.


How different teams will know where to find their relevant contracts?

### Directory Structure
Maintaining all the `.spec` for relevant services along with its `.json` in organized manner helps in, *code simplicity* and *ease of sharing* among different stakeholders.

The resulting directory structure `loginService` example might look something like this:

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
P.S. How do we create `.spec` and relevant test data `.json`?
refer [Specmatic language](/documentation/language.html).



### Shared Repo

A contract `.spec` file is defined in collaboration with Architects of consumer and producer.
 e.g. FrontEnd and BackEnd developers define the contract together as per the requirement and design.
Once the Contract is defined, both backend and frontend teams starts working independently. These parties if don't use the single source of truth throughout, chances of breech of contract `.spec` are there.
This discrepancy found late in process will be costly to respond and fix.
Hence, the agreed `.spec` should be kept in common place for reference. The best way is to keep it in common `repo` on Git.
This repo is reference for all the parties.

```gherkin
Shared Repo: "https://github.com/contracts/"
  Create Directory structure for each team to publish contracts
Given repo "https://github.com/contracts/AUTH/loginService/getOTP_loginService"
```
There must be one contract (.spec file) for each Endpoint and Architects\Developers should consume same file.

- Moreover, for entire product, one repo to store all the services `.spec` provides
    - Highest visibility and usability,
    - Lesser time to search and maintain different contracts,
    - Easy to refer same repo if consuming many contracts `.spec`
    - Updates in contract `.spec` are reported immediately as stub/tests are referring to shared repo location



### Run Your Contracts
One can run contracts directly on their system to get immediate feedback

### locally
 One can locally build and use the contracts using SpecMatic. Refer [Getting Started in 5 min](/documentation/getting_started_programmatically.html)


### Configure in CI
In the Organization having all contracts run (stub and test both) configured in CI with auto-triggers set is clean and efficient.


- CI for shared Contracts repo:
    - Change in Contract to trigger Backward compatibility Test
    - later it Triggers Producer Service CI to run API tests present against the '.spec' contract


  The contracts are stored in Shared Repo which are referenced in code for stub\test creation. Hence any changes in contract repo triggers
  <b>CI for Backward Compatibility</b>.

- CI For Consumer Service Codebase
    -  Provider API Contracts '.spec' file <b>as stub</b> to stub dependencies 
    -  API tests via contracts with dependencies stubbed in source repo against ongoing development


- CI For Producer Service Codebase
    -  Self Contracts '.spec' <b>as test</b> against ongoing development Service
  
CI Helps to achieve key points
  - Helps to develope independent of Integration of Mess
  - At the same time immediate feedback on dependent System changes
  - CI integration for backward compatibility of API


All these can run locally, in dev Environment or any Staging/Automation environments


### Environments
- Dev Environment

  Developer has to just build .spec and run spec.jar. To Locally Run refer <b> Getting Started in 5 min</b>
  Dev Can use the Producer Contracts as stub for local Development. In case of Producer, use Contracts *.spec" as a test to validate changes.

- Automated Test Environment
  Deploy Service\Endpoint under test on Environment. Stub all dependent Downstream API\Endpoints using '.spec'.
  Keep all contracts on a common repo for immediate feedback in case of changes.

  TODO
- Pre -Prod Environment
- Production Environment


### Spec Updates

#### Versioning of Spec & Review
Once these `.spec` are defined for all services, teams can independently work on their part.
Where .spec were defined as part of Design or New features,  Development and defect Fixes may need changes in existing contracts. No Team wants to know the change in contracts at the end but immediately in order to incorporate respective changes or challenge the Change.

The contract is shared among many teams, one team cannot start changing the `.spec` even for valid reasons. Some discipline on Shared contract repo helps in managing Contract changes. We recommend to build some of these traps in CI pipeline itself.

*   Review by Provider along with 1 consumer
*   Versioning refer: [Versioning](/documentation/Versioning.html)

For major changes in contracts where structural changes are done change in versioning is recommended.
    It helps dependent services to still continue using old version till they upgrade with new contract version.

#### Review Contracts
For any team to make any change into the contract, an agreement between a provider and the consumer is required.
Changes can be initiated by either party (consumer or provider), but the `.spec` should be PR reviewed by other party before merge.
As a Practice PR merge to the Master for Contract repo must have mandatory reviewers from both (consumer/Provider).
 

### backward compatibility
Backward Compatibility Testing
Given an older and a newer contract, Specmatic will spin up a stub of the new one, and run the old contract in test mode against it. If all the tests pass, the new contract is considered backward compatible with the old.

Both the Version of Contracts are maintained in Repo:

e.g. getOTP_loginService_v1.spec was version one as name suggests, the new version is: getOTP_loginService_v2.spec

```gherkin
getOTP_loginService_v1.spec
getOTP_loginService_v2.spec
```


Refer [backward compatibility](/documentation/Versioning.html) for details.



