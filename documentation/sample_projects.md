---
layout: default
title: Sample Projects
parent: Documentation
nav_order: 17
---

Specmatic in Action: Sample Projects
---

- [Specmatic in Action: Sample Projects](#specmatic-in-action-sample-projects)
- [Overview](#overview)
- [Sample Application Architecture](#sample-application-architecture)
- [Sample Projects](#sample-projects)
- [Bringing It All Together](#bringing-it-all-together)
- [Need Help?](#need-help)
- [Contributing](#contributing)

## Overview

Specmatic unlocks a new way to approach microservices by aligning contracts and code, making your systems reliable and resilient. Our sample projects showcase real-world implementations across various technologies and communication protocols. This is your playground to experience Specmatic.

## Sample Application Architecture
Each sample project is designed around a familiar microservices setup, giving you the clarity and confidence to integrate Specmatic seamlessly into your stack.<br/>
The architecture consists of three core components:
1. **Backend Service** – The system's engine, processing and providing data.
2. **BFF (Backend For Frontend)** – A mediator between the frontend and backend services.
3. **Frontend Application** – Where the user interacts.

Let's discover how Specmatic works across different layers of an app, with help of following sample projects.

## Sample Projects

<div id="sample-projects-tabs">
{% tabs modules %}
<!-- OPENAPI -->
{% tab modules OpenAPI %}
![OpenAPI Architecture](/images/specmatic-openapi-architecture.gif)

### Projects

| Layer                        | Language | Framework   | Sample Project                                                                                    |
| ---------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------------- |
| Backend                      | Kotlin   | Spring Boot | [specmatic-order-api-java](https://github.com/specmatic/specmatic-order-api-java)                 |
| Backend                      | NodeJS   | Express     | [specmatic-order-api-nodejs](https://github.com/specmatic/specmatic-order-api-nodejs)             |
| Backend                      | Python   | Flask       | [specmatic-order-api-python](https://github.com/specmatic/specmatic-order-api-python)             |
| Back-end for Front-end (BFF) | Kotlin   | Spring Boot | [specmatic-order-bff-java](https://github.com/specmatic/specmatic-order-bff-java)                 |
| Back-end for Front-end (BFF) | NodeJS   | Express     | [specmatic-order-bff-nodejs](https://github.com/specmatic/specmatic-order-bff-nodejs)             |
| Back-end for Front-end (BFF) | Python   | Flask       | [specmatic-order-bff-python](https://github.com/specmatic/specmatic-order-bff-python)             |
| Back-end for Front-end (BFF) | Python   | FastAPI     | [specmatic-redis-python-sample](https://github.com/specmatic/specmatic-redis-python-sample)       |
| Back-end for Front-end (BFF) | Python   | Sanic       | [specmatic-order-bff-python-sanic](https://github.com/specmatic/specmatic-order-bff-python-sanic) |
| Back-end for Front-end (BFF) | GoLang   | Gin         | [specmatic-order-bff-go](https://github.com/znsio/specmatic-order-bff-go)                         |
| Back-end for Front-end (BFF) | C#       | .NET        | [specmatic-order-bff-csharp](https://github.com/specmatic/specmatic-order-bff-csharp)             |
| Frontend                     | JS       | React       | [specmatic-order-ui-react](https://github.com/specmatic/specmatic-order-ui-react)                 |

### Security Schemes

![OAuth Architecture](/images/specmatic-oauth-architecture.gif)

| Security | Language | Framework   | Sample Project                                                                                         |
| -------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| OAuth    | Kotlin   | Spring Boot | [specmatic-order-api-java-with-oaut](https://github.com/specmatic/specmatic-order-api-java-with-oauth) |
{% endtab %}

<!-- ASYNCAPI -->
{% tab modules AsyncAPI %}
![Async Architecture](/images/specmatic-kafka-architecture.gif)

### Projects

| Protocol     | Interaction Pattern | Language | Framework   | Sample Project                                                                            |
| ------------ | ------------------- | -------- | ----------- | ----------------------------------------------------------------------------------------- |
| Kafka        | Fire-n-Forget       | Kotlin   | Spring Boot | [specmatic-order-bff-java](https://github.com/specmatic/specmatic-order-bff-java)         |
| Kafka        | Fire-n-Forget       | NodeJS   | Express     | [specmatic-order-bff-nodejs](https://github.com/specmatic/specmatic-order-bff-nodejs)     |
| JMS          | Request-Reply       | Kotlin   | Spring Boot | [specmatic-order-bff-jms](https://github.com/znsio/specmatic-order-bff-jms)               |

<!-- | Kafka        | Request-Reply       | Kotlin   | Spring Boot | [specmatic-kafka-sample](https://github.com/specmatic/specmatic-kafka-sample)             | -->
<!-- | GooglePubSub | Pub-Sub             | Kotlin   | Spring Boot | [specmatic-google-pubsub-sample](https://github.com/znsio/specmatic-google-pubsub-sample) | -->

<!-- ### Schema Registries

![Avro Architecture](/images/avro-sample-architecture.png)

| Schema Registry | Language | Framework   | Sample Project                                                                          |
| --------------- | -------- | ----------- | --------------------------------------------------------------------------------------- |
| Avro (Kafka)    | Kotlin   | Spring Boot | [specmatic-kafka-avro-sample](https://github.com/specmatic/specmatic-kafka-avro-sample) | -->

{% endtab %}

<!-- GRPC -->
{% tab modules gRPC %}
![gRPC architecture](/images/SpecmaticGRPCSupport.gif)

### Projects

| Layer                        | Language | Framework   | Sample Project                                                                                  |
| ---------------------------- | -------- | ----------- | ----------------------------------------------------------------------------------------------- |
| Backend                      | Kotlin   | Spring Boot | [specmatic-order-api-grpc-kotlin](https://github.com/specmatic/specmatic-order-api-grpc-kotlin) |
| Back-end for Front-end (BFF) | Kotlin   | Spring Boot | [specmatic-order-bff-grpc-kotlin](https://github.com/specmatic/specmatic-order-bff-grpc-kotlin) |
| Back-end for Front-end (BFF) | GoLang   | Gin         | [specmatic-order-bff-grpc-go](https://github.com/specmatic/specmatic-order-bff-grpc-go)         |

{% endtab %}

<!-- GraphQL -->
{% tab modules GraphQL %}
![GraphQL Architecture](/images/specmatic-graphql-architecture.gif)

### Projects

| Layer     | Language | Framework   | Sample Project                                                                                    |
| --------- | -------- | ----------- | ------------------------------------------------------------------------------------------------- |
| Backend   | Kotlin   | Spring Boot | [specmatic-order-bff-graphql-java](https://github.com/specmatic/specmatic-order-bff-graphql-java) |
| Front-end | JS       | React       | [specmatic-order-graphql-ui-react](https://github.com/specmatic/specmatic-order-graphql-ui-react) |
{% endtab %}

<!-- JDBC -->
{% tab modules JDBC %}
![JDBC Architecture](/images/specmatic-jdbc-architecture.gif)

<!-- ### Projects

| Layer   | Language | Framework   | Sample Project                                                          |
| ------- | -------- | ----------- | ----------------------------------------------------------------------- |
| Backend | Kotlin   | Spring Boot | [specmatic-jdbc-sample](https://github.com/znsio/specmatic-jdbc-sample) | -->
{% endtab %}

<!-- REDIS -->
{% tab modules Redis %}
![Redis Architecture](/images/specmatic-redis-architecture.gif)

### Projects

| Layer                        | Language | Framework   | Sample Project                                                                              |
| ---------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------- |
| Backend                      | Kotlin   | Spring Boot | [specmatic-redis-sample](https://github.com/specmatic/specmatic-redis-sample)               |
| Back-end for Front-end (BFF) | Python   | FastAPI     | [specmatic-redis-python-sample](https://github.com/specmatic/specmatic-redis-python-sample) |
{% endtab %}

<!-- WSDL -->
{% tab modules WSDL %}
```
                                      PRODUCTION SETUP
+-------------------+         +--------------------------+         +-------------------+
|                   |         |                          |         |                   |
|  WSDL SOAP Client |         |  Product BFF Search      |         |  order_api        |
|                   |         |  Service (BFF)           |         |  (WSDL Service)   |
+---------+---------+         +-----------+--------------+         +---------+---------+
          |                               |                                  |
          | 1. Request (SOAP)             |                                  |
          +------------------------------>|                                  |
          |                               |                                  |
          |                               | 2. Request (SOAP)                |
          |                               +--------------------------------->|
          |                               |                                  |
          |                               |                3. Response (SOAP)|
          |                               |<---------------------------------+
          | 4. Response (SOAP)            |                                  |
          +<------------------------------+                                  |
```
```
                                        CONTRACT TEST SETUP
+-------------------------+         +--------------------------+         +----------------------+
|                         |         |                          |         |                      |
| Specmatic Contract Test |         |  Product BFF Search      |         |  Specmatic Mock      |
|   (WSDL of BFF)         |         |  Service (BFF)           |         |  (WSDL of order_api) |
+-----------+-------------+         +-----------+--------------+         +----------+-----------+
            |                                   |                                   |
            | 1. Request (SOAP)                 |                                   |
            +---------------------------------->|                                   |
            |                                   |                                   |
            |                                   | 2. Request (SOAP)                 |
            |                                   +---------------------------------->|
            |                                   |                                   |
            |                                   |                3. Response (SOAP) |
            |                                   |<----------------------------------+
            | 4. Response (SOAP)                |                                   |
            +<----------------------------------+                                   |
            |                          
            |--------------------+
            | 5. Assert response |
            | against WSDL spec  |
            +<-------------------+
```
### Projects

| Layer                        | Language | Framework   | Sample Project                                                                    |
| ---------------------------- | -------- | ----------- | --------------------------------------------------------------------------------- |
| Back-end for Front-end (BFF) | Kotlin   | Spring Boot | [specmatic-order-bff-wsdl](https://github.com/specmatic/specmatic-order-bff-wsdl) |
{% endtab %}

<!-- ARAZZO -->
{% tab modules Arazzo %}
![Arazzo Flow](/images/arazzo-flow.svg)

### Projects

| Specification         | Language | Framework | Sample Project                                                                              |
| --------------------- | -------- | --------- | ------------------------------------------------------------------------------------------- |
| OpenAPI               | Python   | Flask     | [specmatic-arazzo-sample](https://github.com/specmatic/specmatic-arazzo-sample)             |
| OpenAPI + AsyncAPI    | Python   | Flask     | [specmatic-arazzo-async-sample](https://github.com/specmatic/specmatic-arazzo-async-sample) |
| OpenAPI with Consumer | Python   | Flask     | [specmatic-arazzo-ui-sample](https://github.com/specmatic/specmatic-arazzo-ui-sample)       |
{% endtab %}

<!-- MCP -->
{% tab modules MCP %}
![MCP Architecture](/images/MCP-Architecture.png)

### Projects

| MCP Server  | Sample Project                                                     |
| ----------- | ------------------------------------------------------------------ |
| Postman     | [mcp-auto-test](https://github.com/specmatic/mcp_auto_test_sample) |
| HuggingFace | [mcp-auto-test](https://github.com/specmatic/mcp_auto_test_sample) |
{% endtab %}

<!-- CENTRAL REPOSTORIES -->
{% tab modules Central Repo %}
![Central Contract Repository](/images/Central-Contract-Repo.png)

### Projects

| Name                      | Repository                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------- |
| Specmatic Order Contracts | [specmatic-order-contracts](https://github.com/specmatic/specmatic-order-contracts) |
{% endtab %}
{% endtabs %}
</div>

## Bringing It All Together

By exploring these projects, you'll gain hands-on experience in integrating Specmatic with a variety of technologies, giving you the power to build smarter and more resilient systems.

## Need Help?
- Join our [community discussions](https://github.com/specmatic/specmatic/discussions) for discussions and support
- Report bugs or suggest improvements in our [GitHub repository](https://github.com/specmatic/specmatic/issues)
- Reach out directly—we're here to [help!]({{ site.contact_us_url }})

## Contributing
We welcome contributions! If you've built something interesting with Specmatic:
- Submit a pull request to add your example
- Share your implementation of these samples in different frameworks
- Help us improve documentation and examples

Ready to transform how you build and test microservices? Pick a sample project and start your Specmatic journey today!
