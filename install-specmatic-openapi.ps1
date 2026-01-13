---
layout: none
---
{% capture latest_version %}{{ site.specmatic-openapi-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo1.maven.org/maven2/io/specmatic/openapi/specmatic-openapi-all/{tool_version}/specmatic-openapi-all-{tool_version}.jar"
  "https://repo.specmatic.io/releases/io/specmatic/openapi/specmatic-openapi-all/{tool_version}/specmatic-openapi-all-{tool_version}.jar"
{% endcapture %}

{% include install-specmatic-tool.ps1
  main_picocli_command="io.specmatic.openapi.application.SpecmaticOpenAPICommand"
  tool_name="Specmatic OpenAPI"
  latest_version=latest_version
  download_target="specmatic-openapi"
  download_urls=download_urls %}
