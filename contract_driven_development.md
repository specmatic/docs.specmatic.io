---
layout: default
title: What Is Contract Driven Development
nav_order: 6
---
# What is Contract Driven Development
{: .fs-9}

---

**Contract Driven Development** leverages API Specifications (such as [OpenAPI](https://www.openapis.org/), [AsyncAPI](https://www.asyncapi.com/), [gRPC proto files](https://grpc.io/docs/what-is-grpc/introduction/), [GraphQL](https://graphql.org/), [WSDL](https://www.w3schools.com/xml/xml_wsdl.asp) and more) as Executable Contracts to shift-left identification contract compatiblity issues there by being absolutely essential for developing and deploying #microservices independently. Here are **5 key practices of CDD**:

1. **API design first**: Collaboratively design and document the API using standard specifications.

2. **Central Contract Repo**: Treat the API specs as code and store it in a central Git repository. This central Git repo should be the single source of truth referenced by both providers and consumers.

3. **Backward Compatibility Checks** and **Linting**: Perform automated backward compatibility checks to ensure we are not accidentally breaking compatibility. Also performing #linting to ensure the #APIDesign meets the agreed-upon specification standards.

4. **Contract Testing**: Convert API specifications like OpenAPI, AsyncAPI, gRPC proto files, GraphQLs or WSDL into executable contracts without writing any code. Run these tests in the CI/CD pipeline to shift-left and detect integration issues early.

5. **Intelligent Service Virtualisation**: Use the same API specifications we used above for "Contract Testing" to spin up stub servers, again without writing any code. When expectations are set against this stub, they are validated against the contract to ensure that consumers and providers do not drift away.

At a high level, our goal is to
* Significantly improve time to market for features
* Independently develop and deploy microservices and microfrontends
* Drastically reduce the dependency on integration testing
* Foster better API designs and collaboration between teams by facilitating communication through industry standard API Specifications such as OpenAPI, AsyncAPI, etc.

Here is a quick explainer video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/CSIrlayMZcU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

**Contract Driven Development** is significantly different from other approaches such as Consumer Driven Contract Testing. Here are [detailed comparisons](https://specmatic.io/category/comparisons) with other tools and approaches.
