---
layout: default
title: specmatic.json
parent: Documentation
nav_order: 14
---

Format of specmatic.json
=======================

- [Format of specmatic.json](#format-of-specmaticjson)
    - [Sample specmatic.json](#sample-specmaticjson)
    - [Declare contracts](#declare-contracts)
    - [Declare pipeline details](#declare-pipeline-details)
    - [Declare environment configuration](#declare-environment-configuration)

### Sample specmatic.json

```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "https://azure.com/XNSio/XNSIO/_git/petstore-contracts2",
      "test": [
        "com/petstore/2.spec"
      ],
      "stub": [
        "com/petstore/payment.spec"
      ]
    }
  ],

  "auth": {
    "bearer-file": "bearer.txt"
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
  }
}
```

### Declare contracts

Contains a list of git repositories containing contract files.

```json
  "sources": [
    {
      "provider": "git",
      
      // repository containing the contracts
      "repository": "https://azure.com/XNSio/XNSIO/_git/petstore-contracts2",
      
      // relative paths of all contracts in this repository
      // to be run as test
      "test": [
        "com/petstore/2.spec"
      ],

      // relative paths of all contracts in this repository
      // to be stubbed out
      "stub": [
          "com/petstore/payment.spec"
      ]
    }
  ],
```

### Declare pipeline details

Contains details of the project pipeline.

```json
  // Needed for Azure CI. See notes below this snippet.
  "auth": {
    "bearer-file": "./bearer.txt"
  },

  // pipeline details of this project
  //
  // This is used by specmatic install, to register
  //    a project's build pipeline to run when a contract changes
  // The details below must be replaced with the details relevant
  //   to your project
  "pipeline": {
    "provider": "azure", // pipeline type, leave as is
    
    // Azure organization name
    "organization": "XNSio",
    
    // Azure project name
    "project": "XNSIO",
    
    // Azure build pipeline definition id
    "definitionId": 4
  }
}
```

Specmatic fetches contracts from git repositories in Azure using the value of the pipeline variable `System.AccessToken` for authentication. This is a predefined variable in Azure build pipelines.

It looks for this value in the file specified by `bearer-file`. `bearer.txt` is our recommended name for the file. This file should be in your project root.

You can set it up by placing this snippet in the `steps` section of your Azure pipeline:

```yaml
steps:
  - script: echo $SYSTEM_ACCESSTOKEN > bearer.txt
    env:
      SYSTEM_ACCESSTOKEN: $(System.AccessToken)
```

You can read more about `System.AccessToken` [here](https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml).

### Declare environment configuration

```json
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
```

The environments key in this example contains configuration for the `staging` environment. It can contain configuration for any number of environments.

Each environment configuration can contain
- `baseurls` - needed when running contracts as test as part of [authentication](documentation/../authentication.html)
- `variables` - these values are plugged into the Examples rows of an auth contract for [authentication](documentation/../authentication.html), or even when running regular contract tests
