---
layout: default
title: AsyncAPI Support
parent: Supported Protocols
nav_order: 1
---

# Specmatic Async Core
{: .no_toc }

Multi-protocol async messaging testing and mocking
{: .fs-6 .fw-300 }

---

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Overview

**Specmatic Async Core** enables contract testing and mocking for asynchronous messaging systems across multiple protocols. Test complex async integrations with a unified approach, regardless of the underlying messaging technology.

### Key Capabilities

| Feature | Description |
|---------|-------------|
| **Multi-Protocol Support** | Kafka, SQS, SNS, Google Pub/Sub, and more |
| **Cross-Protocol Messaging** | Mix request/reply channels across different protocols |
| **Contract Testing** | Verify async integrations match your AsyncAPI specs |
| **Service Mocking** | Simulate downstream services for isolated testing |

### Supported Protocol Combinations

Protocol-agnostic design supports any request/reply channel combination:

```
SQS → Kafka    |    Kafka → SQS    |    SNS → Kafka
Kafka → Kafka  |    SQS → SQS      |    SNS → SQS
Google Pub/Sub → SQS    |    And any other combination
```

---

## Quick Example

**Scenario**: Your app sends a message to an SQS queue, and expects a reply on a Kafka topic.

**What Specmatic Does**:
- Tests the entire integration flow
- Mocks the downstream service
- Verifies message schemas across protocols

---

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

**Example Project**: [View complete working example →](#)

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
- [Example Projects](https://github.com/znsio/specmatic-async-examples)

---

## Support

Need help? Reach out through:
- [GitHub Issues](https://github.com/znsio/specmatic)
- [Community Slack](https://specmatic.slack.com)
- [Documentation](/documentation)

