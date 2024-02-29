---
layout: default
title: Authentication
parent: Documentation
nav_order: 16
---
Authentication
==============

- [Authentication](#authentication)
  - [Testing with real auth](#testing-with-real-auth)
    - [OAuth2](#oauth2)
    - [API Key](#api-key)
    - [Bearer](#bearer)
    - [Basic Authentication](#basic-authentication)
  - [Testing with mock auth](#testing-with-mock-auth)
    - [OAuth2](#oauth2-1)
      - [Wiring up dummy / mock authentication](#wiring-up-dummy--mock-authentication)
    - [API Key Authentication](#api-key-authentication)
      - [Wiring up dummy / mock authentication](#wiring-up-dummy--mock-authentication-1)

Most APIs have some form of security (authentication and authorization). Specmatic reads [OpenAPI Security Schemes](https://spec.openapis.org/oas/v3.0.1#security-scheme-object) in your API Specifications to come up with appropriate request parameters.  
Specmatic supports the following security schemes:
- **OAuth2**
- **API Key**
- **Bearer**

## Testing with real auth
To run contract tests in environments which require a valid security token present in the request, we can define environment variables which hold these valid tokens/api keys.  

The enviornment variable should match the name of the security scheme defined in the open api specification.  

When contract tests are executed, Specmatic will look for an environment variable with the same name as that of the security scheme. If such an environment variable exists, Specmatic will use it apporpriately (based on the security scheme) while making an HTTP request.

### OAuth2
Here's an example of an OAuth2 security scheme in the open api specification:

```yaml
components:
  securitySchemes:
    oAuth2AuthCode:
      type: oauth2
      description: For more information, see https://example.com/docs/oauth
      flows:
        authorizationCode:
          authorizationUrl: https://api.example.com/oauth/authorize
          tokenUrl: https://api.example.com/api/oauth/token
          scopes:
            users:read: Read user information
            users:write: Modify user information
            im:read: Read messages
            im:write: Write messages
            im:history: Access the message archive
            search:read: Search messages, files, and so on
```

To use a real OAuth2 token in contract tests, an environment variable with the name of the security scheme needs to be defined.

For example, in the above case, we would define an environment variable named `oAuth2AuthCode`. Assuming that Authorization header value has to be `Bearer abc123`, set the value of this environment variable to `abc123` (leaving out the `Bearer ` prefix).

### API Key
Here's an example of a Bearer security scheme in the open api specification:

```yaml
components:
  securitySchemes:
      ApiKeyAuthHeader:
        type: apiKey
        in: header
        name: X-API-KEY
```

To use a real API key header in contract tests, an environment variable with the name of the security scheme needs to be defined.

For the above example, define an environment variable named `ApiKeyAuthHeader` having the API key as it's value.

For example, in the above case, we would define an environment variable named `ApiKeyAuthHeader`. Assuming that Authorization header value has to be `my-api-key-abc123`, set the value of this environment variable to `my-api-key-abc123`.

### Bearer
Here's an example of a Bearer security scheme in the open api specification:

```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
```

To use a real bearer auth token in contract tests, an environment variable with the name of the security scheme needs to be defined.

For example, in the above case, we would define an environment variable named `BearerAuth`. Assuming that Authorization header value has to be `Bearer abc123`, set the value of this environment variable to `abc123` (leaving out the `Bearer ` prefix).

### Basic Authentication

Here's an example of a Bearer security scheme in the open api specification:

```yaml
components:
  securitySchemes:
    BasicAuth:
      type: http
      scheme: basic
```

To use a real basic auth token in contract tests, an environment variable with the name of the security scheme needs to be defined.

For example, in the above case, we would define an environment variable named `BasicAuth`. Assuming that Authorization header value has to be `Basic abc123`, set the value of this environment variable to `abc123` (leaving out the `Basic ` prefix).


## Testing with mock auth

While Specmatic supports testing with real authentication as seen above, in a component / contract test like setup, it is recommended to isolate the SUT (System Under Test) which is your service from other dependencies such as auth providers. So at a contract / component test level it is sufficient to validate if an API implementation / service accepts the security parameters it is adverstising in its API Specification. However it is not necessary to validate if the security itself is working. That is for later stages of tests where you can hook up a security service dependency such as DB, OAuth provider, etc.  

So for Contract as Test we recommend having a “Test Security Configuration” where you are still exercise your security plumbing, however not actually fetching real user information. This is similar to running an in-memory DB in test setup instead of running a real DB in CI. Below are some examples of the same.

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