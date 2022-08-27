---
layout: default
title: Authoring Contracts
parent: Documentation
nav_order: 11
---
Authoring Contracts
===================

- [Authoring Contracts](#authoring-contracts)
  - [From an existing application using reverse proxy mode](#from-an-existing-application-using-reverse-proxy-mode)
    - [Start the proxy](#start-the-proxy)
    - [Generate contracts](#generate-contracts)
  - [From an existing application using outbound proxy mode](#from-an-existing-application-using-outbound-proxy-mode)
    - [Start the proxy](#start-the-proxy-1)
    - [Proxy setup](#proxy-setup)
    - [Generate contracts](#generate-contracts-1)
  - [From a sample request and response](#from-a-sample-request-and-response)
    - [Create the sample file](#create-the-sample-file)
    - [Convert the sample into a contract](#convert-the-sample-into-a-contract)
  - [Importing a Postman collection](#importing-a-postman-collection)
    - [Export the collection](#export-the-collection)
    - [Generate the contract](#generate-the-contract)
    - [Authenticated APIs in Postman](#authenticated-apis-in-postman)

## From an existing application using reverse proxy mode

\
![](/images/specmatic-reverse-proxy.svg)

If your remote service runs over HTTPS, use Inbound Proxy Mode. Specmatic acts as a transparent proxy between the client (Postman, your application, etc) and the API.

Let's use the same freely provided (again many thanks to its maintainer) test employee API that we used above.

### Start the proxy

```bash
> specmatic proxy --target http://dummy.restapiexample.com ./contracts
Proxy server is running on http://localhost:9000. Ctrl + C to stop.```
```

Make sure the contracts directory does not exist.

### Generate contracts

Now use Postman to send a request to Specmatic. Create a new Postman request to make a GET request to http://localhost:9000/api/v1/employees

Finally, kill the proxy using Ctrl+C on the command prompt, and it will generate contracts from all the reqeusts and responses it has seen, in the directory that you specify (which is ./contracts in the above example).

You will see something like this:
```bash
Writing contract to ./contracts/new_feature.yaml
Writing stub data to ./contracts/stub0.json
```

## From an existing application using outbound proxy mode

\
![](/images/specmatic-proxy.svg)

This tool will help you generate contract specs when the API exists in some environment and can be invoked.

### Start the proxy

As an example, let's generate a contract for the /employee API from this helpfully provided set of dummy APIs: http://dummy.restapiexample.com

First let's start the proxy:

```bash
> specmatic proxy ./contracts
Proxy server is running on http://localhost:9000. Ctrl + C to stop.
```

Make sure the contracts directory does not exist before you start the proxy.

### Proxy setup

We'll take Postman as an example. Setup proxy in Postman's settings with the proxy host as localhost and the proxy port as 9000.

Here's the documentation on [proxy settings in Postman](https://learning.postman.com/docs/sending-requests/capturing-request-data/proxy/). Use Specmatic Proxy as an HTTP proxy, with localhost as the host and 9000 as the port.

Note: All operating systems have a system wide configuration settings for configuring an HTTP proxy. Many applications (such as Postman) provide their own proxy configuration settings.

### Generate contracts

Create a new Postman request to send a GET request to http://dummy.restapiexample.com/api/v1/employees.

Finally, kill the proxy using Ctrl+C on the command prompt, and it will generate contracts from all the reqeusts and responses it has seen.

You will see something like this:
```bash
Writing contract to ./contracts/new_feature.yaml
Writing stub data to ./contracts/stub0.json
```

When it does, the proxy generates contracts and stubs out of all the request-response exchanges it has seen, and we will see something like this:

```bash
> ls ./contracts
new_feature.yaml stub0.json
```

## From a sample request and response

If you know what the request and response should look like, you can start by creating a file with the sample request and response.

### Create the sample file

The file must contain a single json object using the [Specmatic stub file format](service_virtualisation.html#stub-file-format).

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

Now run the `specmatic import stub` command on it:

```bash
> specmatic import <stub file>.json
Written to file /Users/xyz/customer_stub.yaml
```

## Importing a Postman collection

This is useful when you have a Postman collection which you use to test your service. Well now you can also convert that collection into a contract.

### Export the collection

First you must [export the collection to a file](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#exporting-postman-data). Use v2.1 when doing so.

Here's a sample Postman collection that you can use:

File: postman_employee.json
```json
{
        "info": {
                "_postman_id": "042689b4-61dc-4697-85e6-72d47adc0678",
                "name": "Free Test API",
                "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "item": [
                {
                        "name": "Employee data",
                        "request": {
                                "method": "GET",
                                "header": [],
                                "url": {
                                        "raw": "http://dummy.restapiexample.com/api/v1/employees",
                                        "protocol": "http",
                                        "host": [
                                                "dummy",
                                                "restapiexample",
                                                "com"
                                        ],
                                        "path": [
                                                "api",
                                                "v1",
                                                "employees"
                                        ]
                                }
                        },
                        "response": []
                }
        ],
        "protocolProfileBehavior": {}
}
```

### Generate the contract

```bash
> specmatic import <postman collection file>.json
```

This command will read the Postman collection, and write the new specmatic file into "specmatic file.json" as specified in the command.

### Authenticated APIs in Postman

If any of the APIs in the Postman collection require authentication, Specmatic will not be able to invoke them directly with the needed credentials.

Instead, from within Postman, plug in in the required credentials, invoke the API, and save the request and response as an example.

Then export the collection, and import it into Qontract.

Qontract will still fail to invoke the API, but it will see and convert the examples. You can then adjust the contract as needed.
