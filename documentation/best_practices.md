---
layout: default
title: Best Practices
parent: Documentation
nav_order: 14
---
Best Practices
========

- [Organizing Contract Files](#organising-contract-files)
    - [Authoring Contract Files - The Dilemma](#authoring-contract-files---the-dilemma)
    - [Single Responsibility Principle](#single-responsibility-principle)
    - [Namespaces](#namespacing)
    - [Static Stub Json](#static-stubs)
- [Contract Design Principles](#contract-design-principles)
    - [Smells and Remedies](#smells)
- [Continuous Integration and Pull Request Builders](#ci-and-pull-request-builders)

Organizing contract files
--------

We have already covered how to author good [scenarios](/documentation/language.html). Let us walk through the aspects we should consider when stringing scenarios together in contract files.

### Authoring Contract Files - The Dilemma

**All scenarios and APIs in one .qontract file**
* Advantages
    * One single place to look at
    * Common structures and datatypes that are declared in the background section can be re-used across many scenarios
* Disadvantages / Smells
    * The .qontract file can become large and becomes a scroll hell
    * Churn and merge conflicts etc. because everyone updates the same file
    
**One .qontract file per API endpoint**
* Advantages
    * Short .qontract files
* Disadvantages / Smells
    * Common structures / datatypes across endpoints have to be duplicated (because we cannot import one .qontract file inside another)

As mentioned above, both of these extremes are not necessarily the best.

### Single Responsibility Principle

We recommend adhering to SRP in order to achieve well authored contracts.

* Each .qontract should have scenarios (regardless of whether they belong one endpoint or several endpoints) that are related to a single axis of change.
* In other words, a contract file must change for one and only reason (entity, purpose or action).
* This promotes healthy re-usability of structures and datatypes and helps in reducing merge conflicts
* It may take time to triangulate on the right set of scenarios per file. In the long term this approach is best suited or applications of any size.

### Namespacing

It is a good idea to maintain contract files under folder structures that represent namespaces just like you would maintain code.
Example: com/shop/orders/returns.qontract

While this is not mandated, it is highly recommended as a way to improve maintainablity.

### Static stubs

Static stub files should be co-located with their respective contracts. Example:

```
/com
    /shop
        /orders
            returns.qontract
            /returns_data
                returns.json
```

Contract Design Principles
------
* Be specific with datatypes.
    * This improves ability spot issues when running the contract as a test and in generating meaningful dummy values in stub mode.
    * Example: Prefer date/url over string where possible
* When your Scenario has several nullable values, prefer levering Scenario Outline. In Scenario Outline provide multiple example rows when there are nullable values.
    * Qontract runs [two tests per nullable value](/documentation/language.html#nullable-operator), one for null and one for non-null value. When there are several nullable values Qontract will attempt running tests for all permutations.
    * The example rows in [Scenario Outline](/documentation/language.html#scenario-outline) can help Qontract in determining which are the plausible combinations in the context of your application.
* Reduce Duplication. Extract common structures and datatypes to background.
    * Helps reduce verbosity in scenarios
    * Reduces human error that can happen when there is duplication of structure or datatype definition across scenarios

### Smells
* Too many optional parameters in a single API - Indicates that this API needs to split.

CI and Pull Request Builders
------
* In repositories that store contracts, we recommend running the backward-compatibility check as a bare minimum
* It is also helpful to have a Pull Request builder that can run the backward-compatibility check and annotate PRs where a contract change is involved
