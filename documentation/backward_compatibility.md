---
layout: default
title: Backward Compatibility
parent: Documentation
nav_order: 10
---
Backward Compatibility
==========

- [Backward Compatibility](#backward-compatibility)
  - [What It Means](#what-it-means)
  - [Comparing Two Contracts](#comparing-two-contracts)
  - [Validating Changes In Git On Your Laptop](#validating-changes-in-git-on-your-laptop)
  - [Validating Changes In CI](#validating-changes-in-ci)
  - [Handling Contracts In Progress](#handling-contracts-in-progress)
  - [Rules Of Thumb](#rules-of-thumb)

## What It Means

If a change to an API provider would break existing consumers, the change is NOT backward compatible.

If an API provider implementing a change to a contract would become incompatible with existing consumers, the changes to the contract are NOT backward compatible.

Aim to make all changes to a contract backward compatible, to ensure that an updated API provider can be deployed as soon as it is ready, without waiting for consumers to catchup.

To that end, Specmatic can provide instant feedback when a change to an API provider will break consumers by looking at the old and new provider contract. This saves the provider from actually writing code and breaking consumers after deployment.

## Comparing Two Contracts

Create a file named api_math_v1.yaml.

```yaml
# filename api_math_v1.yaml
openapi: 3.0.1
info:
  title: Math API
  version: "1"
paths:
  /square:
    post:
      summary: Square of a number
      parameters: []
      requestBody:
        content:
          text/plain:
            schema:
              type: number
      responses:
        "200":
          description: Square of a number
          content:
            text/plain:
              schema:
                type: number
```

If we add a new api for cubing numbers, the contract may look like this:

```yaml
# filename api_math_v1-2.yaml
openapi: 3.0.1
info:
  title: Math API
  version: "1"
paths:
  /square:
    post:
      summary: Square of a number
      parameters: []
      requestBody:
        content:
          text/plain:
            schema:
              type: number
      responses:
        "200":
          description: Square of a number
          content:
            text/plain:
              schema:
                type: number
  /cube:
    post:
      summary: Cube of a number
      parameters: []
      requestBody:
        content:
          text/plain:
            schema:
              type: number
      responses:
        "200":
          description: Cube of a number
          content:
            text/plain:
              schema:
                type: number
```

The old /square remains intact, and the new /cube API is added on.

The newer contract is backward compatible with the older, as existing consumers are only using the old API, which remains unchanged.

Run the specmatic compare command to confirm this:

```bash
> java -jar specmatic.jar compare api_math_v1.yaml api_math_v1-2.yaml
```

However, if we changed the api of square, to return a json object instead of a value in the response:

```yaml
# filename api_math_v2.yaml
openapi: 3.0.1
info:
  title: Math API
  version: "1"
paths:
  /square:
    post:
      summary: Square of a number
      parameters: []
      requestBody:
        content:
          text/plain:
            schema:
              type: number
      responses:
        "200":
          description: Square of a number
          content:
            text/plain:
              schema:
                type: object
                properties:
                  result:
                    type: number
```

Now try it again:

```bash
> java -jar specmatic.jar compare api_math_v1.yaml api_math_v2.yaml
```

Specmatic will show you an error message, saying that the change is not backward compatible. The reason for this is that existing consumers are expecting a plain text numeric value in the response, but a provider implementing this API would return a JSON object.

If the change is not backward compatible, the compare command exits with exit code 1. You can use this in a script.

## Validating Changes In Git On Your Laptop

If api_math_v1.yaml is in a git repository, and the change is backward compatible, make the change directly to the v1 file instead of creating a new one.

Before committing the change, run this command:

```bash
java -jar specmatic.jar compatible git file ./run/specmatic/examples/api_math_v1.yaml
```

## Validating Changes In CI

In CI, you will need to compare the changes in a contract from one commit to the next.

You can do this with the following command:

```bash
> java -jar specmatic.jar compatible git commits api_math_v1.yaml HEAD HEAD^1
```

You can even use commit hashes here if you wish to compare any other pair of commits.

## Handling Contracts In Progress

APIs whose design is still in progress can be tagged WIP in the OpenAPI contract. Specmatic will not break builds or return failure on when it see backward incompatible changes to WIP APIs. It will still print the error feedback.

```yaml
# filename api_math_v1.yaml
openapi: 3.0.1
info:
  title: Math API
  version: "1"
paths:
  /square:
    post:
      summary: Square of a number
      tags:
        - WIP
      parameters: []
      requestBody:
        content:
          text/plain:
            schema:
              type: number
      responses:
        "200":
          description: Square of a number
          content:
            text/plain:
              schema:
                type: number
```

Once the contract is complete you can remove the WIP tag.

## Rules Of Thumb

Maintaining backward compatibility is about changing the API provider WITHOUT breaking any existing consumer. Consumers should just continue working as-is, without needing to "keep up".

Here are some rules of thumb to keep in mind.

1. The provider should not expect existing consumers to send something they were not sending before in the request. For example, don't add a compulsory JSON key to any request contract.
2. The provider should not send back anything that consumers were not expecting before in the response. For example, don't remove a JSON key from any response.
