{% capture image_name %}{{ include.image_name }}{% endcapture %}

{% tabs install-specmatic-commercial %}
<!-- docker linux/macOS -->
{% tab install-specmatic-commercial Docker linux/macOS %}

{% include docker_run_volume_mount.md image_name=image_name %}

{% endtab %}
<!-- /docker linux/macOS -->

<!-- docker Windows-Powershell -->
{% tab install-specmatic-commercial Docker Windows-Powershell %}

{% include docker_run_volume_mount.md image_name=image_name shell="Powershell" %}

{% endtab %}
<!-- /docker Windows-Powershell -->

<!-- docker Windows-CMD -->
{% tab install-specmatic-commercial Docker Windows-Command-Prompt %}

{% include docker_run_volume_mount.md image_name=image_name shell="Cmd" %}

{% endtab %}
<!-- /docker Windows-CMD -->

<!-- jar -->
{% tab install-specmatic-commercial JAR %}

The standalone JAR file can be downloaded from the following sources:

* [Specmatic Repository]({{ include.jar_url }})

For older versions, please refer to the [Releases]({{ include.repo_url }}) page.

{% endtab %}
<!-- /jar -->
<!-- linux/macos -->
{% tab install-specmatic-commercial Linux/macOS %}

If you have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:

To run the latest version:
```bash
curl {{site.url}}/{{ include.install_script }}.sh | bash
```

To install an older version, replace `VERSION` with the desired version number from the [Releases]({{ include.repo_url }}) page.

```bash
curl {{site.url}}/{{ include.install_script }}.sh | bash -- --version VERSION
```

{% endtab %}
<!-- /linux/macos -->

<!-- windows -->
{% tab install-specmatic-commercial Windows %}

If you have Java 17 or above installed, you can install the executable using the following PowerShell command and follow the onscreen instructions:

To install the latest version:

```powershell
irm {{site.url}}/{{ include.install_script }}.ps1 | iex
```

To install an older version, replace `VERSION` with the desired version number from the [Releases]({{ include.repo_url }}) page.

```powershell
iex "& { $(irm '{{site.url}}/{{ include.install_script }}.ps1') } --version VERSION"
```

{% endtab %}
<!-- /windows -->
{% endtabs %}