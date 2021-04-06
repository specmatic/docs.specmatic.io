---
layout: default
title: Manage Your Contracts
parent: Documentation
nav_order: 7
---
Manage Your Contracts
========

- [Manage Your Contracts](#manage-Contracts)
    - [Naming Convention](#naming-convention)
    - [Multiple Service's Contracts handling](#built-in-data-types)
      - [Directory Structure](#dir-structure)
      - [Shared Repo](#repo-shared-contracts)
      - [Run Your Contracts](#run-contracts)
        - [locally](#contracts-locally)
        - [Configure in CI](#configure-ci)
        - [Environments](#environments)
      - [Spec Updates](#spec-updates)
        - [Versioning Review_Contracts](#versioning-review-contracts)
        - [Backward Compatibility](#backward-compatibility)



We have seen writing Contracts for single service from Producer and Consumer side in [Getting Started in 5 min](/documentation/getting_started_programmatically.html).
In reality organization have complex Services and dependencies, and different teams work on different pieces. Each Service may have different consumers, Downstream Services and as well Producers.  With some basic practices handling team dependency becomes Easy. 
Let's see how to manage contracts for multiples services in your organization with simple practices.


## Naming Convention for contracts

Filename for Contracts Specification: 
```gherkin
<api_ServiceName_version>.spec
```
e.g. If Service *loginService* have downstream API -> *validateNumber* & *getOTP* then, spec files will be named as below:

```gherkin
validateNumber_loginService_v1.spec

getOTP_loginService_v1.spec
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
P.S. These are Best Practices not Syntax or rules.

## Multiple Services handling

A contract is an API specification. It describes the provider endpoints, the requests it accepts, the responses it returns, and the data types it support etc.
In Earlier section we defined 1 service and its 2 downstream APIs. In reality there will be many such services dependent on other services, and owned by multiple teams.
Each Service may have many endpoints, complex data, as well multiple consumer or provider Services.

Importantly these Contracts are shared among different teams, Having 1 source of truth helps teams to collaborate as well catch the changes early in development cycle.
How different teams will know where to find their provider contracts?

### Directory Structure
Maintaining all the `.spec` for relevant services along with its `.json` in organized manner helps, *code simplicity* and *ease of sharing* among different stakeholders.
The resulting directory structure `loginService` example might look something like this:

```
loginService  [directory]
| getOTP_loginService                         [directory]
 \_ getOTP_loginService_v1.spec [file]
 \_ getOTP_loginService_data     [directory]
    |
     \_ suspendedUserSession.json [file]
     \_ OAUTHTokenlogin.json [file]
 | validateNumber_loginService  [directory]
 \_ validateNumber_loginService_v1.spec [file]
 \_ validateNumber_loginService_data          [directory]
    |
     \_ UnregisteredNumber.json [file]
     \_ test.json [file]    
```
P.S. How do we create `.spec` and relevant test data `.json`?
refer [Specmatic language](/documentation/language.html).








### Shared Repo

one contract `.spec` file is defined in collaboration with its consumer and producers. For e.g. FrontEnd and BackEnd developer define the contract together as per the requirement and design.
Once Contract defined starts working independently, these parties if don't use the common source of truth throughout chances of breech of `.spec` are there.
This found late in process will be costly to fix and align.
Hence, the agreed `.spec` should be kept in common place for reference. The best way is to keep it on common `repo` on Git.
This repo can be reference by all the parties depending on this `.spec`

```gherkin
Shared Repo: "https://github.com/contracts/"
  Create Directory structure for each team to publish contracts
Given repo "https://github.com/contracts/AUTH/loginService/getOTP_loginService"
```
P.S. Only provider or the consumer have to write the contract, there must be one contracts for each Endpoint.

Moreover, for entire product one repo to store all the services `.spec` provides the highest productivity.
( lesser time to search and maintain different contracts, easy to refer same repo if you are consuming many `.spec`).



### Run Your Contracts

### locally

### Configure in CI
- CI for Contracts repo

  Producer : uses <b>.spec</b> to test against ongoing Development

  Consumer : uses <b>.spec</b> to Stub Producer to be independent in ongoing development

  The references of this repo \API is in multiple Service\APIs. Hence the changes in contract repo triggeres
  <b>CI for Backward Compatibility</b>


- CI for consumer

  This is the Repo for Codebase of Consumer. This will Have different API\Component tests which will stub provider Contract from Shared COntract Repo.
  This Also run on Dev Environment.

- CI for Provider

  This is the Repo for Codebase of Provider.

### Environments
- Dev Environment

  Developer have to just build .spec and run spec.jar. To Locally Run refer <b> Getting Started in 5 min</b>
  Dev Can use the Producer Contracts as stub for local Development. In case of Producer use Contracts *.spec" as a test to validate changes.

- Automated Test Environment
  Deploy Service\Endpoint under test on Environment. Stub all dependent Downstream API\Endpoints using '.spec'.
  Keep your all contracts on common repo for immidiate feedback if case of changes.

  TODO
- Pre -Prod Environment
- Production Environment


### Spec Updates

#### Versioning of Spec & Review
Once these `.spec` are defined for all services, teams can independently work on their part.
Where .spec were defined as part of Design or New features,  Development and defect Fixes may need changes in existing contracts. No Team wants to know the change in contracts at the end but immediately in order to encorporate respective changes or challenge the Change.

The contract is shared among many teams, one team cannot start changing the `.spec` even for valid reasons. Some discipline on Shared contract repo helps in managing Contract changes. We recommon to build some of these traps in CI pipeline itself.

*   Review by Provider along with 1 consumer
*   Versioning refer: [Versioning](documentation/Versioning.html)

For major changes in contracts where structural changes are done change in versioning is recommended.
    It helps dependent services to still continue using old version till they upgrade with new contract changes as well till complete rollout of new contract.

#### Review Contracts
Any team consuming contract needs to change the contract should need agreement between a provider and the consumer of the contract.
Changes can be initiated by either party (consumer or provider) but, the `.spec` should be PR reviewed by other party before merge.
As a Practice PR to merge the `.spec` to Master


### backward compatibility
Backward Compatibility Testing
Given an older and a newer contract, Specmatic will spin up a stub of the new one, and run the old in test mode against it. If all the tests pass, the new contract is considered backward compatible with the old.


```gherkin
getOTP_loginService_v1.spec
getOTP_loginService_v2.spec
```



