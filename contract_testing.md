---
layout: default
title: What Is Contract Testing
nav_order: 3
---
# What Is Contract Testing
{: .fs-9}

---

### Context

With several applications moving to MicroServices / Distributed Architecture, it is becoming increasingly hard to run all dependencies on a single machine as a Developer.

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

---

# Qontract - Contract First

Most of the "Contract Testing" tools are "[Consumer Driven Contract](https://martinfowler.com/articles/consumerDrivenContracts.html)" testing tool. Here the contract is generated based on the Provider Stub / Mock server that is defined by Consumers.
This setup suits the Consumer First Development Style better. Here Provider API design is based on what the Consumers need.
* In this style consumers (UI, Applications) write Test Doubles for Providers because the Provider API does not exist.
* A contract is generated based on these Test Doubles and shared with the Provider API Team
* Now it is the responsibility of the Provider API team to make sure they honor this contract

However there are scenarios where this may not work well.
* Public APIs - Here the Provider has to publish the Contract before Consumer Development can begin.
* API First - Some teams prefer to start with API Design for various reasons. Consumer Development starts only after that.

We believe both "Consumer First" and "Contract First" styles have their place in application architecture and wanted to build a tool that caters to both styles.

We built Qontract for the **Contract First** approach. When you start with the Contract, you can either go the Provider First route or Consumer First route.
This also reduces bias towards Provider or Consumer in API Design.

