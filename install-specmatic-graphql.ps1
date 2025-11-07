---
layout: none
---
{% capture latest_version %}{{ site.specmatic-graphql-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo.specmatic.io/releases/io/specmatic/graphql/specmatic-graphql-all/{tool_version}/specmatic-graphql-all-{tool_version}.jar"
{% endcapture %}

{% include install-specmatic-tool.ps1
  main_picocli_command="io.specmatic.graphql.application.SpecmaticGraphQLApplication"
  tool_name="Specmatic GraphQL"
  latest_version=latest_version
  download_target="specmatic-graphql"
  download_urls=download_urls %}
