
{% tabs specmatic-maven-tab %}
{% tab specmatic-maven-tab Maven %}

Be sure to add the following repository to the `repositories` section of your `pom.xml` if you haven't already:

```xml
<repository>
    <id>specmatic-repo</id>
    <url>https://repo.specmatic.io/releases/</url>
</repository>
```

Then add the following dependency to the `dependencies` section of your `pom.xml`:

```xml
  <dependency>
    <groupId>{{ include.group_id }}</groupId>
    <artifactId>{{ include.artifact_id }}</artifactId>
    <version>{{ include.version }}</version>
</dependency>
```
{% endtab %}
{% tab specmatic-maven-tab Gradle %}

Be sure to register the Specmatic repository in your `repositories` section if you haven't already:

```groovy
repositories {
    maven {
        url "https://repo.specmatic.io/releases/"
    }
}
```

Add the following dependency in the `dependencies` section:

```groovy
implementation '{{ include.group_id }}:{{ include.artifact_id }}:{{ include.version }}'
```
{% endtab %}
{% tab specmatic-maven-tab Kotlin DSL %}

Be sure to register the Specmatic repository in your `repositories` section if you haven't already:

```kotlin
repositories {
    maven {
        url = uri("https://repo.specmatic.io/releases/")
    }
}
```

Add the following dependency in the `dependencies` section:

```kotlin
implementation("{{ include.group_id }}:{{ include.artifact_id }}:{{ include.version }}")
```
{% endtab %}

{% endtabs %}
