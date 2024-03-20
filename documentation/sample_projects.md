---
layout: default
title: Sample Projects
parent: Documentation
nav_order: 17
---

# Sample Projects

We have a bunch of sample projects to help you get acquainted with Specmatic and discover all its features. 

## Contract Tests and Service Virtualization(Stubbing)

We have a standard 3 layered architecture implemented in our sample projects:

![HTML client talks to client API which talks to backend api](/images/specmatic-sample-architecture.svg)

We have:
- A front end application (Website UI)
- BFF (Backend For Frontend), the API invoked by the HTTP calls in the client HTML page (Website UI).
- Backend Service, the API invoked by the BFF layer

We have the BFF and Backend APIs implemented in different languages and frameworks so that you can mix and match them as you like.


### Website UI
- [React and NodeJS](https://github.com/znsio/specmatic-order-ui-js)

### BFF
- [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-bff-java/)
- [NodeJS](https://github.com/znsio/specmatic-order-bff-nodejs/)
- [Python (Flask)](https://github.com/znsio/specmatic-order-bff-python/)
- [Python (Sanic)](https://github.com/znsio/specmatic-order-bff-python-sanic/)

### Backend
- [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-api-java)
- [Python (Flask)](https://github.com/znsio/specmatic-order-api-python/)


## OAuth
We have a [Kotlin based SpringBoot project](https://github.com/znsio/specmatic-order-api-java-with-oauth) to demonstrate how Specmatic can be used to run contract tests againt a service which is secured by an OAuth provider.

## Private Beta
Here's a list of sample projects which demonstrates the capabailities in Specmatic's private beta offering.  
**Note:** To be able to run these projects locally on your machine, please reach out to us at **specmatic@xnsio.com** to sign up for our private beta program.

- [Kafka Mock](https://github.com/znsio/specmatic-order-bff-java/)
- [JMS Mock](https://github.com/znsio/specmatic-order-bff-jms/)
- [Redis Mock](https://github.com/znsio/specmatic-redis-sample/)
- [JDBC Mock](https://github.com/znsio/specmatic-jdbc-sample)