---
layout: none
---
{% capture tool_version %}{{ site.specmatic-studio-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo.specmatic.io/releases/io/specmatic/studio/specmatic-studio/{{ site.specmatic-studio-version }}/specmatic-studio-{{ site.specmatic-studio-version }}.jar"
{% endcapture %}

{% include install-specmatic-tool.sh
  main_picocli_command="io.specmatic.studio.application.SpecmaticStudioCommand"
  tool_name="Specmatic Studio"
  tool_version=tool_version
  download_target="specmatic-studio"
  download_urls=download_urls %}
