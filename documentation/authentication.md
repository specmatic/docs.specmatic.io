---
layout: default
title: Authentication
parent: Documentation
nav_exclude: true
---
Authentication
==============

Most APIs have some form of security (authentication and authorization). Specmatic reads [OpenAPI Security Schemes](https://swagger.io/docs/specification/authentication/) in your API Specifications to come up with appropriate request parameters. However these parameters will be randomly generated as per the data types of these security schemes.

Please refer to this [sample API](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_v1.yaml) specification which leverages [ApiKeyAuth](https://swagger.io/docs/specification/authentication/api-keys/) to protect all endpoints that add, modify or delete data.

# Test Configuration - Dummy Authentication

**Contract as Test** is a component level test and at this point it makes sense to validate if an API application accepts the security parameters it is adverstising in its API Specification. However it is not necessary to validate if the security itself is working. That is for later stages of tests where you can hook up a security service dependency such as DB, OAuth provider, etc.

So for Contract as Test we recommend having a "Test Security Configuration" where you are still exercising your security plumbing, however not actually fetching real user information. This is similar to running an in-memory DB in test setup instead of running a real DB in CI.

# Wiring up dummy authentication

Please refer to [sample springboot application](https://github.com/znsio/specmatic-order-api/tree/api_security) that implements the [API](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_v1.yaml) we saw above.

This has two API security configurations
* [Production Security Config](https://github.com/znsio/specmatic-order-api/blob/api_security/src/main/java/com/store/config/SecurityConfig.kt) - This fetches user from the DB based on api token in request header
* [Test Security Config](https://github.com/znsio/specmatic-order-api/blob/api_security/src/test/java/com/store/config/TestSecurityConfig.kt) - This always returns a dummy user principal. However rest of the code such as reading the authentication token from header etc. are still tested.

So when you run the [ContractTest](https://github.com/znsio/specmatic-order-api/blob/api_security/src/test/java/com/store/ContractTests.java) it will still exercise your security plumbing (does the application accept the proper header name, datatype, etc.).

This is just an example of how we can wire up security configurations for test and production environments. Even in SpringBoot you can leverage other techniques such Spring Profiles to achieve the same effect.

The same can be achieved in almost any programming language and stack.