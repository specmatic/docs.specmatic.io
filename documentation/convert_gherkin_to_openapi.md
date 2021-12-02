---
layout: default
title: Convert Gherkin To OpenAPI
parent: Documentation
nav_order: 25
---
Convert Gherkin To OpenAPI
==========================

OpenAPI is now the primary format supported by Specmatic for RESTful APIs.

Specmatic can convert contracts using the older format to OpenAPI 3.0.x, from 0.32.0 onwards.

The command is `java -jar specmatic.jar to-openapi /path/to/contract/file.spec`.

For example, here's a contract for an API that generates a random number.

```gherkin
#file name: random.spec

Feature: Random API

  Scenario: Random number
    When GET /
    Then status 200
    And response-body (number)
```

Start up Command Prompt (Windows) or Terminal (MacOS). cd into the directory containing this file.

Convert it to yaml using `java -jar specmatic.jar to-openapi ./random.spec`

NOTE: remember to use the path to specmatic.jar in the above command.

The convert generates a new file named random.yaml.

Here's what it contains:

```yaml
---
openapi: "3.0.1"
info:
  title: "Random API"
  version: "1"
paths:
  /:
    get:
      summary: "Random number"
      parameters: []
      responses:
        "200":
          description: "Random number"
          content:
            text/plain:
              schema:
                type: "number"
```

The following features are not yet supported:
1. Multipart responses
2. x-www-form-urlencoded data with more than one field
3. XML contracts

For SOAP, simply replace the .spec or .qontract file with the original WSDL file. Read more about it [here](/documentation/authoring_contracts.html#importing-a-wsdl-file).


