---
layout: default
title: Continuous Integration
parent: References
nav_order: 3
redirect_from:
  - /documentation/continuous_integration.html
  - /documentation/references/continuous_integration.html
---

Continuous Integration
==============
<!-- TOC -->
* [Continuous Integration](#continuous-integration)
  * [Objective of this tutorial](#objective-of-this-tutorial)
  * [Architecture Overview](#architecture-overview)
  * [Step 1: Setting Up a Central Contract Repository](#step-1-setting-up-a-central-contract-repository)
    * [Setup overview](#setup-overview)
    * [Setting up the central contract repository](#setting-up-the-central-contract-repository)
    * [CI Pipeline Setup](#ci-pipeline-setup)
  * [Step 2: Setting up Client, Provider and Domain services](#step-2-setting-up-client-provider-and-domain-services)
    * [Step 2.1: Setting Up CI pipeline for client](#step-21-setting-up-ci-pipeline-for-client)
    * [Step 2.2: Setting up CI pipeline for BFF Service](#step-22-setting-up-ci-pipeline-for-bff-service)
    * [Step 2.3: Setting up CI pipeline for Order API](#step-23-setting-up-ci-pipeline-for-order-api)
    * [Summary of Progress](#summary-of-progress)
  * [Step 3: Visualizing Your API Ecosystem](#step-3-visualizing-your-api-ecosystem)
  * [Cloning API specifications from authenticated Central Contract Repositories](#cloning-api-specifications-from-authenticated-central-contract-repositories)
    * [Authentication params in Git Repo URI](#authentication-params-in-git-repo-uri)
      * [GitLab](#gitlab)
      * [GitHub Actions](#github-actions)
    * [GitHub Actions](#github-actions-1)
    * [Generic settings for any other CI setup](#generic-settings-for-any-other-ci-setup)
  * [Featured utilities](#featured-utilities)
    * [GitHub action to set up specmatic environment](#github-action-to-set-up-specmatic-environment)
      * [Examples](#examples)
<!-- TOC -->

Specmatic is a platform and programming language independent executable. We can run it in all CI environments through the [command line interface](/getting_started/cli_quick_start.html#set-up).

## Objective of this tutorial

By the end of this tutorial, you'll have CI Pipeline running Specmatic on your:

1. Central contract repository
2. API providers
3. API consumers

Let's get started!

## Architecture Overview
In this tutorial, we'll be working with a typical scenario of microservices & microfrontends involving a Backend-for-Frontend (BFF) and a Domain Service. Here's an overview of what we'll be setting up:

![Order Microservices architecture](/images/insights_demo_architecture.png)

In this architecture:

- The App represents the client application (e.g., a mobile app or web frontend)
- The *BFF (Backend-for-Frontend)* acts as an intermediary, tailoring the API for specific client needs 
- The *Domain Service* represents the core business logic and data management

We'll be working with two OpenAPI specifications:

* `order_bff.yaml`: Implemented by the `BFF services`, this specification defines the API contract between `clients` (like the mobile app) and the `BFF`.
* `order_api.yaml`: Implemented by the `Domain Service`, this specification defines the API contract between the `BFF` and the `Domain Service`.

## Step 1: Setting Up a Central Contract Repository

### Setup overview

A central contract repository is crucial for maintaining consistency across your API specifications and enabling effective contract testing.

If you already have a central contract repository, you can use that instead and skip to the [next section](#ci-pipeline-setup).

### Setting up the central contract repository

1. Create a new Git repository named "api-contracts". 
2. In this repository, create a folder structure to organize your OpenAPI specifications. For our example, we will do it as follows:

      ```
      api-contracts/
      ├── orders/
      │   ├── order_bff.yaml
      │   └── order_api.yaml
      └── other-services/
      ```

3. Download and add the following OpenAPI specifications to the repository as depicted above

  - [Order BFF OpenAPI Spec](ci_tutorial_spec_files/order_bff.yaml)
  - [Order Domain API OpenAPI Spec](ci_tutorial_spec_files/order_api.yaml)

### CI Pipeline Setup
We need to set up a simple CI pipeline to perform the following actions on OpenAPI specs in the central contract repo:
* lint
* check backward compatibility of your contracts using Specmatic
* generate insights report, using specmatic docker image
* publish build reports to specmatic insights

```yaml
{% raw %}
name: Lint specifications, check backward compatibility and generate report

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
jobs:
  run-lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v5
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v5
        with:
          node-version: 'lts'

      - name: Install OpenAPI linter
        run: npm install -g @stoplight/spectral-cli

      - name: Lint OpenAPI specs using Spectral
        run: spectral lint **/*.yaml

      - name: Run OpenAPI Backward Compatibility Check using Specmatic
        run: |
          docker run --rm \
            -v ${{ github.workspace }}:/usr/src/app \
            specmatic/specmatic \
            backward-compatibility-check

      - name: Generate central contract repo report
        run: |
          docker run --rm \
            -v ${{ github.workspace }}:/usr/src/app \
            specmatic/specmatic \
            central-contract-repo-report
{% endraw %}
```

After successfully setting up your central contract repository and running the CI pipeline, you should see output similar to this:

![Successful contract repo](/images/insights_step1_successful.png)

Also, you can see our sample [central contract repository build report on GitHub](https://github.com/specmatic/specmatic-order-contracts/actions/workflows/central-contract-repo-report.yaml)

## Step 2: Setting up Client, Provider and Domain services

Now that we have our OpenAPI specification checked in, let's bring our Order services to life!

**Client** - You can implement the client in the programming language of your choice. Once ready, place the following configuration in a file named `specmatic.yaml` at the root level of your project. This will:
* Virtualize the BFF service for the client application (based on the `order_bff.yaml` contract), helping to isolate the client.

```yaml
version: 2
contracts:
  - git:
      url: (your-git-repository)
    consumes:
      - path/to/your/spec/in/git/order_bff.yaml # BFF service contract
```

**BFF Service** - Implement the BFF service in the language of your choice. Once ready, place the following configuration in a file named `specmatic.yaml` at the root level of your project. This will:
* Virtualize the Domain API service for the BFF application (based on the `order_api.yaml` contract)
* Test the BFF service as a client (using the `order_bff.yaml` contract)


```yaml
version: 2
contracts:
  - git:
      url: (your-git-repository)
    provides:
      - path/to/your/spec/in/git/order_bff.yaml # BFF service contract
    consumes:
      - path/to/your/spec/in/git/order_api.yaml # Domain service contract
```

**Domain Service** - After implementing domain service, place the following configuration in a file named `specmatic.yaml` at the root level of your project. This will test the domain API based on the `order_api.yaml` contract.

```yaml
version: 2
contracts:
  - git:
      url: (your-git-repository)
    provides:
      - path/to/your/spec/in/git/order_api.yaml # Domain service contract
```


### Step 2.1: Setting Up CI pipeline for client

After the client is up and running and checked into a Git repository, you can create the following CI pipeline to:
* Build the client app
* Virtualize the BFF service using `order_bff.yaml` and the **Specmatic** Docker image
* Test the client implementation against the virtualized BFF service

(note: we implemented the client in react, so setting up pipeline accordingly)

```yaml
{% raw %}
name: Client CI Build using Specmatic Serivce Virtualization

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Run Specmatic stub to virtualize the BFF service
      run: |
        docker run -d \
          -v ${{ github.workspace }}/specmatic.yaml:/usr/src/app/specmatic.yaml \
          -p 8080:8080 \
          specmatic/specmatic stub

        # Wait for the stub to be ready
        sleep 10

    - name: Run component test against the Specmatic stub
      run: npm run test:component
      env:
        STUB_URL: http://localhost:8080
{% endraw %}
```

Upon successful execution of the client CI pipeline, you should see output resembling this:

![Successful Client CI Pipeline](/images/insights_step2_1_successful.png)

Also, you can see our sample [client build report on GitHub](https://github.com/specmatic/specmatic-order-ui-react/actions/workflows/main.yml)

### Step 2.2: Setting up CI pipeline for BFF Service

Make sure the BFF service is checked into a Git repository. Then create the following CI pipeline to:
* Build the BFF service
* Virtualize the Domain service using `order_api.yaml` and the **Specmatic** Docker image
* Test the BFF service using `order_bff.yaml` and the **Specmatic** Docker image

(note: we implemented the BFF service in Kotlin, so setting up pipeline accordingly)

```yaml
{% raw %}
name: Provider CI Build using Specmatic Contract Test

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read

    steps:
    - uses: actions/checkout@v4
      with:
        submodules: 'true'

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'

    - name: Setup Gradle
      uses: gradle/actions/setup-gradle@af1da67850ed9a4cedd57bfd976089dd991e2582 # v4.0.0

    - name: Validate Gradle wrapper
      uses: gradle/wrapper-validation-action@v1

    - name: Run Specmatic stub to virtualize the Order API service
      run: |
        docker run -d \
          -v ${{ github.workspace }}/specmatic.yaml:/usr/src/app/specmatic.yaml \
          -p 9000:9000 \
          specmatic/specmatic stub

        # Wait for the stub to be ready
        sleep 10

    - name: Start Spring Boot application
      run: ./gradlew bootRun &

    - name: Wait for application to start
      run: sleep 30

    - name: Contract Test BFF service using Specmatic
      run: |
        docker run \
          -v ./specmatic.yaml:/usr/src/app/specmatic.yaml \
          --network=host \
          specmatic/specmatic \
          test \
          --port=8080 \
          --host=localhost
{% endraw %}
```

After running the BFF service CI pipeline, you should see results similar to:

![Successful BFF CI pipeline](/images/insights_step2_2_successful.png)

Also, you can see our sample [BFF build report on GitHub](https://github.com/specmatic/specmatic-order-bff-java/actions/workflows/gradle.yml)

### Step 2.3: Setting up CI pipeline for Order API

Make sure Order Domain API service is checked in to a git repository. Then create the following CI pipeline to :
* build the Domain API service
* test Domain API service using `order_api.yaml` and **Specmatic** docker image.

(note: we implemented the Order Domain API service in Kotlin, so setting up pipeline accordingly)

```yaml
name: Domain API service CI Build using Specmatic Contract Test

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read

    steps:
    - uses: actions/checkout@v4
      with:
        submodules: 'true'

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'

    - name: Setup Gradle
      uses: gradle/actions/setup-gradle@af1da67850ed9a4cedd57bfd976089dd991e2582 # v4.0.0

    - name: Validate Gradle wrapper
      uses: gradle/wrapper-validation-action@v1

    - name: Start Spring Boot application
      run: ./gradlew bootRun &

    - name: Wait for application to start
      run: sleep 30

    - name: Contract Test Domain API service using Specmatic
      run: docker run -v "./specmatic.yaml:/usr/src/app/specmatic.yaml" -e HOST_NETWORK=host --network=host "specmatic/specmatic" test --port=9000 --host=localhost
```

Upon completion of the Order API CI pipeline, you should see output like this:

![Success Order API CI pipeline](/images/insights_step2_3_successful.png)

Also, you can see our sample [Order API build report on GitHub](https://github.com/specmatic/specmatic-order-api-java/actions/workflows/maven.yml)

### Summary of Progress

Congratulations! At this point, you have successfully set up and configured:

✅ Central contract repository with CI/CD for linting and backward compatibility checks <br>
✅ Client application with CI/CD for building and testing against a virtualized BFF service <br>
✅ BFF service with CI/CD for building, testing against a virtualized Domain service, and being tested as a provider <br>
✅ Domain service with CI/CD for building and being tested as a provider <br>

All four components are now integrated with Specmatic for contract testing and service virtualization. This setup ensures that your entire API ecosystem is continuously validated and maintains consistency across all services.
With this foundation in place, you can now move on to configuring Specmatic Insights to visualize and analyze your API ecosystem.

## Step 3: Visualizing Your API Ecosystem

If you are interested to:

- View your service dependency graph in real-time as your CI builds run
- Track CDD (Contract-Driven Development) adoption progress in your organization
- Identify dependencies between services
- Monitor API coverage and stub usage of your services

Please go through the detailed [Specmatic Insights guide](/enterprise_onboarding/insights.html) to integrate Specmatic Insights in your CI/CD pipelines.

## Cloning API specifications from authenticated Central Contract Repositories

Specmatic requires appropriate auth setup in order to pull the latest API specifications to be used for both Contract Tests and Intelligent Service Virtualization. Here are the details.

### Authentication params in Git Repo URI

This approach works across any CI setup which can include the auth params as part of the URI. Simply include your auth params (username/password, PAT and any other access tokens) as env variables (be sure to mask the values for security). Here is an example of Git repo URI in the Specmatic configuration file in this approach.

{% tabs config %}
{% tab config specmatic.yaml %}
```yaml
version: 2
contracts:
  - git:
      url: https://${TOKEN}@github.com/specmatic/central-contract-repo-private.git
    provides:
      - io/specmatic/examples/store/openapi/api_order_v3.yaml
```
{% endtab %}
{% tab config specmatic.json %}
```json
{
  "version": 2,
  "contracts": [
    {
      "git": {
        "url": "https://${TOKEN}@github.com/specmatic/central-contract-repo-private.git"
      },
      "provides": [
        "io/specmatic/examples/store/openapi/api_order_v3.yaml"
      ]
    }
  ]
}
```
{% endtab %}
{% endtabs %}

As long as the env variables are available in the CI build machine (in this example `TOKEN`), Specmatic will evaluate them and execute Git clone on the fully evaluated URL.

A quick test to see if your Git Repo URI is correct will be to run a command line Git clone in your CI pipeline with it. If it works with command line Specmatic will also be able to use the same to clone your central contract repo to the CI build machine. Here are detailed examples.

#### GitLab

Examples: 

* CI_JOB_TOKEN - `https://gitlab-ci-token:${CI_JOB_TOKEN}@gitlab.com/contract-testing/central-contract-repo.git/`
* Username / Password - `https://${USERNAME}:${PASSWORD}@gitlab.com/contract-testing/central-contract-repo.git/`

#### GitHub Actions

Examples:

* Personal Access Token - `https://${CENTRAL_CONTRACT_REPO_PAT}@github.com/specmatic/central-contract-repo-private.git`

Detailed steps
* Set up a [Personal Access Token in GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with "Read" access for contents on your Central Contract Repository (we recommend using [fine-grained tokens](https://github.blog/2022-10-18-introducing-fine-grained-personal-access-tokens-for-github/))
* Add this PAT as a [repo secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) in your repository where Specmatic Contract Test / and or Service Virtualization is used. Example: `CENTRAL_CONTRACT_REPO_ACCESS_TOKEN=<your PAT>`
* In your GitHub workflow file, for steps involving Specmatic Contract Test and / or Service Virtualization, setup env variable `CENTRAL_CONTRACT_REPO_PAT` and set its value to the secret that we added above. Example: ```CENTRAL_CONTRACT_REPO_PAT: {% raw %}${{ secrets.CENTRAL_CONTRACT_REPO_ACCESS_TOKEN }}{% endraw %}```. Here is a complete snippet.

{% tabs config %}
{% tab config specmatic.yaml %}
```yaml
version: 2
contracts:
  - git:
      url: https://${CENTRAL_CONTRACT_REPO_PAT}@@github.com/specmatic/central-contract-repo-private.git
    provides:
      - io/specmatic/examples/store/openapi/api_order_v3.yaml
```
{% endtab %}
{% tab config specmatic.json %}
```json
{
  "version": 2,
  "contracts": [
    {
      "git": {
        "url": "https://${CENTRAL_CONTRACT_REPO_PAT}@github.com/specmatic/central-contract-repo-private.git"
      },
      "provides": [
        "io/specmatic/examples/store/openapi/api_order_v3.yaml"
      ]
    }
  ]
}
```
{% endtab %}
{% endtabs %}

### GitHub Actions

**Note:** We are in the process of standardising on a uniform approach ([Authentication params in Git Repo URI](#authentication-params-in-git-repo-uri)) across GitHub, GitLab, Azure and more. We suggest considering the [steps listed here](#github-actions) before going ahead with below technique. Below approach will also continue to be supported.

* Set up a [Personal Access Token in GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with "Read" access for contents on your Central Contract Repository (we recommend using [fine-grained tokens](https://github.blog/2022-10-18-introducing-fine-grained-personal-access-tokens-for-github/))
* Add this PAT as a [repo secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) in your repository where Specmatic Contract Test / and or Service Virtualization is used. Example: `CENTRAL_CONTRACT_REPO_ACCESS_TOKEN=<your PAT>`
* In your GitHub workflow file, for steps involving Specmatic Contract Test and / or Service Virtualization, setup env variable `PERSONAL_ACCESS_TOKEN` and set its value to the secret that we added above. Example: ```PERSONAL_ACCESS_TOKEN: {% raw %}${{ secrets.CENTRAL_CONTRACT_REPO_ACCESS_TOKEN }}{% endraw %}```. Here is a complete snippet.

```yaml
    - name: Build with Maven
      working-directory: main
      env:
        PERSONAL_ACCESS_TOKEN: {% raw %}${{ secrets.CENTRAL_CONTRACT_REPO_ACCESS_TOKEN }}{% endraw %}
      run: mvn test package jacoco:report
```

* Then Specmatic automatically detects the presence of `PERSONAL_ACCESS_TOKEN` env variable and is able to clone the  central contract repo to the CI server by leveraging the same.

### Generic settings for any other CI setup

* [Authentication In CI For HTTPS Git Source](/contract_driven_development/contract_testing.html#authentication-in-ci-for-https-git-source)
* [Authentication In CI For SSH Git Source](/contract_driven_development/contract_testing.html#authentication-in-ci-for-ssh-git-source)

## Featured utilities

### GitHub action to set up specmatic environment

[Setup specmatic environment](https://github.com/marketplace/actions/setup-specmatic-environment) by [Serghei Iakovlev](https://github.com/sergeyklay)


#### Examples
* [Backward compatibility testing](https://github.com/specmatic/specmatic-order-contracts/blob/main/.github/workflows/pull_request_merge_checks.yaml)
* [Contract Tests](https://github.com/specmatic/specmatic-order-api-java/blob/main/.github/workflows/maven.yml)
