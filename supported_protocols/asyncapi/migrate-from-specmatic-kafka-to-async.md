---
layout: default
title: Migrating to specmatic-async
parent: AsyncAPI
nav_order: 11
redirect_from:
  - /documentation/migrate-from-specmatic-kafka-to-async.html
  - /documentation/supported_protocols/asyncapi/migrate-from-specmatic-kafka-to-async.html
---

# Migrating from `specmatic-kafka` to `specmatic-async`

Migrating to `specmatic-async` unlocks multi-protocol support, improved configuration, and a unified approach to async contract testing and mocking. This guide walks you through the key steps and provides practical examples for a smooth transition.

## Migration Steps

### 1. Update Your AsyncAPI Specification
Add a `servers` section and reference it in your channels. This is required by `specmatic-async` for multi-protocol support.

**Before (specmatic-kafka):**
```yaml
channels:
  my-topic:
    ...
```

**After (specmatic-async):**
```yaml
servers:
  kafkaServer:
    host: 'localhost:9092'
    protocol: kafka
channels:
  my-topic:
    servers:
      - $ref: '#/servers/kafkaServer'
    ...
```

### 2. Update Your Configuration File
If you use a `specmatic.yaml` config, update it as per the [Configuration Reference](/supported_protocols/asyncapi/index.html#configuration-reference). `specmatic-async` supports richer configuration, including multiple protocols, schema registry, and client/admin properties.

**Example:**
```yaml
version: 2
contracts:
  - provides:
      - specs:
          - spec/your-service.yaml
        specType: asyncapi
        config:
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
          schemaRegistry:
            kind: CONFLUENT
            url: http://localhost:8085
            username: admin
            password: admin-secret
```

### 3. Update Docker Image
Replace the `specmatic-kafka` image with `specmatic-async` in your Docker commands.

**Before:**
```bash
docker run specmatic/specmatic-kafka test
```
**After:**
```bash
docker run specmatic/specmatic-async test
```

### 4. Update Programmatic Usage
If you use Specmatic mocks/tests in code, update class names and imports:
- Replace `KafkaMock` with `AsyncMock`
- Replace `SpecmaticKafkaContractTest` with `SpecmaticAsyncContractTest`
- Update import statements as per your IDE suggestions

**Before:**
```java
import com.specmatic.kafka.KafkaMock;
import com.specmatic.kafka.SpecmaticKafkaContractTest;
```
**After:**
```java
import com.specmatic.async.AsyncMock;
import com.specmatic.async.SpecmaticAsyncContractTest;
```

## Migration Examples

> **Before running migration commands:**
> Ensure your `specmatic.yaml` configuration file is updated and present in your project root as described above. This is required for both Docker and programmatic usage.

### Docker Setup Migration
**Old (specmatic-kafka):**
```bash
docker run --rm \
  -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" \
  -v "$PWD/spec:/usr/src/app/spec" \
  specmatic/specmatic-kafka test
```
**New (specmatic-async):**
```bash
docker run --rm \
  -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" \
  -v "$PWD/spec:/usr/src/app/spec" \
  specmatic/specmatic-async test
```

### Programmatic Setup Migration
**Old (specmatic-kafka):**
```java
import com.specmatic.kafka.KafkaMock;
import com.specmatic.kafka.SpecmaticKafkaContractTest;

public class KafkaContractTest implements SpecmaticKafkaContractTest {
    // ...
}
```
**New (specmatic-async):**
```java
import com.specmatic.async.AsyncMock;
import com.specmatic.async.SpecmaticAsyncContractTest;

public class AsyncContractTest implements SpecmaticAsyncContractTest {
    // ...
}
```

> **Note:**
> - Include all relevant Kafka config properties (schemaRegistry, client, adminCredentials, etc.) in your new config.
> - Refer to the [Protocol-Specific Configurations](/supported_protocols/asyncapi/index.html#configuration-reference) for details on all supported options.

## Additional Resources
- [AsyncAPI Protocol Support](/supported_protocols/asyncapi/index.html)
- [Specmatic Async Examples](https://github.com/specmatic/specmatic-async-sample)
