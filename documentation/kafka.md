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
docker run -p 9092:9092 -p 2181:2181 -p 29092:29092 -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" znsio/specmatic-kafka
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
docker run -p 9092:9092 -p 2181:2181 -p 3000:3000 -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" znsio/specmatic-kafka --mock-server-api-port=3000
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
        description: Expectations payload
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExpectationRequest'
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
    ExpectationRequest:
      type: object
      properties:
        expectations:
          type: array
          items:
            $ref: '#/components/schemas/Expectation'
        topicsToIgnore:
          type: array
          items:
            type: string
      required:
        - expectations
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

### 📘 Specmatic Kafka Mock Server API Guide

The **Specmatic Kafka Mock Server** enables you to simulate Kafka-based interactions using an AsyncAPI specification. This is particularly useful for integration testing or when dependent services are not readily available.

---

#### ✅ API Capabilities

The mock server provides endpoints to interact with and validate Kafka message flows:

1. **Set Expectations**: Configure the server to expect specific messages on defined topics.
2. **Verify Expectations**: Validate whether the expected messages were received.

---

#### 🚀 Step 1: Start a Kafka Broker

Before using the mock server, ensure that an external Kafka broker is running. The following `docker-compose` file sets up both **Kafka** and **Zookeeper**:

```yaml
version: '3.8'

services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    container_name: zookeeper
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    volumes:
      - /var/lib/zookeeper

  kafka:
    image: confluentinc/cp-kafka:latest
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper
    volumes:
      - /var/lib/kafka/data
```

To start the broker:

```bash
docker compose up -d
```

Ensure the containers start successfully before proceeding.

---

#### ⚙️ Step 2: Launch the Kafka Mock Server

##### 📄 Create a specification file: `spec.yaml`

The mock server uses an AsyncAPI 3.0 spec to simulate message exchanges. Below is a sample `spec.yaml` that defines two Kafka channels:

- **place-order**: Receives an order request.
- **process-order**: Sends a reply once the order is processed.

```yaml
asyncapi: 3.0.0
info:
  title: Order API
  version: '1.0.0'

channels:
  place-order:
    messages:
      placeOrderMessage:
        $ref: "#/components/messages/OrderRequest"

  process-order:
    messages:
      processOrderMessage:
        $ref: "#/components/messages/Order"

operations:
  onPlaceOrder:
    action: receive
    channel:
      $ref: '#/channels/place-order'
    messages:
      - $ref: "#/channels/place-order/messages/placeOrderMessage"
    reply:
      channel:
        $ref: '#/channels/process-order'
      messages:
        - $ref: '#/channels/process-order/messages/processOrderMessage'

components:
  messages:
    OrderRequest:
      name: OrderRequest
      title: An order request
      contentType: application/json
      payload:
        $ref: '#/components/schemas/OrderRequest'

    Order:
      name: OrderToProcess
      title: An order that needs to be processed
      contentType: application/json
      payload:
        type: object
        required:
          - totalAmount
          - status
        properties:
          orderRequestId:
            type: integer
          totalAmount:
            type: number
          status:
            type: string
            enum:
              - NEW
              - IN_PROGRESS
              - PROCESSED
              - FAILED

  schemas:
    OrderRequest:
      type: object
      required:
        - id
        - orderItems
      properties:
        id:
          type: number
        orderItems:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'

    OrderItem:
      type: object
      required:
        - id
        - name
        - quantity
        - price
      properties:
        id:
          type: integer
        name:
          type: string
        quantity:
          type: integer
        price:
          type: number
```

---

Start the Specmatic Kafka mock server using the following command:

```bash
docker run --network host \
  -v "$PWD/spec.yaml:/usr/src/app/spec.yaml" \
  znsio/specmatic-kafka \
  virtualize spec.yaml \
  --external-broker-url localhost:9092
```

- The `--network host` flag ensures proper communication with the locally running Kafka broker.
- Replace `spec.yaml` with the path to your AsyncAPI specification file or use the following spec file.

---

#### 📝 Step 3: Set Expectations

Once the mock server is running, configure the expectations using a `POST` request to the API server (running at `localhost:9999`):

##### Request

