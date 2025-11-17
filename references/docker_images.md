---
layout: default
title: Using Docker Images
parent: References
nav_order: 2
redirect_from:
   - /documentation/docker_images.html
   - /documentation/references/docker_images.html
---

Specmatic Docker Images
=======================

Specmatic provides docker images for all its tools. These images are available on [Docker Hub](https://hub.docker.com/u/specmatic).


## Ease of Use, Consistency, and OS Compatibility

The Specmatic Docker image is designed for ease of use and a consistent user experience across different environments and operating systems. By packaging all dependencies and tools required to run Specmatic, the image ensures that users can get started quickly without worrying about setup or compatibility issues. Whether running locally, in CI/CD pipelines, or in production, the behavior and interface remain the same, providing a reliable and predictable workflow. The Docker image abstracts away differences between user environments and operating systems—regardless of whether you are on macOS, Linux, or Windows, the container provides a uniform environment for running Specmatic. This eliminates issues related to OS-specific dependencies, library versions, or shell differences, ensuring that your Specmatic workflows behave identically everywhere Docker is supported.

{% tabs usage %}
{% tab usage Simple Usage %}
```sh
docker run --rm specmatic/specmatic --help
```
{% endtab %}
{% tab usage Advanced Usage (open a shell) %}

1. Start up a shell in the container:
```sh
docker run -it --rm --entrypoint /bin/bash specmatic/specmatic
```

2. Execute a command in the container:
```sh
specmatic --help
```

{% endtab %}
{% endtabs %}

## Using a License Key with Docker

If you are using a commercial Specmatic module, you will need to provide a valid license key. When running Specmatic in Docker, mount your license file into the container and set the environment variable so Specmatic can find it. For example:

{% tabs use_specmatic_commands %}
{% tab use_specmatic_commands Docker Linux/macOS %}
```shell
docker run -it --rm -v ~/.specmatic:/root/.specmatic specmatic/specmatic-openapi -h
```
{% endtab %}
{% tab use_specmatic_commands Docker-Win-Powershell %}
```shell
docker run -it --rm -v "${env:USERPROFILE}/.specmatic:/root/.specmatic" specmatic/specmatic-openapi -h
```
{% endtab %}
{% tab use_specmatic_commands Docker-Win-CommandPrompt %}
```shell
docker run -it --rm -v "%USERPROFILE%\.specmatic:/root/.specmatic" specmatic/specmatic-openapi -h
```
{% endtab %}
{% endtabs %}

This ensures that the license file is available inside the container and Specmatic can pick it up automatically. For more details, see the [Specmatic License Keys documentation](/enterprise_onboarding/license_key.html).

## Volume mounts

**`/usr/src/app`** is the **working directory** for specmatic, this is where specmatic will pick up files (API specifications, examples) and configurations (`specmatic.yml`). Reports are also generated relative to this directory.


```shell
docker run -it --rm \
  -v /path/to/your/my-spec.yml:/usr/src/app \
  specmatic/specmatic-openapi test my-spec.yml # can also be specmatic-kafka, or specmatic-arazzo
```

## What's Included in the Docker Image?

The Specmatic Docker image contains everything needed to run Specmatic out of the box:

1. **Shell Script Wrapper**: A shell script wrapper is provided at `/usr/local/bin/$TOOL_NAME`, where `$TOOL_NAME` matches the image name (e.g., `specmatic`). This makes it easy to run Specmatic as if it were a native shell command.

    > Under the hood, this script acts as a pass-through to invoke the Specmatic tool jar. The wrapper also accepts an optional `JAVA_OPTS` environment variable, allowing users to override or specify additional JVM parameters if needed.

2. **Utilities**: Common utilities such as `git`, `bash`, `curl` and `jq`, are included to support scripting, version control, and automation tasks within the container. This makes it easy to integrate Specmatic with your existing workflows and scripts.

## Docker Desktop Alternatives

If you need alternatives to Docker Desktop, consider these container runtime options:

- [Podman Desktop](https://podman-desktop.io/downloads/) - Daemonless container engine compatible with Docker commands
- [Rancher Desktop](https://rancherdesktop.io/) - Open-source container management with Kubernetes support
- [Colima](https://github.com/abiosoft/colima) - Lightweight container runtime for macOS
