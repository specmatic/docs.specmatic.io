---
layout: none
---
{% capture tool_version %}{{ site.specmatic-openapi-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo1.maven.org/maven2/io/specmatic/openapi/specmatic-openapi-all/{{ site.specmatic-openapi-version }}/specmatic-openapi-all-{{ site.specmatic-openapi-version }}.jar"
  "https://repo.specmatic.io/releases/io/specmatic/openapi/specmatic-openapi-all/{{ site.specmatic-openapi-version }}/specmatic-openapi-all-{{ site.specmatic-openapi-version }}.jar"
{% endcapture %}

{% include install-specmatic-tool.sh
  tool_name="Specmatic OpenAPI"
  tool_version=tool_version
  download_target="specmatic-openapi"
  download_urls=download_urls %}
