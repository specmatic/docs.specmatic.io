---
layout: default
title: Configuration
parent: Documentation
nav_order: 14
---

Configuration
=============

- [Configuration](#configuration)
    - [Getting started](#getting-started)
      - [Configuring Stubs](#configuring-stubs)
      - [Source control authentication](#source-control-authentication)
      - [Complete sample specmatic.json with all attributes](#complete-sample-specmaticjson-with-all-attributes)
    - [Declare pipeline details](#declare-pipeline-details)
    - [Declare environment configuration](#declare-environment-configuration)
    - [Hooks](#hooks)

### Getting started

We often have to pass more than one API Specification file to Specmatic to stub or test. While it is possible to send all the files as command line options, there is a better way.

Also if your contracts are stored in a source control system like Git, we need to provide details about the repository so that Specmatic can pull your specifications directly from your version control.

Here is a sample ```specmatic.json``` to get you started.

```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "https://github.com/znsio/specmatic-order-contracts.git",
      "test": [
        "in/specmatic/examples/store/api_order_v1.yaml"
      ]
    }
  ]
}
```

Place this file in the root folder of your project (Here is an [example](https://github.com/znsio/specmatic-order-api)). Let us now go through each of the lines in this file.
* **provider** - At the moment we support all git based source control systems. Example: GitHub, Gitlab, Azure, etc.
* **repository** - The git repository URL
* **test** - This is the list of API Specifications that need to be run as a test. Note that the path is relative to the source control repository root.

Now if you run the ```specmatic test``` command line executable from the directory that contains the ```specmatic.json``` file Specmatic will pull the API Specifications listed under test and run them as tests.

```shell
% {{ site.spec_cmd }} test
Loading config file ./specmatic.json
Couldn't find local contracts, cloning https://github.com/znsio/specmatic-order-contracts.git into .specmatic/repos
Resetting /<path where you are running the specmatic command>/.specmatic/repos/specmatic-order-contracts
```

The logs show that Specmatic resets your local copy and clones the latest API Specification from the Git repository into a folder called ```.specmatic```. Please add this folder to ```.gitignore```.

#### Configuring Stubs

The same ```specmatic.json``` file can be leveraged to define stubs also.

```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "https://github.com/znsio/specmatic-order-contracts.git",
      "stub": [
        "in/specmatic/examples/store/api_order_v1.yaml"
      ]
    }
  ]
}
```

Please note that now we are now listing the ```api_order_v1.yaml``` is listed as a stub depdency. You can run the ```specmatic stub``` command and the Specamtic will clone the API specifications and run it as a stub. Here is an [example](https://github.com/znsio/specmatic-order-ui/blob/main/specmatic.json).

A single application may need to list the API Specifications it is implementing under the test attribute and the API Specifications of its dependencies under the stub attribute.

```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "<Git URL>",
      "stub": [
        "com/example/api_order_v1.yaml",
        "com/example/api_user_v1.yaml"
      ],
      "test": [
        "com/example/api_auth_v1.yaml",  
      ]
    }
  ]
}
```

#### Source control authentication

Usually source control requires authentication. Below are the ways in which you can set it up.
* Recommended approach - Provide a Git SSH URL and make sure your environment already has necessary keys loaded. If the git clone command works on your regular command line, it will work within Specmatic too. This is most suitable in CI, because your CI server may already be setup to clone the application code (for which the CI server should already have the necesary keys). So it should already be able clone your API Specifications also. The same also should be applicable for local development and testing environments.
* Alternatives - With https URLs you can provide the bearer token or other means. Please reach us (raise a [github issue](https://github.com/znsio/specmatic/issues/new/choose)) if you need help with this.

#### Complete sample specmatic.json with all attributes

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
  },

  "hooks": {
    "hook_name": "command"
  }
}
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

### Hooks

A hook is simply a command that can run on the Terminal or Command Prompt.

```json
  "hooks": {
    "stub_load_contract": "python load.py"
  }
```

In the above snippet, `stub_load_contract` is the hook name. "python load.py" is executed, and the name of the contract is provided to it as an environment variable named `CONTRACT_FILE`. The hook must modify the contract and write it out to standard output. Specmatic will read the standard output of the plugin, and load the result as the contract.

