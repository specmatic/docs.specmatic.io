---
layout: default
title: SOAP
parent: Documentation
nav_order: 17
---
SOAP
====

- [SOAP](#soap)
  - [Mocking SOAP services using WSDL files](#mocking-soap-services-using-wsdl-files)
  - [Examples as Mock data](#examples-as-mock-data)

Just like how you can mock HTTP services using OpenAPI specification, you can mock / stub SOAP services using WSDL files.

## Mocking SOAP services using WSDL files

If you a WSDL file on your local file system (Example: `my_soap_service.wsdl` in your current folder) you can directly start the stub server using below Docker command.

```shell
docker run -v "$(pwd):/usr/src/app" znsio/specmatic stub "my_soap_service.wsdl"
```

The stub server will start on port 9000 by default (which you can change using CLI options)

## Examples as Mock data

The example format involves setting the HTTP request and response. By default Specmatic will look for examples for each WSDL file in a folder that is name `<wsdl_filename_without_file_extension>_examples` (Example: For `my_soap_service.wsdl` Specmatic will look for a folder named `my_soap_service_examples`, again this can be configured to any foler name). The SOAP payloads should be setup as part of the request and response bodies.

It will look something like this:

```json
{
    "http-request": {
        "method": "POST",
        "headers": {
            "SOAPAction": "\"SOAPAction\""
        },
        "body": "<your><soap><request><payload><here>"
    },
    "http-response": {
        "status": 200,
        "body": "<your><soap><response><payload><here>"
    }
}
```

Please refer to our [sample project](https://github.com/specmatic/specmatic-order-bff-wsdl) to try this out.