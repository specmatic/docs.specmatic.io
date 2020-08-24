---
layout: default
title: HTTP Proxy
parent: Documentation
nav_order: 13
---
HTTP Proxy
==========

- [HTTP Proxy](#http-proxy)
  - [Outbound Proxy Mode](#outbound-proxy-mode)
    - [Start The Proxy](#start-the-proxy)
    - [Proxy Setup](#proxy-setup)
    - [Generate Contracts](#generate-contracts)
  - [Reverse Proxy Mode](#reverse-proxy-mode)
    - [Start The Proxy](#start-the-proxy-1)
    - [Generate Contracts](#generate-contracts-1)
  - [Scenarios](#scenarios)
    - [Web Application On Local Environment Invokes API](#web-application-on-local-environment-invokes-api)
      - [Step 1: Run the proxy](#step-1-run-the-proxy)
      - [Step 2: Configure the OS proxy](#step-2-configure-the-os-proxy)
      - [Step 3: Trigger requests and responses](#step-3-trigger-requests-and-responses)
      - [Step 4: Generating the contracts](#step-4-generating-the-contracts)
    - [Local Service Talks To Remove Service Over HTTPS](#local-service-talks-to-remove-service-over-https)
      - [Step 1: Run the proxy](#step-1-run-the-proxy-1)
      - [Step 2: Configure the application's base url](#step-2-configure-the-applications-base-url)
      - [Step 3: Trigger requests and responses](#step-3-trigger-requests-and-responses-1)
      - [Step 4: Generating the contracts](#step-4-generating-the-contracts-1)

This tool will help you generate contract specs when the API is ready and can be invoked by an application such as Postman, or perhaps the web application that you are building.

## Outbound Proxy Mode

\
![](/images/qontract-proxy.svg)

### Start The Proxy

Syntax: qontract proxy ./generated_contracts

Let's try running it:

```bash
> qontract proxy ./generated_contracts
Proxy server is running on http://localhost:9000. Ctrl + C to stop.
```

### Proxy Setup

We'll use Postman as an example.

Here's the documentation on [proxy settings in Postman](https://learning.postman.com/docs/sending-requests/capturing-request-data/proxy/). Use Qontract Proxy as an HTTP proxy, with localhost as the host and 9000 as the port.

### Generate Contracts

Now use Postman to send a request to your HTTP service of choice (for HTTPS, see [Inbound Proxy Mode](#reverse-proxy-mode)). You could start the service in your dev environment, or perhaps use a service in the staging environment. Either way, with the proxy setup as described above, Postman will route the request through the qontract proxy. Make sure to trigger all the requests that you wish to capture as contracts.

Finally, kill the proxy using Ctrl+C on the command prompt, and it will generate contracts from all the reqeusts and responses it has seen.

You will see something like this:
```bash
Writing contract to ./data/new_feature.qontract
Writing stub data to ./data/stub0.json
```

When it does, the proxy generates contracts and stubs out of all the request-response exchanges it has seen, and we will see something like this:

```bash
> ls ./generated_contracts
new_feature.qontract stub0.json
```

In this case, a single api call was executed. As a result, Qontract generated two files. stub0.json contains the request sent from Postman and the response from the server. new_feature.qontract contains the contract generated from stub0.json.

All operating systems have a system wide configuration settings for configuring an HTTP proxy. Many applications (such as Postman) provide their own proxy configuration settings.

## Reverse Proxy Mode

\
![](/images/qontract-reverse-proxy.svg)

If your remote service runs over HTTPS, use Inbound Proxy Mode. In this mode, Qontract Proxy acts as a reverse proxy to the target application. You configure your application to talk to Qontract Proxy. In this mode, you must not configure proxy settings on the OS or the application. The application is not aware that Qontract is a proxy. Instead, just configure your application to make API calls to Qontract Proxy. Qontract will forward all requests to the target end point, and return it's responses.

### Start The Proxy

Syntax: qontract proxy --target https://host.internal.company.com/service ./generated_contracts

Here https://host.internal.company.com/service is the real application.

Let's try running it:

```bash
> qontract proxy --target https://host.internal.company.com/service ./generated_contracts
Proxy server is running on http://localhost:9000. Ctrl + C to stop.
```

### Generate Contracts

Now use Postman to send a request to Qontract. Alternatively, configure your application's service base url to point to Qontract Proxy for all API calls. Qontract will transparently act as a benign man-in-the-middle between your application and the remote application. Make sure to trigger all the requests that you wish to capture as contracts.

Finally, kill the proxy using Ctrl+C on the command prompt, and it will generate contracts from all the reqeusts and responses it has seen.

You will see something like this:
```bash
Writing contract to ./data/new_feature.qontract
Writing stub data to ./data/stub0.json
```

When it does, the proxy generates contracts and stubs out of all the request-response exchanges it has seen, and we will see something like this:

```bash
> ls ./generated_contracts
new_feature.qontract stub0.json
```

## Scenarios

### Web Application On Local Environment Invokes API

You may have a web application running on your local developer environment, which invokes an HTTP API for which you wish to generate a contract.

#### Step 1: Run the proxy

Run this command:
```bash
> qontract proxy ./generated_contracts
Proxy server is running on http://localhost:9000. Ctrl + C to stop.
```

#### Step 2: Configure the OS proxy

* If you're running the web application on MacOS, configure your [system proxy settings](https://support.apple.com/en-in/guide/mac-help/mchlp2591/mac).
* If you're on Windows using Microsoft Edge, configure your [Microsoft Edge proxy settings](https://docs.microsoft.com/en-us/deployedge/edge-learnmore-cmdline-options-proxy-settings)).

Chrome will also have it's settings on Windows and MacOS (left as an exercise for the reader).

#### Step 3: Trigger requests and responses

Once the proxy has been setup in the OS / browser, simply start up your web application in your browser, and run it, click buttons, load pages, etc.

#### Step 4: Generating the contracts

By now you should see logs at the command prompt showing the requests that the proxy has served.

Stop the proxy using Ctrl+C.

Take a look a the directory `./generated_contracts` which we provided in the proxy command earlier. You'll find in it all the contracts and stubs of the requests and responses that your application triggered.

### Local Service Talks To Remove Service Over HTTPS

You have a local service talking to a remote service, which runs on HTTPS, and no Postman collection which Qontract can convert.

Since the remote application runs on HTTPS, we need to use the reverse proxy mode.

#### Step 1: Run the proxy

Let's assume that the remote service runs on https://service.internal.company.com/customer

Run this command:
```bash
> qontract proxy --target https://service.internal.company.com/customer ./generated_contracts
Proxy server is running on http://localhost:9000. Ctrl + C to stop.
```

#### Step 2: Configure the application's base url

In reverse proxy mode, your application is not aware that there is a proxy.

The application must talk to the proxy as if it is the actual service.

Configure the service base url of your application to point to http://localhost:9000

#### Step 3: Trigger requests and responses

Start up your web application in your browser, and run it, click buttons, load pages, etc.

#### Step 4: Generating the contracts

By now you should see logs at the command prompt showing the requests that the proxy has served.

Stop the proxy using Ctrl+C.

Take a look a the directory `./generated_contracts` which we provided in the proxy command earlier. You'll find in it all the contracts and stubs of the requests and responses that your application triggered.
