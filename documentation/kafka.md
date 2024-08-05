---
layout: default
title: Kafka
parent: Documentation
nav_order: 18
---
# Starting Kafka Mock Server from command line

Create a file named `specmatic.yaml` with below content.

```yaml
#specmatic.yaml
sources:
  - provider: git
    repository: https://github.com/znsio/specmatic-order-contracts.git
    consumes:
      - io/specmatic/examples/store/asyncapi/kafka.yaml
```

This file instructs Specmatic to pull the [AsyncAPI spec named `kafka.yaml`](https://github.com/znsio/specmatic-order-contracts/blob/main/io/specmatic/examples/store/asyncapi/kafka.yaml) from a Git repo. The AsyncAPI spec itself has the details regarding Kafka topics, schema, etc.

Please refer to [Specmatic documentation](https://specmatic.in/documentation/) for more details about the above `specmatic.yaml` config file.

Now we can run below command to spin a Kafka mock server. Please note the volume mapping to pass the specmatic.yaml to the Kafka Docker image and also the port mappings.

```shell
docker run -p 9092:9092 -p 2181:2181 -p 29092:29092 -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" znsio/specmatic-kafka-trial
```

This should produce logs that shows that Specmatic Kafka server has started and listening on topics.

```bash
Setting up listeners
Listening on topics: (product-queries)
```

This command also starts an API server to interact with the mock server on the default port 29092.
```bash
Starting api server on port:29092
```

The API server can be started on a port other than 29092 by passing the desired port via `--mock-server-api-port` CLI argument as follows.
```shell
docker run -p 9092:9092 -p 2181:2181 -p 3000:3000 -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" znsio/specmatic-kafka-trial --mock-server-api-port=3000
```

## Interacting with the API server

The API server provides endpoints to interact with the kafka mock server, allowing you to perform the following actions:
1. Set Expectations: Configure the Kafka mock server with specific expectations.
2. Verify Expectations: Check if the expectations set for the Kafka mock server have been met.

Here is the OpenAPI specification for these endpoints. Please refer to it for comprehensive information on how to utilize these endpoints.
```yaml
openapi: 3.0.0
info:
  title: Specmatic Kafka Mock Server API
  version: 1.0.0
servers:
  - url: http://localhost:29092
paths:
  /_expectations:
    post:
      summary: This endpoint allows you to set expectations for the Kafka mock server.
      requestBody:
        description: A list of expectations
        required: true
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Expectation'
      responses:
        '200':
          description: Expectations saved successfully
          content:
            text/plain:
              schema:
                type: string
  /_expectations/verification_status:
    get:
      summary: This endpoint checks if the expectations set for the Kafka mock server have been met.
      responses:
        '200':
          description: Verification result
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/VerificationResult'
components:
  schemas:
    Expectation:
      type: object
      properties:
        topic:
          type: string
        count:
          type: integer
        headers:
          type: object
          additionalProperties:
            type: string
        body:
          type: string
          nullable: true
      required:
        - topic
        - count
    VerificationResult:
      type: object
      properties:
        success:
          type: boolean
        errors:
          type: array
          items:
            type: string
      required:
        - success
        - errors
```

## Sample project to see full usage

[Order BFF Application](https://github.com/znsio/specmatic-order-bff)
