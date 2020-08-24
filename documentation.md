---
layout: default
title: Home
nav_order: 1
---
# A Contract Driven Development Tool

[Get started now](/documentation/getting_started.html){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 } [View it on GitHub](//github.com/qontract/qontract){: .btn .fs-5 .mb-4 .mb-md-0 }

[![Maven Central](https://img.shields.io/maven-central/v/run.qontract/qontract-core.svg)](https://mvnrepository.com/artifact/run.qontract/qontract-core) [![GitHub release](https://img.shields.io/github/release/qontract/qontract.svg)](https://github.com/qontract/qontract/releases) ![CI Build](https://github.com/qontract/qontract/workflows/CI%20Build/badge.svg) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=qontract_qontract&metric=alert_status)](https://sonarcloud.io/dashboard?id=qontract_qontract) [![Twitter Follow](https://img.shields.io/twitter/follow/qontract.svg?style=social&label=Follow)](https://twitter.com/qontract)
---
### Context

In a complex, interdependent eco-system, where each service is evolving rapidly, we want to make the dependencies between them explicit in the form of executable contracts. By doing so, [Contract Testing](/contract_testing.html) allows teams to get instantaneous feedback while making changes to avoid accidental breakage.

With this ability, we can now deploy, at will, any service at any time without having to depend on expensive and fragile integration tests.

### What is Qontract
Qontract is a [contract driven development tool](/faqs.html#what-is-contract-first) that allows us to turn our contracts into executable specification.

According to us there are 2 key advantages, which were never possible before:
* **Death of Integration Testing** - As long as the service provider and consumer adhere to the contract, you can be 100% confident that each of them can develop and deploy their parts independently. **No need for integration testing**. 
    - On the provider side, run **Qontract in test mode** 
    - On the consumer side run **Qontract in stub mode** - Qontract ensures that the expectations you are setting on your stubs are in-fact valid as per the contract.
* **Backward Compatibility Verification** - Typically for the provider to ensure they've not broken backward compatibility, they need to test their new version of the service with the current versions of all the consumers. This is a complex and time consuming process. With Qontract, you just need to run the new version of the contract with the previous version to check for backward compatibility (no consumer tests required.)

### Our Goal is to support various types of Interactions
Systems interact with each other through several means. Qontract hopes to address all these mechanisms and not just web interactions.
* API calls (**JSon REST**, **SOAP XML**, gRPC, Thrift, other binary protocols)
* Events via Messaging (**Kafka**, Redis, ActiveMQ, RabbitMQ, Kinesis, etc.)
* DB, Other Data Stores
* File system
* Libraries, SDK 
* OS Level Pipes

---
### Key Features

* [**Contract First**](/faqs.html#what-is-contract-first) - With an API-first approach, you can use Consumer or Provider driven contracts, whatever suits your needs the best.
  - Once a Contract is written, both Consumers and Providers can start development in parallel
* **Human readable contracts** - Qontract leverages **Gherkin**'s strength as a specification mechanism to define your services (APIs.) No additional language specific tooling required.
  - Anyone 1.Developer (Consumer or Provider), 2.Architect, 3.Tech Leads, 4.Developer, 5.Tester can author the contracts
* **Backward Compatibility Verification** - Contract vs Contract testing (cross version compatibility checks) etc.
* **Service Virtualisation** - Run your contract in stub mode and isolate yourself from downstream dependencies (also be sure that your stubs are 100% compatible with the actual provider)
* **Contract as Test** - Test drive your services (APIs) using a contract
* **Programmatic** (Kotlin, Java and JVM languages) **and Command line support**
* **Tight integration with CI** - Triger Provider and Consumer CI builds when any of the contracts change.
* Versioning
* Support for **SOAP/XML**, **Kafka**, **callbacks** and more
* Already have a lot of APIs? Don't worry, we can take your **Postman Collection** and easily generate contracts from it

[**Read more about them here**](/Features.html)
