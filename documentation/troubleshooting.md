---
layout: default
title: Troubleshooting
parent: Documentation
nav_order: 9
---
Troubleshooting
===============

It may seem counter intuitive at first, but Qontract errors are good news. Not because we want errors. But if we're breaking integration, we'd rather get Qontract errors in our dev environment, than integraton errors in staging, testing or worst of all, production.

Usually the error should be fairly descriptive, but sometimes we need to dig deeper. So here are some troubleshooting tips.

### Qontract test or stub are showing a lot of errors. I am not sure where to start debugging.

Under some circumstances when none of the scenarios are matching, Qontract simply returns all the errors at you.

Qontract checks the path first. So if that doesn't match, it's likely that the scenario is irrelevant.

Hence, start by ignoring all the path related errors and look at the non path related errors. Most often, this will help you zero down on the core issue.

If there are only path errors, it means that your url itself doesn't match any of the scenarios. You then need to identify the scenario representing the API you want to use, and make sure that your request url's path matches the scenario path.

### My API is responding with errors when invoked with with Qontract test

CAUSES

Usually this is caused by incorrect examples or an incorrectly formed request.

Here are a few possibilities:
- In your examples, the values may not match your application state.
- The json request payload structure in the contract may not be what the application expects.
- You are using form fields where you should be using form data or vice versa. The two are not the same.
- You are missing some headers.

And this is by no means an exhaustive list. If the request in the contract is different from the request expected by your code, your application will naturally respond with an error.

SOLUTION

If you are writing this contract for the first time, you might have written the contract wrong.

- Make sure you have the latest version of Qontract.
- Read the logs, to understand what Qontract is sending to your application.
- Based on that, you can determine whether your contract is in sync with your application or not.

### Postman request works, Qontract test does not

CAUSES

This just means that you have formulated the message correctly in Postman, but not in the contract.

SOLUTION

- Make sure you have the latest version of Qontract.
- Read the logs, to understand what Qontract is sending to your application.
- Compare that with the Postman request. It's likely that they are not in sync.

### Qontract test was working before but it now show errors

CAUSES

Most likely, a well established contract is breaking. Something has changed in your application, which is breaking the contract.

Either the old response format is not being accepted by your application, or the new response format does not anymore agree with the contract.

SOLUTION

- Make sure you have the latest version of Qontract.
- Read the logs, to understand what Qontract is sending to your application, and what it is getting back.
- Check the request being sent by Qontract. Very often, this is where the problem will be found.
- Check the response, Qontract will tell you what it sees amiss.

### Stub says Cookie header is missing, but it is not missing in Postman

CAUSES

It's possible that you do not have the latest verison of either Chrome or the Postman extension.

SOLUTION

Make sure that you have the latest version of Chrome and of the Postman extension.

### Stub mode returns an error to Postman

CAUSES

The Postman request does not match the Contract.

SOLUTION

- Make sure you have the latest version of Qontract.
- Read the error message, to understand where Qontract believes the issue is.
