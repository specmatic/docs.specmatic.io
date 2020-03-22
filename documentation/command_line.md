---
layout: default
title: Command Line
parent: Documentation
nav_order: 4
---
Command Line
============

Qontract Standalone Jar severs two purposes.
* **Zero IDE setup and no code** You can run Contract Tests without a writing a single line of code. Just need to author the Contract to describe your API.
* **Work with several languages and tech stack** Your provider can be a Python Application and the Consumer a JavaScript application. Qontract can work with that setup in the command line mode.

### Introduction

Refer to [getting started](/documentation/getting_started.md)

### Build Server Integration

Qontract "test" command exits with status 0 or 1 to represent success or failure respectively.
You can configure your Provider builds to fail when it does not satisfy the contract.

