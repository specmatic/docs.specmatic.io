---
layout: default
title: Latest
parent: Download
nav_order: 1
---

Release {{ site.latest_release }}
=================================

Date: 16th Aug 2022

What's new:
- Added redeclared command
- Added support for negative testing
- Added tests for the bundle command
- Upgraded to tor 2.0
- Made header matching case-insensitive

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
