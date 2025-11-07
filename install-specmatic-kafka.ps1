---
layout: none
---
{% capture latest_version %}{{ site.specmatic-async-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo.specmatic.io/releases/io/specmatic/async/specmatic-kafka-all/{tool_version}/specmatic-kafka-all-{tool_version}.jar"
{% endcapture %}

{% include install-specmatic-tool.ps1
  main_picocli_command="io.specmatic.kafka.application.SpecmaticKafkaCommand"
  tool_name="Specmatic Kafka"
  latest_version=latest_version
  download_target="specmatic-kafka"
  download_urls=download_urls %}
