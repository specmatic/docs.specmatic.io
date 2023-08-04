---
layout: default
title: Latest
parent: Download
nav_order: 1
---

Release {{ site.latest_release }}
=================================

Date: 4th August 2023

What's new:
* Fixed SOAP action to support quoted and unquoted actions
* Added basic support for SOAP faults

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
