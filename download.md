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
```bash
curl {{site.url}}/install-specmatic.sh | bash -- --version VERSION
```

{% endtab %}
<!-- /linux/macos -->

<!-- windows -->
{% tab install-specmatic Windows %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```powershell
irm {{site.url}}/install-specmatic.ps1 | iex
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://github.com/specmatic/specmatic/releases) page.
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

{% tabs install-specmatic-openapi %}
<!-- docker -->
{% tab install-specmatic-openapi Docker %}

To run the latest version:
```bash
docker run -it --rm specmatic/specmatic-openapi --help
```

For older versions, replace `VERSION` with the desired version number from the [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-openapi/tags) page
```bash
docker run -it --rm specmatic/specmatic-openapi:VERSION --help
```
{% endtab %}
<!-- /docker -->

<!-- jar -->
{% tab install-specmatic-openapi JAR %}

The standalone JAR file can be downloaded from the following sources:

* [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/openapi/specmatic-openapi-all/{{ site.specmatic-openapi-version }}/specmatic-openapi-all-{{ site.specmatic-openapi-version }}.jar)

For older versions, please refer to the [Releases](https://repo.specmatic.io/#releases/io/specmatic/openapi/specmatic-openapi-all/) page.

{% endtab %}
<!-- /jar -->
<!-- linux/macos -->
{% tab install-specmatic-openapi Linux/macOS %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To run the latest version:
```bash
curl {{site.url}}/install-specmatic-openapi.sh | bash
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/openapi/specmatic-openapi-all/) page.
```bash
curl {{site.url}}/install-specmatic-openapi.sh | bash -- --version VERSION
```
{% endtab %}
<!-- /linux/macos -->

<!-- windows -->
{% tab install-specmatic-openapi Windows %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```powershell
irm {{site.url}}/install-specmatic-openapi.ps1 | iex
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/openapi/specmatic-openapi-all/) page.
```powershell
iex "& { $(irm '{{site.url}}/install-specmatic-openapi.ps1') } --version VERSION"
```

{% endtab %}
<!-- /windows -->
{% endtabs %}

## Specmatic Studio

{% tabs install-specmatic-studio %}
<!-- docker -->
{% tab install-specmatic-studio Docker %}

To run the latest version:
```bash
docker run -it --rm specmatic/specmatic-studio --help
```

For older versions, replace `VERSION` with the desired version number from the [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-studio/tags) page
```bash
docker run -it --rm specmatic/specmatic-studio:VERSION --help
```
{% endtab %}
<!-- /docker -->

<!-- jar -->
{% tab install-specmatic-studio JAR %}

The standalone JAR file can be downloaded from the following sources:

* [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/studio/specmatic-studio/{{ site.specmatic-studio-version }}/specmatic-studio-{{ site.specmatic-studio-version }}.jar)

For older versions, please refer to the [Releases](https://repo.specmatic.io/#releases/io/specmatic/studio/specmatic-studio/) page.

{% endtab %}
<!-- /jar -->
<!-- linux/macos -->
{% tab install-specmatic-studio Linux/macOS %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To run the latest version:
```bash
curl {{site.url}}/install-specmatic-studio.sh | bash
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/studio/specmatic-studio/) page.

```bash
curl {{site.url}}/install-specmatic-studio.sh | bash -- --version VERSION
```

{% endtab %}
<!-- /linux/macos -->

<!-- windows -->
{% tab install-specmatic-studio Windows %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```powershell
irm {{site.url}}/install-specmatic-studio.ps1 | iex
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/studio/specmatic-studio/) page.
```powershell
iex "& { $(irm '{{site.url}}/install-specmatic-studio.ps1') } --version VERSION"
```

{% endtab %}
<!-- /windows -->
{% endtabs %}

## Specmatic Kafka

{% tabs install-specmatic-kafka %}
<!-- docker -->
{% tab install-specmatic-kafka Docker %}

To run the latest version:
```bash
docker run -it --rm specmatic/specmatic-kafka --help
```

For older versions, replace `VERSION` with the desired version number from the [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-kafka/tags) page
```bash
docker run -it --rm specmatic/specmatic-kafka:VERSION --help
```
{% endtab %}
<!-- /docker -->

<!-- jar -->
{% tab install-specmatic-kafka JAR %}

The standalone JAR file can be downloaded from the following sources:

* [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/async/specmatic-kafka-all/{{ site.specmatic-async-version }}/specmatic-kafka-all-{{ site.specmatic-async-version }}.jar)

For older versions, please refer to the [Releases](https://repo.specmatic.io/#releases/io/specmatic/async/specmatic-kafka-all/) page.

{% endtab %}
<!-- /jar -->
<!-- linux/macos -->
{% tab install-specmatic-kafka Linux/macOS %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```bash
curl {{site.url}}/install-specmatic-kafka.sh | bash
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/async/specmatic-kafka-all/) page.

