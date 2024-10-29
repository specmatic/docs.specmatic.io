---
layout: default  
title: Sample Projects  
parent: Documentation  
nav_order: 17  
---

Specmatic in Action: Sample Projects
---

- [Sample Projects](#specmatic-in-action-sample-projects)
    - [Overview](#overview)
        - [Sample Application Architecture](#sample-application-architecture)
        - [Getting Started](#getting-started)
        - [Learning path](#learning-path)
    - [In-Depth Implementations](#in-depth-implementations)
        - [OpenAPI](#openapi)
        - [Authentication and Authorization](#authentication-and-authorization)
        - [gRPC](#grpc)
        - [GraphQL](#graphql)
        - [Kafka](#kafka)
        - [Google PubSub](#google-pubsub)
        - [JMS](#jms)
        - [JDBC](#jdbc)
        - [Redis](#redis)
    - [Need Help?](#need-help)
    - [Contributing](#contributing)

## Overview

Specmatic unlocks a new way to approach microservices by aligning contracts and code, making your systems reliable and resilient. Our sample projects showcase real-world implementations across various technologies and communication protocols. This is your playground to experience Specmatic.

### Sample Application Architecture

Each sample project is designed around a familiar microservices setup, giving you the clarity and confidence to integrate Specmatic seamlessly into your stack.

The architecture consists of three core components:

- **Frontend Application** – Where the user interacts.
- **BFF (Backend For Frontend)** – A mediator between the frontend and backend services.
- **Backend Service** – The system's engine, processing and providing data.

### Getting Started
1. Choose a sample project that matches your tech stack
2. Clone the repository and follow the README instructions
3. Explore the contract tests and implementation details
4. Run the examples locally to see Specmatic in action

### Learning Path
- Start with the OpenAPI examples if you're new to Specmatic
- Progress to more complex implementations like OAuth or event-driven patterns
- Experiment with different language implementations of the same architecture

**Let's dive deeper!**

---
## In-Depth Implementations

## OpenAPI

![OpenAPI Architecture](/images/specmatic-openapi-architecture.gif)

Let's discover how Specmatic works across different layers of an app, with help of following sample projects.

- **Frontend:**
    - [React and NodeJS](https://github.com/znsio/specmatic-order-ui-react)

- **BFF:**
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-bff-java/) 
    - [NodeJS (Express)](https://github.com/znsio/specmatic-order-bff-nodejs/)
    - [Python (Flask)](https://github.com/znsio/specmatic-order-bff-python/) and [Sanic](https://github.com/znsio/specmatic-order-bff-python-sanic/)
    - [Go (Gin)](https://github.com/znsio/specmatic-order-bff-go)
    - [.NET core (C#)](https://github.com/znsio/specmatic-order-bff-csharp)

- **Backend:**
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-api-java)
    - [Python (Flask)](https://github.com/znsio/specmatic-order-api-python/)
    - [NodeJS (Express)](https://github.com/znsio/specmatic-order-api-nodejs)

---

## Authentication and Authorization

![OAuth Architecture](/images/specmatic-oauth-architecture.gif)

Take control of secure user access with our OAuth samples, integrating authentication into your apps.

- **OAuth:**
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-api-java-with-oauth)

---

## gRPC

![gRPC architecture](/images/SpecmaticGRPCSupport.gif)

Supercharge your microservices with gRPC. Get started with these samples and see how Specmatic fits in.

- **BFF:**
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-bff-grpc-kotlin)
    - [Go (Gin)](https://github.com/znsio/specmatic-order-bff-grpc-go)

- **Backend:**
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-api-grpc-kotlin)

---

## GraphQL

![GraphQL Architecture](/images/specmatic-graphql-architecture.gif)

GraphQL opens a world of flexible queries—explore how Specmatic bridges contracts and GraphQL endpoints.

- **Frontend:**
    - [React and NodeJS](https://github.com/znsio/specmatic-order-graphql-ui-react) 

- **BFF:**
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-bff-graphql-java)

---

## Kafka

![Kafka Architecture](/images/specmatic-kafka-architecture.gif)

Kafka brings event-driven architecture to life. Discover Specmatic’s power in managing Kafka interactions.

- **BFF:**
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-bff-java/) 
    - [NodeJS (Express)](https://github.com/znsio/specmatic-order-bff-nodejs/)

- **Request-Reply Pattern:**
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-kafka-sample) 

---

## Google PubSub

![Google PubSub Architecture](/images/specmatic-gpubsub-architecture.gif)

Jump into event-driven architectures with Google PubSub, powered by Specmatic.

- **Backend:**
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-google-pubsub-sample) 

---

## JMS

![JMS Architecture](/images/specmatic-jms-architecture.gif)

Embrace the power of Java Messaging Service (JMS) with this Specmatic-integrated sample.

- **BFF:**
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-order-bff-jms/) 

---

## JDBC

![JDBC Architecture](/images/specmatic-jdbc-architecture.gif)

Unlock data from databases using JDBC, and see how Specmatic supports seamless contract testing.

- **BFF:**
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-jdbc-sample)

---

## Redis

![Redis Architecture](/images/specmatic-redis-architecture.gif)

Boost your app’s performance with Redis caching, fully integrated with Specmatic.

- **BFF:**
    - [Kotlin (SpringBoot)](https://github.com/znsio/specmatic-redis-sample) 


By exploring these projects, you'll gain hands-on experience in integrating Specmatic with a variety of technologies, giving you the power to build smarter and more resilient systems. **Ready to level up? Jump in and start experimenting!**

---

## Bringing It All Together

By exploring these projects, you'll gain hands-on experience in integrating Specmatic with a variety of technologies, giving you the power to build smarter and more resilient systems.


### Need Help?
- Join our [community discussions](https://github.com/znsio/specmatic/discussions) for discussions and support
- Report bugs or suggest improvements in our [GitHub repository](https://github.com/znsio/specmatic/issues)
- Reach out directly—we're here to [help!](https://specmatic.io/contact-us/)

### Contributing
We welcome contributions! If you've built something interesting with Specmatic:
- Submit a pull request to add your example
- Share your implementation of these samples in different frameworks
- Help us improve documentation and examples

Ready to transform how you build and test microservices? Pick a sample project and start your Specmatic journey today!

