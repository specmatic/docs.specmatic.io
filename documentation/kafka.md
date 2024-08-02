# Starting Kafka Mock Server from command line

```shell
docker run -p 9092:9092 -p 2181:2181 -v "$PWD/specmatic.yaml:/usr/src/app/specmatic.yaml" znsio/specmatic-kafka-trial
```

This should produce logs that shows that Specmatic Kafka server has started and listening on topics.

```bash
Setting up listeners
Listening on topics: (product-queries)
```

## Breakdown of the above command

The `specmatic.yaml` file is the config where we reference the AsyncAPI spec which in turn defines the Kafka setup.

## Specmatic Config

```yaml
#specmatic.yaml
sources:
  - provider: git
    repository: https://github.com/znsio/specmatic-order-contracts.git
    consumes:
      - io/specmatic/examples/store/asyncapi/kafka.yaml
```

Please refer to [Specmatic documentation](https://specmatic.in/documentation/) for more details about the above config file.

## AsyncAPI spec

AsyncAPI Spec that is referenced above - [kafka.yaml](https://github.com/znsio/specmatic-order-contracts/blob/main/io/specmatic/examples/store/asyncapi/kafka.yaml)

## Sample project to see full usage

[Order BFF Application](https://github.com/znsio/specmatic-order-bff)