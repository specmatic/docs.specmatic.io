---
layout: default
title: Best Practices
parent: Documentation
nav_order: 15
---
Best Practices
========

- [Best Practices](#best-practices)
  - [Design Patterns](#design-patterns)
    - [All API endpoints in one .qontract file](#all-api-endpoints-in-one-qontract-file)
    - [One API endpoint per .qontract file](#one-api-endpoint-per-qontract-file)
    - [Multiple scenarios per endpoint](#multiple-scenarios-per-endpoint)
  - [Principles Of Design](#principles-of-design)
  - [Namespacing](#namespacing)
  - [Static stubs](#static-stubs)
  - [CI and Pull Request Builders](#ci-and-pull-request-builders)

We have already covered how to author good [scenarios](/documentation/language.html). Let us walk through the aspects we should consider when stringing scenarios together in contract files.

## Design Patterns

### All API endpoints in one .qontract file

When all the endpoints are simple, data structures are not too deep, or the list of APIs is small, all the scenarios related to these end points can go into a single file.

* Advantages
    * One single place to look at for all the APIs.
    * Common structures and datatypes that are declared in the Background section can be re-used across many scenarios.
* Disadvantages / Smells
    * The .qontract file can become large and becomes a scroll hell.
    * All the developers update the same file, resulting in a larger number of merge conflics.

### One API endpoint per .qontract file

High complexity of API endpoints may result in too much information stuffed into a single contract file. This often happens when the data structures in the request or response payloads are very deep. When faced with such an API end point, put the definition of the API into a file by itself.

* Advantages
    * Easier to comprehend .qontract files
* Disadvantages / Smells
    * Common structures / datatypes across endpoints have to be duplicated (because we cannot import one .qontract file inside another)

### Multiple scenarios per endpoint

A large number of optional keys is usually a design smell. The concerned API payload usually contains multiple groups of keys, where all the keys in a group are either present or missing together. If they are all simply marked optional, the contract will let you stub out incorrect combinations of optional keys any which way, without giving you feedback.

Let's look at a concrete example.

Here's a contract to get the dimensions of any shape, be it rectangle, triangle or circle. A single-scenario contract would look like this:

```gherkin
Feature: Shape API
  Scenario: Dimensions
    When GET /dimensions/(id:number)
    Then status 200
    And response-body
    | type           | (string) |
    | length?        | (number) |
    | breadth?       | (number) |
    | side1?         | (number) |
    | side2?         | (number) |
    | side3?         | (number) |
    | circumference? | (number) |
```

This is a poor API spec. length and breadth will both be there when the shape is a rectangle, and neither for a circle (which will have circumference).

So the API will never return, for example, a body with length and side1. And we should not be able to stub it out. But the current contract allows us to do this. As a result, when we actually integrate our consumer with the real shape API, the consumer is expecting length and side1, but it would get length and breadth, and the consumer would break as a result.

To avoid this problem, the API should be represented in the form of 3 different scenarios.

```gherkin
Feature: Shape API
  Scenario: Dimensions of a rectangle
    When GET /dimensions/(id:number)
    Then status 200
    And response-body
    | type    | (string) |
    | length  | (number) |
    | breadth | (number) |

  Scenario: Dimensions of a triangle
    When GET /dimensions/(id:number)
    Then status 200
    And response-body
    | type  | (string) |
    | side1 | (number) |
    | side2 | (number) |
    | side3 | (number) |

  Scenario: Dimensions of a circle
    When GET /dimensions/(id:number)
    Then status 200
    And response-body
    | type          | (string) |
    | circumference | (number) |
```

But now there's so much duplication in these scenarios. This too can be fixed:

```gherkin
Feature: Shape API
  Background:
    When GET /dimensions/(id:number)
    Then status 200

  Scenario: Dimensions of a rectangle
    * response-body
    | type    | (string) |
    | length  | (number) |
    | breadth | (number) |

  Scenario: Dimensions of a triangle
    * response-body
    | type  | (string) |
    | side1 | (number) |
    | side2 | (number) |
    | side3 | (number) |

  Scenario: Dimensions of a circle
    * response-body
    | type          | (string) |
    | circumference | (number) |
```

Note how [background](documentation/../language.html#background) contains everything that's common to the scenarios.

## Principles Of Design
* Be specific with datatypes.
    * This improves ability spot issues when running the contract as a test and in generating meaningful dummy values in stub mode.
    * Example: Prefer date/url over string where possible
* When your Scenario has several nullable values, use Scenario Outline. In Scenario Outline provide multiple example rows when there are nullable values.
    * Qontract runs [two tests per nullable value](/documentation/language.html#nullable-operator), one for null and one for non-null value. When there are several nullable values Qontract will attempt running tests for all permutations.
    * The example rows in [Scenario Outline](/documentation/language.html#scenario-outline) can help Qontract in determining which are the plausible combinations in the context of your application.
* Reduce Duplication. Extract common structures and datatypes to background.
    * Helps reduce verbosity in scenarios
    * Reduces human error that can happen when there is duplication of structure or datatype definition across scenarios
* Single Responsibility Principle
    * We recommend adhering to SRP in order to achieve well authored contracts.
    * Each .qontract should have scenarios (regardless of whether they belong one endpoint or several endpoints) that are related to a single axis of change.
    * In other words, a contract file must change for one and only reason (entity, purpose or action).
    * This promotes healthy re-usability of structures and datatypes and helps in reducing merge conflicts
    * It may take time to triangulate on the right set of scenarios per file. In the long term this approach is best suited or applications of any size.

## Namespacing

It is a good idea to maintain contract files under folder structures that represent namespaces just like you would maintain code.

For example:

```
/com
    /shop
        /orders
            returns.qontract
```

While this is not mandated, it is highly recommended as a way to improve maintainablity.

## Static stubs

Static stub files should be co-located with their respective contracts. Example:

```
/com
    /shop
        /orders
            returns.qontract
            /returns_data
                returns.json
```

## CI and Pull Request Builders
* In repositories that store contracts, we recommend running the backward-compatibility check as a bare minimum
* It is also helpful to have a Pull Request builder that can run the backward-compatibility check and annotate PRs where a contract change is involved
