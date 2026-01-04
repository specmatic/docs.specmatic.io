---
layout: default
title: AsyncAPI
parent: Supported Protocols
nav_order: 1
has_children: true
has_toc: false
redirect_from:
  - /documentation/supported_protocols/asyncapi/
---

# AsyncAPI Specification
{: .no_toc }

Specmatic Async - Multi-protocol async messaging testing and mocking
{: .fs-6 .fw-300 }

**Specmatic Async** enables contract testing and mocking of event-driven APIs and asynchronous messages/events across multiple protocols. Test complex async integrations with a unified approach, regardless of the underlying messaging technology.

Currently, specmatic-async supports the following protocols inside the AsyncAPI specifications:
- [Kafka](/supported_protocols/asyncapi/kafka.html)
- [ActiveMQ](/supported_protocols/asyncapi/active-mq.html)
- [RabbitMQ](/supported_protocols/asyncapi/rabbit-mq.html)
- [AWS SNS](/supported_protocols/asyncapi/aws-sns.html)
- [AWS SQS](/supported_protocols/asyncapi/aws-sqs.html)
- [AWS EventBridge](/supported_protocols/asyncapi/aws-event-bridge.html)
- [MQTT](/supported_protocols/asyncapi/mqtt.html)
- [WebSocket](/supported_protocols/asyncapi/web-sockets.html)
- [JMS](/supported_protocols/asyncapi/jms.html)
- [Google Pub/Sub](/supported_protocols/asyncapi/google-pub-sub.html)

## Table of Contents
{: .no_toc }

* TOC
{:toc}

## Typical Use-case
You want to drop a message on a specific topic/queue in a messaging platform (let's say Amazon SQS), then your application picks up the message, processes it and then then emits a updated message on another topic/queue in the same or different messaging platform (let's say Kafka). You want to verify if this flow is working correctly, the messages are adhering to your defined schemas, the correct integration/messaging pattern (fire-and-forget, request-reply, pub-sub, event-stream, etc.) is being followed and so on.

To help you verify the above with a No-Code approach, Specmatic will send example messages described by AsyncAPI spec files on Amazon SQS queues, verifies the corresponding messages have reached the right Kafka topics, and generates CTRF reports for the test run.

### What Specmatic does
- Validates SQS → Kafka integration by running contract tests defined in the AsyncAPI spec files.
- Sends messages to the configured SQS endpoint and waits for expected Kafka messages.
- Generates a CTRF report at the end of the run.

## Quick start

Basic run:

```bash
docker run --rm --network host \
  -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" \
  -v "$PWD/spec:/usr/src/app/spec" \
  -v "$PWD/build/reports/specmatic:/usr/src/app/build/reports/specmatic" \
  specmatic/specmatic-async test
```

### Key Capabilities

| Feature                      | Description                                                                                    |
|------------------------------|------------------------------------------------------------------------------------------------|
| **Multi-Protocol Support**   | Kafka, SQS, SNS, ActiveMQ, RabbitMQ, MQTT, Google Pub/Sub, WebSocket, AWS EventBridge and more |
| **Cross-Protocol Messaging** | Mix request/reply channels across different protocols                                          |
| **Contract Testing**         | Verify async integrations match your AsyncAPI specs                                            |
| **Service Mocking**          | Simulate downstream services for isolated testing                                              |

### Supported Protocol Combinations

Protocol-agnostic design supports any request/reply channel combination:

```
SQS → Kafka             |    Kafka → SQS    |    SNS → Kafka
Kafka → Kafka           |    SQS → SQS      |    SNS → SQS
Google Pub/Sub → SQS    |    And any other combination
```

## Getting Started

### Contract Testing

Test your async applications against AsyncAPI specifications to ensure they honor the contract.

#### Example: SQS to Kafka Integration

**Scenario**: Messages arrive on an SQS queue, your app processes them and sends replies to a Kafka topic.

**Step 1: Define Your AsyncAPI Specification**

Create `spec/order-service.yaml`:

