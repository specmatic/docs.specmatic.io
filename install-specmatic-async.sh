---
layout: none
---
{% capture tool_version %}{{ site.specmatic-async-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo1.maven.org/maven2/io/specmatic/async/specmatic-async-all/{{ site.specmatic-async-version }}/specmatic-async-all-{{ site.specmatic-async-version }}.jar"
  "https://repo.specmatic.io/releases/io/specmatic/async/specmatic-async-all/{{ site.specmatic-async-version }}/specmatic-async-all-{{ site.specmatic-async-version }}.jar"
{% endcapture %}
{% include install-specmatic-tool.sh
  tool_name="Specmatic Async"
  tool_version=tool_version
  download_target="specmatic-async"
  download_urls=download_urls %}
