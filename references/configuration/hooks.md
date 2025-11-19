---
layout: default
title: Hooks
parent: Configuration
grand_parent: References
nav_order: 8
---

# Hooks

## What are Hooks?

A hook is simply a command that can run on the Terminal or Command Prompt.

## Configuration

{% tabs hooks_configuration %}
{% tab hooks_configuration specmatic.yaml %}
```yaml
version: 2
hooks:
  stub_load_contract: python load.py
```
{% endtab %}
{% tab hooks_configuration specmatic.json %}
```json
{
  "version": 2,
  "hooks": {
    "stub_load_contract": "python load.py"
  }
}
```
{% endtab %}
{% endtabs %}

## How Hooks Work

In the above snippet, `stub_load_contract` is the hook name. `python load.py` is executed, while the path of the original contract file is present in `CONTRACT_FILE` environment variable.

The command can parse the contract file and write it to standard out. Specmatic will read it as the new contract.

## Supported Hook Names

- `stub_load_contract`
- `test_load_contract`
