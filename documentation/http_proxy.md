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
    - [Reverse Proxy Mode (Supports HTTPS Application Endpoint)](#reverse-proxy-mode-supports-https-application-endpoint)
      - [Start The Proxy](#start-the-proxy-1)
      - [Generate Contracts](#generate-contracts-1)

This tool will help you generate contract specs when the API is ready and can be invoked by an application such as Postman, or perhaps the web application that you are building.

### Outbound Proxy Mode

\
![](/images/qontract-proxy.svg)

All operating systems have a system wide configuration settings for configuring an HTTP proxy. Applications often provide their own proxy configuration settings.

We'll use Postman as an example.

#### Start The Proxy

Syntax: qontract proxy ./data_for_generated_contracts

Let's try running it:

```bash
> qontract proxy ./data
Proxy server is running on http://localhost:9000. Ctrl + C to stop.
```

#### Proxy Setup

Here's the documentation on [proxy settings in Postman](https://learning.postman.com/docs/sending-requests/capturing-request-data/proxy/). Use Qontract Proxy as an HTTP proxy, with localhost as the host and 9000 as the port.

#### Generate Contracts

Now use Postman to send a request to your HTTP service of choice (for HTTPS, see [Inbound Proxy Mode](#reverse-proxy-mode)). You could start the service in your dev environment, or perhaps use a service in the staging environment. Either way, with the proxy setup as described above, Postman will route the request through the qontract proxy. Make sure to trigger all the requests that you wish to capture as contracts.

Finally, kill the proxy using Ctrl+C on the command prompt, and it will generate contracts from all the reqeusts and responses it has seen.

You will see something like this:
```bash
Writing contract to ./data/new_feature.qontract
Writing stub data to ./data/stub0.json
```

When it does, the proxy generates contracts and stubs out of all the request-response exchanges it has seen, and we will see something like this:

```bash
> ls ./data
new_feature.qontract stub0.json
```

In this case, a single api call was executed. As a result, Qontract generated two files. stub0.json contains the request sent from Postman and the response from the server. new_feature.qontract contains the contract generated from stub0.json.

### Reverse Proxy Mode (Supports HTTPS Application Endpoint)

\
![](/images/qontract-reverse-proxy.svg)

If your remote service runs over HTTPS, use Inbound Proxy Mode. In this mode, Qontract Proxy acts as a reverse proxy to the target application. You configure your application to talk to Qontract Proxy. In this mode, you must not configure proxy settings on the OS or the application. The application is not aware that Qontract is a proxy. Instead, just configure your application to make API calls to Qontract Proxy. Qontract will forward all requests to the target end point, and return it's responses.

#### Start The Proxy

Syntax: qontract proxy --target https://host.internal.company.com/service ./data_for_generated_contracts

Here https://host.internal.company.com/service is the real application.

Let's try running it:

```bash
> qontract proxy --target https://host.internal.company.com/service ./data_for_generated_contracts
Proxy server is running on http://localhost:9000. Ctrl + C to stop.
```

#### Generate Contracts

Now use Postman to send a request to Qontract. Alternatively, configure your application to hit Qontract Proxy for all API calls. Qontract will transparently act as a benign man-in-the-middle between your application and the remote application. Make sure to trigger all the requests that you wish to capture as contracts.

Finally, kill the proxy using Ctrl+C on the command prompt, and it will generate contracts from all the reqeusts and responses it has seen.

You will see something like this:
```bash
Writing contract to ./data/new_feature.qontract
Writing stub data to ./data/stub0.json
```

When it does, the proxy generates contracts and stubs out of all the request-response exchanges it has seen, and we will see something like this:

```bash
> ls ./data
new_feature.qontract stub0.json
```
