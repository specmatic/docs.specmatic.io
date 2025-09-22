---
layout: none
---
{% capture tool_version %}{{ site.specmatic-core-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo1.maven.org/maven2/io/specmatic/specmatic-executable-all/{{ site.specmatic-core-version }}/specmatic-executable-all-{{ site.specmatic-core-version }}.jar"
  "https://github.com/specmatic/specmatic/releases/download/{{ site.specmatic-core-version }}/specmatic.jar"
  "https://repo.specmatic.io/releases/io/specmatic/specmatic-executable-all/{{ site.specmatic-core-version }}/specmatic-executable-all-{{ site.specmatic-core-version }}.jar"
{% endcapture %}

{% include install-specmatic-tool.sh
  main_picocli_command="application.SpecmaticCommand"
  tool_name="Specmatic"
  tool_version=tool_version
  download_target="specmatic"
  download_urls=download_urls %}
