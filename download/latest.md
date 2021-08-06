---
layout: default
title: Latest
parent: Download
nav_order: 1
---

Release {{ site.latest_release }}
=================================

Date: 6th Aug 2021

What's new:
- Added support for x-www-form-urlencoded parameters in OpenAPI. This includes support for specifying json as the format of the contents of such a parameter.

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
