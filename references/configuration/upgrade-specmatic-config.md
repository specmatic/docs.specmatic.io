---
layout: default
title: Upgrade Configuration
parent: Configuration
grand_parent: References
nav_order: 11
---

# Upgrade Older Configuration to the Latest Version

If you have an old version of the config, Specmatic can upgrade it to the latest version.

{% tabs compare %}
{% tab compare docker %}
```bash
docker run -v "/your-local-specs-directory:/specs" specmatic/specmatic config upgrade --input "/specs/specmatic.yaml" --output "specmatic_new.yaml"
```
{% endtab %}
{% tab compare java %}
```bash
java -jar specmatic.jar config upgrade --input specmatic_old.yaml --output specmatic.yaml
```
{% endtab %}
{% tab compare npm %}
```bash
npx specmatic config upgrade --input specmatic_old.yaml --output specmatic.yaml
```
{% endtab %}
{% endtabs %}

When you run the `config upgrade` command without specifying `input` or `output` parameters, it will search for the config file in default locations (the directory from which the command is run, the application classpath, `CONFIG_FILE_PATH` environment variable, or `CONFIG_FILE_PATH` system property) and display the result in the same terminal from which the command was executed.