```bash
curl -X POST http://localhost:9999/_expectations \
  -H "Content-Type: application/json" \
  -d '{
    "expectations": [
      {
        "topic": "place-order",
        "count": 1
      }
    ],
    "topicsToIgnore": ["__consumer_offsets"]
  }'
```

This tells the mock server to expect **1 message** on the `place-order` topic and ignore the `__consumer_offsets` topic.

###### When to use topicsToIgnore?

When connecting the Specmatic Kafka Mock Server to an external Kafka broker, it’s common for other active topics to exist—many of which may be unrelated to the scope of your current testing.

By default, Specmatic validates all Kafka activity against the topics defined in your AsyncAPI specification. Any message published to a topic not listed in the spec is treated as unexpected behavior, signaling a drift from the contract and resulting in a failure.

This is where the topicsToIgnore configuration becomes essential. It allows you to exclude specific topics (e.g., __consumer_offsets, _schemas, or any infrastructure-related ones) from validation, ensuring that external system noise doesn’t interfere with your testing.

Use topicsToIgnore to maintain a clean and accurate environment, especially when dealing with shared or production-like Kafka brokers.

---

#### 📨 Step 4: Publish a Message

Send a valid message to the `place-order` topic using Kafka CLI:

```bash
echo '{"id":12345,"orderItems":[{"id":1,"name":"Macbook","quantity":1,"price":2000.0},{"id":2,"name":"Iphone","quantity":1,"price":1000.0}]}' | docker compose exec -T kafka kafka-console-producer \
  --broker-list localhost:9092 \
  --topic place-order \
  --property "parse.key=false" \
  --producer-property "acks=all" \
  --property "value.serializer=org.apache.kafka.common.serialization.StringSerializer"
```

---

#### ✅ Step 5: Verify Expectations

Check whether the expected messages were received and they were **schema valid** as per the specification using the `GET` verification endpoint:

##### Request

```bash
curl http://localhost:9999/_expectations/verification_status
```

##### Successful Response

```json
{
  "success": true,
  "errors": []
}
```

If the verification fails, the response will include details of the mismatches.

---

#### ℹ️ Additional Notes

- You can mount a different `spec.yaml` anytime to simulate different message contracts.
- Use the `topicsToIgnore` field to exclude system/internal topics.
- Ensure all published messages adhere to the schema defined in the spec.


# Running Contract Tests Against a Kafka-Based Request-Reply Service

Create a service which implements the kafka messaging architecture as per the [order_service_async.yaml](https://github.com/znsio/specmatic-order-contracts/blob/main/io/specmatic/examples/store/asyncapi/order_service_async_v1.yaml) specification.

This service will use a Kafka consumer to listen to the `place-order` topic, and upon receiving a message, it will publish one message each to the `process-order` and `notification` topics. This architecture pattern is known as the request-reply pattern.

### Service Implementation
1. Consumer: Listens to the place-order topic.
2. Producer: Publish messages to process-order and notification topics.

### Specmatic Configuration
Create a specmatic.yaml configuration file to specify the contract for the service:
```yaml
sources:
- provider: "git"
  repository: "https://github.com/znsio/specmatic-order-contracts.git"
  provides:
  - "io/specmatic/examples/store/asyncapi/order_service_async_v1.yaml"
```
This configuration informs Specmatic that the service provides the implementation as per the specification listed under the provides key. This setup allows Specmatic to run tests against the service using the provided spec.

### Testing the Service
To test this service from the command line, follow the below steps.
1. **Start Kafka Broker**: Launch a local instance of the Kafka broker on the desired host and port.
2. **Run the Service**: Start your service locally.
3. **Run Contract Tests**: Use the following command to run the contract tests against the service by replacing `kafka_broker_host` and `kafka_broker_port` with appropriate values:
```shell
docker run --network="host" -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" znsio/specmatic-kafka test --host=<kafka_broker_host> --port=<kafka_broker_port>
```

To get information around all the CLI args of the `test` command, run the following command.
```shell
docker run znsio/specmatic-kafka test --help
```

To get a hands-on experience, refer to [these](https://specmatic.io/documentation/sample_projects.html#kafka) sample projects.

