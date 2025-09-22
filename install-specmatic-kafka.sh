---
layout: none
---
{% capture tool_version %}{{ site.specmatic-async-version }}{% endcapture %}
{% capture download_urls %}
  http://localhost:8000/specmatic-kafka-1.3.2-SNAPSHOT-all-unobfuscated.jar
  "https://repo.specmatic.io/releases/io/specmatic/async/specmatic-kafka-all/{{ site.specmatic-async-version }}/specmatic-kafka-all-{{ site.specmatic-async-version }}.jar"
{% endcapture %}

{% include install-specmatic-tool.sh
  main_picocli_command="io.specmatic.kafka.application.SpecmaticKafkaCommand"
  tool_name="Specmatic Kafka"
  tool_version=tool_version
  download_target="specmatic-kafka"
  download_urls=download_urls %}
