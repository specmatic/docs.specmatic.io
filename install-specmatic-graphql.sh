---
layout: none
---
{% capture tool_version %}{{ site.specmatic-graphql-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo.specmatic.io/releases/io/specmatic/graphql/specmatic-graphql-all/{{ site.specmatic-graphql-version }}/specmatic-graphql-all-{{ site.specmatic-graphql-version }}.jar"
{% endcapture %}

{% include install-specmatic-tool.sh
  main_picocli_command="io.specmatic.graphql.application.SpecmaticGraphQLApplication"
  tool_name="Specmatic GraphQL"
  tool_version=tool_version
  download_target="specmatic-graphql"
  download_urls=download_urls %}
