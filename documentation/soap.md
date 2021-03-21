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
    - [Declaring an array of nodes](#declaring-an-array-of-nodes)
    - [Reusing declarations across scenarios](#reusing-declarations-across-scenarios)
    - [Factoring out sub types](#factoring-out-sub-types)
    - [Namespace prefixes](#namespace-prefixes)
    - [Order of the nodes](#order-of-the-nodes)
    - [Sample projects](#sample-projects)

The syntax for XML payloads can be found on the [Language](/documentation/language.html) page. Here, we will see how you can use it to define SOAP contracts.

### Obtaining Payload Samples

Use your application's logging features to obtain requests and responses for your SOAP API, which you can then rewrite using Specmatic syntax.

### Defining SOAP Contracts

SOAP contracts are defined just like regular contracts you will find on the [Language](/documentation/language.html) page, but with SOAP XML payloads instead.

Here's a basic example of the SOAP API of a pet store, which gets information about a pet in the store's inventory:

```gherkin
Feature: Petstore SOAP API
    Scenario Outline: Get Pet Info
        Given type Request
        """
            <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                    <SOAP-ENV:Header/>
                    <SOAP-ENV:Body>
                            <ns2:GetPetRequest xmlns:ns2="http://specmatic.in/petstore/api">
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
                        <ns2:GetPetResponse xmlns:ns2="http://specmatic.in/petstore/api">
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

### Declaring an array of nodes

Consider the following SOAP API to get all invoice ids related to a pet in a pet store's inventory.

Here's the request for all invoice ids for pet id 100:

```xml
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
            <SOAP-ENV:Header/>
            <SOAP-ENV:Body>
                    <ns2:GetPetInvoiceIdsRequest xmlns:ns2="http://specmatic.in/petstore/api">
                        <ns2:id>100</ns2:id>
                    </ns2:GetPetInvoiceIdsRequest>
            </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
```

...and the response, containing 3 invoice ids:

```xml
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
            <SOAP-ENV:Header/>
            <SOAP-ENV:Body>
                <ns2:GetPetInvoiceIdsResponse xmlns:ns2="http://specmatic.in/petstore/api">
                        <ns2:id>10</ns2:id>
                        <ns2:id>11</ns2:id>
                        <ns2:id>12</ns2:id>
                </ns2:GetPetInvoiceIdsResponse>
            </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
```

The number of invoice id nodes is, naturally, not fixed. There could be more, depending on how much the store has spent on the pet.

Our contract must define a response which can contain multiple id nodes.

Here's the way to do this:

```gherkin
Feature: Pet store API
    Scenario: Get pet invoice ids
        Given type Request
        """
            <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                    <SOAP-ENV:Header/>
                    <SOAP-ENV:Body>
                            <ns2:GetPetInvoiceIds xmlns:ns2="http://specmatic.in/petstore/api">
                                <ns2:id>(number)</ns2:id>
                            </ns2:GetPetInvoiceIds>
                    </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>
        """
        And type Id <ns2:id>100</ns2:id>
        And type Response
        """
            <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                    <SOAP-ENV:Header/>
                    <SOAP-ENV:Body>
                            <ns2:GetPetInvoiceIdsResponse xmlns:ns2="http://specmatic.in/petstore/api">
                            (Id*)
                            </ns2:GetPetInvoiceIdsResponse>
                    </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>
        """

        When POST /ws
        And request-body (Request)
        Then status 200
        And response-body (Response)
```

Let's review what's been done:
1. We pulled the definition of Id outside, into it's own xml data type,
2. And then we put (Id*) inside the response, indicating that there could be multiple xml nodes with the structure defined in the Id type.
3. Note that the Id type in the response is now defined in a single line.

### Reusing declarations across scenarios

There may be multiple APIs with the same overall payload structures, with the differences found only in part of the request and response payloads.

We can declare these common pieces in the background section. These declarations get inherited by all scenarios in the contract file.

In the following example, we have two APIs. The first API returns the data on a pet in the pet store's inventory for a given pet id. The second API returns a list of invoice ids representing expenses incurred by the pet store for a given pet id.

We can start with the following contract:

```gherkin
Feature: Pet store API
    Scenario Outline: Get Pet Info
        Given type Request
        """
            <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                    <SOAP-ENV:Header/>
                    <SOAP-ENV:Body>
                        <ns2:GetPetRequest xmlns:ns2="http://specmatic.in/petstore/api">
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
                        <ns2:GetPetResponse xmlns:ns2="http://specmatic.in/petstore/api">
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

    Scenario: Get pet invoice ids
        Given type Request
        """
            <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                    <SOAP-ENV:Header/>
                    <SOAP-ENV:Body>
                        <ns2:GetPetInvoiceIds xmlns:ns2="http://specmatic.in/petstore/api">
                            <ns2:id>(number)</ns2:id>
                        </ns2:GetPetInvoiceIds>
                    </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>
        """
        And type Id
        """
        <ns2:id>100</ns2:id>
        """
        And type Response
        """
            <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                    <SOAP-ENV:Header/>
                    <SOAP-ENV:Body>
                        <ns2:GetPetInvoiceIdsResponse xmlns:ns2="http://specmatic.in/petstore/api">
                        (Id*)
                        </ns2:GetPetInvoiceIdsResponse>
                    </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>
        """

        When POST /ws
        And request-body (Request)
        Then status 200
        And response-body (Response)
```

These two API definitions have much in common. The request and response headers, The request method, request path, response status, request headers and payload envelopes are exactly the same between both scenarios.

All these details can be pulled into the background, with the invdividual scenarios encapsulating just the differences.

```gherkin
Feature: Pet store API
    Background:
        Given type Request
        """
            <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>
                    (RequestBody)
                </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>
        """
        And type Response
        """
            <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>
                (ResponseBody)
                </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>
        """

        When POST /ws
        And request-body (Request)
        Then status 200
        And response-body (Response)

    Scenario Outline: Get Pet Info
        Given type RequestBody
        """
            <ns2:GetPetRequest xmlns:ns2="http://specmatic.in/petstore/api">
                <ns2:id>(number)</ns2:id>
            </ns2:GetPetRequest>
        """
        And type ResponseBody
        """
            <ns2:GetPetResponse xmlns:ns2="http://specmatic.in/petstore/api">
                <ns2:id>(number)</ns2:id>
                <ns2:name>(string)</ns2:name>
                <ns2:type>(string)</ns2:type>
                <ns2:status>(string)</ns2:status>
            </ns2:GetPetResponse>
        """

    Scenario: Get pet invoice ids
        Given type RequestBody
        """
            <ns2:GetPetInvoiceIds xmlns:ns2="http://specmatic.in/petstore/api">
                <ns2:id>(number)</ns2:id>
            </ns2:GetPetInvoiceIds>
        """
        And type Id <ns2:id>100</ns2:id>
        And type ResponseBody
        """
            <ns2:GetPetInvoiceIdsResponse xmlns:ns2="http://specmatic.in/petstore/api">
            (Id*)
            </ns2:GetPetInvoiceIdsResponse>
        """
```

Let's review what's been done:
1. We pulled the declaration of the request method, request path, status, and the common structures in request and response into the background.
2. RequestBody and ResponseBody are referred to in the background, in the request and response structures. But they are defined in each scenario as needed.

### Factoring out sub types

Sometimes, a data type definition can be cleaned up by pulling a part of the definition outside.

We have seen this done in the above sections. In [Declaring an array of nodes](#declaring-an-array-of-nodes), we pulled out the definition of the Id node. In [Reusing declarations across scenarios](#reusing-declarations-across-scenarios) we pulled out the Request and Response type into the background.

Let's review this again, in the form of another contract.

```gherkin
Feature: Petstore SOAP API
  Scenario Outline: Get Pet Info
    Given type GetPetRequest
    """
        <ns2:GetPetRequest xmlns:ns2="http://specmatic.in/petstore/api">
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
        <ns2:GetPetResponse xmlns:ns2="http://specmatic.in/petstore/api">
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

If the XML request or response payloads get complex and long, we may need to factor out sub parts of them for the sake of readability.

### Namespace prefixes

SOAP clients can sometimes change the namespace prefixes from request to request.

For example, when getting pet info for pet id 10, the SOAP client library might send the following request the first time:

```xml
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
            <SOAP-ENV:Header/>
            <SOAP-ENV:Body>
                <ns2:GetPetRequest xmlns:ns2="http://specmatic.in/petstore/api">
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
                <ns3:GetPetRequest xmlns:ns3="http://specmatic.in/petstore/api">
                    <ns3:id>10</ns3:id>
                </ns3:GetPetRequest>
            </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
```

Note that the namespace prefix changed from `ns2` in the first request to `ns3` in the second.

The namespace prefix is merely a reference to the the namespace. In both requests, while the namespace prefix has changed, the namespace remained the same.

The [Namespace in XML 1.1](https://www.w3.org/TR/xml-names11/#ns-qualnames) document explains it like this:

> Note that the prefix functions only as a placeholder for a namespace name. Applications should use the namespace name, not the prefix, in constructing names whose scope extends beyond the containing document.

The exact prefix name is not important. It's the namespace, not the prefix referring to it that matters. Now since the namespace has remained the same in both request payloads, the SOAP server considers both requests to be identical.

So as a shortcut at this point in time, Specmatic completely ignores the namespace, as well as the namespace prefixes, and matches the node name in the actual request payload against the node name in the contract request payload.

Take the following contract snippet:

```gherkin
Scenario: Get Pet Details
    Given type GetPetRequest
    """
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
            <SOAP-ENV:Header/>
            <SOAP-ENV:Body>
                <ns2:GetPetRequest xmlns:ns2="http://specmatic.in/petstore/api">
                    <ns2:id>(number)</ns2:id>
                </ns2:GetPetRequest>
            </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
    """
    # snip
```

This scenario would match the following xml request payload:

```xml
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
        <SOAP-ENV:Header/>
        <SOAP-ENV:Body>
            <ns3:GetPetRequest xmlns:ns3="http://specmatic.in/petstore/api">
                <ns3:id>10</ns3:id>
            </ns3:GetPetRequest>
        </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
```

The contract defines a payload with namespace prefix `ns2`, and the actual request uses the namespace prefix `ns3`. But since Specmatic completely ignores namespaces, and the node names excluding the namespaces are the same, the request will successfully match the contract.

### Order of the nodes

Order must be preserved. If the contract defines SOAP-ENV:Header before SOAP-ENV:Body, the actual xml document must contain the SOAP-ENV:Header before the SOAP-ENV:Body.

### Sample projects

Here is a [SOAP API sample](https://github.com/specmatic/petstore-soap-api/). Here is the [SOAP contract, api_1.spec](https://github.com/specmatic/petstore-contracts/tree/master/run/specmatic/examples/petstore-soap) for which it declares support. You will find the stub examples in api_1_data.

The petstore-soap-api project runs api_1.spec as contract tests.

Here is a [SOAP consumer sample](https://github.com/specmatic/petstore-soap-website/). This project contains a simple static page, and JSON API which consumes the SOAP service. It declares the same SOAP API contract as a dependency, and the tests use this contract to stub out the SOAP API that it consumes.
