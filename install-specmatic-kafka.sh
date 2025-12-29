---
layout: none
---
{% capture tool_version %}{{ site.specmatic-kafka-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo.specmatic.io/releases/io/specmatic/async/specmatic-kafka-all/{{ site.specmatic-kafka-version }}/specmatic-kafka-all-{{ site.specmatic-kafka-version }}.jar"
{% endcapture %}

{% include install-specmatic-tool.sh
  tool_name="Specmatic Kafka"
  tool_version=tool_version
  download_target="specmatic-kafka"
  download_urls=download_urls %}
