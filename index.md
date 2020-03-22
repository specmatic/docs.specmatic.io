---
layout: default
title: Home
nav_order: 1
---
# Qontract
{: .fs-9}

Qontract is a ["Contract First"](/faqs.html#what-is-contract-first) Contract Testing Tool.
{: .fs-6 .fw-300}

[Get started now](/documentation/getting_started.html){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 } [View it on GitHub](//github.com/qontract/qontract){: .btn .fs-5 .mb-4 .mb-md-0 }

---
### Elevator Pitch

In a complex, interdependent eco-system, where each system’s components are evolving rapidly,
we want to make the dependencies between these components explicit in the form of contracts.
By doing so, [Contract Testing](/contract_testing.html) helps us get instantaneous feedback when we make changes to avoid accidental breakage.
With this ability, we can now deploy, at will, any system’s component at any time without having to completely depend on expensive Integration Tests.

Systems interact with each other through several means. Qontract hopes to address all these mechanisms and not just web interactions.
* API calls (JSon Rest, SOAP XML, gRPC, Thrift, other binary protocols)
* Events via Messaging (Kafka, )
* DB
* File system
* Libraries, SDK 
* OS Level Pipes

---
### Key Features

* **Human readable contracts** - Qontract leverages **Gherkin**'s strength as a specification mechanism to define APIs.
* **Backward Compatibility Verification** - Contract vs Contract testing (cross version compatibility checks) etc.
* **Contract as Stub / Mock** - Run stubs / mocks that are based on your downstream contracts to isolate your development
* **Contract as Test** - Test drive your APIs with contract
* **Programmatic** (Kotlin, Java and JVM languages) **and Command line support**
* [**And many more**](/features.html)

