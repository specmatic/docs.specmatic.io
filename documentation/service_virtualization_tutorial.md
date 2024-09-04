---
layout: default
title: Service Virtualization
parent: Documentation
nav_order: 6
---
Service Virtualization
======================

- [Service Virtualization](#service-virtualization)
  - [Pre-requisites](#pre-requisites)
  - [Inline Examples](#inline-examples)
  - [Externalizing Example Data](#externalizing-example-data)
  - [Intelligent Service Virtualisation - Example cannot go out of sync](#intelligent-service-virtualisation---example-cannot-go-out-of-sync)
  - [Strict Mode](#strict-mode)
  - [Data Type-Based Examples](#data-type-based-examples)
  - [Plain Text Request Bodies - Examples With Regular Expressions](#plain-text-request-bodies---examples-with-regular-expressions)
  - [Correlated Request And Response Values](#correlated-request-and-response-values)
    - [Direct Substitution - Copying Values From Request To Response](#direct-substitution---copying-values-from-request-to-response)
    - [Data Lookup](#data-lookup)
  - [Partial Examples](#partial-examples)
    - [Partial Request Examples](#partial-request-examples)
    - [Partial Response Examples](#partial-response-examples)
  - [Inject Response Values From An External Dictionary](#inject-response-values-from-an-external-dictionary)
  - [Delay Simulation](#delay-simulation)
    - [Example Specific Delay](#example-specific-delay)
    - [Global Delay](#global-delay)
  - [SSL / HTTPS  Stubbing](#ssl--https--stubbing)
    - [Auto-Generated Cert Store](#auto-generated-cert-store)
    - [Bring Your Own Key Store](#bring-your-own-key-store)
  - [Dynamic Expectations (a.k.a. Dynamic Stubbing Or Mocking) - Setting Expecations Over Specmatic Http Api](#dynamic-expectations-aka-dynamic-stubbing-or-mocking---setting-expecations-over-specmatic-http-api)
    - [Context](#context)
    - [Expectations Http Endpoint](#expectations-http-endpoint)
    - [Anatomy of a Component / API Test](#anatomy-of-a-component--api-test)
  - [Programmatically Starting Stub Server Within Tests](#programmatically-starting-stub-server-within-tests)
  - [Transient Expectations (a.k.a. Transient Stubs)](#transient-expectations-aka-transient-stubs)
    - [Setting transient expectations](#setting-transient-expectations)
    - [Clearing Transient Expectations](#clearing-transient-expectations)
  - [Externalised Response Generation](#externalised-response-generation)
  - [Hooks](#hooks)
  - [Precedence Across Types Of Examples](#precedence-across-types-of-examples)
  - [Checking Health Status Of Stub Server](#checking-health-status-of-stub-server)
      - [Example `curl` Request:](#example-curl-request)
  - [Sample Java Project](#sample-java-project)


## Pre-requisites

- Create a directory named `specmatic` in your home directory.
- Make sure you have installed Specmatic. Explore the [Getting Started](/documentation/service_virtualization_tutorial.html) page for all options for installing Specmatic.

## Inline Examples

- Create a file named `employees.yaml` in the `specmatic` directory with the following contents.

  ```yaml
  openapi: 3.0.0
  info:
    title: Employees
    version: '1.0'
  servers: []
  paths:
    '/employees':
      post:
        summary: ''
        requestBody:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Employee'
              examples:
                CREATE_EMPLOYEE_SUCCESS:
                  value:
                    name: Jill Doe
                    department: Engineering
                    designation: Director
        responses:
          '201':
            description: Employee Created Response
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    id:
                      type: integer
                  required:
                    - id
                examples:
                  CREATE_EMPLOYEE_SUCCESS:
                    value:
                      id: 10
  components:
    schemas:
      Employee:
        type: object
        required:
          - name
          - department
          - designation
        properties:
          name:
            type: string
          department:
            type: string
          designation:
            type: string
  ```

- In the same directory, create a file named `specmatic.yaml` with the following contents:

  ```yaml
  sources:
    - provider: filesystem
      stub:
        - employees.yaml
  ```

- `cd` into the `specmatic` directory and run the following command:

    ```shell
    java -jar specmatic.jar stub
    ```

    Alternatively, you can also run the same command with the Docker image:

    ```shell
    docker run znsio/specmatic stub
    ```

- In a new tab, run the following curl command:

  ```shell
  curl -X POST -H 'Content-Type: application/json' -d '{"name": "Jill Doe", "department": "Engineering", "designation": "Director"}' http://localhost:9000/employees
  ```

- You should get the following response back:

  ```json
  {
    "id": 10
  }
  ```

- Specmatic ties the **named example** `CREATE_EMPLOYEE_SUCCESS` listed under the request parameters and the response sections of the OpenAPI spec to create a test. 
- Here's a detailed breakdown of the contract test:
  - **Request:** Specmatic uses the request body in the request example named `CREATE_EMPLOYEE_SUCCESS` to match the incoming HTTP request.
  - **Response:** Once matched, Specmatic looks for an example with same name (`CREATE_EMPLOYEE_SUCCESS`) under responses. In this case the response code happens to be 200, so that is the response that Specmatic will return.

## Externalizing Example Data

It may not always be possible to add examples inline in the OpenAPI specifications. And sometimes certain examples may not belong in the API specification. In such cases, we can add examples outside the spec in the form of JSON files.

Let's see how this is done.

- Run the `examples` command:

  ```shell
  java -jar specmatic.jar examples employees.yaml
  ```

  Alternatively, you can also run the same command with the Docker image:

  ```shell
  docker run znsio/specmatic examples employees.yaml
  ```

- It generates a request-response mapping JSON file in the `employees_examples` directory containing an example of the API in the spec.
  - The directory name follows the format `<spec file name without extension>_examples`.
  - The example file name as generated indicates the operation it was generated from. In fact, the name is not limited to any format. You can choose a name that is meaningful to you.

- Open the file, and you'll see this:

  ```json
  {
      "http-request": {
          "path": "/employees",
          "method": "POST",
          "headers": {
              "Content-Type": "application/json"
          },
          "body": {
              "name": "Jill Doe",
              "department": "Engineering",
              "designation": "Director"
          }
      },
      "http-response": {
          "status": 201,
          "body": {
              "id": 479
          },
          "status-text": "Created",
          "headers": {
              "Content-Type": "application/json"
          }
      }
  }
  ```

- Specmatic stub recognizes the `_examples` directory naming convention, and loads files in this directory automatically on startup.
- Now let's update the request section to suit our needs, by modifying the value of `name` to "Jack Sprat", and the value of `department` to "Sales". And in the response, let us modify the value of `id` to 20, like so:

  ```json
  {
      "http-request": {
          "path": "/employees",
          "method": "POST",

          "headers": {
              "Content-Type": "application/json"
          },
          
          "body": {
              "name": "Jack Sprat",
              "department": "Sales",
              "designation": "Director"
          }
      },
      "http-response": {
          "status": 201,
          
          "body": {
              "id": 20
          },
          
          "headers": {
              "Content-Type": "application/json"
          }

          "status-text": "Created",
      }
  }
  ```

- Kill the stub (`Ctrl+C`) if it is running, and start it again.
  - You will see that file name is mentioned in the startup logs.
- In a new tab, run the following curl command:

  ```shell
  curl -X POST -H 'Content-Type: application/json' -d '{"name": "Jack Sprat", "department": "Sales", "designation": "Director"}' http://localhost:9000/employees
  ```

- Specmatic stub will response with this payload:

  ```json
  {
    "id": 20
  }
  ```

**Note:** You may add more example files into the `employees_examples` directory. There is no limit to the number of example files that can be added.

## Intelligent Service Virtualisation - Example cannot go out of sync

An important and unique feature of Specmatic is that it constantly validates both inline and external examples against the specification to make sure they are always aligned.

Let's try this feature out.

Create a file named `out-of-sync.json` with the following contents:

  ```json
  {
    "http-request": {
      "path": "/employees",
      "method": "POST",

      "headers": {
        "Content-Type": "application/json"
      },
      
      "body": {
        "name": "Janet",
        "department": "Sales",
        "designation": "Director"
      }
    },
    "http-response": {
      "status": 201,
        
      "body": {
        "id": "abc123"
      },
      
      "headers": {
        "Content-Type": "application/json"
      }

      "status-text": "Created",
    }
  }
  ```

- Note: the value of `id` in the response is a string in the example, but an integer in the specification.
- Now when you start the stub server, you'll see the following error message in the log:

  ```text
  In scenario ". Response: Employee Created Response"
  API: POST /employees -> 201

    >> REQUEST.BODY.department

        Contract expected string but stub contained 10 (number)
  ```

- Specmatic's stub rejected the example because of the mismatch. Let us ascertain the same by running the following curl command:

  ```shell
  curl -X POST -H 'Content-Type: application/json' -d '{"name": "Janet", "department": "Sales", "designation": "Director"}' http://localhost:9000/employees
  ```

- You'll get this response:

  ```json
  {
      "id": 783
  }
  ```

- As you can see the response contains a generated value for the id, rather than "abc123", which was in the invalid example.
- Since the invalid example was rejected by Specmatic stub, the response is a value generated based on the response in the specification.

## Strict Mode

Suppose you do not wish Specmatic to return an auto-generated response when there are no matching examples. You can run Specmatic stub server in `strict` mode.

Let's try this out.

- Start Specamtic stub with the `--strict` flag, using the following command:

  ```shell
  java -jar specmatic.jar --strict
  ```

  Alternatively, you can also run the same command with the Docker image:

  ```shell
  docker run znsio/specmatic --strict
  ```

- Now run the following curl command:

  ```shell
  curl -X POST -H 'Content-Type: application/json' -d '{"name": "Janet", "department": "Sales", "designation": "Director"}' http://localhost:9000/employees
  ```

- Specmatic will return a 400, with a detailed error message.

- To recap, in `strict` mode, Specmatic will only respond to requests that have matching examples, inline or external.

## Data Type-Based Examples

Sometimes the exact value may not be that important in an example.

For example, suppose that in the request we expect, the important values to be matched against `department` and `designation`. `name` must be present but we don't particularly care about the exact value.

Let's see how we can formulate an example that meets these requirements.

- Create a new file in the `employees_examples` directory named `any_name.json`:

  ```json
  {
    "http-request": {
      "path": "/employees",
      "method": "POST",

      "headers": {
        "Content-Type": "application/json"
      },
      
      "body": {
        "name": "(string)",
        "department": "Sales",
        "designation": "Director"
      }
    },
    "http-response": {
      "status": 201,
        
      "body": {
        "id": 30
      },
      
      "headers": {
        "Content-Type": "application/json"
      }

      "status-text": "Created",
    }
  }
  ```

- Start the Specmatic stub and execute the following command, which has the `name` "Janet":

  ```shell
  curl -X POST -H 'Content-Type: application/json' -d '{"name": "Janet", "department": "Engineering", "designation": "Director"}' http://localhost:9000/employees
  ```

- You'll get this response:

  ```json
  {
      "id": 30
  }
  ```

- Modify the `name` to "Justin", or any other name, and you'll get the same response.
  - This is because Specmatic just checks that the `name` in your curl request is a string. It doesn't care about the exact value.
- But modify the value of `department` in the curl command to "Facilities".
  - This time round, the request does not match the example, because the values of `department` in the example and the request are different ("Sales" and "Engineering" respectively).
  - Since no example available matches the incoming request, a response is generated based on the specification and returned.

## Plain Text Request Bodies - Examples With Regular Expressions

For specifications where the request body is a string, you may find it helpful to use a regular expression in the example.

Let's try this out.

Create a new specification file named employee_sql.yaml:

```yaml
openapi: 3.0.0
info:
  title: SQL Query API
  version: '1.0'
paths:
  /employee-query:
    post:
      summary: Run an SQL query
      requestBody:
        required: true
        content:
          text/plain:
            schema:
              type: string
              description: The SQL query to be executed
      responses:
        '200':
          description: Successful execution of the SQL query
          content:
            application/json:
              schema:
                type: object
                required:
                  - id
                  - name
                properties:
                  id:
                    type: integer
                    description: The employee ID
                  name:
                    type: string
                    description: The employee name

```

- Note: the request body is a string holding an SQL query.
- Create a directory named `employee_sql_examples`. Create a file in this directory named `select_employee_by_id.json` with the following contents:

  ```json
  {
    "http-request": {
      "path": "/employee-query",
      "method": "POST",

      "headers": {
        "Content-Type": "application/json"
      },
      
      "body": "(string)",
      "bodyRegex": "^SELECT .*id = 1$"
    },
    "http-response": {
      "status": 200,
        
      "body": {
        "id": 1,
        "name": "John Doe"
      },
      
      "headers": {
        "Content-Type": "application/json"
      },

      "status-text": "OK"
    }
  }
  ```

- Add `employee_sql.yaml` to the `stub` list in `specmatic.yaml`, like so:

  ```yaml
  sources:
    - provider: filesystem
      stub:
        - employees.yaml
        - employee_sql.yaml
  ```

- Run the following curl command:

  ```shell
  curl -X POST -H 'Content-Type: text/plain' -d 'SELECT * from employee where id = 1' http://localhost:9000/employee-query
  ```

- You'll get this response:

  ```json
  {
      "id": 1,
      "name": "John Doe"
  }
  ```

- Try changing the table name, or any other part of the query. Just make sure that the query starts with `SELECT` and ends with `id = 1`, as per the regex in `bodyRegex` in the example, and you'll get the same response.

## Correlated Request And Response Values

Sometimes, your application may require the request and response to be coordinated coherently. This coordination may take two different forms which we shall explore below.

In preparation, let's update our employees.yaml specification with the following content:

  ```yaml
  openapi: 3.0.0
  info:
    title: Employees
    version: '1.0'
  servers: []
  paths:
    /employees:
      patch:
        requestBody:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Employee'
        responses:
          '200':
            description: Employee Updated Response
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/EmployeeResponse'
  components:
    schemas:
      Employee:
        type: object
        required:
          - employeeCode
        properties:
          employeeCode:
            type: string
          name:
            type: string
          department:
            type: string
          designation:
            type: string
      EmployeeResponse:
        allOf:
          - $ref: '#/components/schemas/Employee'
          - type: object
            required:
              - id
              - employeeCode
            properties:
              id:
                type: integer
              employeeCode:
                type: string
  ```

Since we have changed the spec, remove all the examples in `employees_examples`, as they will now be invalid.

### Direct Substitution - Copying Values From Request To Response

- In the `employees_examples` directory, add a file named `direct_substitution.json` with the following content:

  ```json
  {
      "http-request": {
          "method": "PATCH",
          "path": "/employees",
          "body": {
              "name": "Jake",
              "employeeCode": "(EMPLOYEE_CODE:string)"
          }
      },
      "http-response": {
          "status": 200,
          "body": {
              "id": 10,
              "name": "Jake",
              "employeeCode": "$(EMPLOYEE_CODE)",
              "department": "Sales",
              "designation": "Associate"
          }
      }
  }
  ```

- Execute the following `curl` command:

  ```shell
  curl -X PATCH -H 'Content-Type: application/json' -d '{"name": "Jake", "employeeCode": "abc123"}' http://localhost:9000/employees
  ```

- You'll get this response:

  ```json
  {
      "id": 10,
      "name": "Jake",
      "employeeCode": "abc123",
      "department": "Sales",
      "designation": "Associate"
  }
  ```

- Here's what's happening.
  - The value of `employeeCode` in the incoming curl request is stored to a variable named `EMPLOYEE_CODE`, due to `"employeeCode": "(EMPLOYEE_CODE:string)"`.
  - Then the value stored in `EMPLOYEE_CODE` is used as the value of `employeeCode` in the response, due to `"employeeCode": "$(EMPLOYEE_CODE)"`.

- Try the same curl command again, but change the `employeeCode`. You'll find that any `employeeCode` sent in the request will be reflected in the response.

### Data Lookup

Sometimes, the values of multiple response keys which have very different values need to be coordinated with a single request value, and for this the data look feature is quite useful.

Let's try this out.

- Add a new file into the `employees_examples` directory named `data_lookup.json` with the following contents:

  ```json
  {
      "http-request": {
          "method": "PATCH",
          "path": "/employees",
          "body": {
              "employeeCode": "(EMPLOYEE_CODE:string)",
              "department": "(DEPARTMENT:string)"
          }
      },
      "http-response": {
          "status": 200,
          "body": {
              "id": 10,
              "employeeCode": "$(EMPLOYEE_CODE)",
              "name": "Jack",
              "department": "$(DEPARTMENT)",
              "designation": "$(dataLookup.departments[DEPARTMENT].desig)"
          }
      },
      "dataLookup": {
          "departments": {
              "Sales": {
                  "desig": "Associate"
              },
              "Engineering": {
                  "desig": "Manager"
              }
          }
      }
  }
  ```

- Observe the value of `designation` in the response. Specmatic will resolve this expression at runtime on receiving a request that matches the request in this example.

- First let's see it in action. Execute this curl command:

  ```shell
  curl -X PATCH -H 'Content-Type: application/json' -d '{"department": "Sales", "employeeCode": "abc123"}' http://localhost:9000/employees
  ```

- You'll get the following response, in which the value of `designation` is "Associate", as per the lookup.

  ```json
  {
      "id": 10,
      "name": "Jack",
      "employeeCode": "abc123",
      "department": "Sales",
      "designation": "Associate"
  }
  ```

- Note: The curl request matched the example request, so Specmatic loaded the corresponding response in the example, evaluated the expression `$(dataLookup.departments[DEPARTMENT].desig)` to get value of `designation` (which turned out to be "Associate"), evaluated the direct substitution expressions to get the values of `employeeCode` and `department`, and returned this response to the caller.

- Specmatic evaluates the expression `$(dataLookup.departments[DEPARTMENT].desig)` from the example response using the following steps:
  - Access the `dataLookup` object (you'll find it in the example JSON).
  - Retrieve the `departments` collection from the `dataLookup` object.
  - Select the department corresponding to the value of the variable `DEPARTMENT` from the departments collection.
    - In this case, the value of `DEPARTMENT` is set to "Sales" (see the section on Direct Substitution above if you don't understand how that came about).
  - Access the `desig` property of the selected department.
- It's the value of the `desig` property that gets used as the value of `designation` in the response.

- The format of these expressions is fixed: `top-level-object.collection[LOOKUP_VARIABLE_NAME].property`
  - The names themselves, such as `dataLookup`, `departments`, `desig` are not restricted to any format. You may use names that are meaningful to you.

- Next execute this curl command:

  ```shell 
  curl -X PATCH -H 'Content-Type: application/json' -d '{"department": "Engineering"}' http://localhost:9000/employees
  ```

- You will get the following response, in which the value of `designation` is "Manager", as per the lookup.

  ```json
  {
    "id": 10,
    "name": "Jack",
    "employeeCode": "abc123",
    "department": "Engineering",
    "designation": "Manager"
  }
  ```

- You can use as many collections and properties as you like in the `dataLookup` data object.

## Partial Examples

This feature let's you focus on the keys that need, allowing Specmatic to fill in the missing details.

### Partial Request Examples

For example, suppose I want to setup a response for all requests with `name` set to "George". I don't care about the specific values of `name`, `employeeCode` (which is mandatory), `department` or `designation` in the request.

- Create a file in `employees_examples` named partial.json, with the following contents:

  ```json
  {
      "partial": {
          "http-request": {
              "method": "PATCH",
              "path": "/employees",
              "body": {
                  "name": "George"
              }
          },
          "http-response": {
              "status": 200,
              "body": {
                  "id": 10,
                  "employeeCode": "abc123",
                  "name": "George",
                  "department": "Sales",
                  "designation": "Manager"    
              }
          }
      }
  }
  ```

- Note: In the request, the example only contains `name`. But because this is a `partial` example, Specmatic knows that `employeeCode` is mandatory and will validate the incoming request accordingly, despite it being missing in the example.

- Start the stub, and execute the following curl command:

```shell
curl -X PATCH -H 'Content-Type: application/json' -d '{"name": "George", "employeeCode": "abc12dd3"}' http://localhost:9000/employees
```

- You'll get this response:

```json
{
    "id": 10,
    "employeeCode": "abc123",
    "name": "George",
    "department": "Sales",
    "designation": "Manager"
}
```

- Try the same but vary status code. As long as the `name` is "George", you will get the above response.

### Partial Response Examples

The same idea extends to the response.

- Replace the content of `employees_examples/partial.json` with the following contents:

  ```json
  {
      "partial": {
          "http-request": {
              "method": "PATCH",
              "path": "/employees",
              "body": {
                  "name": "George"
              }
          },
          "http-response": {
              "status": 200,
              "body": {
                  "name": "George",
                  "department": "Sales",
                  "designation": "Manager"    
              }
          }
      }
  }
  ```

- Note that the two mandatory keys in the response named `id` and `employeeCode` are omitted from the example.
- But because it's a partial example, when you make the execute the previous curl command, Specmatic will autogenerate values for `id` and `employeeCode` from their schemas in the specification.

## Inject Response Values From An External Dictionary

Sometimes it's helpful to just formulate the example without certain concrete values, and have them injected later on. The dictionary feature can be used to do this.

Let's see how this works.

- Create a new example file in the `employees_examples` directory named `lookup_dictionary.json` with the following contents:

  ```json
  {
      "http-request": {
          "method": "PATCH",
          "path": "/employees",
          "body": {
              "employeeCode": "pqrxyz",
              "name": "Jamie"
          }
      },
      "http-response": {
          "status": 200,
          "body": {
              "id": 10,
              "employeeCode": "pqrxyz",
              "name": "Jamie",
              "department": "(string)",
              "designation": "(string)"
          }
      }
  }
  ```

- Update your `specmatic.yaml` file to declare the dictionary:

  ```yaml
  sources:
    - provider: filesystem
      stub:
        - employees.yaml
  stub:
    dictionary: ./dictionary.json
  ```

- Start the stub and execute this curl command:

  ```shell
  curl -X PATCH -H 'Content-Type: application/json' -d '{"name": "Jamie", "employeeCode": "pqrxyz"}' http://localhost:9000/employees
  ```

- You'll get this response:

  ```json
  {
      "id": 10,
      "name": "Jamie",
      "employeeCode": "pqrxyz",
      "department": "Sales",
      "designation": "Associate"
  }
  ```

- Note: we did not provide "Sales" or "Associate" as the value of "department" or "designation" respectively. Those were looked up in the dictionary.

This feature also supports the following lookup syntax:

```json
{
  "person.name": "Jackie",
  "addresses[*].street": "Baker Street",
  "past_companies[0].name": "Acme Inc"
}
```

How this works:

| -- | -- |
| Syntax | Turns | Into |
| -- | -- |
| `"person.name": "Jackie"` | `{"person": {"name": "(string)" } }` | `{"person": {"name": "Jackie" } }` |
| `"addresses[*].street": "Baker Street"` | `{ "addresses": [ {"street": "(string)" }, {"street: "(string)" }]}` | `{ "addresses": [ {"street": "Baker Street" }, {"street: "Baker Street" }]}` |
| `"past_companies[0].name": "Acme Inc"` | `{ "past_companies": [ {"name": "(string)" }, {"name: "(string)" }]}` | same as above but only for the 0th element of `past_companies` |

This syntax can be nested to any depth, e.g. `person.addresses[*].street: "Baker Street"`

## Delay Simulation

Specmatic allows granular control over simulating a slow response for certain requests.

### Example Specific Delay

Let us create another expectation file on the same lines as [expectation.json](/documentation/service_virtualization_tutorial.html#fix-the-response-to-products10) in the products-api_examples folder and call it expectation-with-delay.json with below content.

```yaml
{
  "http-request": {
    "method": "GET",
    "path": "/products/11"
  },
  "http-response": {
    "status": 200,
    "body": {
      "name": "Slow Soap",
      "sku": "slow1234"
    }
  },
  "delay-in-milliseconds": 3000
}
```

We have set the delay to 3 seconds here. Once the Specmatic stub server has loaded this expectation, time the request for product id 11 and you should see a 3 second delay.

```shell
% time curl http://localhost:9000/products/11
{
    "name": "Slow Soap",
    "sku": "slow1234"
}curl http://localhost:9000/products/11  0.01s user 0.01s system 0% cpu 3.082 total
```

All other requests, other than the specific request (product id 11) where a delay has been setup, will have either no delay or fallback to global delay.

### Global Delay

A Global delay can be applied to all requests handled by service virtualization. By configuring the `delayInMilliseconds` parameter in Specmatic Config, 
you can simulate response times with the specified delay in milliseconds.

{% tabs stubs %}
{% tab stubs specmatic.json %}
```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "https://github.com/znsio/specmatic-order-contracts.git",
      "consumes": [
        "io/specmatic/examples/store/openapi/api_order_v3.yaml"
      ]
    }
  ],
  "stub": {
    "delayInMilliseconds": 3000
  }
}
```
{% endtab %}
{% tab stubs specmatic.yaml %}
```yaml
sources:
  - provider: git
    repository: https://github.com/znsio/specmatic-order-contracts.git
    consumes:
      - io/specmatic/examples/store/openapi/api_order_v3.yaml
stub:
  delayInMilliseconds: 3000
```
{% endtab %}
{% endtabs %}

**Note:** If the delay is specified in the example file, it will be used to simulate response times for that specific example. 
Otherwise, the global delay will be applied.

## SSL / HTTPS  Stubbing

There are multiple ways to run the Specmatic Stub with SSL.

### Auto-Generated Cert Store

This is the quickest approach.

```shell
java -jar specmatic.jar stub --httpsKeyStoreDir=<directory to create keystore> --port=443 product-api.yaml
```

Alternatively, you can also run the same command with the Docker image:

```shell
docker run znsio/specmatic stub --httpsKeyStoreDir=<directory to create keystore> --port=443 product-api.yaml
```

This will create a `specmatic.jks` file in the dir that you mentioned above and you can now access the stub over https.

### Bring Your Own Key Store

If you already have a keystore and self signed certificate you can pass it to Specmatic through below command options.

```shell
% specmatic stub --help
...
      --httpsKeyStore=<keyStoreFile>
                             Run the proxy on https using a key in this store
      --httpsKeyStorePassword=<keyStorePassword>
                             Run the proxy on https, password for pre-existing
                               key store
      --httpsPassword=<keyPassword>
                             Key password if any
```

## Dynamic Expectations (a.k.a. Dynamic Stubbing Or Mocking) - Setting Expecations Over Specmatic Http Api

### Context
It is not always possible to know ahead of time what expecation data needs to be setup. Example: Consider below scenario
* Let us say our system under test needs to lookup the SKU value from another service (over which we do not have control or cannot mock) before creating products
* In this scenario we will be unable to create the expectation json file with any specific value of SKU since we will only know this at test runtime / dynamically

**Dynamic Stubs** are helpful in such scenarios which involve a **work flow** with multiple steps where the input of a step depends on output of its previous step.

### Expectations Http Endpoint

Specmatic stub server can accept expectation json through below http endpoint.

```shell
http://localhost:9000/_specmatic/expectations
```

Please see <a href="/documentation/SpecmaticExpectations-postman_collection.json" download>postman collection</a> for reference.

Specmatic will verify these expecations against the OpenAPI Specifications and will only return a 2xx response if they are as per API Specifications. Specmatic returns 4xx reponse if the expectation json is not as per the OpenAPI Specifications.

### Anatomy of a Component / API Test

<img alt="Anatomy of a Component / API Test" src="https://specmatic.in/wp-content/uploads/2022/09/Contact-as-stub.png" />

Please see this [video](https://youtu.be/U5Agz-mvYIU?t=998) for reference.

The above image shows how Specmatic Smart Mocking fits into your Component Test. A good component test isolates the system / component under test from its dependencies. Here Specmatic is emulating the dependencies of the mobile application thereby isolating it.

**API Tests are just Component Tests where the System Under Test is a Service / API**. Here is an [example](https://github.com/znsio/specmatic-order-bff-java/blob/main/src/test/kotlin/com/component/orders/ApiTests.kt) of how you can leverage Specmatic dynamic mocking in an API Test. Below are the pieces involved.
* **System Under Test** - [Find Available Products Service](https://github.com/znsio/specmatic-order-bff-java/blob/main/src/main/kotlin/com/component/orders/controllers/Products.kt) - Invokes products API to get all products and filters out products where inventory is zero.
* **Dependency** - Products API mocked by Specmatic. Specmatic is setup to leverage [OpenAPI Specification of Products API](https://github.com/znsio/specmatic-order-contracts/blob/main/io/specmatic/examples/store/openapi/api_order_v3.yaml) in the [central contract repo](https://github.com/znsio/specmatic-order-contracts) through [specmatic.yaml](https://github.com/znsio/specmatic-order-bff-java/blob/main/specmatic.yaml) configuration.

Let us analyse each phase of this API test.
* **Arrange** - In this step, we setup Specmatic stub server with expectation json through Specmatic http endpoint to emulate the Products API to return expected response. We also verify that Specmatic has accepted this expectation data by asserting that the response code is 2xx. This confirms that are our expectation data is in line with the OpenAPI Specification of Products OpenAPI Specification.
* **Act** - Here the test invokes System Under Test to exercise the functionality we need to test. This inturn results in the System Under Test invoking its dependency (Products Service) which is being emulated by Specmatic. Specmatic returns the response we have setup in the previous step to the System Under Test. System Under Test processes this data and responds to API Test.
* **Assert** - We now verify the response from System Under Test to ascertain if it has returned the correct response.

## Programmatically Starting Stub Server Within Tests

{% tabs virtualization %}
{% tab virtualization java %}
If your tests are written in a JVM based language, you can start and stop the stub server within your tests programmatically.

Add `specmatic-core` jar dependency with scope set to test since this need not be shipped as part of your production deliverable.

```
<dependency>
    <groupId>io.specmatic</groupId>
    <artifactId>specmatic-core</artifactId>
    <version>{{ site.latest_release }}</version>
    <scope>test</scope>
</dependency>
```

Now you can import the utilty to create the stub server. Below code snippets are in Kotlin. However the overall concept is the same across all JVM languages such as Clojure, Scala or plain Java.

```kotlin
import io.specmatic.stub.createStub
```

This utility can now be used in your test ```setup``` / ```beforeAll``` method to start the stub server. Specmatic automatically looks for your [Specmatic configuration](/documentation/configuration.html) file in project root directory / classpath to locate your API Specification files that need to run as part of the stub server.

```kotlin
@BeforeAll
@JvmStatic
fun setUp() {
    stub = createStub()
}
```

We can now programmatically set [dynamic expectations](/documentation/service_virtualization_tutorial.html#dynamic-mocking---setting-expecations-over-specmatic-http-api) on the ```stub``` with the ```setExpectation(<expectationJson>)``` method where ```<expecationJson>``` is in the same format as [static expecations](/documentation/service_virtualization_tutorial.html#fix-the-response-to-products10)

```java
stub.setExpectation(expectationJson);
```

If you have several such JSON expectation files that you would like to setup at once, you can pass a list of files or dir containing these expectation JSON files while creating the stub.

```kotlin
httpStub = createStub(listOf("./src/test/resources"))
```

The above `createStub()` function creates your Specmatic HTTP stub with default host, port, etc. Below is an example with all values being passedin 

```kotlin
@BeforeAll
@JvmStatic
fun setUp() {
    stub = createStub(listOf("./src/test/resources"), "localhost", 8090, strict = true)
}
```

The last parameter (`strict = true`), enables **strict** mode where Specmatic HTTP Stub will only respond to requests where expectations have been set. For any other requests, `400 Bad Request` is returned.

And subsequently once your tests are done, you can shutdown the stub server as part of your ```teardown``` / ```afterAll``` method.

```kotlin
@AfterAll
@JvmStatic
fun tearDown() {
    service?.stop()
    stub.close()
}
```

Here is a complete example of Specmatic Contract Tests that leverages the above technique.

[Kotlin Example](https://github.com/znsio/specmatic-order-bff-java/blob/main/src/test/kotlin/com/component/orders/contract/ContractTests.kt)

Please note that this is only a utility for the purpose of convenience in Java projects. Other programming languages can simply run the Specmatic standalone executable just as easily. If you do happpen to write a thin wrapper and would like to contribute the same to the project, please refer to our [contribution guidelines](https://github.com/znsio/specmatic/blob/main/CONTRIBUTING.md).

{% endtab %}
{% tab virtualization python %}
If your tests are written in Python, you can start and stop the stub server within your tests programmatically.

1. **Install the Specmatic Python library**: Use pip, a package installer for Python, to install the Specmatic library.

   ```bash
   pip install specmatic
   ```

2. **Run Tests with a Stub**: If you want to run the tests with a stub, you can do so like this:

   ```python
   import os
   from specmatic.core.specmatic import Specmatic
   from your_project import app
   PROJECT_ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
   app_host = "127.0.0.1"
   app_port = 5000
   stub_host = "127.0.0.1"
   stub_port = 5000
   expectation_json_file = PROJECT_ROOT_DIR + '/test/data/expectation.json'

   Specmatic() \
       .with_project_root(PROJECT_ROOT_DIR) \
       .with_stub(stub_host, stub_port, [expectation_json_file]) \
       .with_wsgi_app(app, app_host, app_port) \
       .test(TestContract) \
       .run()
   ```

   In this example, we are passing an instance of wsgi app like flask. `stub_host`, `stub_port`, and `expectation_json_file` are the the host and port for the stub server, and the path to a JSON file containing expectations for the stub, respectively. Replace `app` with your Flask application object.

   Here are complete example of [Specmatic stub server](https://github.com/znsio/specmatic-order-bff-python/blob/main/test/test_contract.py) usage in Python.
{% endtab %}
{% endtabs %}

## Transient Expectations (a.k.a. Transient Stubs)

A transient mock disappears immediately after it has been exercised.

### Setting transient expectations

For example, create this stub file for products-api.yaml contract:

```json
{
  "http-stub-id": "123",
  "http-request": {
    "method": "GET",
    "path": "/storestatus",
  },
  "http-response": {
    "status": 200,
    "body": "open"
  }
}
```

Make an HTTP request to http://localhost:9000/storestatus with the GET method. The response says "open".

Now try the same request again. The response is a randomized string.

This is useful particularly when there are no distinguishing features of the request like in the above example, and we need to simulate a succession of calls to that API giving different responses.

### Clearing Transient Expectations

If the test fails and you need to start a new run of the test, you may need to clear all the transient mocks so that the two tests do not step on eachother's toes.

To do that, make an API call to the path /_specmatic/http-stub/<http-stub-token> with the DELETE verb.

To clear the transient mock in the above example, you would call http://localhost:9000/_specmatic/http-stub/123 with the DELETE verb.

## Externalised Response Generation

There may be circumstances where we need to compute the response or part of it based on the request in the expectation. Here is an example.

```yaml
openapi: 3.0.1
info:
  title: New Feature
  version: "1"
paths:
  /triple/{value}:
    get:
      summary: three times
      parameters:
      - name: value
        in: path
        required: true
        schema:
          type: number
      responses:
        "200":
          description: three times
          content:
            application/json:
              schema:
                type: number
```

This OpenAPI specification expects given input to be multiplied by three. It may not be possible to create expectation for each individual number. In this can we can create an expecation that can call an external command to which it can pass the incoming request and then return the value generated by that external command.

```json
{
    "http-request": {
        "method": "GET",
        "path": "/triple/(value:number)"
    },
    "http-response": {
        "status": 200,
        "body": "10",
        "externalisedResponseCommand": "<path to>/response.sh"
    }
}
```

In the above expecation file since we are providing the ```externalisedResponseCommand```, Specmatic will ignore the data inside ```http-reponse body```. Instead it call the command (```response.sh```) that is mentioned in ```externalisedResponseCommand``` and pass the incoming request as a environment variable ```SPECMATIC_REQUEST```.

```shell
#!/bin/bash

value=${SPECMATIC_REQUEST:20:1}

cat << EOF
{
    "status": 200,
    "body": $((value * 3)),
    "status-text": "OK",
    "headers": {
        "X-Specmatic-Result": "success",
        "Content-Type": "text/plain"
    }
}
EOF
```

The above shell script is just an example, the external command can be any executable / script / program which can read an environment variable. The example shell script here is reading the path parameter and multiplying it by three. The response of this script / command is returned as the response to the request.

## Hooks

Specmatic can modify the specification before loading it.

Let's see a quick example of a frontend that connects to the backend API through an API gateway.

Here is an API specification for a products API.

```yaml
openapi: 3.0.0
info:
  title: Sample Product API
  version: 0.0.1
servers:
  - url: http://localhost:8080
    description: Local
paths:
  /products:
    get:
      summary: Get Products
      description: Get Products
      parameters:
        - in: path
          name: id
          schema:
            type: number
          required: true
          description: Numerical Product Id
        - in: header
          name: X-internal-id
          schema:
            type: string
          required: true
          description: Internal customer id
      responses:
        '200':
          description: Returns Product With Id
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  required:
                    - name
                    - sku
                  properties:
                    name:
                      type: string
                    sku:
                      type: string
```


The expectation used by the consumer when stubbing out the Products API Backend looks something like this:

```json
{
  "http-request": {
    "headers": {
      "X-auth-token": "abc 123"
    },
    "method": "GET",
    "path": "/products"
  },
  "http-response": {
    "status": 200,
    "body": [
      {
        "name": "Rice",
        "sku": "sku123"
      }
    ]
  }
}
```

Note how the consumer sends the header `X-auth-token` in the request. The API gateway replaces it at runtime with `X-internal-id`, and forwards the request to the backend (note that the specification declares the header `X-internal-id`, not `X-auth-token`).

The specification as-is will not accept the above frontend expectation, without a small modification, which can be achieved using Specmatic's `stub_load_contract` hook.

Create the `specamtic.json` file with the following content:

```json
{
  "sources": [
    {
      "provider": "git",
      "stub": [
        "products.yaml"
      ]
    }
  ],
  "hooks": {
    "stub_load_contract": "python3 header.py"
  }
}
```

Create a file named header.py in the root of your project, with the following code:

```python
import os
import sys
import yaml

def main():
    # Read the name of the file from the environment variable
    file_name = os.getenv('CONTRACT_FILE')
    
    if not file_name:
        print("CONTRACT_FILE environment variable not set.")
        sys.exit(1)

    try:
        with open(file_name, 'r') as file:
            # Load the YAML file
            data = yaml.safe_load(file)
            
            # Modify the specified header
            paths = data.get('paths', {})
            products_path = paths.get('/products/{id}', {})
            get_operation = products_path.get('get', {})
            parameters = get_operation.get('parameters', [])
            
            for param in parameters:
                if param.get('in') == 'header' and param.get('name') == 'X-internal-id':
                    param['name'] = 'X-auth-token'
                    break

            # Print the modified data
            print(yaml.dump(data))
    except FileNotFoundError:
        print(f"File not found: {file_name}")
        sys.exit(2)
    except Exception as e:
        print(f"Error processing file: {e}")
        sys.exit(3)

if __name__ == "__main__":
    main()
```

This sample hook code replaces the header name `X-internal-id` with `X-auth-token`.

Now when Specmatic is run in stub mode, it will invoke the hook, pass the specification path to it using through the environment variable `CONTRACT_FILE`, and then load whatever specification is printed by the hook to standard output.

## Precedence Across Types Of Examples

There are now several ways in which to provide expectations.

1. Transient expectations
2. Dynamic expectations
3. Expectations from externalized examples
4. Expectations from examples in the specification

They are resolved in the order in which they appear above.

This means, if a request matches an example in the specification, but also matches a dynamic expectation, the response will be served from the dynamic expectations. Put differently, dynamic expectations override expectations from examples.

## Checking Health Status Of Stub Server

You can use the `/actuator/health` endpoint to verify if the stub server is operational. To do this, send a GET request to this endpoint using Postman or a curl command. 

The response will provide the current health status of the stub server, indicating whether it is **ready to handle requests**. 
This allows you to confirm that the stub server is up before routing any traffic through it.

#### Example `curl` Request:
```shell
curl -X GET http://<stub_server_url>/actuator/health
# Example successful response:
# {
#   "status": "UP"
# }
```

Here's the OpenAPI specification describing the `/actuator/health` endpoint.
```yaml
openapi: 3.0.3
info:
  title: Health Check API
  description: API for checking the health status of the stub server.
  version: 1.0.0
paths:
  /actuator/health:
    get:
      description: Returns the health status of the stub server.
      responses:
        '200':
          description: Health status of the stub server.
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum:
                      - UP
                    example: UP
```


## Sample Java Project

[https://github.com/znsio/specmatic-order-bff-java](https://github.com/znsio/specmatic-order-bff-java)

