---
layout: default
title: Latest
parent: Releases
nav_order: 1
---

Release {{ site.latest_release }}
=================================

Date: 8th July 2020

What's new:
- Experimental support for recording contracts and stubs in proxy mode
- Rewritten support for XML
- Improved support for CI

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/{{ site.latest_release }}/qontract.jar)

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
