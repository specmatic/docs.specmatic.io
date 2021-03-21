---
layout: default
title: Features
nav_order: 2
---
# Features

## Http support

Specmatic describes the interaction between two systems over HTTP.

It can describe HTTP requests and responses, and within them:
* Methods (GET, POST, PUT, DELETE)
* Headers
* Query parameters
* JSON payloads
* XML payloads
* Form field payloads in the request
* Multipart data
* Types of all values (e.g. a header value should be a number, a json value at a specific key should be boolean)
* Tabular notation to make payload description easier to read for complex payloads (currently supports json)

The Examples keyword in Gherkin can be used to provide specific values to use. If an example is present for a particular parameter, it is not auto generated.

## Kafka

Specmatic supports the contract testing of Kafka messages. A contract describes the message name and its format.

## Test Mode

In test mode, Specmatics accepts a contract file, and the hostname and port of the service whose API is being tested. It then sends an HTTP request based on the request format described in the contract for every scenario, generating random values where no examples are given. When the service responds, it validates the response based on the format in the contract.

This is meant to be used by API providers.

## Service Virtualisation

In stub mode, Specmatic provides random responses to requests that match the contract. It's a way of exploring what the contract looks like.

This is meant to be used by anyone who wants to take a fake version of the API for a spin.

This mode can also stub out real requests and responses, which will be validated against the contract before being accepted.

## Backward Compatibility Testing

Given an older and a newer contract, Specmatic will spin up a stub of the new one, and run the old in test mode against it. If all the tests pass, the new contract is considered backward compatible with the old.

## Versioning

Specmatic provides various tools that enable you to version your contracts.

## Support for Callbacks

Specmatic enables contract testing for async callbacks with the help of Specmatic's stub mode.

## Converting from Postman to Specmatic

Specmatic can read a Postman file and convert it into a Specmatic file. It will work even without Postman examples, by using the Postman request to query the service.
