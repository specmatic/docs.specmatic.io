---
layout: default
title: HTTP Proxy
parent: Documentation
nav_order: 13
---
HTTP Proxy
==========

- [HTTP Proxy](#http-proxy)
  - [Run The Command](#run-the-command)
  - [Setup The Proxy To Intercept HTTP Traffic](#setup-the-proxy-to-intercept-http-traffic)
  - [Generate Contracts Using The Proxy](#generate-contracts-using-the-proxy)

This tool will help you generate contract specs when the API is ready and can be invoked by an application such as Postman, or perhaps the web application that you are building.

## Run The Command

Syntax: qontract proxy ./data_for_generated_contracts

Let's try running it:

```bash
> qontract proxy ./data
Proxy server is running on http://localhost:9000. Ctrl + C to stop.
```

## Setup The Proxy To Intercept HTTP Traffic

There are many ways to setup this proxy. You can configure the proxy in your OS settings. Applications often provide their own proxy settings.

See how to [set it up in Postman](https://learning.postman.com/docs/sending-requests/capturing-request-data/proxy/).

## Generate Contracts Using The Proxy

If you're using Postman, just it the send button to send the requests that you want the proxy to capture as contracts. If you have configured Postman to use the proxy (see the previous section), Postman will route the request through the qontract proxy. The proxy will keep track of the exchange.

If you're generating the requests a web app, you can now click the buttons and links that will trigger the API calls you want to capture as contracts.

Make sure to trigger all the requests that you wish to capture as contracts.

When done, kill the proxy using Ctrl+C.

You will see something like this:
```bash
Writing contract to ./data/new_feature.qontract
Writing stub data to ./data/stub0.json
```

When it does, the proxy generate contracts   and stubs out of all the request-response exchanges it has seen.

```bash
> ls ./data
new_feature.qontract stub0.json
```

In this case, a single api call was executed. As a result, Qontract generated two files. stub0.json contains the request sent from Postman and the response from the server. new_feature.qontract contains the contract generated from stub0.json.
