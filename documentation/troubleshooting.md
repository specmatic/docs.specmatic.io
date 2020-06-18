---
layout: default
title: Troubleshooting
parent: Documentation
nav_order: 11
---
Troubleshooting
===============

- [Troubleshooting](#troubleshooting)
    - [Qontract test or stub are showing a lot of errors. I am not sure where to start debugging.](#qontract-test-or-stub-are-showing-a-lot-of-errors-i-am-not-sure-where-to-start-debugging)
    - [The stub is serving random values instead of my stubbed data](#the-stub-is-serving-random-values-instead-of-my-stubbed-data)
    - [My API is responding with errors when invoked with with Qontract test](#my-api-is-responding-with-errors-when-invoked-with-with-qontract-test)
    - [Postman request works, Qontract test does not](#postman-request-works-qontract-test-does-not)
    - [Qontract test was working before but it now show errors](#qontract-test-was-working-before-but-it-now-show-errors)
    - [Stub says Cookie header is missing, but it is not missing in Postman](#stub-says-cookie-header-is-missing-but-it-is-not-missing-in-postman)
    - [Stub mode returns an error to Postman](#stub-mode-returns-an-error-to-postman)

It may seem counter intuitive at first, but Qontract error reports are good news. Not because we want errors. But if we're breaking integration, we'd rather get Qontract errors in our dev environment, than integraton errors in staging, testing or worst of all, production.

You can read [more about error reports here](/documentation/reading_reports.html).

Usually the error should be fairly descriptive, but sometimes we need to dig deeper. So here are some troubleshooting tips.

### Qontract test or stub are showing a lot of errors. I am not sure where to start debugging.

Under some circumstances when none of the scenarios are matching, Qontract simply returns all the errors to you.

First, start by ignoring all the path related errors. Look only at the non path related errors. Most often, this will help you zero down on the core error.

But if all the errors are path related, it means that your request url doesn't match the path in any of the scenarios.

If the scenario relevant to the API you are calling had a path variable, e.g. /order/(id:number), then you may find helpful path matching errors.

For example, consider this contract:

```gherkin
#File name order.qontract
Feature: Order contract

Scenario: Order API
When POST /basic
And request-body (number)
Then status 200
```

Run it using `java -jar path/to/qontract.jar stub order.qontract`.

Then run `curl http://localhost:9000/order/abc`, and you'll get an error looking like this.

```
In scenario "Order info"
>> REQUEST.URL.id.PATH (/order/abc)

Expected number, actual was string: "abc"%
```

But sometimes there are only path matching errors to be found, and no path variables involved. In that case, simply identify the scenario representing the API you want to use. Then see how that scenario's path differs from your request.

### The stub is serving random values instead of my stubbed data

There are two possible reasons.

1. The stubbed data may not have been in compliance with the contract, and so Qontract rejected it at startup.

To check if this happened, take a look at the stub log on the console at startup. You may find something like this:

    /path/to/math_data/sample.json didn't match math.qontract
    In scenario "Square of a number"
    >> REQUEST.BODY.data

    Expected number, actual was string: "hello"
    Stub server is running on http://localhost:9000. Ctrl + C to stop.

In this case, it means that the contract expectd data to be a number, but it was a string, and so the stub was not loaded.

2. The request did not match the stub request. If the request from your application, Postman, etc does not match the stubbed request exactly, Qontract will not send the corresponding stubbed response back. But if it does match the contract, Qontract will send a random response back in the same shape as what was declared in the contract file.

To check if this is the case, start the stub in strict mode: `java -jar /path/to/qontract.jar stub --strict /path/to/contract.qontract`, and try the requests again.

In strict mode, if Qontract cannot find a match amongst the available stubs for the request from your application or Postman, it will show the reasons why the stubs did not match your request.

### My API is responding with errors when invoked with with Qontract test

Usually this is caused by incorrect examples or an incorrectly formed request.

Here are a few possibilities:
- In your examples, the values may not match your application state.
- The json request payload structure in the contract may not be what the application expects.
- You are using form fields where you should be using form data or vice versa. The two are not the same.
- You are missing some headers.

And this is by no means an exhaustive list. If the request in the contract is different from the request expected by your code, your application will naturally respond with an error.

If you are writing this contract for the first time, you might have written the contract wrong.

- Make sure you have the latest version of Qontract.
- Read the logs, to understand what Qontract is sending to your application.
- Based on that, you can determine whether your contract is in sync with your application or not.

### Postman request works, Qontract test does not

This just means that you have formulated the message correctly in Postman, but not in the contract.

- Make sure you have the latest version of Qontract.
- Read the logs, to understand what Qontract is sending to your application.
- Compare that with the Postman request. It's likely that they are not in sync.

### Qontract test was working before but it now show errors

Most likely, a well established contract is breaking. Something has changed in your application, which is breaking the contract.

Either the old response format is not being accepted by your application, or the new response format does not anymore agree with the contract.

To resolve this:
- Make sure you have the latest version of Qontract.
- Read the logs, to understand what Qontract is sending to your application, and what it is getting back.
- Check the request being sent by Qontract. Very often, this is where the problem will be found.
- Check the response, Qontract will tell you what it sees amiss.

### Stub says Cookie header is missing, but it is not missing in Postman

It's possible that you do not have the latest version of either Chrome or the Postman extension.

Make sure that you have the latest version of Chrome and of the Postman extension.

### Stub mode returns an error to Postman

The Postman request does not match the Contract.

To resolve this:
- Make sure you have the latest version of Qontract.
- Read the error message, to understand where Qontract believes the issue is.
