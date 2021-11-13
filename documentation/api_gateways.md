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

Supposting that
* the API provider has an API /List, which the API gateway exposes as /customer/list
* the API provider expects a header x-security, which is added by API gateway, and is not sent by the external consumer

The contract might look like this:

```yaml
---
openapi: "3.0.1"
info:
  title: "Customers"
  version: "1"
paths:
  /List:
    get:
      summary: "List customers"
      parameters:
      - name: "x-security"
        in: "header"
        required: true
        schema:
          type: "string"
      responses:
        "200":
          description: "List customers"
          content:
            text/plain:
              schema:
                type: "array"
                items:
                  type: "number"
```

The script below removes provider-only headers, and changes the provider paths to the ones accepted by the API gateway.

```python
#filename: load.py

import yaml
import os

def cleanup_path(contract_file_name, path_map):
    with open(contract_file_name) as f:
        data = yaml.safe_load(f)

    paths = data["paths"]

    for pathName in path_map:
        if pathName in paths:
            newPathName = path_map[pathName]
            data["paths"][newPathName] = data["paths"][pathName]
            del data["paths"][pathName]


    return data

def remove_provider_only_headers(data):
    for pathName in data["paths"]:
        path = data["paths"][pathName]
        for methodName in path:
            method = path[methodName]
            if methodName in ["post", "get"] and "parameters" in method:
                params = method["parameters"]
                deletable = [i for i in range(len(params)) if params[i]["$ref"].endswith("x-security")]
                
                for i in reversed(deletable):
                    del params[i]
    
    return data

contract_file_name = os.environ["CONTRACT_FILE"]

path_map = {
    "/List": "/customer/list"
}

contract = cleanup_path(contract_file_name, path_map)

contract = remove_provider_only_headers(contract)

print(yaml.dump(contract))
```

The contract actually seen by Specmatic after passing it through this script would be:

```yaml
---
openapi: "3.0.1"
info:
  title: "Customers"
  version: "1"
paths:
  /customer/list:
    get:
      summary: "List customers"
      parameters: []
      responses:
        "200":
          description: "List customers"
          content:
            text/plain:
              schema:
                type: "array"
                items:
                  type: "number"
``````