```yaml
asyncapi: 3.0.0
info:
  title: Order Service SNS-SQS API
  version: 1.0.0
  description: |
    Receives order placement messages on SQS, replies on Kafka

servers:
  sqsServer:
    host: 'http://localhost:4566/000000000000'
    protocol: sqs
    description: AWS SQS server for receiving messages
  kafkaServer:
    host: 'localhost:9092'
    protocol: kafka
    description: Kafka broker for reply messages

channels:
  placeOrder:
    address: place-order-queue
    servers:
      - $ref: '#/servers/sqsServer'
    messages:
      placeOrderMessage:
        $ref: '#/components/messages/PlaceOrderMessage'

  wipOrder:
    address: place-order-topic
    servers:
      - $ref: '#/servers/kafkaServer'
    messages:
      wipOrderMessage:
        $ref: '#/components/messages/WipOrderMessage'

operations:
  sendOrder:
    description: Receive order on SQS, reply with WIP status on Kafka
    action: receive
    channel:
      $ref: '#/channels/placeOrder'
    messages:
      - $ref: '#/channels/placeOrder/messages/placeOrderMessage'
    reply:
      channel:
        $ref: '#/channels/wipOrder'
      messages:
        - $ref: '#/channels/wipOrder/messages/wipOrderMessage'

components:
  messages:
    PlaceOrderMessage:
      name: PlaceOrderMessage
      title: Order Created Event
      contentType: application/json
      headers:
        type: object
        properties:
          MessageGroupId:
            type: string
            examples:
              - order-group-1
          Subject:
            type: string
            examples:
              - Order Placed
      payload:
        type: object
        properties:
          orderType:
            type: string
            enum:
              - STANDARD
            examples:
              - STANDARD
          orderId:
            type: string
            examples:
              - ORD-12345
          customerId:
            type: string
            examples:
              - CUST-67890
          items:
            type: array
            items:
              type: object
              properties:
                productId:
                  type: string
                quantity:
                  type: integer
                price:
                  type: number
                  format: float
          totalAmount:
            type: number
            format: float
          orderDate:
            type: string
            format: date-time
        required:
          - orderType
          - orderId
          - customerId
          - items
          - totalAmount
          - orderDate

    WipOrderMessage:
      name: WipOrderMessage
      title: Work In Progress Order Event
      contentType: application/json
      payload:
        type: object
        properties:
          orderId:
            type: string
            examples:
              - ORD-12345
          itemsCount:
            type: integer
            examples:
              - 2
          status:
            type: string
            enum:
              - WIP
            examples:
              - WIP
          processingStartedAt:
            type: string
            format: date-time
        required:
          - orderId
          - itemsCount
          - status
```

**Step 2: Configure Specmatic**

Create `specmatic.yaml`:

```yaml
version: 2
contracts:
  - provides:
      - specs:
          - spec/order-service.yaml
        specType: asyncapi 
        config:
          servers:
            - host: <SQS_QUEUE_URL>
              protocol: sqs
              adminCredentials:
                region: <REGION>
                aws.access.key.id: <AWS_ACCESS_KEY_ID>
                aws.secret.access.key: <AWS_SECRET_ACCESS_KEY>
            - host: <KAFKA_BROKER_URL>
              protocol: kafka
```

{: .note }
Replace values in angle brackets (`<...>`) with your actual configuration.

**Step 3: Run Contract Tests**

Start your application with its dependencies (SQS, Kafka, etc.), then run:

```bash
docker run --rm --network host \
  -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" \
  -v "$PWD/spec:/usr/src/app/spec" \
  -v "$PWD/build/reports/specmatic:/usr/src/app/build/reports/specmatic" \
  specmatic/specmatic-async-core test
```

This generates and executes contract tests based on your AsyncAPI specification.

