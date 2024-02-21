---
layout: default
title: Continuous Integration
parent: Documentation
nav_order: 31
---
Contract Tests
==============

Specmatic is a platform and programming language independent execuable. We can run it in all CI environments through [command line](/documentation/getting_started.html#setup).

## Featured utilities

### Github action to setup specmatic environment

[Setup specmatic environment](https://github.com/marketplace/actions/setup-specmatic-environment) by [Serghei Iakovlev](https://github.com/sergeyklay)


#### Examples
* [Backward compatibility testing](https://github.com/znsio/specmatic-order-contracts/blob/main/.github/workflows/pull_request_merge_checks.yaml)
* [Contract as Test](https://github.com/znsio/specmatic-order-api/blob/github-actions-setup-specmatic/.github/workflows/command_line_contract_tests.yml)