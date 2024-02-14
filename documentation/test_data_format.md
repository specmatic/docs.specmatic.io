---
layout: default
title: Test Data Format
parent: Documentation
nav_order: 7
---
Test Data Format
================

Test data for service virtualisation and testing can be externalised to JSON files.

This page describes the format of these files. Both leverage the same format.

The directories in which these files lie id described in the documentation on [service virtualisation](/documentation/service_virtualization_tutorial.html) and [contract tests](/documentation/contract_tests.html).

```json
{
    "http-request": {
        "method": "POST",
        "path": "/url/path/(number)/some/more/path",
        "headers": {
            "X-Header-Name1": "(string)",
            "X-Header-Name2": "(string)"
        },

        "query": {
            "id": "(number)",
            "type": "(string)"
        },

        "form-fields": {
            "Data": "(PredefinedJsonType)",
            "MoreData": "some hardcoded value"
        },

        "multipart-formdata": [
            {
                "name": "customers",
                "content": "(string)",
                "filename": "@data.csv",
                "contentType": "text/plain",
                "contentEncoding": "gzip"
            }
        ]
        "body": {
            "name": "Jane Doe",
            "address": "22 Baker Street"
        }
    },

    "http-response": {
        "status": 200,
        "headers": {
            "X-Header-Name": "(string)",
            "X-Header-Name2": "(string)"
        }
        "body": "some value"
    }
}
```

Notes on the request format:
1. `path` parameters if any appear inline (e.g. `/customer/10`), but query parameters need to mentioned separately in the query section.
2. Multipart:
  - Provide either `content` or `filename`, not both
  - `filename` must start with @
  - `contentType` is optional, and is matched against the `Content-Type` header
  - `contentEncoding` is matched against the `Content-Encoding` header

3. Body can also just be a string, such "Hello world", or an array, such as [1, 2, 3]

Notes on the response format:
1. In Contract Tests, only the status is needed. Headers and body are not needed, and are ignored if provided.
