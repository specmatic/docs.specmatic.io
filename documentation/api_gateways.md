---
layout: default
title: API Gateways
parent: Documentation
nav_order: 26
---
API Gateways
============

## Four Party Model

A contract represents the interface provided by the API provider to the API consumer.

An API gateway may modify this interface, adding headers, rewriting the URL, etc. As a result, the contract seen by the consumer may be a little different from that seen by the provider.

In addition, there may be consumers of the API lying behind the API gateway, consuming the API directly.

We can think of this as a four party model.

![four party model](/images/four-party-model.svg)

Specmatic's approach is to write the contract the way the API provider and internal consumer sees it.

This way, the API provider can run contract tests using the contract as is, and the internal consumer can stub it out.

That leaves the external consumer.

Specmatic provides a hook that can be configured by the external consumer to load whenever the API is stubbed out. The hook is given the contract, and can modify it in memory just before it is loaded.

The hook name is `stub_load_contract`.

Register it in [specmatic.json](/documentation/specmatic_json.html#hooks) in the section on hooks.

The hooks snippet in specmatic.json would look like this:

```json
  "hooks": {
    "stub_load_contract": "python load.py"
  }
```

It can be any command, above is just an example.

Instead of reading the contract directly, Specmatic runs "python load.py" with the environment variable `CONTRACT_FILE` set to the path of the contract to be read.

`load.py` must read the contract, modify it as needed, and print it to standard output.

Specmatic reads the contract from standard output and proceeds from there onward as normal.

Here's a sample of what the load.py file could look like.

```python
```
