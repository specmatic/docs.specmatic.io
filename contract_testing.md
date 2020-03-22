---
layout: default
title: Contract Testing
nav_order: 3
---
# Contract Testing
{: .fs-9}

---

### Context

With an increasing number of applications moving to MicroServices / Distributed Architecture, it is becoming increasingly hard to run all dependencies on a single machine as a Developer.

There have been several tools and techniques that have been tried over time to solve this. Examples:
* Record and Replay - When there were no tools to help stub other service dependencies the go to approach was to use tools like Fiddler to record and replay requests. It worked, just that it was not convenient to store these recordings in version control. Just a trick up a developer’s sleeve to move fast while developing client applications.
* [Self Initializing Fakes](https://martinfowler.com/bliki/SelfInitializingFake.html) - A good example of this is VCR Gem Rails community was a popular technique to record the interaction where the consumer calls the provider and then store the request and response of that interaction as a cassette which can be played back to the consumer should there be more such requests while running unit tests. The main downside to this approach is that the Consumer does not have any way of knowing that the provider has changed its API signature and that the cassettes are not valid any more.
* API Mocks - These tools (Example: Wiremock) let you author the mock server yourself instead of recording the interaction. However there is no way to say whether the mock is truly representing the provider.

Since these techniques cannot guarantee that provider stub may is inline with the provider, Integration Tests are necessary.

---

### Integration Tests

Integration Tests are expensive
* Effort intensive
  * Needs an environment where participating services have to be deployed.
  * They can be brittle and will need continued effort to maintain them
* Slow Feedback
  * They can be quite slow to run, and so usually as Developers we may not be inclined to run them often
  * It may not even be possible to run some integration tests on our dev machines. So we have to wait for the Test Server to run and give us feedback

This why Integration Tests are appear above unit tests in the [Test Food Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
![](/images/test_food_pyramid.jpg)

We need a way to test the integration points without actually running integration tests.

---

### Enter Contract Testing

Contract Tests keep the test double which used by the consumer in line with the provider and vice versa. Thereby reducing the need for a Integration Tests.

Let us look at the updated Test Food Pyramid.
![](/images/test_food_pyramid_with_contract_testing.jpg)

Before picking a Contract Testing tool, it is important to consider your Development Style.
* FrontEnd before BackEnd - [Consumer Driven Contract](https://martinfowler.com/articles/consumerDrivenContracts.html)
  * In this style consumers (UI, Applications) write Test Doubles for Providers because the Provider API does not exist.
  * A contract is generated based on these Test Doubles and shared with the Provider API Team
  * Now it is the responsibility of the Provider API team to make sure they honor this contract
* API First - Provider Driven Contract
  * The Provider API Team write tests against their application
  * These tests generate a test Double or Fake which is shared with Consumer Teams.
  * Consumers use these Test Doubles / Fakes during development and testing to avoid expensive calls to the real Provider

It is not easy to pick on approach. Some use cases require an API First approach and others not. So usually we will have a mix of these techniques.

Qontract being an [Contract First](/#what-is-contract-first) suits both development styles seamlessly.
