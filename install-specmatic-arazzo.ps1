---
layout: none
---
{% capture latest_version %}{{ site.specmatic-arazzo-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo.specmatic.io/releases/io/specmatic/arazzo/specmatic-arazzo-all/{tool_version}/specmatic-arazzo-all-{tool_version}.jar"
{% endcapture %}

{% include install-specmatic-tool.ps1
  main_picocli_command="io.specmatic.arazzo.Application"
  tool_name="Specmatic Arazzo"
  latest_version=latest_version
  download_target="specmatic-arazzo"
  download_urls=download_urls %}
