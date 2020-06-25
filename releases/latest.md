---
layout: default
title: Latest
parent: Releases
nav_order: 1
---

Release {{ site.latest_release }}
=================================

Date: 25th June 2020

What's new:
- Unexpected JSON keys in the response are not accepted now in test mode, unless the type defines a ... key with no value, which is an explicit declaration that unexpected keys must be accepted and ignored
- Files in stub directories that are not loaded are logged to the console
- Improved error messages

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
