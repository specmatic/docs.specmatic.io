---
layout: default
title: Troubleshooting
parent: Documentation
nav_order: 33
---
Troubleshooting
===============

- [Troubleshooting](#troubleshooting)
    - [When I try to run contract tests using SpecmaticJUnitSupport, I'm getting an exception saying that XYZ method or class is missing. What do I do?](#when-i-try-to-run-contract-tests-using-specmaticjunitsupport-im-getting-an-exception-saying-that-xyz-method-or-class-is-missing-what-do-i-do)
    - [Maven properties in Spring projects](#maven-properties-in-spring-projects)

### When I try to run contract tests using SpecmaticJUnitSupport, I'm getting an exception saying that XYZ method or class is missing. What do I do?

Spring-boot declares Kotlin as a dependency, and so does Specmatic (`Specmatic` is written in Kotlin). The two versions may conflict, resulting in errors about missing methods or classes.

### Maven properties in Spring projects

In a Spring 2.x or 3.x project, in case of errors about a missing Kotlin method/class which indicate a core Kotlin method/class or a coroutines-related method/class, add the following to the pom:

**Properties**

```xml
<properties>
    <kotlin.version>1.9.22</kotlin.version>
    <kotlin-coroutines.version>latest-version-from-github-project<kotlin-coroutines.version>
</properties>
```

*Remember:* Update the version of `kotlin-coroutines.version` above with the latest version from https://github.com/Kotlin/kotlinx.coroutines.

**Dependencies**

If similar errors appear after adding these properties, add the following dependency.

```xml
<dependency>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-stdlib</artifactId>
    <version>1.9.22</version>
</dependency>
```
