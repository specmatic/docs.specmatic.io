---
layout: default
title: Latest
parent: Download
nav_order: 1
---

Release {{ site.latest_release }}
=================================

Date: 21st October 2020

What's new:
- Added a new feature in which the stub that forwards unknown urls to another url whose url is provided to it at startup ([Forward Unrecognized URLs To An Actual Service](/documentation/service_virtualisation.html#forward-unrecognized-urls-to-an-actual-service))

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
