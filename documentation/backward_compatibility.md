---
layout: default
title: Backward Compatibility
parent: Documentation
nav_order: 10
---
Backward Compatibility
==========

- [Backward Compatibility](#backward-compatibility)
  - [About Backward Compatibility](#about-backward-compatibility)
  - [Comparing Two Contracts (Contract vs Contract)](#comparing-two-contracts-contract-vs-contract)
  - [Validating Changes In Git On Your Laptop](#validating-changes-in-git-on-your-laptop)
  - [Validating Changes In CI](#validating-changes-in-ci)
  - [Handling Contracts In Progress](#handling-contracts-in-progress)
  - [Backward Compatibility Rules](#backward-compatibility-rules)

## About Backward Compatibility

If an API provider implementing a change to a contract would become incompatible with existing consumers due to the change, the changes to the contract are NOT backward compatible.

Aim to make all changes to a contract backward compatible, to ensure that an updated API provider can be deployed as soon as it is ready, without waiting for consumers to catchup.

Specmatic can provide instant feedback when a change to an API provider will break consumers by looking at the old and new contract. This feedback only requires the contract. No code needs to be written, saving the provider the effort of writing code.

<img src="https://specmatic.in/wp-content/uploads/2022/09/Compatability.png" width="60%" height="60%" />

[Watch this video](https://www.youtube.com/watch?v=vBwzEpnQ7To&t=1197s) to see it in action. Read on and even try it out yourself!

## Comparing Two Contracts (Contract vs Contract)

Create a file named api_products_v1.yaml.

```yaml
# filename api_products_v1.yaml
openapi: 3.0.0
info:
  title: Sample Product API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9
servers:
  - url: http://localhost:8080
    description: Local
  - url: http://localhost:9000
    description: Specmatic Stub Server
paths:
  /products/{id}:
    get:
      summary: Get Products
      description: Get Products
      parameters:
        - in: path
          name: id
          schema:
            type: number
          required: true
          description: Numerical Product Id
      responses:
        '200':
          description: Returns Product With Id
          content:
            application/json:
              schema:
                type: object
                required:
                  - name
                properties:
                  name:
                    type: string
                  sku:
                    type: string
```

This contract contains an API for fetching the details of a product.

Let's add a new api to create a product record:

```yaml
# filename api_products_v2.yaml
openapi: 3.0.0
info:
  title: Sample Product API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9
servers:
  - url: http://localhost:8080
    description: Local
  - url: http://localhost:9000
    description: Specmatic Stub Server
paths:
  /products/{id}:
    get:
      summary: Get Products
      description: Get Products
      parameters:
        - in: path
          name: id
          schema:
            type: number
          required: true
          description: Numerical Product Id
      responses:
        '200':
          description: Returns Product With Id
          content:
            application/json:
              schema:
                type: object
                required:
                  - name
                properties:
                  name:
                    type: string
                  sku:
                    type: string
  /products:
    post:
      summary: Add Product
      description: Add Product
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required:
                - name
              properties:
                name:
                  type: string
                sku:
                  type: string
                  nullable: true
      responses:
        '200':
          description: Returns Product With Id
          content:
            application/json:
              schema:
                type: object
                required:
                  - id
                properties:
                  id:
                    type: integer
```

The old /products/{id} API remains intact, and the new /products API is added on.

The newer contract is backward compatible with the older, as existing consumers are only using the old API, which remains unchanged.

Run the specmatic compare command to confirm this, and see the result:

{% tabs compare %}
{% tab compare java %}
```bash
java -jar specmatic.jar compare api_products_v1.yaml api_products_v2.yaml
```
{% endtab %}
{% tab compare docker %}
```bash
docker run -v "/local-directory:/specs" znsio/specmatic compare "/specs/api_products_v1.yaml" "/specs/api_products_v2.yaml" 
```
{% endtab %}
{% endtabs %}

You should now see an output as shown below.
```bash
The newer contract is backward compatible
```

Let's change the original contract of square to return `sku` as a num `integer` instead of `string` in the response:

```yaml
# filename api_products_v2.yaml
openapi: 3.0.0
info:
  title: Sample Product API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9
servers:
  - url: http://localhost:8080
    description: Local
  - url: http://localhost:9000
    description: Specmatic Stub Server
paths:
  /products/{id}:
    get:
      summary: Get Products
      description: Get Products
      parameters:
        - in: path
          name: id
          schema:
            type: number
          required: true
          description: Numerical Product Id
      responses:
        '200':
          description: Returns Product With Id
          content:
            application/json:
              schema:
                type: object
                required:
                  - name
                properties:
                  name:
                    type: string
                  sku: #this has changed from string to integer
                    type: integer
```

Now try it again:

{% tabs compare2 %}
{% tab compare2 java %}
```bash
java -jar specmatic.jar compare api_products_v1.yaml api_products_v2.yaml
```
{% endtab %}
{% tab compare2 docker %}
```bash
docker run -v "/local-directory:/specs" znsio/specmatic compare "/specs/api_products_v1.yaml" "/specs/api_products_v2.yaml" 
```
{% endtab %}
{% endtabs %}

Specmatic will show you an error message, saying that the change is not backward compatible. The reason for this is that existing consumers are expecting a string "sku", but will get an "integer" instead.

```bash
In scenario "Get Products. Response: Returns Product With Id"
API: GET /products/(id:number) -> 200

  >> RESPONSE.BODY.sku

     This is number in the new contract response but string in the old contract

The newer contract is not backward compatible.
```

If the change is not backward compatible, the compare command exits with exit code 1. You can use this in a script.

## Validating Changes In Git On Your Laptop

If `api_products_v1.yaml` is part of a git repository, changes can be made directly to this file instead of creating a new one.

Then to confirm that it is a backward compatible change, before committing the change, run this command:

{% tabs git-compare %}
{% tab git-compare java %}
```bash
java -jar specmatic.jar compatible git file ./run/specmatic/examples/api_products_v1.yaml
```
{% endtab %}
{% tab git-compare docker %}
```bash
docker run -v "/git-repo:/git-repo" znsio/specmatic compatible git file "/git-repo/api_products_v1.yaml"
```
{% endtab %}
{% endtabs %}

This command exits with exit code 1 if the change is backward incompatible. It can be configured as a git pre-commit hook.

```bash
The newer contract is backward compatible
```

## Validating Changes In CI

In CI, you will need to compare the changes in a contract from one commit to the next.

You can do this with the following command:

{% tabs ci-compare %}
{% tab ci-compare java %}
```bash
> java -jar specmatic.jar compatible git commits api_products_v1.yaml HEAD HEAD^1

The newer contract is backward compatible
```
{% endtab %}
{% tab ci-compare docker %}
```bash
docker run -v "/git-repo:/git-repo" znsio/specmatic compatible git commits "/git-repo/api_products_v1.yaml" HEAD HEAD^1

The newer contract is backward compatible
```
{% endtab %}
{% endtabs %}

You can even use commit hashes here if you wish to compare any other pair of commits.

This command exits with exit code 1 if the change is backward incompatible.

## Handling Contracts In Progress

APIs whose design is still in progress can be tagged WIP in the OpenAPI contract. Specmatic will not break builds or return failure on when it see backward incompatible changes to WIP APIs. It will still print the error feedback.

```yaml
# filename api_products_v1.yaml
openapi: 3.0.0
info:
  title: Sample Product API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9
servers:
  - url: http://localhost:8080
    description: Local
  - url: http://localhost:9000
    description: Specmatic Stub Server
paths:
  /products/{id}:
    get:
      summary: Get Products
      description: Get Products
      tags:
        - "WIP"
      parameters:
        - in: path
          name: id
          schema:
            type: number
          required: true
          description: Numerical Product Id
      responses:
        '200':
          description: Returns Product With Id
          content:
            application/json:
              schema:
                type: object
                required:
                  - name
                properties:
                  name:
                    type: string
                  sku:
                    type: string
  /products:
    post:
      summary: Add Product
      description: Add Product
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required:
                - name
              properties:
                name:
                  type: string
                sku:
                  type: string
                  nullable: true
      responses:
        '200':
          description: Returns Product With Id
          content:
            application/json:
              schema:
                type: object
                required:
                  - id
                properties:
                  id:
                    type: integer
```

Once the contract is complete you can remove the WIP tag.

## Backward Compatibility Rules

Maintaining backward compatibility is about changing the API provider WITHOUT breaking any existing consumer. Consumers should just continue working as-is, without needing to "keep up".

[Read this for more](https://specmatic.in/documentation/backward_compatibility_rules.html).
