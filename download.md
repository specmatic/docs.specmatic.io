---
layout: default
title: Download
nav_order: 3
---
Download
========

Download the latest Specmatic standalone executable from the following sources:
* [Github](https://github.com/znsio/specmatic/releases)
* [Maven Central](https://repo1.maven.org/maven2/io/specmatic/specmatic-executable/{{ site.latest_release }}/specmatic-executable-{{ site.latest_release }}-all.jar)
* [Docker Hub](https://hub.docker.com/r/znsio/specmatic)

Read our "[Getting started (in 5 min)](/getting_started.html)" section learn more about using the standalone executable.

### Maven dependencies

```
<dependency>
    <groupId>io.specmatic</groupId>
    <artifactId>specmatic-core</artifactId>
    <version>{{ site.latest_release }}</version>
</dependency>

<!-- Optional dependency to run the contract as test on Provider -->
<dependency>
    <groupId>io.specmatic</groupId>
    <artifactId>junit5-support</artifactId>
    <version>{{ site.latest_release }}</version>
</dependency>
```

## NOTE: Group ID `in.specmatic` has moved to `io.specmatic`

Updates will no longer be available under the deprecated Group ID `in.specmatic`,
We kindly request that you update your dependencies to use the new Group ID `io.specmatic` instead.
