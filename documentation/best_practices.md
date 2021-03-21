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
    - [All API endpoints in one .spec file](#all-api-endpoints-in-one-specmatic-file)
    - [One API endpoint per .spec file](#one-api-endpoint-per-specmatic-file)
    - [Multiple scenarios per endpoint](#multiple-scenarios-per-endpoint)
  - [Principles Of Design](#principles-of-design)
  - [Namespacing](#namespacing)
  - [Static stubs](#static-stubs)
  - [CI and Pull Request Builders](#ci-and-pull-request-builders)

We have already covered how to author good [scenarios](/documentation/language.html). Let us walk through the aspects we should consider when stringing scenarios together in contract files.

## Design Patterns

### All API endpoints in one .spec file

When all the endpoints are simple, data structures are not too deep, or the list of APIs is small, all the scenarios related to these end points can go into a single file.

* Advantages
    * One single place to look at for all the APIs.
    * Common structures and datatypes that are declared in the Background section can be re-used across many scenarios.
* Disadvantages / Smells
    * The .spec file can become large and becomes a scroll hell.
    * All the developers update the same file, resulting in a larger number of merge conflics.

### One API endpoint per .spec file

High complexity of API endpoints may result in too much information stuffed into a single contract file. This often happens when the data structures in the request or response payloads are very deep. When faced with such an API end point, put the definition of the API into a file by itself.

* Advantages
    * Easier to comprehend .spec files
* Disadvantages / Smells
    * Common structures / datatypes across endpoints have to be duplicated (because we cannot import one .spec file inside another)

### Multiple scenarios per endpoint

A large number of optional keys is usually a design smell. The concerned API payload usually contains multiple groups of keys, where all the keys in a group are either present or missing together. If they are all simply marked optional, the contract will let you stub out incorrect combinations of optional keys any which way, without giving you feedback.

Here's a concrete example.

Let's describe an API that returns the dimensions of a shape. If the requested shape is a rectangle, the response JSON contains two keys, `length` and `breadth`, if a circle, `circumference`, and if a triangle, `side1`, `side2` and `side3`.

Here's what a single-scenario contract might look like:

```gherkin
Feature: Shape API
  Scenario: Dimensions
    When GET /dimensions/(shape_id:number)
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

Now the contract shows almost all the keys as optional. This lets us stub out a response containing only length and side1, which is unrealistic. The real API would never return such a response, so we should not be able to stub out such a response either.

But the contract in this form allows it. So if we in error stub out a response with length and side1, and write our consumer against this stub, we'd get no negative feedback. Then, when we actually integrate our consumer with the real shape API instance, the consumer will expect length and side1, but it will get length and breadth, and it will break.

If the contract were designed better, the incorrect stub of length and side1 itself would have been rejected, saving us the integration error.

Take a look at the contract below:

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

This contract will not let us stub out a response with length and side1. None of the scenarios support that combination.

But now there's duplication in all the scenarios. This too can be fixed:

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

Note how the [background](documentation/../language.html#background) contains everything that's common to the scenarios.

## Principles Of Design
* Be specific with datatypes.
    * This improves ability spot issues when running the contract as a test and in generating meaningful dummy values in stub mode.
    * Example: Prefer date/url over string where possible
* When your Scenario has several nullable values, use Scenario Outline. In Scenario Outline provide multiple example rows when there are nullable values.
    * Specmatic runs [two tests per nullable value](/documentation/language.html#nullable-operator), one for null and one for non-null value. When there are several nullable values Specmatic will attempt running tests for all permutations.
    * The example rows in [Scenario Outline](/documentation/language.html#scenario-outline) can help Specmatic in determining which are the plausible combinations in the context of your application.
* Reduce Duplication. Extract common structures and datatypes to background.
    * Helps reduce verbosity in scenarios
    * Reduces human error that can happen when there is duplication of structure or datatype definition across scenarios
* Single Responsibility Principle
    * We recommend adhering to SRP in order to achieve well authored contracts.
    * Each .spec should have scenarios (regardless of whether they belong one endpoint or several endpoints) that are related to a single axis of change.
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
            returns.spec
```

While this is not mandated, it is highly recommended as a way to improve maintainablity.

## Static stubs

Static stub files should be co-located with their respective contracts. Example:

```
/com
    /shop
        /orders
            returns.spec
            /returns_data
                returns.json
```

## CI and Pull Request Builders
* In repositories that store contracts, we recommend running the backward-compatibility check as a bare minimum
* It is also helpful to have a Pull Request builder that can run the backward-compatibility check and annotate PRs where a contract change is involved
