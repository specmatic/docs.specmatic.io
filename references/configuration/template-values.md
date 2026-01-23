---
layout: default
title: Template Values
parent: Configuration
grand_parent: References
nav_order: 9
---

# Template Values

- [Template Values](#template-values)
  - [Template Syntax](#template-syntax)
  - [Scalar Examples](#scalar-examples)
  - [Structured Values (Object or Array)](#structured-values-object-or-array)
  - [Using a JSON-Looking Value As String](#using-a-json-looking-value-as-string)
  - [Notes](#notes)

Specmatic configuration can pull in values from environment variables or system properties at runtime, through the use of template values.

## Template Syntax

Template values use the format:

```
{ENV_VAR_NAME:defaultValue}
```

Resolution order:

1. Environment variable `ENV_VAR_NAME`
2. System property `ENV_VAR_NAME`
3. `defaultValue`

## Scalar Examples

{% tabs template_scalar %}
{% tab template_scalar specmatic.yaml %}
```yaml
version: 2
contracts:
  - consumes:
    - spec.yaml
stub:
  generative: "{STUB_GENERATIVE:true}"
```
{% endtab %}
{% tab template_scalar specmatic.json %}
```json
{
  "version": 2,
  "contracts": [
    {
      "consumes": [
        "spec.yaml"
      ]
    }
  ],
  "stub": {
    "generative": "{STUB_GENERATIVE:true}"
  }
}
```
{% endtab %}
{% endtabs %}

Set the value in a shell (zsh/bash):

```
export STUB_GENERATIVE=false
```

## Structured Values (Object or Array)

If the resolved value starts with `{` or `[`, it is parsed as JSON and used as an object or array value in the config.

{% tabs template_structured %}
{% tab template_structured specmatic.yaml %}
```yaml
version: 2
contracts:
  - consumes:
    - spec.yaml
stub: "{STUB_CONFIG:{\"generative\": true}}"
examples: "{EXAMPLE_DIRS:[\"examples/one\",\"examples/two\"]}"
```
{% endtab %}
{% tab template_structured specmatic.json %}
```json
{
  "version": 2,
  "contracts": [
    {
      "consumes": [
        "spec.yaml"
      ]
    }
  ],
  "stub": "{STUB_CONFIG:{\"generative\": true}}",
  "examples": "{EXAMPLE_DIRS:[\"examples/one\",\"examples/two\"]}"
}
```
{% endtab %}
{% endtabs %}

Set the value in a shell:

```
export STUB_CONFIG='{"generative": false}'
export EXAMPLE_DIRS='["examples/one","examples/two"]'
```

## Using a JSON-Looking Value As String

If the resolved value is a JSON string (quoted), Specmatic treats it as a string and removes the outer quotes. This lets you keep a JSON-looking value as plain text.

Example:

{% tabs force_string %}
{% tab force_string_yaml specmatic.yaml %}
```yaml
stub: "{STUB_CONFIG:\"{\\\"generative\\\": true}\"}"
```
{% endtab %}
{% tab force_string_json specmatic.json %}
```json
{
  "stub": "{STUB_CONFIG:\"{\\\"generative\\\": true}\"}"
}
```
{% endtab %}
{% endtabs %}

Set the value in a shell:

```
export STUB_CONFIG='"{\"generative\": true}"'
```

Resulting value:

```
{"generative": true}
```

## Notes

- JSON must be valid when using object/array templates.
- Quoted JSON strings are treated as strings, not parsed into objects or arrays.
