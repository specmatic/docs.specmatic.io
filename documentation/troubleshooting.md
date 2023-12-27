---
layout: default
title: Troubleshooting
parent: Documentation
nav_exclude: true
search_exclude: true
---
Troubleshooting
===============

- [Troubleshooting](#troubleshooting)
    - [Specmatic test or stub are showing a lot of errors. I am not sure where to start debugging.](#specmatic-test-or-stub-are-showing-a-lot-of-errors-i-am-not-sure-where-to-start-debugging)
    - [The stub is serving random values instead of my stubbed data](#the-stub-is-serving-random-values-instead-of-my-stubbed-data)
    - [My API is responding with errors when invoked with with Specmatic test](#my-api-is-responding-with-errors-when-invoked-with-with-specmatic-test)
    - [Postman request works, Specmatic test does not](#postman-request-works-specmatic-test-does-not)
    - [Specmatic test was working before but it now show errors](#specmatic-test-was-working-before-but-it-now-show-errors)
    - [Stub says Cookie header is missing, but it is not missing in Postman](#stub-says-cookie-header-is-missing-but-it-is-not-missing-in-postman)
    - [Stub mode returns an error to Postman](#stub-mode-returns-an-error-to-postman)
    - [When I try to run contract tests using SpecmaticJUnitSupport, I'm getting an exception saying that XYZ method or class is missing. What do I do?](#when-i-try-to-run-contract-tests-using-specmaticjunitsupport-im-getting-an-exception-saying-that-xyz-method-or-class-is-missing-what-do-i-do)
    - [Maven properties in Spring projects](#maven-properties-in-spring-projects)

It may seem counter intuitive at first, but Specmatic error reports are good news. Not because we want errors. But if we're breaking integration, we'd rather get Specmatic errors in our dev environment, than integraton errors in staging, testing or worst of all, production.

You can read [more about error reports here](/documentation/reading_reports.html).

Usually the error should be fairly descriptive, but sometimes we need to dig deeper. So here are some troubleshooting tips.

### Specmatic test or stub are showing a lot of errors. I am not sure where to start debugging.

Under some circumstances when none of the scenarios are matching, Specmatic simply returns all the errors to you.

First, start by ignoring all the path related errors. Look only at the non path related errors. Most often, this will help you zero down on the core error.

But if all the errors are path related, it means that your request url doesn't match the path in any of the scenarios.

If the scenario relevant to the API you are calling had a path variable, e.g. /order/(id:number), then you may find helpful path matching errors.

For example, consider this contract:

```gherkin
#File name order.spec
Feature: Order contract

Scenario: Order API
When POST /basic
And request-body (number)
Then status 200
```

Run it using `java -jar path/to/specmatic.jar stub order.spec`.

Then run `curl http://localhost:9000/order/abc`, and you'll get an error looking like this.

```
In scenario "Order info"
>> REQUEST.URL.id.PATH (/order/abc)

Expected number, actual was string: "abc"%
```

But sometimes there are only path matching errors to be found, and no path variables involved. In that case, simply identify the scenario representing the API you want to use. Then see how that scenario's path differs from your request.

### The stub is serving random values instead of my stubbed data

There are two possible reasons.

1. The stubbed data may not have been in compliance with the contract, and so Specmatic rejected it at startup.

To check if this happened, take a look at the stub log on the console at startup. You may find something like this:

    /path/to/math_data/sample.json didn't match math.spec
    In scenario "Square of a number"
    >> REQUEST.BODY.data

    Expected number, actual was string: "hello"
    Stub server is running on http://localhost:9000. Ctrl + C to stop.

In this case, it means that the contract expectd data to be a number, but it was a string, and so the stub was not loaded.

2. The request did not match the stub request. If the request from your application, Postman, etc does not match the stubbed request exactly, Specmatic will not send the corresponding stubbed response back. But if it does match the contract, Specmatic will send a random response back in the same shape as what was declared in the contract file.

To check if this is the case, start the stub in strict mode: `java -jar /path/to/specmatic.jar stub --strict /path/to/contract.spec`, and try the requests again.

In strict mode, if Specmatic cannot find a match amongst the available stubs for the request from your application or Postman, it will show the reasons why the stubs did not match your request.

### My API is responding with errors when invoked with with Specmatic test

Usually this is caused by incorrect examples or an incorrectly formed request.

Here are a few possibilities:
- In your examples, the values may not match your application state.
- The json request payload structure in the contract may not be what the application expects.
- You are using form fields where you should be using form data or vice versa. The two are not the same.
- You are missing some headers.

And this is by no means an exhaustive list. If the request in the contract is different from the request expected by your code, your application will naturally respond with an error.

If you are writing this contract for the first time, you might have written the contract wrong.

- Make sure you have the latest version of Specmatic.
- Read the logs, to understand what Specmatic is sending to your application.
- Based on that, you can determine whether your contract is in sync with your application or not.

### Postman request works, Specmatic test does not

This just means that you have formulated the message correctly in Postman, but not in the contract.

- Make sure you have the latest version of Specmatic.
- Read the logs, to understand what Specmatic is sending to your application.
- Compare that with the Postman request. It's likely that they are not in sync.

### Specmatic test was working before but it now show errors

Most likely, a well established contract is breaking. Something has changed in your application, which is breaking the contract.

Either the old response format is not being accepted by your application, or the new response format does not anymore agree with the contract.

To resolve this:
- Make sure you have the latest version of Specmatic.
- Read the logs, to understand what Specmatic is sending to your application, and what it is getting back.
- Check the request being sent by Specmatic. Very often, this is where the problem will be found.
- Check the response, Specmatic will tell you what it sees amiss.

### Stub says Cookie header is missing, but it is not missing in Postman

It's possible that you do not have the latest version of either Chrome or the Postman extension.

Make sure that you have the latest version of Chrome and of the Postman extension.

### Stub mode returns an error to Postman

The Postman request does not match the Contract.

To resolve this:
- Make sure you have the latest version of Specmatic.
- Read the error message, to understand where Specmatic believes the issue is.

### When I try to run contract tests using SpecmaticJUnitSupport, I'm getting an exception saying that XYZ method or class is missing. What do I do?

Spring-boot declares Kotlin as a dependency, and so does Specmatic (`Specmatic` is written in Kotlin). The two versions may conflict, resulting in errors about missing methods or classes.

### Maven properties in Spring projects

In a Spring 2.x or 3.x project, in case of errors about a missing Kotlin method/class which indicate a core Kotlin method/class or a coroutines-related method/class, add the following to the pom:

**Properties**

```xml
<properties>
    <kotlin.version>1.9.22</kotlin.version>
    <kotlin-coroutines.version>latest-version-from-github-project<kotlin-coroutines.version>
</properties>
```

*Remember:* Update the version of `kotlin-coroutines.version` above with the latest version from https://github.com/Kotlin/kotlinx.coroutines.

**Dependencies**

If similar errors appear after adding these properties, add the following dependency.

```xml
<dependency>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-stdlib</artifactId>
    <version>1.9.22</version>
</dependency>
```
