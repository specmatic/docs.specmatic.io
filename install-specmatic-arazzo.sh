---
layout: none
---
{% capture tool_version %}{{ site.specmatic-arazzo-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo.specmatic.io/releases/io/specmatic/arazzo/specmatic-arazzo-all/{{ site.specmatic-arazzo-version }}/specmatic-arazzo-all-{{ site.specmatic-arazzo-version }}.jar"
{% endcapture %}

{% include install-specmatic-tool.sh
  tool_name="Specmatic Arazzo"
  tool_version=tool_version
  download_target="specmatic-arazzo"
  download_urls=download_urls %}
