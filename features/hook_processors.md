---
layout: default
title: Hook Processors
parent: Features
nav_order: 5
---
Hook Processors
===============
<!-- TOC -->
- [Hook Processors](#hook-processors)
  - [Hooks](#hooks)
    - [pre\_specmatic\_request\_processor](#pre_specmatic_request_processor)
    - [pre\_specmatic\_response\_processor](#pre_specmatic_response_processor)
    - [post\_specmatic\_response\_processor](#post_specmatic_response_processor)
  - [Configuring Hook Processors](#configuring-hook-processors)
  - [Notes On Writing Hook Scripts](#notes-on-writing-hook-scripts)
  - [Sample Project](#sample-project)
<!-- TOC -->

Specmatic hook processors let you transform traffic that comes to the proxy and the stub. They are useful when the provider and consumer speak a wire format that differs in some way from the the actual data that traverses the wire. For example, a consumer may encrypt data JSON data in the request sent to the provider. You may want specification to capture the application/json format, even though the request payload sent across the wire is encrypted and sent as text/plain.

## Hooks 

Specmatic exposes three hook entry points that run at different stages of request or response handling. They give you precise control over how traffic is translated between the consumer, Specmatic, and the provider.

They may be registered in `specmatic.yaml` as shown below:

```yaml
hooks:
  pre_specmatic_request_processor: ./hooks/decode_request_from_consumer.sh
  post_specmatic_response_processor: ./hooks/encode_response_to_consumer.sh
  pre_specmatic_response_processor: ./hooks/decode_response_from_provider.sh
```

In each case, the value of the hook entry is the path to an executable file (script or binary) that Specmatic will invoke at the appropriate time.

### pre_specmatic_request_processor

- Runs in both proxy and stub modes.
- Receives the incoming request before Specmatic validates it (stub) or forwards it to the provider (proxy).

Use this hook when the consumer sends payloads in a shape that Specmatic should process as-is.

The hook should read the request in the Specmatic example format from the stdin, modify it as needed, and write the transformed request back to stdout.

Sample input to the hook (STDIN):

```json
{
  "http-request": {
    "method": "POST",
    "path": "/api/data",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "data": "eyJrZXkiOiAidmFsdWUifQ=="  // base64 encoded JSON
    }
  }
}
```

Sample output from the hook (STDOUT):

```json
{
  "http-request": {
    "method": "POST",
    "path": "/api/data",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "data": {
        "key": "value"
      }
    }
  }
}
```

### pre_specmatic_response_processor

- Runs in proxy mode as responses come back from the real provider.
- Gives you the combined request/response document so you can adjust what Specmatic records.

Sample input to the hook (STDIN):

```json
{
  "http-request": {
    "method": "GET",
    "path": "/api/data"
  },
  "http-response": {
    "status": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "data": "eyJzZWNyZXQiOiAiVmFsdWUifQ=="  // base64 encoded JSON
    }
  }
}
```

Sample output from the hook (STDOUT):

```json
{
  "http-request": {
    "method": "GET",
    "path": "/api/data"
  },
  "http-response": {
    "status": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "data": {
        "secret": "Value"
      }
    }
  }
}
```

### post_specmatic_response_processor

- Runs only in stub mode, after Specmatic has generated a response for the consumer.
- Lets you re-encode payloads, set protocol-specific headers, or add late-stage metadata before the stub returns control to the caller.

Use this hook when the consumer expects something different on the wire (for example base64 or plain text) from what's in the specification.

Sample input to the hook (STDIN):

```json
{
  "http-response": {
    "status": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "data": {
        "secret": "Value"
      }
    }
  }
}
```

Sample output from the hook (STDOUT):

```json
{
  "http-response": {
    "status": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "data": "eyJzZWNyZXQiOiAiVmFsdWUifQ=="  // base64 encoded JSON
    }
  }
}
```

## Configuring Hook Processors

Hook processors are configured in `specmatic.yaml`. Each hook entry should point to an executable file (script or binary) that will be run by Specmatic.

```yaml
hooks:
  pre_specmatic_request_processor: ./hooks/decode_request_from_consumer.sh
  post_specmatic_response_processor: ./hooks/encode_response_to_consumer.sh
  pre_specmatic_response_processor: ./hooks/decode_response_from_provider.sh
```

The configuration is evaluated relative to the directory in which Specmatic is launched. You can point at shell scripts, compiled binaries, or even Node/Python entry points... anything executable on your platform.

## Notes On Writing Hook Scripts

- Your script must print the transformed JSON document to STDOUT.
- Exit with status `0` to let Specmatic continue. Any non-zero status will abort the interaction and surface an error to the caller.
- Make sure dependencies such as `jq`, `base64`, or language runtimes are available in the environment where Specmatic runs.
- If you're using executable scripts, remember to grant execute permissions (`chmod +x hooks/*.sh`) so Specmatic can invoke the hook scripts.

## Sample Project

See [`sample-projects/hooks-demo`](../sample-projects/hooks-demo/README.md) for a complete, runnable example that uses hooks to translate base64 payloads between the consumer and provider while keeping the recorded contract in JSON.
