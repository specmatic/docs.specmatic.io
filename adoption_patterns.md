---
layout: default
title: Adoption Patterns
nav_order: 5
---
# Adoption Patterns

Qontract at this point is based on a broker less design. This is because we wanted to make adoption as seamless as possible.
We are cognizant of the advantages that come with having a Broker or a Results aggregator (such as Compatibility Matrix visualization) and it may become available in future versions.

There are multiple ways to collaborate over contracts between Consumers and Providers.
Identify which of the modes of operation below best describe your scenario and adopt Qontract accordingly.

---

## Repository Per Service

---

### Publishing Provider

![](/images/publishing_provider.jpg)

* Contract is authored by Provider Team. They may not involve the consumers in the api design discussion. They only make sure that their code satisfies their contract. Example: Public APIs, Core Services Teams etc.
* Consumers have to stay in line with the Provider's contract
  * Consumer’s CI pipeline points to the Provider’s Contract file based on which a mock server is run for the purpose of Consumer’s unit tests.
  * When Provider updates its Contract (Example: to add an additional mandatory parameter to its request), the mock server, which is based on the above contract, will throw an expectation mismatch error.
  * The Consumer’s unit tests break either in CI or local machine signalling that they are out of sync with Provider and they need to update their Provider API Client code.
* Setup
  * Repository
    * Contracts are stored in Provider Repo
    * Consumers have readonly or Pull Request access only to the contract
  * CI
    * Provider CI runs the contract as a test against its API
    * Consumer CI tests its code which talks to a Provider Stub which points to Provider Contract file.

**Note**:
* We have not spoken about API versioning here. That will be addressed in detail in another section.
* Provider may not always be able to expose its contract files directly through readonly repository access to Consumers (Example: Public APIs). Here the Provider may choose to make it available over file hosting etc.

---

### Collaborating Provider

![](/images/collaborating_provider.jpg)

A Provider team that constantly collaborates with Consumers while authoring Contracts. This sort of Provider is invested in making sure that its new contract will not break existing Consumers.
* Setup
  * Repository
    * Contracts are stored in their own dedicated repository to which both Consumer and Provider developers have Pull Request access.
    * A council of developers consisting of both consumers and providers approves PRs collaboratively.
  * CI
    * Both Consumers and Provider run stubs and tests respectively based on the jointly owned contracts
    * Providers have responsibility to make sure they do not break compatibility and consumers have a responsibility to stay current.

---

### Consumer Driven Contract

![](/images/consumer_driven_contract.jpg)

In this mode one or more Consumers dictate the Provider’s Contract. Example: Consumer 1 needs fields a, b and c in the response. Consumer 2 needs fields a, g and h in the response.
Both these consumers author the 2 contracts as per their said needs. Provider should be able to satisfy both these contracts when they are run as tests (it has to serve a, b, c, g, h).
* Setup
  * Repository
    * Each Consumer owns its version of the contract in its repository.
    * Providers have to raise PRs to contracts stored in respective Consumer's repositories if they need to make a change. This PR is approved only by the concerned Consumer team.
  * CI
    * Provider CI has to run all the contracts that each of its consumers has as a test against its API.
    * Consumer only has to run its unit test against a stub that is based on its own version of the contract

