---
layout: default
title: Latest
parent: Download
nav_order: 1
---

Release {{ site.latest_release }}
=================================

Date: 10th March 2023

What's new:
- Allow contract-invalid examples of 400 in the contract
- Examples can now be marked WIP (by adding [WIP] at the start of the example name), and WIP example tests will not return 1 at the command prompt, nor fail a build
- Added stats showing how many tests are for each API in the contracts used for contract testing
- Eliminated stackoverflow error when a cycle exists in the contract  - thanks to @westse (Steve West)
- Added support for discriminator - thanks to @westse (Steve West)
- Added support for Dictionary with allOf, oneOf - thanks to @westse (Steve West)

Standalone jar - [specmatic.jar](https://github.com/znsio/specmatic/releases/download/{{ site.latest_release }}/specmatic.jar)

```
<dependency>
    <groupId>in.specmatic</groupId>
    <artifactId>specmatic-core</artifactId>
    <version>{{ site.latest_release }}</version>
</dependency>

<!-- Optional depdendency to run the contract as test on Provider -->
<dependency>
    <groupId>in.specmatic</groupId>
    <artifactId>junit5-support</artifactId>
    <version>{{ site.latest_release }}</version>
</dependency>
```
