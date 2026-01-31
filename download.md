---
layout: default
title: Download
nav_order: 2
---

# [Specmatic Open Source](https://github.com/specmatic/specmatic)

## Open Source CLI standalone executable

Read our "[CLI Quick Start (in 5 min)](/getting_started/cli_quick_start.html)" section and learn more about using the standalone executable.

{% tabs install-specmatic %}
<!-- docker -->
{% tab install-specmatic Docker %}

To run the latest version:

```bash
docker run -it --rm specmatic/specmatic --help
```

For older versions, replace `VERSION` with the desired version number from
the [Docker Hub](https://hub.docker.com/r/specmatic/specmatic/tags) page

```bash
docker run -it --rm specmatic/specmatic:VERSION --help
```

{% endtab %}
<!-- /docker -->

<!-- jar -->
{% tab install-specmatic JAR %}

The standalone JAR file can be downloaded from the following sources:

* [GitHub](https://github.com/specmatic/specmatic/releases/download/{{ site.specmatic-core-version }}/specmatic.jar)
* [Maven Central](https://repo1.maven.org/maven2/io/specmatic/specmatic-executable-all/{{ site.specmatic-core-version
  }}/specmatic-executable-all-{{ site.specmatic-core-version }}.jar)

For older versions, please refer to the [Releases](https://github.com/specmatic/specmatic/releases) page.

To run the JAR file, use the following command:

```shell
java -jar specmatic.jar --help
```

{% endtab %}
<!-- /jar -->
<!-- linux/macos -->
{% tab install-specmatic Linux/macOS %}

If you have Java 17 or above installed, you can install the executable using the following command and follow the
onscreen instructions:

To install the latest version:

```shell
# install the latest version
curl {{site.url}}/install-specmatic.sh | bash
```

To install an older version, replace `VERSION` with the desired version number from
the [Releases](https://github.com/specmatic/specmatic/releases) page.

```bash
curl {{site.url}}/install-specmatic.sh | bash -- --version VERSION
```

{% endtab %}
<!-- /linux/macos -->

<!-- windows -->
{% tab install-specmatic Windows %}

If you have Java 17 or above installed, you can install the executable using the following PowerShell command and follow
the onscreen instructions:

To install the latest version:

```powershell
irm {{site.url}}/install-specmatic.ps1 | iex
```

To install an older version, replace `VERSION` with the desired version number from
the [Releases](https://github.com/specmatic/specmatic/releases) page.

```powershell
iex "& { $(irm '{{site.url}}/install-specmatic.ps1') } --version VERSION"
```

{% endtab %}
<!-- /windows -->

<!-- npm -->
{% tab install-specmatic NPM %}

To run the latest version:

```bash
npx specmatic
```

For older versions, replace `VERSION` with the desired version number from
the [NPM Registry](https://www.npmjs.com/package/specmatic?activeTab=versions) page

```bash
npx specmatic@VERSION
```

{% endtab %}
<!-- /npm -->

{% tab install-specmatic Python %}

To install Specmatic via pip, run the following command:

```bash
pip install specmatic
```

To install a specific version, replace `VERSION` with the desired version number from
the [PyPI](https://pypi.org/project/specmatic/#history) page:

```bash
pip install specmatic==VERSION
```

{% endtab %}
{% endtabs %}

# Specmatic Commercial offerings

## Specmatic Enterprise

{% capture specmatic_enterprise_version %}{{ site.specmatic-enterprise-version }}{% endcapture %}
{% capture specmatic_enterprise_jar_url %}https://repo.specmatic.io/releases/io/specmatic/enterprise/specmatic-enterprise-all/{{ site.specmatic-enterprise-version }}/specmatic-enterprise-all-{{ site.specmatic-enterprise-version }}.jar{% endcapture %}
{% capture specmatic_enterprise_repo_url %}https://repo.specmatic.io/#releases/io/specmatic/enterprise/specmatic-enterprise-all/{% endcapture %}
{% capture specmatic_enterprise_maven_central_url %}https://repo1.maven.org/maven2/io/specmatic/enterprise/specmatic-enterprise-all/{{ site.specmatic-enterprise-version }}/specmatic-enterprise-all-{{ site.specmatic-enterprise-version }}.jar{% endcapture %}

{% include commercial_download.md
    image_name="specmatic/enterprise"
    tool_version=specmatic_enterprise_version
    jar_url=specmatic_enterprise_jar_url
    maven_central_url=specmatic_enterprise_maven_central_url
    repo_url=specmatic_enterprise_repo_url
    install_script="install-specmatic-enterprise" %}

## [Specmatic Redis](https://specmatic.io/features/api-resiliency-and-contract-testing-for-resp-redis/)

{% capture specmatic_redis_version %}{{ site.specmatic-redis-version }}{% endcapture %}
{% capture specmatic_redis_jar_url %}https://repo.specmatic.io/releases/io/specmatic/redis/specmatic-redis-all/{{ site.specmatic-redis-version }}/specmatic-redis-all-{{ site.specmatic-redis-version }}.jar{% endcapture %}
{% capture specmatic_redis_repo_url %}https://repo.specmatic.io/#releases/io/specmatic/redis/specmatic-redis-all/{% endcapture %}

{% include commercial_download.md
    image_name="specmatic/specmatic-redis"
    tool_version=specmatic_redis_version
    jar_url=specmatic_redis_jar_url
    repo_url=specmatic_redis_repo_url
    install_script="install-specmatic-redis" %}

## [Specmatic JDBC](https://specmatic.io/features/jdbc-contract-driven-development-leverage-asyncapi-specs-as-executable-contracts/)

Specmatic JDBC needs to be imported as a dependency in your project:

{% capture specmatic_jdbc_version %}{{ site.specmatic-jdbc-version }}{% endcapture %}

{% include maven_coordinates.md
group_id="io.specmatic.jdbc"
artifact_id="specmatic-jdbc"
version=specmatic_jdbc_version %}

## [Specmatic JMS](https://specmatic.io/features/jms-contract-driven-development-leverage-asyncapi-specs-as-executable-contracts/)

Specmatic JMS needs to be imported as a dependency in your project:

{% capture specmatic_jms_version %}{{ site.specmatic-jms-version }}{% endcapture %}

{% include maven_coordinates.md
group_id="io.specmatic.jms"
artifact_id="specmatic-jms"
version=specmatic_jms_version %}

## [Specmatic Google pubsub](https://specmatic.io/features/google-pubsub-contract-driven-development-leverage-asyncapi-specs-as-executable-contracts/)

Specmatic Google pubsub needs to be imported as a dependency in your project:

{% capture specmatic_google_pubsub_version %}{{ site.specmatic-google-pubsub-version }}{% endcapture %}

{% include maven_coordinates.md
group_id="io.specmatic.googlepubsub"
artifact_id="specmatic-google-pubsub"
version=specmatic_google_pubsub_version %}
