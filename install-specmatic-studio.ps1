---
layout: none
---
{% capture latest_version %}{{ site.specmatic-studio-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo.specmatic.io/releases/io/specmatic/studio/specmatic-studio/{tool_version}/specmatic-studio-{tool_version}.jar"
{% endcapture %}

{% include install-specmatic-tool.ps1
  main_picocli_command="io.specmatic.studio.application.SpecmaticStudioCommand"
  tool_name="Specmatic Studio"
  latest_version=latest_version
  download_target="specmatic-studio"
  download_urls=download_urls %}
