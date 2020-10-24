---
layout: default
title: SOAP
parent: Documentation
nav_order: 17
---
SOAP
====

- [SOAP](#soap)
    - [Obtaining Payload Samples](#obtaining-payload-samples)
    - [Defining SOAP Contracts](#defining-soap-contracts)
    - [Order of the nodes](#order-of-the-nodes)
    - [Factoring out sub types](#factoring-out-sub-types)
    - [Using the background](#using-the-background)
    - [Array of nodes](#array-of-nodes)
    - [Namespace prefixes](#namespace-prefixes)
    - [Sample projects](#sample-projects)

The syntax for XML payloads can be found on the [Language](/documentation/language.html) page. Here, we will see how you can use it to define SOAP contracts.

### Obtaining Payload Samples

Use your application's logging features to obtain requests and responses for your SOAP API, which you can then rewrite using Qontract syntax.

### Defining SOAP Contracts

SOAP contracts are defined just like regular contracts you will find on the [Language](/documentation/language.html) page, but with SOAP XML payloads instead.

Here's a basic example:

```gherkin
Feature: Petstore SOAP API (edited)
  Scenario Outline: Get Pet Info
    Given type Request
    """
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>
                        <ns2:GetPetRequest xmlns:ns2="http://qontract.run/petstore/api">
                            <ns2:id>(number)</ns2:id>
                        </ns2:GetPetRequest>
                </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
    """
    And type Response
    """
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>
                    <ns2:GetPetResponse xmlns:ns2="http://qontract.run/petstore/api">
                            <ns2:id>(number)</ns2:id>
                            <ns2:name>(string)</ns2:name>
                            <ns2:type>(string)</ns2:type>
                            <ns2:status>(string)</ns2:status>
                    </ns2:GetPetResponse>
                </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
    """
    When POST /ws
    And request-body (Request)
    Then status 200
    And response-body (Response)
```

### Order of the nodes

Order must be preserved. If the contract defines SOAP-ENV:Header before SOAP-ENV:Body, the actual xml document must contain the SOAP-ENV:Header before the SOAP-ENV:Body.

### Factoring out sub types

If you want to pull out some of the datatype definitions to make the payload definition easier to read:

```gherkin
Feature: Petstore SOAP API
  Scenario Outline: Get Pet Info
    Given type GetPetRequest
    """
        <ns2:GetPetRequest xmlns:ns2="http://qontract.run/petstore/api">
            <ns2:id>(number)</ns2:id>
        </ns2:GetPetRequest>
    """
    Given type Request
    """
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>(GetPetRequest)</SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
    """
    Given type GetPetResponse
    """
        <ns2:GetPetResponse xmlns:ns2="http://qontract.run/petstore/api">
                <ns2:id>(number)</ns2:id>
                <ns2:name>(string)</ns2:name>
                <ns2:type>(string)</ns2:type>
                <ns2:status>(string)</ns2:status>
        </ns2:GetPetResponse>
    """
    Given type Response
    """
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>(GetPetResponse)</SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
    """
    When POST /ws
    And request-body (Request)
    Then status 200
    And response-body (Response)
```

See how we pulled out the request and response structures.

### Using the background

In fact, there may be more such APIs with the same overall structure, with the differences being in the request and response.

We can pull some common details into the background.

```gherkin
Feature: Petstore SOAP API (edited)
  Background:
    Given type Request
    """
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>(RequestPayload)</SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
    """
    Given type Response
    """
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>(ResponsePayload)</SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
    """
    When POST /ws
    And request-body (Request)
    Then status 200
    And response-body (Response)

  Scenario Outline: Get Pet Info
    * type RequestPayload
    """
        <ns2:GetPetRequest xmlns:ns2="http://qontract.run/petstore/api">
            <ns2:id>(number)</ns2:id>
        </ns2:GetPetRequest>
    """
    * type ResponsePayload
    """
        <ns2:GetPetResponse xmlns:ns2="http://qontract.run/petstore/api">
                <ns2:id>(number)</ns2:id>
                <ns2:name>(string)</ns2:name>
                <ns2:type>(string)</ns2:type>
                <ns2:status>(string)</ns2:status>
        </ns2:GetPetResponse>
    """
```

### Array of nodes

Suppose there is an array of invoice ids for various expenses for a pet.

```gherkin
Feature: Petstore SOAP API
  Background:
    Given type Request
    """
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>(RequestPayload)</SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
    """
    Given type Response
    """
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>(ResponsePayload)</SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
    """
    When POST /ws
    And request-body (Request)
    Then status 200
    And response-body (Response)

  Scenario Outline: Get Pet Info
    * type RequestPayload
    """
        <ns2:GetPetRequest xmlns:ns2="http://qontract.run/petstore/api">
            <ns2:id>(number)</ns2:id>
        </ns2:GetPetRequest>
    """
    * type InvoiceId <invoiceid>(number)</invoiceid>
    * type ResponsePayload
    """
        <ns2:GetPetResponse xmlns:ns2="http://qontract.run/petstore/api">
                <ns2:id>(number)</ns2:id>
                <ns2:name>(string)</ns2:name>
                <ns2:type>(string)</ns2:type>
                <ns2:status>(string)</ns2:status>
                <ns2:invoices>(InvoiceId*)</ns2:invoices>
        </ns2:GetPetResponse>
    """
```

This would match a response payload looking like this:

```xml
        <ns2:GetPetResponse xmlns:ns2="http://qontract.run/petstore/api">
                <ns2:id>(number)</ns2:id>
                <ns2:name>(string)</ns2:name>
                <ns2:type>(string)</ns2:type>
                <ns2:status>(string)</ns2:status>
                <ns2:invoices><invoiceid>10</invoiceid><invoiceid>20</invoiceid></ns2:invoices>
        </ns2:GetPetResponse>
```

### Namespace prefixes

SOAP clients can sometimes change the namespace prefixes from request to request.

For example, when getting pet info for pet id 10, the SOAP client library might send the following request the first time:

```xml
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>
                    <ns2:GetPetRequest xmlns:ns2="http://qontract.run/petstore/api">
                        <ns2:id>10</ns2:id>
                    </ns2:GetPetRequest>
                </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
```

...but might send this another time:

```xml
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>
                    <ns3:GetPetRequest xmlns:ns3="http://qontract.run/petstore/api">
                        <ns3:id>10</ns3:id>
                    </ns3:GetPetRequest>
                </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
```

Note that the namespace prefix changed from `ns2` in the first request to `ns3` in the second.

But since the namespace remains the same, the SOAP server considers both requests to be identical.

Qontract ignores the namespaces, and matches against the node name, at this point in time. So if for example a payload in the contract has the prefix `ns2`, but the request has the prefix `ns3`, Qontact will ignore both `ns2` and `ns3`, and verify that the incoming node name matches the contract's node name.

### Sample projects

Here is a [SOAP API sample](https://github.com/qontract/petstore-soap-api/). Here is the [SOAP contract, api_1.qontract](https://github.com/qontract/petstore-contracts/tree/master/run/qontract/examples/petstore-soap) for which it declares support. You will find the stub examples in api_1_data.

The petstore-soap-api project runs api_1.qontract as contract tests.

Here is a [SOAP consumer sample](https://github.com/qontract/petstore-soap-website/). This project contains a simple static page, and JSON API which consumes the SOAP service. It declares the same SOAP API contract as a dependency, and the tests use this contract to stub out the SOAP API that it consumes.
