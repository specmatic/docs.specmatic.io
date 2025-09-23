---
layout: none
---
{% capture tool_version %}{{ site.specmatic-openapi-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo.specmatic.io/releases/io/specmatic/openapi/specmatic-openapi-all/{{ site.specmatic-openapi-version }}/specmatic-openapi-all-{{ site.specmatic-openapi-version }}.jar"
{% endcapture %}

{% include install-specmatic-tool.ps1
  main_picocli_command="io.specmatic.openapi.application.SpecmaticOpenAPICommand"
  tool_name="Specmatic OpenAPI"
  tool_version=tool_version
  download_target="specmatic-openapi"
  download_urls=download_urls %}
