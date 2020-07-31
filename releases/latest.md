---
layout: default
title: Latest
parent: Releases
nav_order: 1
---

Release {{ site.latest_release }}
=================================

Date: 31st July 2020

What's new:
- Improved CI support (new push command for pushing contract changes, new subscribe command to have the ci pipeline run when changes occur)
- Bug fixes

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
