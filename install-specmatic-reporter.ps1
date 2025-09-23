---
layout: none
---
{% capture tool_version %}{{ site.specmatic-build-reporter-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo.specmatic.io/releases/io/specmatic/build-reporter/specmatic-reporter-all/{{ site.specmatic-build-reporter-version }}/specmatic-reporter-all-{{ site.specmatic-build-reporter-version }}.jar"
{% endcapture %}

{% include install-specmatic-tool.ps1
  main_picocli_command="io.specmatic.reporter.commands.SendReportCommand"
  tool_name="Specmatic Build Reporter"
  tool_version=tool_version
  download_target="specmatic-reporter"
  download_urls=download_urls %}
