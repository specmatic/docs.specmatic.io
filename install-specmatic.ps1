---
layout: none
---
{% capture latest_version %}{{ site.specmatic-core-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo1.maven.org/maven2/io/specmatic/specmatic-executable-all/{tool_version}/specmatic-executable-all-{tool_version}.jar"
  "https://github.com/specmatic/specmatic/releases/download/{tool_version}/specmatic.jar"
  "https://repo.specmatic.io/releases/io/specmatic/specmatic-executable-all/{tool_version}/specmatic-executable-all-{tool_version}.jar"
{% endcapture %}

{% include install-specmatic-tool.ps1
  main_picocli_command="application.SpecmaticCommand"
  tool_name="Specmatic"
  latest_version=latest_version
  download_target="specmatic"
  download_urls=download_urls %}
