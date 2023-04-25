---
layout: default
title: Latest
parent: Download
nav_order: 1
---

Release {{ site.latest_release }}
=================================

Date: 25th April 2023

What's new:
- Added the ability to filter out tests by name (search the documentation for filterNotName)

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
