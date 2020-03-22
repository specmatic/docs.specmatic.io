---
layout: default
title: Frequently Asked Questions
nav_order: 5
---
### What is "Contract First"?
Contract Testing involves two sides, Consumer and Provider. Contract Testing Tools usually have to pick a side that will define the contracts.
* **Consumer Driven Contracts** - The contract is generated based on the Provider Stub / Mock server that is defined by Consumers.
* **Provider Driven Contracts** - The contract is more or less a Provider API test. This test / contract generates the Provider Stub / Mock server that is used by Consumers.

We believe both "Consumer First" and "Provider" approaches have their place in application architecture and did not want to impose either technique on developers.

So we decided on **Contract First** approach. This reduces bias towards Provider or Consumer in API Design.
