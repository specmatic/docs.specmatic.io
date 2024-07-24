---
layout: default
title: Sample Projects
parent: Documentation
nav_order: 17
---
# Sample Projects

- [Sample Projects](#sample-projects)
    - [Sample Application Architecture](#sample-application-architecture)
    - [OpenAPI](#openapi)
    - [Authentication and Authorization](#authentication-and-authorization)
    - [gRPC](#grpc)
    - [GraphQL](#graphql)
    - [Kafka](#kafka)
    - [Google PubSub](#google-pubsub)
    - [JMS](#jms)
    - [JDBC](#jdbc)
    - [Redis](#redis)

Below Sample Projects demonstrate various capabilities of Specmatic in the context of a fairly realistic microservices application.

## Sample Application Architecture

The sample projects consist of 3 components:

- A Frontend application.
- BFF (Backend For Frontend), the API invoked by the Frontend.
- Backend Service, the API invoked by the BFF layer.

Below sections showcase these components implemented in various languages, frameworks and communication protocols.

---

### OpenAPI

![OpenAPI Architecture](/images/specmatic-openapi-architecture.gif)

**Note**: Above is a high-level architecture. Architecture specific to the sample project can be found in their corresponding repositories.

- #### Frontend
    - [React and NodeJS](https://github.com/znsio/specmatic-order-ui-react) 

- #### BFF
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-bff-java/)
    - [NodeJS (Express)](https://github.com/znsio/specmatic-order-bff-nodejs/)
    - [Python (Flask)](https://github.com/znsio/specmatic-order-bff-python/)
    - [Python (Sanic)](https://github.com/znsio/specmatic-order-bff-python-sanic/)

- #### Backend
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-api-java)
    - [Python (Flask)](https://github.com/znsio/specmatic-order-api-python/)
    - [NodeJS (Express)](https://github.com/znsio/specmatic-order-api-nodejs)

---

### Authentication and Authorization

![OAuth Architecture](/images/specmatic-oauth-architecture.gif)

**Note**: Above is a high-level architecture. Architecture specific to the sample project can be found in their corresponding repositories.

- #### OAuth
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-api-java-with-oauth)

---

### gRPC

![gRPC architecture](/images/specmatic-grpc-architecture.gif)

**Note**: Above is a high-level architecture. Architecture specific to the sample project can be found in their corresponding repositories.

- #### BFF
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-bff-grpc-kotlin)
    - [Go (Gin)](https://github.com/znsio/specmatic-order-bff-grpc-go)

- #### Backend
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-api-grpc-kotlin)

---

### GraphQL

![GraphQL Architecture](/images/specmatic-graphql-architecture.gif)

**Note**: Above is a high-level architecture. Architecture specific to the sample project can be found in their corresponding repositories.

- #### Frontend
    - [React and NodeJS](https://github.com/znsio/specmatic-order-graphql-ui-react)

- #### BFF
    - [Kotlin (SpringBoot) that provides the GraphQL Service](https://github.com/znsio/specmatic-order-bff-graphql-java)
    - [Kotlin (SpringBoot) that consumes the GraphQL Service](https://github.com/znsio/specmatic-order-graphql-consumer-java)

---
    
### Kafka

![Kafka Architecture](/images/specmatic-kafka-architecture.gif)

**Note**: Above is a high-level architecture. Architecture specific to the sample project can be found in their corresponding repositories.
    
- #### BFF
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-bff-java/)
    - [NodeJS (Express)](https://github.com/znsio/specmatic-order-bff-nodejs/)

---

### Google PubSub

![Google PubSub Architecture](/images/specmatic-gpubsub-architecture.gif)

**Note**: Above is a high-level architecture. Architecture specific to the sample project can be found in their corresponding repositories.

- #### Backend
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-google-pubsub-sample)

---

### JMS

![JMS Architecture](/images/specmatic-jms-architecture.gif)

**Note**: Above is a high-level architecture. Architecture specific to the sample project can be found in their corresponding repositories.

- #### BFF
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-bff-jms/)

---

### JDBC

![JDBC Architecture](/images/specmatic-jdbc-architecture.gif)

**Note**: Above is a high-level architecture. Architecture specific to the sample project can be found in their corresponding repositories.

- #### BFF
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-jdbc-sample)

---

### Redis

![Redis Architecture](/images/specmatic-redis-architecture.gif)

**Note**: Above is a high-level architecture. Architecture specific to the sample project can be found in their corresponding repositories.

- #### BFF
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-redis-sample)
