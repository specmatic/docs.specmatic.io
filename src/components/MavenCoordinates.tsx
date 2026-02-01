import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export default function MavenCoordinates({ groupId, artifactId, version }) {
  return (
    <Tabs groupId={`maven-${artifactId}`}>
      <TabItem value="maven" label="Maven">
        <CodeBlock language="xml">{`<repository>
  <id>specmatic-repo</id>
  <url>https://repo.specmatic.io/releases/</url>
</repository>`}</CodeBlock>

        <CodeBlock language="xml">{`<dependency>
  <groupId>${groupId}</groupId>
  <artifactId>${artifactId}</artifactId>
  <version>${version}</version>
</dependency>`}</CodeBlock>
      </TabItem>

      <TabItem value="gradle" label="Gradle">
        <CodeBlock language="groovy">{`repositories {
  maven {
    url "https://repo.specmatic.io/releases/"
  }
}`}</CodeBlock>

        <CodeBlock language="groovy">{`implementation '${groupId}:${artifactId}:${version}'`}</CodeBlock>
      </TabItem>

      <TabItem value="gradle-kotlin" label="Kotlin DSL">
        <CodeBlock language="kotlin">{`repositories {
  maven {
    url = uri("https://repo.specmatic.io/releases/")
  }
}`}</CodeBlock>

        <CodeBlock language="kotlin">{`implementation("${groupId}:${artifactId}:${version}")`}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
