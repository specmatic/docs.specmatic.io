---
layout: default
title: Configuration
parent: Documentation
nav_order: 14
has_children: true
---

Configuration
=============

- [Configuration](#configuration)
    - [Getting started](#getting-started)
      - [Upgrade older configuration to the latest version](#upgrade-older-configuration-to-the-latest-version)
      - [Externalized Examples Directories](#externalized-examples-directories)
      - [Contract Test Timeout](#contract-test-timeout)
      - [Configuring Stubs](#configuring-stubs)
      - [Service Virtualization Delay](#service-virtualization-delay)
      - [Use specifications on local file system](#use-specifications-on-local-file-system)
      - [Run stub on different ports for different specifications](#run-stub-on-different-ports-for-different-specifications)
      - [Source control authentication](#source-control-authentication)
      - [Report Configuration](#report-configuration)
      - [Formatters](#formatters)
      - [Report Types](#report-types)
      - [API Coverage report](#api-coverage-report)
      - [Complete sample specmatic.json with all attributes](#complete-sample-specmaticjson-with-all-attributes)
    - [Declare pipeline details](#declare-pipeline-details)
    - [Declare environment configuration](#declare-environment-configuration)
    - [Hooks](#hooks)

### Getting started

We often have to pass more than one API Specification file to Specmatic to stub or test. While it is possible to send all the files as command line options, there is a better way.

Also if your contracts are stored in a source control system like Git, we need to provide details about the repository so that Specmatic can pull your specifications directly from your version control.

#### Upgrade older configuration to the latest version

If you have an old version of the config, Specmatic can upgrade it to the latest version.

{% tabs compare %}
{% tab compare java %}
```bash
java -jar specmatic.jar config upgrade --input specmatic_old.yaml --output specmatic.yaml
```
{% endtab %}
{% tab compare npm %}
```bash
npx specmatic config upgrade --input specmatic_old.yaml --output specmatic.yaml
```
{% endtab %}
{% tab compare docker %}
```bash
docker run -v "/your-local-specs-directory:/specs" znsio/specmatic config upgrade --input "/specs/specmatic.yaml" --output "specmatic_new.yaml"
```
{% endtab %}
{% endtabs %}

When you run the `config upgrade` command without specifying `input` or `output` parameters, it will search for the config file in default locations (the directory from which the command is run, the application classpath, `CONFIG_FILE_PATH` environment variable, or `CONFIG_FILE_PATH` system property) and display the result in the same terminal from which the command was executed.

#### Externalized Examples Directories

By default, Specmatic searches for the directory ending with `_examples` to pickup externalized examples. However, if needed, you can specify a list of directories containing externalized examples under `examples` key in specmatic configuration. Specmatic will retrieve the examples from these directories for use in both contract testing and service virtualization.

{% tabs stubs_configuration %}
{% tab stubs_configuration specmatic.yaml %}
```yaml
version: 2
contracts:
  - git:
      url: https://github.com/znsio/specmatic-order-contracts.git
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
        "url": "https://github.com/znsio/specmatic-order-contracts.git"
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

#### Contract Test Timeout

The HTTP timeout duration for requests made during contract testing can be configured using `timeoutInMilliseconds` parameter. 
This parameter sets the maximum time Specmatic will wait for a response to each HTTP request before marking it as a failure.
The default timeout is `6000 milliseconds`.

{% tabs test_configuration %}
{% tab test_configuration specmatic.yaml %}
```yaml
version: 2
contracts:
  - git:
      url: https://github.com/znsio/specmatic-order-contracts.git
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
        "url": "https://github.com/znsio/specmatic-order-contracts.git"
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

#### Configuring Stubs

The same configuration file can be leveraged to define stubs also.

{% tabs contracts_configuration %}
{% tab contracts_configuration specmatic.yaml %}
```yaml
version: 2
contracts:
  - git:
      url: https://github.com/znsio/specmatic-order-contracts.git
    consumes:
      - io/specmatic/examples/store/openapi/api_order_v3.yaml
```
{% endtab %}
{% tab contracts_configuration specmatic.json %}
```json
{
  "version": 2,
  "contracts": [
    {
      "git": {
        "url": "https://github.com/znsio/specmatic-order-contracts.git"
      },
      "consumes": [
        "io/specmatic/examples/store/openapi/api_order_v3.yaml"
      ]
    }
  ]
}
```
{% endtab %}
{% endtabs %}

Please note that now we are now listing the ```api_order_v3.yaml``` is listed as a stub dependency. You can run the ```specmatic stub``` command and the Specmatic will clone the API specifications and run it as a stub. Here is an [example](https://github.com/znsio/specmatic-order-bff-java/blob/main/specmatic.yaml).

A single application may need to list the API Specifications it is implementing under the provides attribute and the API Specifications of its dependencies under the consumes attribute.

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
        "com/example/api_auth_v1.yaml",  
      ]
    }
  ]
}
```
{% endtab %}
{% endtabs %}

#### Service Virtualization Delay

A delay can be applied to all requests handled by service virtualization. By configuring the `delayInMilliseconds` parameter, 
you can simulate response times with the specified delay in milliseconds, as mentioned in [Delay Simulation](/documentation/service_virtualization_tutorial.html#delay-simulation)

#### Use specifications on local file system

If you just need to use specifications from your local file system, specify `filesystem` field within contracts (if not specified, `directory` will default to current directory), as shown below.

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
        "api_auth_v1.yaml",  
      ]
    }
  ]
}
```
{% endtab %}
{% endtabs %}

Note that the `consumes` and `provides` specifications are relative paths. This means that they must be in the same directory as the current directory.

You can also provide absolute paths in case they are somewhere else on the filesystem.

#### Run stub on different ports for different specifications

If you want to run stubs on different ports for different specifications, you can specify the port number in the `port` field under `consumes` key and assign the list of `specs` to it.


{% tabs local_configuration %}
{% tab local_configuration specmatic.yaml %}
```yaml
version: 2
contracts:
  - filesystem:
      directory: <Path to directory where all the specmatic should look for specifications>
    consumes:
      - specs:
          - api_order_v1.yaml
          - api_user_v1.yaml
        port: 9000
      - specs:
          - api_auth_v1.yaml
        port: 9001
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
        {
          "specs": [
            "api_order_v1.yaml",
            "api_user_v1.yaml"
          ],
          "port": 9000
        },
        {
          "specs": [
            "api_auth_v1.yaml"
          ],
          "port": 9001
        }
      ]
    }
  ]
}
```
{% endtab %}
{% endtabs %}

As per the above configuration, the specs `api_order_v1.yaml` and `api_user_v1.yaml` will run on port 9000 and the spec `api_auth_v1.yaml` will run on port 9001.

#### Source control authentication

Usually source control requires authentication. Below are the ways in which you can set it up.
* Recommended approach - Provide a Git SSH URL and make sure your environment already has necessary keys loaded. If the git clone command works on your regular command line, it will work within Specmatic too. This is most suitable in CI, because your CI server may already be setup to clone the application code (for which the CI server should already have the necessary keys). So it should already be able to clone your API Specifications also. The same also should be applicable for local development and testing environments.
* Alternatives - With https URLs you can provide the bearer token or other means. Please reach us (raise a [github issue](https://github.com/znsio/specmatic/issues/new/choose)) if you need help with this.

#### Report Configuration
Specmatic can generate reports based on the below configuration:

{% tabs report_configuration %}
{% tab report_configuration specmatic.yaml %}
```yaml
version: 2
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
        excludedEndpoints:
          - /health
```
{% endtab %}
{% tab report_configuration specmatic.json %}
```json
"version": 2,
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
          },
          "excludedEndpoints": [
            "/health"
          ]
        }
      }
    }
  }
```
{% endtab %}
{% endtabs %}
 
#### Formatters
Defaults to 'Text' if none specified.  
The Text formatter will print the report on to the console/terminal.

#### Report Types
#### API Coverage report
This gives you a comprehensive analysis of any mismatch between your api specification and implementation. [Here](https://specmatic.in/updates/detect-mismatches-between-your-api-specifications-and-implementation-specmatic-api-coverage-report/#gsc.tab=0) is an article with a detailed write-up about this feature.

#### Complete sample specmatic.json with all attributes

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
        excludedEndpoints:
          - /health
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
          },
          "excludedEndpoints": [
            "/health"
          ]
        }
      }
    }
  }
}
```
{% endtab %}
{% endtabs %}

### Declare pipeline details

Contains details of the project pipeline.

{% tabs pipeline_configuration %}
{% tab pipeline_configuration specmatic.yaml %}
```yaml
version: 2
auth:
  bearer-file: ./central_repo_auth_token.txt

pipeline:
  provider: azure
  organization: XNSio
  project: XNSIO
  definitionId: 4
```
{% endtab %}
{% tab pipeline_configuration specmatic.json %}
```json
{
  "version": 2,
  "auth": {
    "bearer-file": "./central_repo_auth_token.txt"
  },

  "pipeline": {
    "provider": "azure", 
    "organization": "XNSio",
    "project": "XNSIO",
    "definitionId": 4
  }
}
```
{% endtab %}
{% endtabs %}

* `auth` section is needed for Azure pipelines
* `pipeline` section is used by Specmatic install, to register a project's build pipeline to run when a contract changes.
  * `provider` should remain `azure`, no need to change this
  * Details such as `organization`, `project` and `definitionId` must be set up as per your project.

Specmatic fetches contracts from git repositories in Azure using the value of the pipeline variable `System.AccessToken` for authentication. This is a predefined variable in Azure build pipelines.

It looks for this value in the file specified by `bearer-file`. `central_repo_auth_token.txt` is our recommended name for the file. This file should be in your project root.

You can set it up by placing this snippet in the `steps` section of your Azure pipeline:

```yaml
steps:
  - script: echo $SYSTEM_ACCESSTOKEN > central_repo_auth_token.txt
    env:
      SYSTEM_ACCESSTOKEN: $(System.AccessToken)
```

You can read more about `System.AccessToken` [here](https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml).

### Declare environment configuration

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
```
{% endtab %}
{% endtabs %}

The environments key in this example contains configuration for the `staging` environment. It can contain configuration for any number of environments.

Each environment configuration can contain
- `baseurls` - needed when running contracts as test as part of [authentication](documentation/../authentication.html)
- `variables` - these values are plugged into the Examples rows of an auth contract for [authentication](documentation/../authentication.html), or even when running regular contract tests



### Hooks

A hook is simply a command that can run on the Terminal or Command Prompt.

{% tabs hooks_configuration %}
{% tab hooks_configuration specmatic.yaml %}
```yaml
version: 2
hooks:
  stub_load_contract: python load.py
```
{% endtab %}
{% tab hooks_configuration specmatic.json %}
```json
{
  "version": 2,
  "hooks": {
    "stub_load_contract": "python load.py"
  }
}
```
{% endtab %}
{% endtabs %}

In the above snippet, `stub_load_contract` is the hook name. `python load.py` is executed, while the path of the original contract file is present in `CONTRACT_FILE` environment variable. 

The command can parse the contract file and write it to standard out. Specmatic will read it as the new contract. `stub_load_contract` and `test_load_contract` are the supported hook names.
