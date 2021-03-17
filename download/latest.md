---
layout: default
title: Latest
parent: Download
nav_order: 1
---

Release {{ site.latest_release }}
=================================

Date: 17th March 2021

What new:
- Renamed Qontract to Specmatic
- Implemented a new variable and environment feature that makes it possible to wire up contracts to authentication APIs

Standalone jar - [qontract.jar](https://github.com/znsio/qontract/releases/download/{{ site.latest_release }}/qontract.jar)

```
<dependency>
    <groupId>run.qontract</groupId>
    <artifactId>qontract-core</artifactId>
    <version>{{ site.latest_release }}</version>
</dependency>

<!-- Optional depdendency to run the contract as test on Provider -->
<dependency>
    <groupId>run.qontract</groupId>
    <artifactId>junit5-support</artifactId>
    <version>{{ site.latest_release }}</version>
</dependency>
```
