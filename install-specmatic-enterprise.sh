---
layout: none
---
{% capture tool_version %}{{ site.specmatic-enterprise-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo1.maven.org/maven2/io/specmatic/enterprise/specmatic-enterprise-all/{{ site.specmatic-enterprise-version }}/specmatic-enterprise-all-{{ site.specmatic-enterprise-version }}.jar"
  "https://repo.specmatic.io/releases/io/specmatic/enterprise/specmatic-enterprise-all/{{ site.specmatic-enterprise-version }}/specmatic-enterprise-all-{{ site.specmatic-enterprise-version }}.jar"
{% endcapture %}

{% include install-specmatic-tool.sh
  tool_name="Specmatic Enterprise"
  tool_version=tool_version
  download_target="specmatic-enterprise"
  download_urls=download_urls %}
