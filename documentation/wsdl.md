---
layout: default
title: WSDL
parent: Documentation
nav_order: 17
---
# WSDL

- [WSDL](#wsdl)
    - [Examples For WSDL Contracts](#examples-for-wsdl-contracts)
    - [Mocking SOAP services using WSDL files](#mocking-soap-services-using-wsdl-files)
    - [Examples as Mock data](#examples-as-mock-data)
    - [Sample Applications](#sample-applications)


### Examples For WSDL Contracts

A WSDL contract cannot hold examples within the contract. The format does not support it.
We can instead add examples to a companion file. The companion file should be in the same directory as the wsdl file. It would look like this:

```gherkin
Feature: WSDL Companion file
  Background:
    Given wsdl ./soap-contract-file.wsdl

  Scenario: Add user
    When POST /soap-service-path
    Then status 200

    Examples:
    | (REQUEST-BODY)        | SOAPAction | Any other headers... |
    | <soapenv>...</soapenv> | "/addUser" | header values        |
```

(REQUEST-BODY) contains the request body in a single line, SOAPAction contains the value value of the SOAPAction header, and additional columns must be included for each header sent by the SOAP service.

### Mocking SOAP services using WSDL files

Just like how you can mock HTTP services using OpenAPI specification, you can mock / stub SOAP services using WSDL files.
If you a WSDL file on your local file system (Example: `my_soap_service.wsdl` in your current folder) you can directly start the stub server using below Docker command.

```shell
docker run -v "$(pwd):/usr/src/app" specmatic/specmatic virtualize "my_soap_service.wsdl"
```

The stub server will start on port `9000` by default (which you can change using CLI options)

### Examples as Mock data

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


### Sample Applications
Please have a look at the following sample project to understand how to utilize `Specmatic` with WSDL in your applications

- [specmatic-order-bff-wsdl](https://github.com/specmatic/specmatic-order-bff-wsdl)
