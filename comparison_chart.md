---
layout: default
title: Comparison Chart
nav_order: 4
---
# Comparison Chart
{: .fs-9}

|              | Qontract| Pact  | Spring Cloud Contract |
|:-------------|:--------|:------|:--------|
| Tool Type    | [Contract First](/faqs.html#what-is-contract-first) | [Code First, Consumer Driven](https://docs.pact.io/#consumer-driven-contracts) | [Consumer Driven](https://spring.io/projects/spring-cloud-contract) [Producer's code base](https://cloud.spring.io/spring-cloud-static/spring-cloud-contract/2.2.2.RELEASE/reference/html/getting-started.html#getting-started-three-second-tour) |
| Consumer Driven Contract Testing | Yes | Yes | Yes |
| Provider Driven Contract Testing | Yes | No | In a way |
| Command Line Support (zero code) | Yes | No, it claims to be a "code first" tool | No, only programmatic integration |
| Contract Definition | Gherkin Syntax, Human readable and authored by hand | Pact JSON, relatively hard to read, auto generated based on the Stub defined with Pact DSL | [Groovy DSL, YAML](https://cloud.spring.io/spring-cloud-static/spring-cloud-contract/2.2.2.RELEASE/reference/html/getting-started.html#getting-started-what-is-a-contract) and also integrates with [Pact](https://cloud.spring.io/spring-cloud-static/spring-cloud-contract/2.2.0.M2/reference/html/howto.html#how-to-generate-pact-from-scc) |

