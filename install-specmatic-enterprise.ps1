---
layout: none
---
{% capture latest_version %}{{ site.specmatic-enterprise-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo1.maven.org/maven2/io/specmatic/enterprise/specmatic-enterprise-all/{tool_version}/specmatic-enterprise-all-{tool_version}.jar"
  "https://repo.specmatic.io/releases/io/specmatic/enterprise/specmatic-enterprise-all/{tool_version}/specmatic-enterprise-all-{tool_version}.jar"
{% endcapture %}

{% include install-specmatic-tool.ps1
  tool_name="Specmatic Enterprise"
  latest_version=latest_version
  download_target="specmatic-enterprise"
  download_urls=download_urls %}
