---
layout: default
title: Contract Management
parent: Configuration
grand_parent: References
nav_order: 2
---

# Contract Management

## Contracts from Git Repository

Configure Specmatic to pull contracts from a Git repository:

{% tabs contracts_configuration %}
{% tab contracts_configuration specmatic.yaml %}
```yaml
version: 2
contracts:
  - git:
      url: https://github.com/specmatic/specmatic-order-contracts.git
      branch: main
    provides:
      - com/petstore/store.yaml
    consumes:
      - com/petstore/payment.yaml
```
{% endtab %}
{% tab contracts_configuration specmatic.json %}
```json
{
  "version": 2,
  "contracts": [
    {
      "git": {
        "url": "https://github.com/specmatic/specmatic-order-contracts.git",
        "branch": "main"
      },
      "provides": [
        "com/petstore/store.yaml"
      ],
      "consumes": [
        "com/petstore/payment.yaml"
      ]
    }
  ]
}
```
{% endtab %}
{% endtabs %}

## Contracts from Local Filesystem

If you just need to use specifications from your local file system, specify `filesystem` field within contracts (if not specified, `directory` will default to current directory):

{% tabs local_configuration %}
{% tab local_configuration specmatic.yaml %}
```yaml
version: 2
contracts:
  - filesystem:
      directory: <Path to directory where all the specmatic should look for specifications>
    consumes:
      - api_order_v1.yaml
      - api_user_v1.yaml
    provides:
      - api_auth_v1.yaml
```
{% endtab %}
{% tab local_configuration specmatic.json %}
```json
{
  "version": 2,
  "contracts": [
    {
      "filesystem": {
        "directory": "<Path to directory where all the specmatic should look for specifications>"
      },
      "consumes": [
        "api_order_v1.yaml",
        "api_user_v1.yaml"
      ],
      "provides": [
        "api_auth_v1.yaml"
      ]
    }
  ]
}
```
{% endtab %}
{% endtabs %}

Note that the `consumes` and `provides` specifications are relative paths. This means that they must be in the same directory as the current directory.

You can also provide absolute paths in case they are somewhere else on the filesystem.

## Provides and Consumes

A single application may need to list the API Specifications it is implementing under the `provides` attribute and the API Specifications of its dependencies under the `consumes` attribute.

{% tabs dependencies_configuration %}
{% tab dependencies_configuration specmatic.yaml %}
```yaml
version: 2
contracts:
  - git:
      url: <Git URL>
    consumes:
      - com/example/api_order_v1.yaml
      - com/example/api_user_v1.yaml
    provides:
      - com/example/api_auth_v1.yaml
```
{% endtab %}
{% tab dependencies_configuration specmatic.json %}
```json
{
  "version": 2,
  "contracts": [
    {
      "git": {
        "url": "<Git URL>"
      },
      "consumes": [
        "com/example/api_order_v1.yaml",
        "com/example/api_user_v1.yaml"
      ],
      "provides": [
        "com/example/api_auth_v1.yaml"
      ]
    }
  ]
}
```
{% endtab %}
{% endtabs %}
