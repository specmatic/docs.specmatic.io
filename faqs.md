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

So we decided on **Contract First** approach. When you start with the Contract, you can either go the Provider First route or Consumer First route.
This also reduces bias towards Provider or Consumer in API Design.

### Does Qontract work with all programming languages?

Yes, Qontract can work with any language / tech stack in [command line](/documentation/command_line.html) mode.
At the moment [programmatic support](/documentation/getting_started_programmatically.html) is only available to JVM languages.
We are working on adding support for more languages and VMs.

### How much code do I have to write to get Qontract running?

Zero, if you are adopting the [command_line](/documentation/command_line.html) approach.
If you need IDE support, you have to write a few lines of code to get it going.

