---
layout: default
title: SOAP
parent: Documentation
nav_order: 17
---
SOAP
====

- [SOAP](#soap)
  - [Stubbing out a WSDL in component tests](#stubbing-out-a-wsdl-in-component-tests)
  - [Setting SOAP expectations](#setting-soap-expectations)

Service virtualization of SOAP APIs works in a similar way REST APIs.

However the API format for SOAP services is WSDL (not YAML). So you will need the WSDL file for the SOAP API that you need to stub out.

## Stubbing out a WSDL in component tests

Commit the WSDL for the SOAP API into your central contract repository.

Once done, create the `specmatic.json` file in the root of your project. It should contain the following json configuration: 

```json
{
    "sources": [
        {
            "provider": "git",
            "repository": "https://your-central-contract-repo.com",
            "stub": [
                "/path/to/soap-api.wsdl"
            ]
        }
    ]
}
```

*NOTE:* Remember to update the repository and stub section, to reflect the git repository in which you placed the specification, and the stub path.

## Setting SOAP expectations

Once again, you can use the same stub format that is used for REST APIs. The only difference is, put the SOAP payloads where the rest payloads would go.

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

How does one get the above payloads?

Some options:
1. Review the requests from the application and the response from the API using the logs from [Specmatic Proxy](/documentation/authoring_contracts.html). While the proxy does not generate expectations for SOAP/XML yet, it does log requests and responses to the console.
2. Run the tests and look at application logs. The application may log it's request and response payloads when running tests.
