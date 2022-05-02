---
layout: default
title: Latest
parent: Download
nav_order: 1
---

Release {{ site.latest_release }}
=================================

Date: 2nd May 2022

What's new:
- Contract test request payload can be specified in it's entirety instead of breaking it up into it's params
- Improvements to loading externalized xsd from within WSDL
- Shallow clone when loading contracts
- Bug fixes to handling of azure auth using a personal access token
- Improved backward compatibility messages
- Other improved error messages

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
