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

## Specmatic OpenAPI

{% capture specmatic_openapi_version %}{{ site.specmatic-openapi-version }}{% endcapture %}
{% capture specmatic_openapi_jar_url %}https://repo.specmatic.io/releases/io/specmatic/openapi/specmatic-openapi-all/{{ site.specmatic-openapi-version }}/specmatic-openapi-all-{{ site.specmatic-openapi-version }}.jar{% endcapture %}
{% capture specmatic_openapi_repo_url %}https://repo.specmatic.io/#releases/io/specmatic/openapi/specmatic-openapi-all/{% endcapture %}

{% include commercial_download.md
    image_name="specmatic/specmatic-openapi"
    tool_version=specmatic_openapi_version
    jar_url=specmatic_openapi_jar_url
    repo_url=specmatic_openapi_repo_url
    install_script="install-specmatic-openapi" %}

## [Specmatic Studio](https://specmatic.io/specmatic-studio/)

{% capture specmatic_studio_version %}{{ site.specmatic-studio-version }}{% endcapture %}
{% capture specmatic_studio_jar_url %}https://repo.specmatic.io/releases/io/specmatic/studio/specmatic-studio/{{ site.specmatic-studio-version }}/specmatic-studio-{{ site.specmatic-studio-version }}.jar{% endcapture %}
{% capture specmatic_studio_repo_url %}https://repo.specmatic.io/#releases/io/specmatic/studio/specmatic-studio/{% endcapture %}

{% include commercial_download.md
    image_name="specmatic/specmatic-studio"
    tool_version=specmatic_studio_version
    jar_url=specmatic_studio_jar_url
    repo_url=specmatic_studio_repo_url
    install_script="install-specmatic-studio" %}

## [Specmatic Async](https://hub.docker.com/r/specmatic/specmatic-async)

{% capture specmatic_async_version %}{{ site.specmatic-async-version }}{% endcapture %}
{% capture specmatic_async_jar_url %}https://repo.specmatic.io/releases/io/specmatic/async/specmatic-async-all/{{ site.specmatic-async-version }}/specmatic-async-all-{{ site.specmatic-async-version }}.jar{% endcapture %}
{% capture specmatic_async_repo_url %}https://repo.specmatic.io/#releases/io/specmatic/async/specmatic-async-all{% endcapture %}

{% include commercial_download.md
image_name="specmatic/specmatic-async"
tool_version=specmatic_async_version
jar_url=specmatic_async_jar_url
repo_url=specmatic_async_repo_url
install_script="install-specmatic-async" %}

## [Specmatic Kafka](https://specmatic.io/features/kafka-contract-driven-development-leverage-asyncapi-specs-as-executable-contracts/)

{% capture specmatic_kafka_version %}{{ site.specmatic-kafka-version }}{% endcapture %}
{% capture specmatic_kafka_jar_url %}https://repo.specmatic.io/releases/io/specmatic/async/specmatic-kafka-all/{{ site.specmatic-kafka-version }}/specmatic-kafka-all-{{ site.specmatic-kafka-version }}.jar{% endcapture %}
{% capture specmatic_kafka_repo_url %}https://repo.specmatic.io/#releases/io/specmatic/async/specmatic-kafka-all{% endcapture %}

{% include commercial_download.md
    image_name="specmatic/specmatic-kafka"
    tool_version=specmatic_kafka_version
    jar_url=specmatic_kafka_jar_url
    repo_url=specmatic_kafka_repo_url
    install_script="install-specmatic-kafka" %}

## [Specmatic gRPC](https://specmatic.io/features/transform-your-grpc-proto-files-into-executable-contracts-in-seconds-with-specmatic/)

{% capture specmatic_grpc_version %}{{ site.specmatic-grpc-version }}{% endcapture %}
{% capture specmatic_grpc_jar_url %}https://repo.specmatic.io/releases/io/specmatic/grpc/specmatic-grpc-all/{{ site.specmatic-grpc-version }}/specmatic-grpc-all-{{ site.specmatic-grpc-version }}.jar{% endcapture %}
{% capture specmatic_grpc_repo_url %}https://repo.specmatic.io/#releases/io/specmatic/grpc/specmatic-grpc-all/{% endcapture %}

{% include commercial_download.md
    image_name="specmatic/specmatic-grpc"
    tool_version=specmatic_grpc_version
    jar_url=specmatic_grpc_jar_url
    repo_url=specmatic_grpc_repo_url
    install_script="install-specmatic-grpc" %}

## [Specmatic GraphQL](https://specmatic.io/features/transform-your-graphql-specs-into-executable-contracts-in-seconds-with-specmatic/)

{% capture specmatic_graphql_version %}{{ site.specmatic-graphql-version }}{% endcapture %}
{% capture specmatic_graphql_jar_url %}https://repo.specmatic.io/releases/io/specmatic/graphql/specmatic-graphql-all/{{ site.specmatic-graphql-version }}/specmatic-graphql-all-{{ site.specmatic-graphql-version }}.jar{% endcapture %}
{% capture specmatic_graphql_repo_url %}https://repo.specmatic.io/#releases/io/specmatic/graphql/specmatic-graphql-all/{% endcapture %}

{% include commercial_download.md
    image_name="specmatic/specmatic-graphql"
    tool_version=specmatic_graphql_version
    jar_url=specmatic_graphql_jar_url
    repo_url=specmatic_graphql_repo_url
    install_script="install-specmatic-graphql" %}

## [Specmatic Arazzo](https://specmatic.io/features/author-test-arazzo-api-workflows-drag-drop-simplicity/)

{% capture specmatic_arazzo_version %}{{ site.specmatic-arazzo-version }}{% endcapture %}
{% capture specmatic_arazzo_jar_url %}https://repo.specmatic.io/releases/io/specmatic/arazzo/specmatic-arazzo-all/{{ site.specmatic-arazzo-version }}/specmatic-arazzo-all-{{ site.specmatic-arazzo-version }}.jar{% endcapture %}
{% capture specmatic_arazzo_repo_url %}https://repo.specmatic.io/#releases/io/specmatic/arazzo/specmatic-arazzo-all/{% endcapture %}

{% include commercial_download.md
    image_name="specmatic/specmatic-arazzo"
    tool_version=specmatic_arazzo_version
    jar_url=specmatic_arazzo_jar_url
    repo_url=specmatic_arazzo_repo_url install_script="install-specmatic-arazzo" %}

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
