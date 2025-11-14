---
layout: none
---
{% capture latest_version %}{{ site.specmatic-grpc-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo.specmatic.io/releases/io/specmatic/grpc/specmatic-grpc-all/{tool_version}/specmatic-grpc-all-{tool_version}.jar"
{% endcapture %}

{% include install-specmatic-tool.ps1
  main_picocli_command="io.specmatic.grpc.application.SpecmaticGrpcApplication"
  tool_name="Specmatic GRPC"
  latest_version=latest_version
  download_target="specmatic-grpc"
  download_urls=download_urls %}
