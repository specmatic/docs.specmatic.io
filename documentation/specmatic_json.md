---
layout: default
title: specmatic.json
parent: Documentation
nav_order: 14
---
Format of specmatic.json
=======================

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
  // needed for CI, leave as is
  "auth": {
    "bearer-file": "bearer.txt"
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
