---
layout: default
title: Features
nav_order: 2
---
# Features

## Language Support

Qontract describes the interaction between to systems over HTTP.

It can describe the HTTP requests and responses, and within them:
* Methods (GET, POST, PUT, DELETE)
* Headers
* Query parameters
* JSON payloads
* XML payloads
* Form field payloads in the request
* Types of all values (e.g. a header value should be a number, a json value at a specific key should be boolean)
* Tabular notation to make payload description easier to read for complex payloads (currently supports json)

The Examples keyword in Gherkin can be used to provide specific values to use. If an example is present for a particular parameter, it is not auto generated.

## Test Mode

In test mode, Qontracts accepts a contract file, and the hostname and port of the service whose API is being tested. It then sends an HTTP request based on the request format described in the contract for every scenario, generating random values where no examples are given. When the service responds, it validates the response based on the format in the contract.

This is meant to be used by API providers.

## Mock Mode

Qontract provides APIs for mocking out API calls to a service in Java and over HTTP. A mock instance must be started (for the HTTP API) or instantiated (in Java) and provided with a contract. It may then be configured per the needs of the test. Any request to mock out an API which does not match the contract is denied.

This is meant to be used by API consumers.

## Stub Mode

In stub mode, Qontract provides random responses to requests that match the contract. It's a way of exploring what the contract looks like.

This is meant to be used by anyone who wants to take a fake version of the API for a spin.

## Backward Compatibility Testing

Given an older and a newer contract, Qontract will spin up a stub of the new one, and run the old in test mode against it. If all the tests pass, the new contract is considered backward compatible with the old.

## Samples

Qontract will use stub and test mode to generate samples of all API requests and responses. This is meant to be a simpler of stub mode, for the purpose of exploring what the API requests and resposes would look like in practice.
