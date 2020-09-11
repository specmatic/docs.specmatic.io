---
layout: default
title: Authoring Contracts
parent: Documentation
nav_order: 11
---
Authoring Contracts
===================

- [Authoring Contracts](#authoring-contracts)
  - [By hand](#by-hand)
    - [The contract file](#the-contract-file)
    - [Stub files that accompany the contract file](#stub-files-that-accompany-the-contract-file)
  - [Generate a contract a sample request and response](#generate-a-contract-a-sample-request-and-response)
    - [Create the sample file](#create-the-sample-file)
    - [Convert the sample into a contract](#convert-the-sample-into-a-contract)
  - [Generating a contract using outbound proxy mode](#generating-a-contract-using-outbound-proxy-mode)
    - [Start the proxy](#start-the-proxy)
    - [Proxy setup](#proxy-setup)
    - [Generate contracts](#generate-contracts)
  - [Generating a contract using reverse proxy mode](#generating-a-contract-using-reverse-proxy-mode)
    - [Start the proxy](#start-the-proxy-1)
    - [Generate contracts](#generate-contracts-1)
  - [Importing a Postman collection](#importing-a-postman-collection)
    - [Export the collection](#export-the-collection)
    - [Generate the contract](#generate-the-contract)
  - [Scenarios](#scenarios)
    - [Web Application On Local Environment Invokes API](#web-application-on-local-environment-invokes-api)
      - [Step 1: Run the proxy](#step-1-run-the-proxy)
      - [Step 2: Configure the OS proxy](#step-2-configure-the-os-proxy)
      - [Step 3: Trigger requests and responses](#step-3-trigger-requests-and-responses)
      - [Step 4: Generating the contracts](#step-4-generating-the-contracts)
    - [Local Service Talks To Remote Service Over HTTPS](#local-service-talks-to-remote-service-over-https)
      - [Step 1: Run the proxy](#step-1-run-the-proxy-1)
      - [Step 2: Configure the application's base url](#step-2-configure-the-applications-base-url)
      - [Step 3: Trigger requests and responses](#step-3-trigger-requests-and-responses-1)
      - [Step 4: Generating the contracts](#step-4-generating-the-contracts-1)

## By hand

You could simply write the contract yourself. This is usually done when you don't have a service and are describing a fresh API from scratch.

### The contract file

A contract file contains a description of an API or a set of APIs using the [Qontract language](/documentation/language.html). Contract files must have the extension `.qontract`.

### Stub files that accompany the contract file

To learn more about stub files, read about [service virtualisation](/documentation/service_virtualisation.html), and within that, about [stubbing specific requests for specific responses](documentation/service_virtualisation.html#stubbing-out-specific-responses-to-specific-requests).

Stub files accompanying a contract can be easily used by anyone referring to the contract who needs to run a quick stub.

Stub files must be placed in a directory with the same name as the contract file, suffixed with _data.

For example, given a contract file named orderservice.qontract:
* create a directory named orderservice_data in the same directory as the contract file
* put the stub files in that directory

The resulting directory structure might look something like this:

```
|
 \_ orderservice.qontract [file]
 \_ orderservice_data     [directory]
    |
     \_ placing_an_order.json [file]
     \_ listing_all_orders.json [file]
```

## Generate a contract a sample request and response

If you know what the request and response should look like, you can start by creating a file with the sample request and response.

### Create the sample file

The file must contain a single json object using the [Qontract stub file format](documentation/service_virtualisation.html#stub-file-format).

Here's a sample file that contains a request for the name of a customer by id:

File: customer_stub.json
```json
{
  "http-request": {
    "method": "GET",
    "path": "/customer/name",
    "query": {
      "name": 10
    }
  },
  "http-response": {
    "status": 200,
    "body": "Jane Doe"
  }
}
```

### Convert the sample into a contract

Now run the `qontract import stub` command on it:

```bash
> qontract import stub -o <qontract file>.json <stub file>.json
Written to file /Users/xyz/customer_stub.qontract

> cat customer_stub.qontract
Feature: New Feature
  Scenario: New scenario
    When GET /customer/name?id=(number)
    Then status 200
    And response-body (string)

    Examples:
    | id |
    | 10 |
```

The generated contract matches the sample.

In fact we can use the [sample as a stub](/documentation/service_virtualisation.html). To do so:

```bash
> mv customer_stub.qontract customer.qontract
> mkdir customer_data
> mv customer_stub.json customer_data
> qontract stub customer.qontract
Loading customer.qontract
  Loading stub expectations from /Users/joelrosario/tmp/customer_data
  Reading the following stub files:
    /Users/joelrosario/tmp/customer_data/customer_stub.json
Stub server is running on http://0.0.0.0:9000. Ctrl + C to stop.
```

You can now make a call to this stub in a new tab:

```bash
> curl 'http://localhost:9000/customer/name?id=10'
Jane Doe
```

You can read more about [service virtualization here](/documentation/service_virtualisation.html).

## Generating a contract using outbound proxy mode

\
![](/images/qontract-proxy.svg)

This tool will help you generate contract specs when the API is ready and can be invoked by an application such as Postman, or perhaps the web application that you are building.

### Start the proxy

Syntax: qontract proxy ./generated_contracts

Let's try running it:

```bash
> qontract proxy ./generated_contracts
Proxy server is running on http://localhost:9000. Ctrl + C to stop.
```

### Proxy setup

We'll use Postman as an example.

Here's the documentation on [proxy settings in Postman](https://learning.postman.com/docs/sending-requests/capturing-request-data/proxy/). Use Qontract Proxy as an HTTP proxy, with localhost as the host and 9000 as the port.

### Generate contracts

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

## Generating a contract using reverse proxy mode

\
![](/images/qontract-reverse-proxy.svg)

If your remote service runs over HTTPS, use Inbound Proxy Mode. In this mode, Qontract Proxy acts as a reverse proxy to the target application. You configure your application to talk to Qontract Proxy. In this mode, you must not configure proxy settings on the OS or the application. The application is not aware that Qontract is a proxy. Instead, just configure your application to make API calls to Qontract Proxy. Qontract will forward all requests to the target end point, and return it's responses.

### Start the proxy

Syntax: qontract proxy --target https://host.internal.company.com/service ./generated_contracts

Here https://host.internal.company.com/service is the real application.

Let's try running it:

```bash
> qontract proxy --target https://host.internal.company.com/service ./generated_contracts
Proxy server is running on http://localhost:9000. Ctrl + C to stop.
```

### Generate contracts

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

## Importing a Postman collection

This is useful when you have a Postman collection which you use to test your service. Well now you can also convert that collection into a contract.

### Export the collection

First you must [export the collection to a file](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#exporting-postman-data). Use v2.1 when doing so.

### Generate the contract

`qontract import postman -o <qontract file>.json <postman collection file>.json`

This command will read the Postman collection, and write the new qontract file into "qontract file.json" as specified in the command.

To see the qontract on standard output instead, just omit `-o filename.json`.

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

### Local Service Talks To Remote Service Over HTTPS

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