```bash
curl {{site.url}}/install-specmatic-kafka.sh | bash -- --version VERSION
```


{% endtab %}
<!-- /linux/macos -->

<!-- windows -->
{% tab install-specmatic-kafka Windows %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```powershell
irm {{site.url}}/install-specmatic-kafka.ps1 | iex
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/async/specmatic-kafka-all/) page.
```powershell
iex "& { $(irm '{{site.url}}/install-specmatic-kafka.ps1') } --version VERSION"
```

{% endtab %}
<!-- /windows -->
{% endtabs %}

## Specmatic gRPC

{% tabs install-specmatic-grpc %}
<!-- docker -->
{% tab install-specmatic-grpc Docker %}

To run the latest version:
```bash
docker run -it --rm specmatic/specmatic-grpc --help
```

For older versions, replace `VERSION` with the desired version number from the [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-grpc/tags) page
```bash
docker run -it --rm specmatic/specmatic-grpc:VERSION --help
```
{% endtab %}
<!-- /docker -->
<!-- jar -->
{% tab install-specmatic-grpc JAR %}

The standalone JAR file can be downloaded from the following sources:

* [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/grpc/specmatic-grpc-all/{{ site.specmatic-grpc-version }}/specmatic-grpc-all-{{ site.specmatic-grpc-version }}.jar)

For older versions, please refer to the [Releases](https://repo.specmatic.io/#releases/io/specmatic/grpc/specmatic-grpc-all/) page.

{% endtab %}
<!-- /jar -->
<!-- /linux/macos -->
{% tab install-specmatic-grpc Linux/macOS %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```bash
curl {{site.url}}/install-specmatic-grpc.sh | bash
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/grpc/specmatic-grpc-all/) page.
```bash
curl {{site.url}}/install-specmatic-grpc.sh | bash -- --version VERSION
```

{% endtab %}
<!-- /linux/macos -->
<!-- windows -->
{% tab install-specmatic-grpc Windows %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```powershell
irm {{site.url}}/install-specmatic-grpc.ps1 | iex
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/grpc/specmatic-grpc-all/) page.
```powershell
iex "& { $(irm '{{site.url}}/install-specmatic-grpc.ps1') } --version VERSION"
```

{% endtab %}
<!-- /windows -->
{% endtabs %}

## Specmatic GraphQL

{% tabs install-specmatic-graphql %}
<!-- docker -->
{% tab install-specmatic-graphql Docker %}

To run the latest version:
```bash
docker run -it --rm specmatic/specmatic-graphql --help
```

For older versions, replace `VERSION` with the desired version number from the [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-graphql/tags) page
```bash
docker run -it --rm specmatic/specmatic-graphql:VERSION --help
```
{% endtab %}
<!-- /docker -->

<!-- jar -->
{% tab install-specmatic-graphql JAR %}

The standalone JAR file can be downloaded from the following sources:

* [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/graphql/specmatic-graphql-all/{{ site.specmatic-graphql-version }}/specmatic-graphql-all-{{ site.specmatic-graphql-version }}.jar)

For older versions, please refer to the [Releases](https://repo.specmatic.io/#releases/io/specmatic/graphql/specmatic-graphql-all/) page.

{% endtab %}
<!-- /jar -->
<!-- /linux/macos -->
{% tab install-specmatic-graphql Linux/macOS %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```bash
curl {{site.url}}/install-specmatic-graphql.sh | bash
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/graphql/specmatic-graphql-all/) page.
```bash
curl {{site.url}}/install-specmatic-graphql.sh | bash -- --version VERSION
```

