---
layout: default
title: Comparison Chart
nav_exclude: true
---
# Comparison Chart
{: .fs-9}

|              | Qontract| Pact  | Spring Cloud Contract |
|:-------------|:--------|:------|:--------|
| Tool Type    | [Contract First](/faqs.html#what-is-contract-first) | [Code First, Consumer Driven](https://docs.pact.io/#consumer-driven-contracts) | [Consumer Driven](https://spring.io/projects/spring-cloud-contract) Generates [stub library](https://cloud.spring.io/spring-cloud-static/spring-cloud-contract/2.2.2.RELEASE/reference/html/getting-started.html#getting-started-three-second-tour) |
| Consumer Driven Contract Testing | Yes | Yes | Yes |
| Provider Driven Contract Testing | Yes | No | Supports [Provider Contract](https://cloud.spring.io/spring-cloud-contract/reference/html/documentation-overview.html#working-with-spring-cloud-contract) |
| Command Line Support (zero code) | Yes | No, it claims to be a "code first" tool | No, only programmatic integration |
| Contract Definition | Gherkin Syntax, Human readable and authored by hand | Pact JSON, relatively hard to read, auto generated based on the Stub defined with Pact DSL | [Groovy DSL, YAML](https://cloud.spring.io/spring-cloud-static/spring-cloud-contract/2.2.2.RELEASE/reference/html/getting-started.html#getting-started-what-is-a-contract) and also integrates with [Pact](https://cloud.spring.io/spring-cloud-static/spring-cloud-contract/2.2.0.M2/reference/html/howto.html#how-to-generate-pact-from-scc) |
| How does it work | Developers author Contract (Plain text Gerkin syntax), Stub Server and Contract Tests consume this file | Developers author Provider Stub with DSL, Pact generates Pact JSON which are run as Contract Tests against Producer | Developers author API contract in DSL, Stub library is generated based on the contract and shared with Consumer. Refer to [sequence diagram](https://cloud.spring.io/spring-cloud-static/spring-cloud-contract/2.2.2.RELEASE/reference/html/getting-started.html#getting-started-three-second-tour) |
| Broker Support | WIP | Yes | Works with [Pact Broker](https://cloud.spring.io/spring-cloud-static/spring-cloud-contract/2.0.1.RELEASE/multi/multi__spring_cloud_contract_faq.html#_can_i_use_the_pact_broker) |

