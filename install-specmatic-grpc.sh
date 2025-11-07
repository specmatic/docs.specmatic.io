---
layout: none
---
{% capture tool_version %}{{ site.specmatic-grpc-version }}{% endcapture %}
{% capture download_urls %}
  "https://repo.specmatic.io/releases/io/specmatic/grpc/specmatic-grpc-all/{{ site.specmatic-grpc-version }}/specmatic-grpc-all-{{ site.specmatic-grpc-version }}.jar"
{% endcapture %}

{% include install-specmatic-tool.sh
  main_picocli_command="io.specmatic.grpc.application.SpecmaticGrpcApplication"
  tool_name="Specmatic gRPC"
  tool_version=tool_version
  download_target="specmatic-grpc"
  download_urls=download_urls %}