**Example Project**: [View complete working example →](https://github.com/specmatic/specmatic-sqs-kafka-sample)

---

### Service Mocking

Mock downstream async services when your application isn't ready or for integration testing.

{: .note }
For protocols other than Kafka (e.g., SQS, SNS, Google Pub/Sub), you must configure external brokers in `specmatic.yaml`. In-memory broker is currently only supported for Kafka.

**Step 1: Create Test Examples**

Create examples in `spec/order-service_examples/` folder:

`Standard_Order_SQS_Kafka.json`:

```json
{
  "name": "Standard_Order_SQS_Kafka",
  "receive": {
    "topic": "place-order-queue",
    "payload": {
      "orderType": "STANDARD",
      "orderId": "ORD-90001",
      "customerId": "CUST-44556",
      "items": [
        {
          "productId": "PROD-111",
          "quantity": 1,
          "price": 899.99
        },
        {
          "productId": "PROD-222",
          "quantity": 2,
          "price": 129.50
        }
      ],
      "totalAmount": 1158.99,
      "orderDate": "2025-12-09T14:20:00Z"
    },
    "headers": {
      "MessageGroupId": "order-group-9",
      "Subject": "Order Placed"
    }
  },
  "send": {
    "topic": "place-order-topic",
    "payload": {
      "orderId": "ORD-90001",
      "itemsCount": "$match(exact: 2)",
      "status": "$match(exact: WIP)",
      "processingStartedAt": "(datetime)"
    }
  }
}
```

{: .note }
Use Specmatic matchers like `$match(exact: ...)` and `(datetime)` to define flexible validation rules.

**Step 2: Update Configuration**

Modify `specmatic.yaml` to use `consumes`:

```yaml
version: 2
contracts:
  - consumes:
      - specs:
          - spec/order-service.yaml
        specType: asyncapi 
        config:
          servers:
            - host: <SQS_QUEUE_URL>
              protocol: sqs
              adminCredentials:
                region: <REGION>
                aws.access.key.id: <AWS_ACCESS_KEY_ID>
                aws.secret.access.key: <AWS_SECRET_ACCESS_KEY>
            - host: <KAFKA_BROKER_URL>
              protocol: kafka
```

**Step 3: Start the Mock**

```bash
docker run --rm --network host \
  -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" \
  -v "$PWD/spec:/usr/src/app/spec" \
  -v "$PWD/build/reports/specmatic:/usr/src/app/build/reports/specmatic" \
  specmatic/specmatic-async-core virtualize
```

**How It Works**:
- ✅ **Valid messages** matching your example trigger the defined reply
- ❌ **Invalid messages** are rejected with relevant log messages
- 🎯 **Mock behaves** exactly as defined in your AsyncAPI contract

---

### Examples Validation

Validate your test examples against the AsyncAPI specification before using them.

**Validate Examples in Default Location**

For examples in `<SPEC_NAME>_examples/` directory:

```bash
docker run --rm \
  -v "$PWD/spec:/usr/src/app/spec" \
  specmatic/specmatic-async-core examples validate \
  --spec-file spec/order-service.yaml
```

**Validate Examples in Custom Location**

```bash
docker run --rm \
  -v "$PWD/spec:/usr/src/app/spec" \
  -v "$PWD/custom-examples:/usr/src/app/custom-examples" \
  specmatic/specmatic-async-core examples validate \
  --spec-file spec/order-service.yaml \
  --examples custom-examples
```

---

## Command Reference

### Test Command

Run contract tests against your application:

```bash
specmatic-async-core test [OPTIONS]
```

**Options**:
- `--verbose`, `-v`: Enable verbose logging (default: false)
- `--examples`: Directory containing test examples (optional)
- `--overlay`: Overlay file path (optional)
- `--reply-timeout`: Maximum time in milliseconds to wait for reply messages (default: 10000)
- `--subscriber-readiness-wait-time`: Time in milliseconds to wait for subscriber readiness (default: 0)

### Virtualize Command

Start a mock/stub server for async messaging protocols. Supports both external brokers (configured in `specmatic.yaml`) and in-memory Kafka broker.

**Aliases**: `stub`, `virtualize`

```bash
specmatic-async-core virtualize [OPTIONS]
```

**Options**:
- `--host`: Host for in-memory Kafka broker (default: localhost)
- `--port`: Port for in-memory Kafka broker (default: 9092)
- `--log-dir`: Directory for in-memory Kafka broker logs (default: `./kafka-logs`)
- `--verbose`, `-v`: Enable verbose logging (default: false)
- `--overlay`: Overlay file path (optional)
- `--examples`: Directory containing test examples (optional)

{: .note }
The command automatically detects whether to use external brokers (if configured in `specmatic.yaml`) or start an in-memory Kafka broker. In-memory broker is currently only supported for Kafka.

### Examples Validate Command

Validate test examples against the specification:

```bash
specmatic-async-core examples validate [OPTIONS]
```

**Options**:
- `--spec-file`: Path to AsyncAPI specification (required)
- `--examples`: Path to examples directory (optional)

---

## Best Practices

### 1. Organize Your Specs

```
project/
├── spec/
│   ├── order-service.yaml
│   └── order-service_examples/
│       ├── Standard_Order_SQS_Kafka.json
│       └── Priority_Order_SQS_Kafka.json
└── specmatic.yaml
```

### 2. Use Examples Effectively

- **Create realistic examples** that represent actual use cases
- **Use matchers** for flexible validation (`$match`, `(datetime)`, etc.)
- **Validate examples** before using them for mocking or testing

### 3. Configuration Management

- **Use environment variables** for sensitive credentials
- **Keep separate configs** for different environments (dev, staging, prod)
- **Version control** your AsyncAPI specs and examples

---

## Configuration Reference

### Complete Configuration Structure

The `specmatic.yaml` file supports detailed configuration for async messaging protocols. Here's the complete structure:

```yaml
version: 2
contracts:
  - provides:  # or consumes:
      - specs:
          - spec/your-service.yaml
        specType: asyncapi
        config:
          # Schema Registry Configuration (optional)
          schemaRegistry:
            kind: CONFLUENT
            url: http://localhost:8085
            username: admin
            password: admin-secret
          
          # Server Configurations
          servers:
            - host: <HOST_URL>
              protocol: <PROTOCOL>
              adminCredentials:
                # Protocol-specific admin properties
              client:
                producer:
                  # Protocol-specific producer properties
                consumer:
                  # Protocol-specific consumer properties
```

---

### Protocol-Specific Configurations

#### Kafka

**Basic Configuration**:

```yaml
servers:
  - host: localhost:9092
    protocol: kafka
```

**With Authentication (SASL)**:

```yaml
servers:
  - host: localhost:9092
    protocol: kafka
    adminCredentials:
      security.protocol: SASL_PLAINTEXT
      sasl.mechanism: PLAIN
      sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin-secret";
    client:
      producer:
        basic.auth.credentials.source: USER_INFO
        basic.auth.user.info: admin:admin-secret
      consumer:
        basic.auth.credentials.source: USER_INFO
        basic.auth.user.info: admin:admin-secret
```

**Configuration Options**:

| Property | Description |
|----------|-------------|
| `host` | Kafka broker URL (e.g., `localhost:9092`) |
| `protocol` | Must be `kafka` |
| `adminCredentials` | Kafka admin client properties for topic management |
| `client.producer` | Standard Kafka producer properties |
| `client.consumer` | Standard Kafka consumer properties |

{: .note }
The `producer` and `consumer` sections accept any standard [Kafka producer](https://kafka.apache.org/documentation/#producerconfigs) and [consumer](https://kafka.apache.org/documentation/#consumerconfigs) configuration properties.

---

#### AWS SQS

**Configuration**:

```yaml
servers:
  - host: http://localhost:4566/000000000000
    protocol: sqs
    adminCredentials:
      region: us-east-1
      aws.access.key.id: test
      aws.secret.access.key: test
```

**Configuration Options**:

| Property | Description |
|----------|-------------|
| `host` | SQS endpoint URL including account ID |
| `protocol` | Must be `sqs` |
| `adminCredentials.region` | AWS region (e.g., `us-east-1`) |
| `adminCredentials.aws.access.key.id` | AWS access key ID |
| `adminCredentials.aws.secret.access.key` | AWS secret access key |

{: .note }
For LocalStack, use `http://localhost:4566/000000000000`. For production AWS, use the full SQS endpoint URL.

---

#### AWS EventBridge

**Configuration**:

```yaml
servers:
  - host: http://localhost:4566/000000000000
    protocol: eventbridge
    adminCredentials:
      region: us-east-1
      aws.access.key.id: test
      aws.secret.access.key: test
```

**Configuration Options**:

| Property | Description |
|----------|-------------|
| `host` | EventBridge endpoint URL including account ID |
| `protocol` | Must be `eventbridge` |
| `adminCredentials.region` | AWS region (e.g., `us-east-1`) |
| `adminCredentials.aws.access.key.id` | AWS access key ID |
| `adminCredentials.aws.secret.access.key` | AWS secret access key |

---

### Schema Registry Configuration

Use Schema Registry to manage and validate message schemas (typically with Kafka).

**Confluent Schema Registry**:

```yaml
config:
  schemaRegistry:
    kind: CONFLUENT
    url: http://localhost:8085
    username: admin
    password: admin-secret
  
  servers:
    - host: localhost:9092
      protocol: kafka
```

**Configuration Options**:

| Property | Description |
|----------|-------------|
| `kind` | Schema registry type (currently `CONFLUENT`) |
| `url` | Schema registry endpoint URL |
| `username` | Authentication username (optional) |
| `password` | Authentication password (optional) |

---

### Multi-Protocol Example

**Mixed SQS and Kafka Configuration**:

```yaml
version: 2
contracts:
  - provides:
      - specs:
          - spec/order-service.yaml
        specType: asyncapi
        config:
          servers:
            # SQS for incoming messages
            - host: http://localhost:4566/000000000000
              protocol: sqs
              adminCredentials:
                region: us-east-1
                aws.access.key.id: test
                aws.secret.access.key: test
            
            # Kafka for outgoing messages
            - host: localhost:9092
              protocol: kafka
              adminCredentials:
                security.protocol: SASL_PLAINTEXT
                sasl.mechanism: PLAIN
                sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin-secret";
              client:
                producer:
                  basic.auth.credentials.source: USER_INFO
                  basic.auth.user.info: admin:admin-secret
```

[//]: # (---)

[//]: # ()
[//]: # (### Environment-Specific Configuration)

[//]: # ()
[//]: # (**Development &#40;LocalStack + Local Kafka&#41;**:)

[//]: # ()
[//]: # (```yaml)

[//]: # (config:)

[//]: # (  servers:)

[//]: # (    - host: http://localhost:4566/000000000000)

[//]: # (      protocol: sqs)

[//]: # (      adminCredentials:)

[//]: # (        region: us-east-1)

[//]: # (        aws.access.key.id: test)

[//]: # (        aws.secret.access.key: test)

[//]: # (    - host: localhost:9092)

[//]: # (      protocol: kafka)

[//]: # (```)

[//]: # (**Production &#40;AWS + Confluent Cloud&#41;**:)

[//]: # ()
[//]: # (```yaml)

[//]: # (config:)

[//]: # (  schemaRegistry:)

[//]: # (    kind: CONFLUENT)

[//]: # (    url: https://schema-registry.us-east-1.aws.confluent.cloud)

[//]: # (    username: ${SCHEMA_REGISTRY_KEY})

[//]: # (    password: ${SCHEMA_REGISTRY_SECRET})

[//]: # (  )
[//]: # (  servers:)

[//]: # (    - host: https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT_ID})

[//]: # (      protocol: sqs)

[//]: # (      adminCredentials:)

[//]: # (        region: us-east-1)

[//]: # (        aws.access.key.id: ${AWS_ACCESS_KEY_ID})

[//]: # (        aws.secret.access.key: ${AWS_SECRET_ACCESS_KEY})

[//]: # (    )
[//]: # (    - host: ${KAFKA_BOOTSTRAP_SERVERS})

[//]: # (      protocol: kafka)

[//]: # (      adminCredentials:)

[//]: # (        security.protocol: SASL_SSL)

[//]: # (        sasl.mechanism: PLAIN)

[//]: # (        sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="${KAFKA_API_KEY}" password="${KAFKA_API_SECRET}";)

[//]: # (      client:)

[//]: # (        producer:)

[//]: # (          security.protocol: SASL_SSL)

[//]: # (          sasl.mechanism: PLAIN)

[//]: # (          sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="${KAFKA_API_KEY}" password="${KAFKA_API_SECRET}";)

[//]: # (        consumer:)

[//]: # (          security.protocol: SASL_SSL)

[//]: # (          sasl.mechanism: PLAIN)

[//]: # (          sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="${KAFKA_API_KEY}" password="${KAFKA_API_SECRET}";)

[//]: # (```)

[//]: # ()
[//]: # ({: .note })

[//]: # (Use environment variables &#40;e.g., `${VARIABLE_NAME}`&#41; for sensitive credentials and environment-specific values.)

---

## Troubleshooting

### Tests Not Running

**Issue**: Contract tests fail to start

**Solutions**:
- Verify your application and dependencies (SQS, Kafka) are running
- Check network connectivity with `--network host`
- Ensure volume mounts point to correct directories

### Mock Not Responding

**Issue**: Mock server doesn't process messages

**Solutions**:
- Verify examples are in the correct directory (`<SPEC_NAME>_examples/`)
- Run `examples validate` to check example validity
- Check logs for schema validation errors

### Protocol Connection Issues

**Issue**: Cannot connect to SQS/Kafka/other protocols

**Solutions**:
- Verify server URLs and credentials in `specmatic.yaml`
- Check network accessibility to message brokers
- Ensure protocol-specific dependencies are running

---

## Additional Resources

- [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/latest)
- [Specmatic Documentation](/)
- [Example Projects](https://github.com/specmatic/specmatic-async-examples)

---