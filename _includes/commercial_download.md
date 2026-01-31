{% capture image_name %}{{ include.image_name }}{% endcapture %}
{% assign tab_name = include.image_name | replace: 'specmatic/', '' %}

{% tabs download-{{ tab_name }} %}
<!-- docker linux/macOS -->
{% tab download-{{ tab_name }} Docker Linux/macOS %}

{% include docker_run_volume_mount.md image_name=image_name %}

{% endtab %}
<!-- /docker linux/macOS -->

<!-- docker Windows-Powershell -->
{% tab download-{{ tab_name }} Docker Win-Powershell %}

{% include docker_run_volume_mount.md image_name=image_name shell="Powershell" %}

{% endtab %}
<!-- /docker Windows-Powershell -->

<!-- docker Windows-CMD -->
{% tab download-{{ tab_name }} Docker Win-Command-Prompt %}

{% include docker_run_volume_mount.md image_name=image_name shell="Cmd" %}

{% endtab %}
<!-- /docker Windows-CMD -->

<!-- jar -->
{% tab download-{{ tab_name }} JAR %}

The standalone JAR file can be downloaded from the following sources:

{% if include.maven_central_url %}* [Maven Central]({{ include.maven_central_url }}){% endif %}
* [Specmatic Repository]({{ include.jar_url }})

For older versions, please refer to the [Releases]({{ include.repo_url }}) page.

{% endtab %}
<!-- /jar -->
<!-- linux/macos -->
{% tab download-{{ tab_name }} Linux/macOS %}

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
{% tab download-{{ tab_name }} Windows %}

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
