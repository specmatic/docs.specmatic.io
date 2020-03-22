---
layout: default
title: Contract Testing
nav_order: 3
---
# Contract Testing
{: .fs-9}

---

### Context

With an several applications moving to MicroServices / Distributed Architecture, it is becoming increasingly hard to run all dependencies on a single machine as a Developer.

There have been several tools and techniques that have been tried over time to solve this. Examples:
* Record and Replay - When there were no tools to help stub other service dependencies the go to approach was to use tools like Fiddler to record and replay requests. It worked, just that it was not convenient to store these recordings in version control. Just a trick up a developer’s sleeve to move fast while developing client applications.
* [Self Initializing Fakes](https://martinfowler.com/bliki/SelfInitializingFake.html) - A good example of this is VCR Gem in Ruby on Rails. When the consumer calls the provider stub for the first time, the stub calls the provider and stores the request and response of that interaction as a cassette. This is played back to the consumer should there be more such requests from the consumer. This quite helpful while running unit tests. However there are downsides
  * The Consumer does not have any way of knowing that the provider has changed its API signature and that the cassettes are not valid any more.
  * It also assumes that the Provider has to exist before Consumer development can start
* API Mocks - These tools (Example: Wiremock) let you author the mock server yourself instead of recording the interaction. However there is no way to say whether the mock is truly representing the provider.

These techniques cannot guarantee that provider stub is inline with the provider. So Integration Tests are necessary to make sure Provider and Consumer are compatible.

---

### Integration Tests

Integration Tests are expensive
* Effort intensive
  * Needs an environment where participating services have to be deployed.
  * They can be brittle and will need continued effort to maintain them
* Slow Feedback
  * They can be quite slow to run, and so usually as Developers we may not be inclined to run them often
  * It may not even be possible to run some integration tests on our dev machines. So we have to wait for the Test Server to run and give us feedback

The [Test Food Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) is a good way to visualize this.
![](/images/test_food_pyramid.jpg)

Unit tests are quick and cheap. However they offer almost no feedback on integration breakages between APIs.

Integration tests are slow and expensive. We cannot however dismiss them because of the value they add.

We need a way to reduce dependency on integration tests without sacrificing ability to test integration points.

---

### Contract Testing

Contract Tests keep test doubles (that represent Providers) used by the consumer in line with the Provider and vice versa.

Contracts ensure below aspects
* The Consumer side of the bargain by making sure the test double is in line with the contract
* The Provider also has to keep its promise of adhering to the contract

This reduces our dependency on Integration Tests. Remember we may not be able to completely do away with Integration Tests.

Let us look at the updated Test Food Pyramid.
![](/images/test_food_pyramid_with_contract_testing.jpg)

Contract Tests are Fast and Quick like Unit Tests and still offer a majority of the value provided by Integration Tests.

Before picking a Contract Testing tool, it is important to understand which type of Contract Testing you need. This will depend on the order in which Consumer and Provider are built / defined.
* FrontEnd before BackEnd / Consumer First - [Consumer Driven Contract](https://martinfowler.com/articles/consumerDrivenContracts.html)
  * In this style consumers (UI, Applications) write Test Doubles for Providers because the Provider API does not exist.
  * A contract is generated based on these Test Doubles and shared with the Provider API Team
  * Now it is the responsibility of the Provider API team to make sure they honor this contract
* API First - Provider Driven Contract
  * The Provider API Team write tests against their application
  * These tests generate a test Double or Fake which is shared with Consumer Teams.
  * Consumers use these Test Doubles / Fakes during development and testing to avoid expensive calls to the real Provider

It is not easy to pick on approach. Some use cases require an API First approach while others may not.
Also quite often we need to develop the Provider and Consumer in parallel.

Qontract being a [Contract First](/#what-is-contract-first) contract testing tool, suits both development styles seamlessly.
