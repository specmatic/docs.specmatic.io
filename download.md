---
layout: default
title: Download
nav_order: 3
---
Download
========

Get the latest version of the Specmatic binary from [Github](https://github.com/znsio/specmatic/releases). You can use this from the command-line or terminal.

### Maven dependencies

```
<dependency>
    <groupId>in.specmatic</groupId>
    <artifactId>specmatic-core</artifactId>
    <version>use-latest-version-here</version>
</dependency>

<!-- Optional depdendency to run the contract as test on Provider -->
<dependency>
    <groupId>in.specmatic</groupId>
    <artifactId>junit5-support</artifactId>
    <version>use-latest-version-here</version>
</dependency>
```

### Maven properties in Spring projects

In a Spring 2.x or 3.x project, in case of errors about a missing Kotlin method/class which indicate a core Kotlin method/class or a coroutines-related method/class, add the following to the pom:

**Properties**

```xml
<properties>
    <kotlin.version>1.9.22</kotlin.version>
    <kotlin-coroutines.version>latest-version-from-github-project<kotlin-coroutines.version>
</properties>
```

*Remember:* Update the version of `kotlin-coroutines.version`` above with the latest version from https://github.com/Kotlin/kotlinx.coroutines.

**Dependencies**

If similar errors appear after adding these properties, add the following dependency.

```xml
<dependency>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-stdlib</artifactId>
    <version>1.9.22</version>
</dependency>
```
