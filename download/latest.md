---
layout: default
title: Latest
parent: Download
nav_order: 1
---

Release {{ site.latest_release }}
=================================

Date: 18th Nov 2022

What's new:
- Added support for arrays in query params and headers
- Added support for omitting query params in contract test examples
- Proxy generates stub files in _data directory

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
