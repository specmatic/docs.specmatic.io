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
- Independent development and deployment

## Using the tools

### Writing contracts
- How to write contracts (using Stoplight Studio for OpenAPI)
- Use of OpenAPI features not yet supported by Stoplight Studio, including dictionaries, xml support

### Service virtualisation
- Review of "intelligent service virtualisation"
- Specmatic project setup
  - In Java projects
    - Instructions for Maven dependencies (include instructions on projects that use Spring, which has conflicting versions of kotlin / JUnit)
    - Instructions for Gradle dependencies
    - Instructions for starting up a stub in Java, using JUnit 4 and JUnit 5
  - Node projects (for now, just a link to the node project)
  - Instructions for non-Java projects (e.g. PHP)
- Setting up specmatic.json
- How to do service virtualisation
  - Static service virtualisation
  - Dynamic service virtualisation
  - With contracts in the repo
  - With contracts in another repo
- Making contracts in another repo run in the pipeline (Azure)

### Contract Tests
- Review of "contract testing"
- Specmatic project setup
  - In Java projects
    - Instructions for Maven dependencies (include instructions on projects that use Spring, which has conflicting versions of kotlin / JUnit)
    - Instructions for Gradle dependencies
    - Instructions for starting up a stub in Java, using JUnit 4 and JUnit 5
  - Node projects (for now, just a link to the node project)
  - Instructions for non-Java projects (e.g. PHP)
- Setting up specmatic.json
- Run contract tests using Java helpers
- Run the contract tests using the commandline tool
- Run contract tests using the node helper (link to the node project)

### How to share contracts
- Using a central git repo
  - How to setup stub and test to read from a remote repository
  - How to setup backward compatibility check in (Azure)
- Using a git monorepo

### Service virtualisation in an integrated environment
- How to run Specmatic stub on a directory of contracts, and keep it in sync with the central repository
- 