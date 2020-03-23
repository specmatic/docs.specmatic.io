---
layout: default
title: Frequently Asked Questions
nav_order: 5
---
### What is "Contract First"?
Most of the "Contract Testing" tools are "Consumer Driven Contract" testing tool.
This setup suits the Consumer First Development Style better. Here Provider API design is based on what the Consumers need. Which is good thing.

However there scenarios where this may not work well.
* Public APIs - Here the Provider has to publish the Contract before Consumer Development can begin
* API First - Some teams prefer to start with API Design for various reasons. Consumer Development starts only after that.

We believe both "Consumer First" and "Provider First" approaches have their place in application architecture and wanted to build a tool that caters to both styles.

So we decided on **Contract First** approach. When you start with the Contract, you can either go the Provider First route or Consumer First route.
This also reduces bias towards Provider or Consumer in API Design.

### Does Qontract work with all programming languages?

Yes, Qontract can work with any language / tech stack in [command line](/documentation/command_line.html) mode.
At the moment [programmatic support](/documentation/getting_started_programmatically.html) is only available to JVM languages.
We are working on adding support for more languages and VMs.

### How much code do I have to write to get Qontract running?

Zero, if you are adopting the [command_line](/documentation/command_line.html) approach.
If you need IDE support, you have to write a few lines of code to get it going.

