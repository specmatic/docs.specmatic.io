---
layout: none
---
{% capture tool_version %}{{ site.specmatic-redis-version }}{% endcapture %}
{% capture download_urls %}
  https://repo.specmatic.io/releases/io/specmatic/redis/specmatic-redis-all/{{ site.specmatic-redis-version }}/specmatic-redis-all-{{ site.specmatic-redis-version }}.jar
{% endcapture %}

{% include install-specmatic-tool.sh
  main_picocli_command="io.specmatic.redis.mock.application.SpecmaticRedisCommand"
  tool_name="Specmatic Redis"
  tool_version=tool_version
  download_target="specmatic-redis"
  download_urls=download_urls %}
