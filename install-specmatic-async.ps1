---
layout: none
---
{% capture latest_version %}{{ site.specmatic-async-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo1.maven.org/maven2/io/specmatic/async/specmatic-async-all/{tool_version}/specmatic-async-all-{tool_version}.jar"
  "https://repo.specmatic.io/releases/io/specmatic/async/specmatic-async-all/{tool_version}/specmatic-async-all-{tool_version}.jar"
{% endcapture %}
{% include install-specmatic-tool.ps1
  main_picocli_command="io.specmatic.async.application.SpecmaticAsyncCommand"
  tool_name="Specmatic Async"
  latest_version=latest_version
  download_target="specmatic-async"
  download_urls=download_urls %}
