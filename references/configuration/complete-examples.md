---
layout: default
title: Complete Examples
parent: Configuration
grand_parent: References
nav_order: 10
---

# Complete Configuration Examples

## Complete Sample Configuration with All Attributes

This example shows all available configuration options:

{% tabs complete_configuration %}
{% tab complete_configuration specmatic.yaml %}
```yaml
version: 2
contracts:
  - git:
      url: https://azure.com/XNSio/XNSIO/_git/petstore-contracts
      branch: main
    provides:
      - com/petstore/store.yaml
    consumes:
      - com/petstore/payment.yaml

auth:
  bearer-file: central_repo_auth_token.txt

pipeline:
  provider: azure
  organization: XNSio
  project: XNSIO
  definitionId: 4

environments:
  staging:
    baseurls:
      auth.spec: http://localhost:8080
    variables:
      username: jackie
      password: PaSsWoRd

hooks:
  hook_name: command

report:
  formatters:
    - type: text
      layout: table
  types:
    APICoverage:
      OpenAPI:
        successCriteria:
          minThresholdPercentage: 100
          maxMissedEndpointsInSpec: 0
          enforce: true
```
{% endtab %}
{% tab complete_configuration specmatic.json %}
```json
{
  "version": 2,
  "contracts": [
    {
      "git": {
        "url": "https://azure.com/XNSio/XNSIO/_git/petstore-contracts",
        "branch": "main"
      },
      "provides": [
        "com/petstore/store.yaml"
      ],
      "consumes": [
        "com/petstore/payment.yaml"
      ]
    }
  ],

  "auth": {
    "bearer-file": "central_repo_auth_token.txt"
  },

  "pipeline": {
    "provider": "azure",
    "organization": "XNSio",
    "project": "XNSIO",
    "definitionId": 4
  },

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
  },

  "hooks": {
    "hook_name": "command"
  },

  "report": {
    "formatters": [
      {
        "type": "text",
        "layout": "table"
      }
    ],
    "types": {
      "APICoverage": {
        "OpenAPI": {
          "successCriteria": {
            "minThresholdPercentage": 100,
            "maxMissedEndpointsInSpec": 0,
            "enforce": true
          }
        }
      }
    }
  }
}
```
{% endtab %}
{% endtabs %}

## Configuration Structure Summary

The complete configuration file supports the following top-level sections:

1. **version** - Configuration version number (currently 2)
2. **contracts** - Define API specifications from Git or filesystem
3. **auth** - Authentication configuration for source control
4. **pipeline** - CI/CD pipeline integration settings
5. **environments** - Environment-specific variables and base URLs
6. **hooks** - Custom commands for contract processing
7. **test** - Contract testing configuration
8. **stub** - Service virtualization configuration
9. **report** - Report generation and formatting options
10. **examples** - Directories for externalized examples

For detailed information on each section, refer to the specific documentation pages.
