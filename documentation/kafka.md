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

Now we can run below command to spin a Kafka mock server. Please note the volume mapping to pass the specmatic.yaml to the Kafka Docker image and also the port mappings.

```shell
docker run -p 9092:9092 -p 2181:2181 -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" znsio/specmatic-kafka-trial
```

This should produce logs that shows that Specmatic Kafka server has started and listening on topics.

```bash
Setting up listeners
Listening on topics: (product-queries)
```

Please refer to [Specmatic documentation](https://specmatic.in/documentation/) for more details about the above `specmatic.yaml` config file.

## Sample project to see full usage

[Order BFF Application](https://github.com/znsio/specmatic-order-bff)