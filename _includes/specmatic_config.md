Configuration
=============

- [Configuration](#configuration)
    - [Getting started](#getting-started)
      - [Contract Test Timeout](#contract-test-timeout)
      - [Configuring Stubs](#configuring-stubs)
      - [Service Virtualization Delay](#service-virtualization-delay)
      - [Use specifications on local file system](#use-specifications-on-local-file-system)
      - [Use specifications from the web](#use-specifications-from-the-web)
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

#### **Configuration File Location**

The configuration can be specified in JSON or YAML format. There are several ways to specify the location of your configuration file:

1. **Default Location**: Place the configuration file in the root folder of your project. By default, Specmatic looks for `specmatic.json` or `specmatic.yaml` in the project root.

2. **Command Line Option**: Specify a custom configuration file location using the `--config` option:
  ```bash
  specmatic test --config=path/to/my-config.json
  ```

3. **Environment Variable**: When working programmatically, set the configuration file path using the CONFIG_FILE_PATH environment variable:

{% tabs config_location %}
{% tab config_location macOS/Linux %}

```bash
# Set configuration file path in terminal
export CONFIG_FILE_PATH=/path/to/specmatic.yaml
```

{% endtab %}
{% tab config_location Windows %}

```shell
# Set configuration file path in command prompt
set CONFIG_FILE_PATH=C:\path\to\specmatic.yaml

# Or in PowerShell
$env:CONFIG_FILE_PATH="C:\path\to\specmatic.yaml"
```

{% endtab %}
{% tab config_location Java Tests %}

```java
@BeforeAll
public static void setUp() {
    // Set configuration file path programmatically
    System.setProperty("CONFIG_FILE_PATH", "/path/to/specmatic.yaml");
    
    // Rest of your test setup
    System.setProperty("host", "localhost");
    System.setProperty("port", "8080");
}
```

{% endtab %}
{% endtabs %}

Note on Precedence: When multiple configuration methods are used, they are evaluated in the following order:
1. Command line option (--config)
2. Environment variable (CONFIG_FILE_PATH)
3. Default location (project root)

Here is a sample configuration to get you started.

{% tabs config %}
{% tab config specmatic.json %}
```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "https://github.com/znsio/specmatic-order-contracts.git",
      "provides": [
        "io/specmatic/examples/store/openapi/api_order_v3.yaml"
      ]
    }
  ]
}
```
{% endtab %}
{% tab config specmatic.yaml %}
```yaml
sources:
  - provider: git
    repository: https://github.com/znsio/specmatic-order-contracts.git
    provides:
      - io/specmatic/examples/store/openapi/api_order_v3.yaml
```
{% endtab %}
{% endtabs %}

Place this file in the root folder of your project (Here is an [example](https://github.com/znsio/specmatic-order-api-java)). Let us now go through each of the lines in this file.
* **provider** - At the moment we support all git based source control systems. Example: GitHub, Gitlab, Azure, etc.
* **repository** - The git repository URL
* **provides** - This is the list of API Specifications that need to be run as a test. Note that the path is relative to the source control repository root.

You can also specify the branch.

{% tabs branch %}
{% tab branch specmatic.json %}
```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "https://github.com/znsio/specmatic-order-contracts.git",
      "branch": "feature-1",
      "provides": [
        "io/specmatic/examples/store/openapi/api_order_v3.yaml"
      ]
    }
  ]
}
```
{% endtab %}
{% tab branch specmatic.yaml %}
```yaml
sources:
  - provider: git
    repository: https://github.com/znsio/specmatic-order-contracts.git
    branch: feature-1
    provides:
      - io/specmatic/examples/store/openapi/api_order_v3.yaml
```
{% endtab %}
{% endtabs %}

When branch is not specified, default branch will be picked up.

Now if you run the ```specmatic test``` command line executable from the directory that contains the ```specmatic.json``` file Specmatic will pull the API Specifications listed under provides and run them as tests.

```shell
% {{ site.spec_cmd }} test
Loading config file ./specmatic.json
Couldn't find local contracts, cloning https://github.com/znsio/specmatic-order-contracts.git into .specmatic/repos
Resetting /<path where you are running the specmatic command>/.specmatic/repos/specmatic-order-contracts
```

The logs show that Specmatic resets your local copy and clones the latest API Specification from the Git repository into a folder called ```.specmatic```. Please add this folder to ```.gitignore```.

#### Contract Test Timeout

The HTTP timeout duration for requests made during contract testing can be configured using `timeoutInMilliseconds` parameter. 
This parameter sets the maximum time Specmatic will wait for a response to each HTTP request before marking it as a failure.
The default timeout is `6000 milliseconds`.

{% tabs stubs %}
{% tab stubs specmatic.json %}
```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "https://github.com/znsio/specmatic-order-contracts.git",
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
{% tab stubs specmatic.yaml %}
```yaml
sources:
  - provider: git
    repository: https://github.com/znsio/specmatic-order-contracts.git
    consumes:
      - io/specmatic/examples/store/openapi/api_order_v3.yaml
test:
  timeoutInMilliseconds: 3000
```
{% endtab %}
{% endtabs %}

#### Configuring Stubs

The same configuration file can be leveraged to define stubs also.

{% tabs stubs %}
{% tab stubs specmatic.json %}
```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "https://github.com/znsio/specmatic-order-contracts.git",
      "consumes": [
        "io/specmatic/examples/store/openapi/api_order_v3.yaml"
      ]
    }
  ]
}
```
{% endtab %}
{% tab stubs specmatic.yaml %}
```yaml
sources:
  - provider: git
    repository: https://github.com/znsio/specmatic-order-contracts.git
    consumes:
      - io/specmatic/examples/store/openapi/api_order_v3.yaml
```
{% endtab %}
{% endtabs %}

Please note that now we are now listing the ```api_order_v3.yaml``` is listed as a stub dependency. You can run the ```specmatic stub``` command and the Specmatic will clone the API specifications and run it as a stub. Here is an [example](https://github.com/znsio/specmatic-order-bff-java/blob/main/specmatic.yaml).

A single application may need to list the API Specifications it is implementing under the provides attribute and the API Specifications of its dependencies under the consumes attribute.

{% tabs dependencies %}
{% tab dependencies specmatic.json %}
```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "<Git URL>",
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
{% tab dependencies specmatic.yaml %}
```yaml
sources:
  - provider: git
    repository: <Git URL>
    consumes:
      - com/example/api_order_v1.yaml
      - com/example/api_user_v1.yaml
    provides:
      - com/example/api_auth_v1.yaml
```
{% endtab %}
{% endtabs %}

#### Service Virtualization Delay

A delay can be applied to all requests handled by service virtualization. By configuring the `delayInMilliseconds` parameter, 
you can simulate response times with the specified delay in milliseconds, as mentioned in [Delay Simulation](/documentation/service_virtualization_tutorial.html#delay-simulation)

#### Use specifications on local file system

If you just need to use specifications from your local file system, specify `provider` as `filesystem`, as shown below.

{% tabs local %}
{% tab local specmatic.json %}
```json
{
  "sources": [
    {
      "provider": "filesystem",
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
{% tab local specmatic.yaml %}
```yaml
sources:
  - provider: filesystem
    consumes:
      - api_order_v1.yaml
      - api_user_v1.yaml
    provides:
      - api_auth_v1.yaml
```
{% endtab %}
{% endtabs %}

Note that the `consumes` and `provides` specifications are relative paths. This means that they must be in the same directory as the current directory.

You can also provide absolute paths in case they are somewhere else on the filesystem.

#### Use specifications from the web

{% tabs web %}
{% tab web specmatic.json %}
```json
{
  "sources": [
    {
      "provider": "web",
      "consumes": [
        "http://third.party.com/products.yaml"
      ],
      "provides": [
        "http://third.party.com/api_auth_v1.yaml",
      ]
    }
  ]
}
```
{% endtab %}
{% tab web specmatic.yaml %}
```yaml
sources:
  - provider: web
    consumes:
      - http://third.party.com/products.yaml
    provides:
      - http://third.party.com/api_auth_v1.yaml
```
{% endtab %}
{% endtabs %}

Note that the `consumes` and `provides` can both contain URLs. `http` and `https` are both supported.

#### Source control authentication

Usually source control requires authentication. Below are the ways in which you can set it up.
* Recommended approach - Provide a Git SSH URL and make sure your environment already has necessary keys loaded. If the git clone command works on your regular command line, it will work within Specmatic too. This is most suitable in CI, because your CI server may already be setup to clone the application code (for which the CI server should already have the necessary keys). So it should already be able to clone your API Specifications also. The same also should be applicable for local development and testing environments.
* Alternatives - With https URLs you can provide the bearer token or other means. Please reach us (raise a [github issue](https://github.com/znsio/specmatic/issues/new/choose)) if you need help with this.

#### Report Configuration
Specmatic can generate reports based on the below configuration:

{% tabs report %}
{% tab report specmatic.json %}
```json
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
{% tab report specmatic.yaml %}
```yaml
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
{% endtabs %}
 
#### Formatters
Defaults to 'Text' if none specified.  
The Text formatter will print the report on to the console/terminal.

#### Report Types
#### API Coverage report
This gives you a comprehensive analysis of any mismatch between your api specification and implementation. [Here](https://specmatic.in/updates/detect-mismatches-between-your-api-specifications-and-implementation-specmatic-api-coverage-report/#gsc.tab=0) is an article with a detailed write-up about this feature.

#### Complete sample specmatic.json with all attributes

{% tabs complete %}
{% tab complete specmatic.json %}
```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "https://azure.com/XNSio/XNSIO/_git/petstore-contracts",
      "branch": "main",
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
{% tab complete specmatic.yaml %}
```yaml
sources:
  - provider: git
    repository: https://azure.com/XNSio/XNSIO/_git/petstore-contracts
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
{% endtabs %}

### Declare pipeline details

Contains details of the project pipeline.

{% tabs pipeline %}
{% tab pipeline specmatic.json %}
```json
{
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
{% tab pipeline specmatic.yaml %}
```yaml
auth:
  bearer-file: ./central_repo_auth_token.txt

pipeline:
  provider: azure
  organization: XNSio
  project: XNSIO
  definitionId: 4
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

{% tabs environment %}
{% tab environment specmatic.json %}
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
{% endtab %}
{% tab environment specmatic.yaml %}
```yaml
environments:
  staging:
    baseurls:
      auth.spec: http://localhost:8080
    variables:
      username: jackie
      password: PaSsWoRd
```
{% endtab %}
{% endtabs %}

The environments key in this example contains configuration for the `staging` environment. It can contain configuration for any number of environments.

Each environment configuration can contain
- `baseurls` - needed when running contracts as test as part of [authentication](documentation/../authentication.html)
- `variables` - these values are plugged into the Examples rows of an auth contract for [authentication](documentation/../authentication.html), or even when running regular contract tests



### Hooks

A hook is simply a command that can run on the Terminal or Command Prompt.

{% tabs hooks %}
{% tab hooks specmatic.json %}
```json
{
  "hooks": {
    "stub_load_contract": "python load.py"
  }
}
```
{% endtab %}
{% tab hooks specmatic.yaml %}
```yaml
hooks:
  stub_load_contract: python load.py
```
{% endtab %}
{% endtabs %}

In the above snippet, `stub_load_contract` is the hook name. `python load.py` is executed, while the path of the original contract file is present in `CONTRACT_FILE` environment variable. 

The command can parse the contract file and write it to standard out. Specmatic will read it as the new contract. `stub_load_contract` and `test_load_contract` are the supported hook names.

