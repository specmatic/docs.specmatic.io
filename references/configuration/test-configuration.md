---
layout: default
title: Test Configuration
parent: Configuration
grand_parent: References
nav_order: 3
---

# Test Configuration

## Resiliency Tests

To enable resiliency tests, add the `resiliencyTests` configuration to your `specmatic.yaml` file as shown below:

```yaml
version: 2

# Sample contracts configuration for running contract tests
contracts:
  - provides:
    - /path/to/your/spec.yaml

# Switches resiliency tests on (they are off by default)
test:
  resiliencyTests:
    enable: all
```

Note: The value of `enable` can hold the following values:
- `all`
- `positiveOnly` — will not run negative tests
- `none` - the default

## Contract Test Timeout

The HTTP timeout duration for requests made during contract testing can be configured using `timeoutInMilliseconds` parameter.
This parameter sets the maximum time Specmatic will wait for a response to each HTTP request before marking it as a failure.
The default timeout is `6000 milliseconds`.

{% tabs test_configuration %}
{% tab test_configuration specmatic.yaml %}
```yaml
version: 2
contracts:
  - git:
      url: https://github.com/specmatic/specmatic-order-contracts.git
    consumes:
      - io/specmatic/examples/store/openapi/api_order_v3.yaml
test:
  timeoutInMilliseconds: 3000
```
{% endtab %}
{% tab test_configuration specmatic.json %}
```json
{
  "version": 2,
  "contracts": [
    {
      "git": {
        "url": "https://github.com/specmatic/specmatic-order-contracts.git"
      },
      "consumes": [
        "io/specmatic/examples/store/openapi/api_order_v3.yaml"
      ]
    }
  ],
  "test": {
    "timeoutInMilliseconds": 3000
  }
}
```
{% endtab %}
{% endtabs %}

## Strict Mode

Test may run in strict mode. You can read more about [test in strict mode here](/contract_driven_development/contract_testing.html#strict-mode).

You can configure Specmatic to run test in strict mode using the following configuration:

```yaml
version: 2
contracts:
  - provides:
    - /path/to/spec.yaml
test:
  strictMode: true
```

## Configure Contract Test BaseUrls for Different Specs

Let's say you have a service that two specifications, or even multiple versions of the same specification. You need to run contract tests using that specification against the service. You can customize the base URL in specmatic configuration as shown below.

{% tabs contract_tests_base_url %}
{% tab contract_tests_base_url specmatic.yaml %}
```yaml
version: 2
contracts:
  - filesystem:
      directory: <Path to directory where all the specmatic should look for specifications>
    provides:
      - specs:
          - api_order_v1.yaml
        baseUrl: http://localhost:8080/v1
      - specs:
          - api_order_v2.yaml
        baseUrl: http://localhost:8080/v2
```
{% endtab %}
{% tab contract_tests_base_url specmatic.json %}
```json
{
  "version": 2,
  "contracts": [
    {
      "filesystem": {
        "directory": "<Path to directory where all the specmatic should look for specifications>"
      },
      "provides": [
        {
          "specs": [
            "api_order_v1.yaml"
          ],
          "baseUrl": "http://localhost:8080/v1"
        },
        {
          "specs": [
            "api_order_v2.yaml"
          ],
          "baseUrl": "http://localhost:8080/v2"
        }
      ]
    }
  ]
}
```
{% endtab %}
{% endtabs %}


## Externalized Examples Directories

By default, Specmatic searches for the directory ending with `_examples` to pickup externalized examples. However, if needed, you can specify a list of directories containing externalized examples under `examples` key in specmatic configuration. Specmatic will retrieve the examples from these directories for use in both contract testing and service virtualization.

{% tabs stubs_configuration %}
{% tab stubs_configuration specmatic.yaml %}
```yaml
version: 2
contracts:
  - git:
      url: https://github.com/specmatic/specmatic-order-contracts.git
    provides:
      - io/specmatic/examples/store/openapi/product_search_bff_v4.yaml
    consumes:
      - io/specmatic/examples/store/openapi/api_order_v3.yaml
examples:
  - order_service/examples
  - product_service/examples
```
{% endtab %}
{% tab stubs_configuration specmatic.json %}
```json
{
  "version": 2,
  "contracts": [
    {
      "git": {
        "url": "https://github.com/specmatic/specmatic-order-contracts.git"
      },
      "provides": [
        "io/specmatic/examples/store/openapi/product_search_bff_v4.yaml"
      ],
      "consumes": [
        "io/specmatic/examples/store/openapi/api_order_v3.yaml"
      ]
    }
  ],
  "examples": [
    "order_service/examples",
    "product_service/examples"
    ]
}
```
{% endtab %}
{% endtabs %}

**Note**: if the `_examples` directory is present, it will still be included alongside any additional directories specified under the `examples` key.
