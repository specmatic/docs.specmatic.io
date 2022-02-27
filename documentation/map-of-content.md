---
layout: default
title: Map Of Content
nav_exclude: true
search_exclude: true
---
Documentation
=============

## Overview of Contract Driven Development
- Contract First
- What is integration hell
- Contract Driven Development as a solution to integration hell
  - What is contract testing
  - What is intelligent service virtualisation
- Independent development and deployment

---

## Getting Started

- [5 minute quick start](/documentation/getting_started_programmatically.html)

---

## Writing Contracts
- Stoplight Studio for writing OpenAPI contracts — [Stoplight Studio](https://stoplight.io/studio/) is a powerful, free GUI provided by [Stoplight](https://stoplight.io) for writing OpenAPI contracts.
- [Migrating legacy Gherkin to OpenAPI](/documentation/convert_gherkin_to_openapi.html)
- Migrating Postman collections
- Using Specmatic proxy
- Use of OpenAPI features not yet supported by Stoplight Studio, including dictionaries, xml support

---

## Service Virtualisation For Consumers
- Setup Specmatic in the project
  - In Java projects
    - Instructions for Maven dependencies (include instructions on projects that use Spring, which has conflicting versions of kotlin / JUnit)
    - Instructions for Gradle dependencies
    - Instructions for starting up a stub in Java, using JUnit 4 and JUnit 5
  - Node projects (for now, just a link to the node project)
  - Instructions for non-Java projects (e.g. PHP)
  - Setting up specmatic.json
- Service virtualisation techniques
  - Static service virtualisation
  - Dynamic service virtualisation
  - With contracts in the repo
  - With contracts in another repo
- Making contracts in another repo run in the pipeline (Azure)

---

## Contract Tests For Providers
- Setup Specmatic in the project
  - In Java projects
    - Instructions for Maven dependencies (include instructions on projects that use Spring, which has conflicting versions of kotlin / JUnit)
    - Instructions for Gradle dependencies
    - Instructions for starting up a stub in Java, using JUnit 4 and JUnit 5
  - Node projects (for now, just a link to the node project)
  - Instructions for non-Java projects (e.g. PHP)
  - Setting up specmatic.json
- Running contract tests

---

## Create A Central Source Of Contracts
- Using a central git repo
  - How to setup stub and test to read from a remote repository
  - How to setup backward compatibility check in (Azure)
- Using a git monorepo

---

## Backward Compatibility
- How it works
- The backward compatibility rules

---

## Service Virtualisation In An Integrated Environment
- How to run Specmatic stub on a directory of contracts, and keep it in sync with the central repository
