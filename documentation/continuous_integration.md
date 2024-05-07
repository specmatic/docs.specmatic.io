---
layout: default
title: Continuous Integration
parent: Documentation
nav_order: 31
---

Contract Tests
==============

Specmatic is a platform and programming language independent execuable. We can run it in all CI environments through [command line](/getting_started.html#setup).

## Cloning API specifications from authenticated Central Contract Repositories

Specmatic requires appropriate auth setup in order to pull the latest API specifications to be used for both Contract Tests and Intelligent Service Virtualisation. Here are the details.

### Github Actions

* Setup a [Personal Access Token in Github](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with "Read" access for contents on your Central Contract Repository (we recommend using [fine grained tokens](https://github.blog/2022-10-18-introducing-fine-grained-personal-access-tokens-for-github/))
* Add this a PAT as a [repo secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) in your repository where Specmatic Contract Test / and or Service Virtualisation is used. Example: `CENTRAL_CONTRACT_REPO_ACCESS_TOKEN=<your PAT>`
* In your Github workflow file, for steps involving Specmatic Contract Test and / or Service Virtualisation, setup env variable `PERSONAL_ACCESS_TOKEN` and set its value to the secret that we added above. Example: ```PERSONAL_ACCESS_TOKEN: {% raw %}${{ secrets.CENTRAL_CONTRACT_REPO_ACCESS_TOKEN }}{% endraw %}```. Here is a complete snippet.

```yaml
    - name: Build with Maven
      working-directory: main
      env:
        PERSONAL_ACCESS_TOKEN: {% raw %}${{ secrets.CENTRAL_CONTRACT_REPO_ACCESS_TOKEN }}{% endraw %}
      run: mvn test package jacoco:report
```

* Then Specmatic automatically detects the presence of `PERSONAL_ACCESS_TOKEN` env variable and is able to clone the  central contract repo to the CI server by leveraging the same.

### Generic settings for any other CI setup

* [Authentication In CI For HTTPS Git Source](/documentation/contract_tests.html#authentication-in-ci-for-https-git-source)
* [Authentication In CI For SSH Git Source](/documentation/contract_tests.html#authentication-in-ci-for-ssh-git-source)

## Featured utilities

### Github action to setup specmatic environment

[Setup specmatic environment](https://github.com/marketplace/actions/setup-specmatic-environment) by [Serghei Iakovlev](https://github.com/sergeyklay)


#### Examples
* [Backward compatibility testing](https://github.com/znsio/specmatic-order-contracts/blob/main/.github/workflows/pull_request_merge_checks.yaml)
* [Contract as Test](https://github.com/znsio/specmatic-order-api/blob/github-actions-setup-specmatic/.github/workflows/command_line_contract_tests.yml)