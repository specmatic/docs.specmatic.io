---
layout: default
title: Authentication
parent: Documentation
nav_order: 16
---
Authentication
==============

- [Authentication](#authentication)
  - [Contract as Test Context](#authentication-and-authorization-in-the-context-of-contract-as-test)
- [Examples](#examples)
  - [OAuth2](#oauth2)
  - [API Key](#api-key-authentication)

Most APIs have some form of security (authentication and authorization). Specmatic reads [OpenAPI Security Schemes](https://spec.openapis.org/oas/v3.0.1#security-scheme-object) in your API Specifications to come up with appropriate request parameters.

## Authentication and Authorization in the context of Contract as Test

**Contract as Test** is a component level test and at this point it makes sense to validate if an API application accepts the security parameters it is adverstising in its API Specification. However it is not necessary to validate if the security itself is working. That is for later stages of tests where you can hook up a security service dependency such as DB, OAuth provider, etc.

So for Contract as Test we recommend having a "Test Security Configuration" where you are still exercising your security plumbing, however not actually fetching real user information. This is similar to running an in-memory DB in test setup instead of running a real DB in CI.

## Examples

### OAuth2

Please refer to this [sample API](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_with_oauth_v1.yaml) specification which leverages [OAuth2](https://spec.openapis.org/oas/v3.0.1#implicit-oauth2-sample) to protect all endpoints that add, modify or delete data.

#### Wiring up dummy / mock authentication

![Specmatic Sample Application to demonstrate OpenAPI OAuth2 security scheme support](/images/SpecmaticOAuth.gif)

Please refer to [sample springboot application](https://github.com/znsio/specmatic-order-api-java-with-oauth) that implements the [API](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_with_oauth_v1.yaml) we saw above.

### API Key Authentication

Please refer to this [sample API](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_v1.yaml) specification which leverages [ApiKeyAuth](https://spec.openapis.org/oas/v3.0.1#api-key-sample) to protect all endpoints that add, modify or delete data.

#### Wiring up dummy / mock authentication

Please refer to [sample springboot application](https://github.com/znsio/specmatic-order-api) that implements the [API](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_v1.yaml) we saw above.

This has two API security configurations
* [Production Security Config](https://github.com/znsio/specmatic-order-api/blob/main/src/main/java/com/store/config/SecurityConfig.kt) - This fetches user from the DB based on api token in request header
* [Test Security Config](https://github.com/znsio/specmatic-order-api/blob/main/src/test/java/com/store/config/TestSecurityConfig.kt) - This always returns a dummy user principal. However rest of the code such as reading the authentication token from header etc. are still tested.

So when you run the [ContractTest](https://github.com/znsio/specmatic-order-api/blob/main/src/test/java/com/store/ContractTest.java) it will still exercise your security plumbing (does the application accept the proper header name, datatype, etc.).

This is just an example of how we can wire up security configurations for test and production environments. Even in SpringBoot you can leverage other techniques such as [Spring Profiles](https://docs.spring.io/spring-boot/docs/1.2.0.M1/reference/html/boot-features-profiles.html) to achieve the same effect.

The same can be achieved in almost any programming language and stack.
* Dot Net - Register a custom [AuthenticationHandler](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authentication.authenticationhandler-1?view=aspnetcore-7.0) for mock authentication in tests
* NodeJS - Switch auth middleware based on ```process.env.NODE_ENV```

In general the overall idea is to inject a mock authentication mechanism while running Specmatic Contract as Tests