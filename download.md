---
layout: default
title: Download
nav_exclude: true

---
# Specmatic Open Source

## Open Source CLI standalone executable

Download the latest Specmatic standalone executable from the following sources:
* [Github](https://github.com/specmatic/specmatic/releases/tag/{{ site.specmatic-core-version }})
* [Maven Central](https://repo1.maven.org/maven2/io/specmatic/specmatic-executable-all/{{ site.specmatic-core-version }}/specmatic-executable-all-{{ site.specmatic-core-version }}.jar)
* [Docker Hub](https://hub.docker.com/r/specmatic/specmatic) - `docker pull specmatic/specmatic`

Read our "[Getting started (in 5 min)](/getting_started.html)" section learn more about using the standalone executable.

## Specmatic Open Source as a library

```
<dependency>
    <groupId>io.specmatic</groupId>
    <artifactId>specmatic-core</artifactId>
    <version>{{ site.specmatic-core-version }}</version>
</dependency>

<!-- Optional dependency to run contract tests on Provider -->
<dependency>
    <groupId>io.specmatic</groupId>
    <artifactId>junit5-support</artifactId>
    <version>{{ site.specmatic-core-version }}</version>
</dependency>
```

## NOTE: Group ID `in.specmatic` has moved to `io.specmatic`

Updates will no longer be available under the deprecated Group ID `in.specmatic`,
We kindly request that you update your dependencies to use the new Group ID `io.specmatic` instead.


# Specmatic Commercial offerings

## Specmatic Studio

Specmatic Studio can be downloaded from the following sources:
* [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-studio) - `docker pull specmatic/specmatic-studio`
* As a JAR file from [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/studio/specmatic-studio/{{ site.specmatic-studio-version }}/specmatic-studio-{{ site.specmatic-studio-version }}.jar)

## Specmatic Kafka

Specmatic Kafka can be downloaded from the following sources:
* [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-kafka) - `docker pull specmatic/specmatic-kafka`
* As a JAR file from [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/async/specmatic-kafka-all/{{ site.specmatic-async-version }}/specmatic-kafka-all-{{ site.specmatic-async-version }}.jar)

## Specmatic OpenAPI

Specmatic OpenAPI can be downloaded from the following sources:
* [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-openapi) - `docker pull specmatic/specmatic-openapi`
* As a JAR file from [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/openapi/specmatic-openapi-all/{{ site.specmatic-openapi-version }}/specmatic-openapi-all-{{ site.specmatic-openapi-version }}.jar)
