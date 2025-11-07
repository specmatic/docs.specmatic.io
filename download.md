---
layout: default
title: Download
nav_exclude: true

---
# Specmatic Open Source

## Open Source CLI standalone executable

Read our "[Getting started (in 5 min)](/getting_started.html)" section learn more about using the standalone executable.


{% tabs install-specmatic %}
<!-- docker -->
{% tab install-specmatic Docker %}

To run the latest version:
```bash
docker run -it --rm specmatic/specmatic --help
```

For older versions, replace `VERSION` with the desired version number from the [Docker Hub](https://hub.docker.com/r/specmatic/specmatic/tags) page
```bash
docker run -it --rm specmatic/specmatic:VERSION --help
```
{% endtab %}
<!-- /docker -->

<!-- jar -->
{% tab install-specmatic JAR %}

The standalone JAR file can be downloaded from the following sources:

* [Github](https://github.com/specmatic/specmatic/releases/download/{{ site.specmatic-core-version }}/specmatic.jar)
* [Maven Central](https://repo1.maven.org/maven2/io/specmatic/specmatic-executable-all/{{ site.specmatic-core-version }}/specmatic-executable-all-{{ site.specmatic-core-version }}.jar)

For older versions, please refer to the [Releases](https://github.com/specmatic/specmatic/releases) page.

{% endtab %}
<!-- /jar -->
<!-- linux/macos -->
{% tab install-specmatic Linux/macOS %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```shell
# install the latest version
curl {{site.url}}/install-specmatic.sh | bash
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://github.com/specmatic/specmatic/releases) page.
```shell
curl {{site.url}}/install-specmatic.sh | bash -- --version VERSION
```

{% endtab %}
<!-- /linux/macos -->

<!-- windows -->
{% tab install-specmatic Windows %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

```bash
irm {{site.url}}/install-specmatic.ps1 | iex
```
{% endtab %}
<!-- /windows -->

<!-- npm -->
{% tab install-specmatic NPM %}

To run the latest version:
```bash
npx specmatic
```

For older versions, replace `VERSION` with the desired version number from the [NPM Registry](https://www.npmjs.com/package/specmatic?activeTab=versions) page
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

To install a specific version, replace `VERSION` with the desired version number from the [PyPI](https://pypi.org/project/specmatic/#history) page:
```bash
pip install specmatic==VERSION
```

{% endtab %}
{% endtabs %}

# Specmatic Commercial offerings

## Specmatic OpenAPI



Specmatic OpenAPI can be downloaded from the following sources:
* [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-openapi) - `docker pull specmatic/specmatic-openapi`
* As a JAR file from [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/openapi/specmatic-openapi-all/{{ site.specmatic-openapi-version }}/specmatic-openapi-all-{{ site.specmatic-openapi-version }}.jar).
* Previous JAR versions can be found [here](https://repo.specmatic.io/#releases/io/specmatic/openapi/specmatic-openapi-all/).

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

{% tabs install-specmatic-openapi %}
{% tab install-specmatic-openapi Linux/macOS %}
```bash
curl {{site.url}}/install-specmatic-openapi.sh | bash
```
{% endtab %}
{% tab install-specmatic-openapi Windows %}
```bash
irm {{site.url}}/install-specmatic-openapi.ps1 | iex
```
{% endtab %}
{% endtabs %}

## Specmatic Studio

Specmatic Studio can be downloaded from the following sources:
* [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-studio) - `docker pull specmatic/specmatic-studio`
* As a JAR file from [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/studio/specmatic-studio/{{ site.specmatic-studio-version }}/specmatic-studio-{{ site.specmatic-studio-version }}.jar).
* Previous JAR versions can be found [here](https://repo.specmatic.io/#releases/io/specmatic/studio/specmatic-studio/).

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

{% tabs install-specmatic-studio %}
{% tab install-specmatic-studio Linux/macOS %}
```bash
curl {{site.url}}/install-specmatic-studio.sh | bash
```
{% endtab %}
{% tab install-specmatic-studio Windows %}
```bash
irm {{site.url}}/install-specmatic-studio.ps1 | iex
```
{% endtab %}
{% endtabs %}

## Specmatic Kafka

Specmatic Kafka can be downloaded from the following sources:
* [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-kafka) - `docker pull specmatic/specmatic-kafka`
* As a JAR file from [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/async/specmatic-kafka-all/{{ site.specmatic-async-version }}/specmatic-kafka-all-{{ site.specmatic-async-version }}.jar)
* Previous JAR versions can be found [here](https://repo.specmatic.io/#releases/io/specmatic/async/specmatic-kafka-all/).

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

{% tabs install-specmatic-kafka %}
{% tab install-specmatic-kafka Linux/macOS %}
```bash
curl {{site.url}}/install-specmatic-kafka.sh | bash
```
{% endtab %}
{% tab install-specmatic-kafka Windows %}
```bash
irm {{site.url}}/install-specmatic-kafka.ps1 | iex
```
{% endtab %}
{% endtabs %}

## Specmatic gRPC

Specmatic gRPC can be downloaded from the following sources:
* [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-grpc)
* As a JAR file from [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/grpc/specmatic-grpc-all/{{ site.specmatic-grpc-version }}/specmatic-grpc-all-{{ site.specmatic-grpc-version }}.jar)
* Previous JAR versions can be found [here](https://repo.specmatic.io/#releases/io/specmatic/grpc/specmatic-grpc-all/).

## Specmatic GraphQL

Specmatic GraphQL can be downloaded from the following sources:
* [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-graphql)
* As a JAR file from [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/graphql/specmatic-graphql-all/{{ site.specmatic-graphql-version }}/specmatic-graphql-all-{{ site.specmatic-graphql-version }}.jar)
* Previous JAR versions can be found [here](https://repo.specmatic.io/#releases/io/specmatic/graphql/specmatic-graphql-all/).

## Specmatic Arazzo

Specmatic Arazzo can be downloaded from the following sources:
* [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-arazzo)
* As a JAR file from [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/arazzo/specmatic-arazzo-all/{{ site.specmatic-arazzo-version }}/specmatic-arazzo-all-{{ site.specmatic-arazzo-version }}.jar)
* Previous JAR versions can be found [here](https://repo.specmatic.io/#releases/io/specmatic/arazzo/specmatic-arazzo-all/).

## Specmatic Redis

Specmatic Redis can be downloaded from the following sources:
* [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-redis)
* As a JAR file from [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/redis/specmatic-redis-all/{{ site.specmatic-redis-version }}/specmatic-redis-all-{{ site.specmatic-redis-version }}.jar)
* Previous JAR versions can be found [here](https://repo.specmatic.io/#releases/io/specmatic/redis/specmatic-redis-all/).

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

{% tabs install-specmatic-redis %}
{% tab install-specmatic-redis Linux/macOS %}
```bash
curl {{site.url}}/install-specmatic-redis.sh | bash
```
{% endtab %}
{% tab install-specmatic-redis Windows %}
```bash
irm {{site.url}}/install-specmatic-redis.ps1 | iex
```
{% endtab %}
{% endtabs %}


## Specmatic JDBC

Specmatic JDBC needs to be imported as a dependency in your project:

{% capture specmatic_jdbc_version %}{{ site.specmatic-jdbc-version }}{% endcapture %}

{% include maven_coordinates.md
  group_id="io.specmatic.jdbc"
  artifact_id="specmatic-jdbc"
  version=specmatic_jdbc_version %}


## Specmatic JMS

Specmatic JMS needs to be imported as a dependency in your project:

{% capture specmatic_jms_version %}{{ site.specmatic-jms-version }}{% endcapture %}

{% include maven_coordinates.md
  group_id="io.specmatic.jms"
  artifact_id="specmatic-jms"
  version=specmatic_jms_version %}