{% endtab %}
<!-- /linux/macos -->
<!-- windows -->
{% tab install-specmatic-graphql Windows %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```powershell
irm {{site.url}}/install-specmatic-graphql.ps1 | iex
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/graphql/specmatic-graphql-all/) page.
```powershell
iex "& { $(irm '{{site.url}}/install-specmatic-graphql.ps1') } --version VERSION"
```

{% endtab %}
<!-- /windows -->
{% endtabs %}

## Specmatic Arazzo

{% tabs install-specmatic-arazzo %}
<!-- docker -->
{% tab install-specmatic-arazzo Docker %}

To run the latest version:
```bash
docker run -it --rm specmatic/specmatic-arazzo --help
```

For older versions, replace `VERSION` with the desired version number from the [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-arazzo/tags) page
```bash
docker run -it --rm specmatic/specmatic-arazzo:VERSION --help
```
{% endtab %}
<!-- /docker -->

<!-- jar -->
{% tab install-specmatic-arazzo JAR %}

The standalone JAR file can be downloaded from the following sources:

* [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/arazzo/specmatic-arazzo-all/{{ site.specmatic-arazzo-version }}/specmatic-arazzo-all-{{ site.specmatic-arazzo-version }}.jar)

For older versions, please refer to the [Releases](https://repo.specmatic.io/#releases/io/specmatic/arazzo/specmatic-arazzo-all/) page.

{% endtab %}
<!-- /jar -->
<!-- /linux/macos -->
{% tab install-specmatic-arazzo Linux/macOS %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```bash
curl {{site.url}}/install-specmatic-arazzo.sh | bash
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/arazzo/specmatic-arazzo-all/) page.
```bash
curl {{site.url}}/install-specmatic-arazzo.sh | bash -- --version VERSION
```

{% endtab %}
<!-- /linux/macos -->
<!-- windows -->
{% tab install-specmatic-arazzo Windows %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```powershell
irm {{site.url}}/install-specmatic-arazzo.ps1 | iex
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/arazzo/specmatic-arazzo-all/) page.
```powershell
iex "& { $(irm '{{site.url}}/install-specmatic-arazzo.ps1') } --version VERSION"
```

{% endtab %}
<!-- /windows -->
{% endtabs %}

## Specmatic Redis

{% tabs install-specmatic-redis %}
<!-- docker -->
{% tab install-specmatic-redis Docker %}

To run the latest version:
```bash
docker run -it --rm specmatic/specmatic-redis --help
```

For older versions, replace `VERSION` with the desired version number from the [Docker Hub](https://hub.docker.com/r/specmatic/specmatic-redis/tags) page
```bash
docker run -it --rm specmatic/specmatic-redis:VERSION --help
```
{% endtab %}
<!-- /docker -->

<!-- jar -->
{% tab install-specmatic-redis JAR %}

The standalone JAR file can be downloaded from the following sources:

* [Specmatic Repository](https://repo.specmatic.io/releases/io/specmatic/redis/specmatic-redis-all/{{ site.specmatic-redis-version }}/specmatic-redis-all-{{ site.specmatic-redis-version }}.jar)

For older versions, please refer to the [Releases](https://repo.specmatic.io/#releases/io/specmatic/redis/specmatic-redis-all/) page.

{% endtab %}
<!-- /jar -->
<!-- linux/macos -->
{% tab install-specmatic-redis Linux/macOS %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```bash
curl {{site.url}}/install-specmatic-redis.sh | bash
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/redis/specmatic-redis-all/) page.
```bash
curl {{site.url}}/install-specmatic-redis.sh | bash -- --version VERSION
```

{% endtab %}
<!-- /linux/macos -->

<!-- windows -->
{% tab install-specmatic-redis Windows %}

If you have have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To install the latest version:
```powershell
irm {{site.url}}/install-specmatic-redis.ps1 | iex
```

To install an older version, replace `VERSION` with the desired version number from the [Releases](https://repo.specmatic.io/#releases/io/specmatic/redis/specmatic-redis-all/) page.
```powershell
iex "& { $(irm '{{site.url}}/install-specmatic-redis.ps1') } --version VERSION"
```

{% endtab %}
<!-- /windows -->
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


## Specmatic Google pubsub

Specmatic Google pubsub needs to be imported as a dependency in your project:

{% capture specmatic_google_pubsub_version %}{{ site.specmatic-google-pubsub-version }}{% endcapture %}

{% include maven_coordinates.md
  group_id="io.specmatic.googlepubsub"
  artifact_id="specmatic-google-pubsub"
  version=specmatic_google_pubsub_version %}
