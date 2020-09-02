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
  "auth": {
    // needed for CI
    "bearer-file": "bearer.txt"
  },
  "pipeline": {
    "provider": "azure",
    
    // Azure organization name
    "organization": "XNSio",
    
    // Azure project name
    "project": "XNSIO",
    
    // Azure build pipeline definition id
    "definitionId": 4
  },

  // List of contract sources
  //
  // A source consists of
  // - a git repository containing contracts
  // - and the relative paths of the needed contracts in the repository
  //
  // ultiple sources can be declared
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
  ]
}
```
