---
layout: default
title: qontract.json
parent: Documentation
nav_order: 14
---
Format of qontract.json
=======================

```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "https://azure.com/XNSio/XNSIO/_git/petstore-contracts2",
      "test": [
        "com/petstore/2.qontract"
      ],
      "stub": [
        "com/petstore/payment.qontract"
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
        "com/petstore/2.qontract"
      ],

      // relative paths of all contracts in this repository
      // to be stubbed out
      "stub": [
          "com/petstore/payment.qontract"
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
  // This is used by qontract install, to register
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
