---
layout: default
title: Environments
parent: Configuration
grand_parent: References
nav_order: 7
---

# Environments

## Declare Environment Configuration

{% tabs environment_configuration %}
{% tab environment_configuration specmatic.yaml %}
```yaml
version: 2
environments:
  staging:
    baseurls:
      auth.spec: http://localhost:8080
    variables:
      username: jackie
      password: PaSsWoRd
```
{% endtab %}
{% tab environment_configuration specmatic.json %}
```json
{
  "version": 2,
  "environments": {
    "staging": {
      "baseurls": {
        "auth.spec": "http://localhost:8080"
      },
      "variables": {
        "username": "jackie",
        "password": "PaSsWoRd"
      }
    }
  }
}
```
{% endtab %}
{% endtabs %}

The environments key in this example contains configuration for the `staging` environment. It can contain configuration for any number of environments.

## Environment Configuration Options

Each environment configuration can contain:

### Base URLs

`baseurls` - needed when running contracts as test as part of [authentication](/features/authentication.html)

### Variables

`variables` - these values are plugged into the Examples rows of an auth contract for [authentication](/features/authentication.html), or even when running regular contract tests
