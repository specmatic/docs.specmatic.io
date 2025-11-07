---
layout: none
---
{% capture latest_version %}{{ site.specmatic-redis-version }}{% endcapture %}
{% capture download_urls %}
  https://repo.specmatic.io/releases/io/specmatic/redis/specmatic-redis-all/{tool_version}/specmatic-redis-all-{tool_version}.jar
{% endcapture %}

{% include install-specmatic-tool.ps1
  main_picocli_command="io.specmatic.redis.mock.application.SpecmaticRedisCommand"
  tool_name="Specmatic Redis"
  latest_version=latest_version
  download_target="specmatic-redis"
  download_urls=download_urls %}
