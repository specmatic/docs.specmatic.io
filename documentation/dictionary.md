---
layout: default
title: Dictionary
parent: Documentation
nav_order: 8
---
# Dictionary


- [Dictionary](#dictionary)
  - [Structure](#structure)
    - [Basic Field Mapping](#basic-field-mapping)
    - [Nested Properties](#nested-properties)
    - [Handling Arrays](#handling-arrays)
      - [Nested properties in Arrays](#nested-properties-in-arrays)
    - [Referencing Other Schemas](#referencing-other-schemas)
  - [Dictionary Generation](#dictionary-generation)
    - [Specification](#specification)
    - [Examples](#examples)
    - [Generating the Dictionary](#generating-the-dictionary)
    - [Understanding the Dictionary](#understanding-the-dictionary)
  - [Dictionary with Contract Testing](#dictionary-with-contract-testing)
    - [Run the tests](#run-the-tests)
    - [Generative Tests](#generative-tests)
  - [Dictionary with Service Virtualization](#dictionary-with-service-virtualization)
    - [Run Service Virtualization](#run-service-virtualization)
    - [Making Requests](#making-requests)
  - [Dictionary with Examples](#dictionary-with-examples)

When Specmatic generates requests while running tests or responses while running as a stub and no examples have been provided, Specmatic will generate values for fields based on the schema in the OpenAPI specifications.

While the generated values will conform to the schema, they may not be meaningful from the point of view of your business domain. Also at times you want to have more control on the exact values that are used for certain fields.

This is where dictionary capability helps you define domain-specific values which Specmatic can use in the absence of examples. Specmatic will lookup values for fields in the dictionary defined by you while generating requests or responses.

The dictionary can be supplied in either `YAML` or `JSON` format. When the dictionary file name follows the convention `<spec-file-name>_dictionary.<format>`, Specmatic will automatically pick it up in the context of the corresponding API specification file.

## Structure

Fields are represented as nested properties that reflect the hierarchical structure of the schema.
- Each entry in the dictionary maps a schema field to either a `single value` or a `list of values`.
- If a single value is specified, it will be used directly.
- If a list is specified, one of those values will be selected at random.

### Basic Field Mapping

For example, given the `Employee` schema as follows:

```yaml
components:
  schemas:
    Employee:
      type: object
      properties:
        name:
          type: string
        age:
          type: integer
```

Corresponding dictionary entries for the `name` and `age` properties would be:

{% tabs dictionary %}
{% tab dictionary yaml %}
```yaml
Employee:
 name: John # Single-value
 age: # Multi-value
 - 20
 - 30
 - 40
```
{% endtab %}
{% tab dictionary json %}
```json
{
  "Employee": {
    "name": "John",
    "age": [20, 30, 40]
  }
}
```
{% endtab %}
{% endtabs %}

- The `name` field is supplied as a `single value` and will be used directly.
- The `age` field is supplied as a `list of values`, from which either `20`, `30`, or `40` will be `pseudo-random` selected.

### Nested Properties

For nested structures, properties are represented as nested keys, where each level corresponds to a that level in the schema hierarchy.
For example, given the `Employee` schema as follows:

```yaml
components:
  schemas:
    Employee:
      type: object
      required:
        - name
      properties:
        name:
          type: object
          required:
            - first_name
          properties:
            first_name:
              type: string
            last_name:
              type: string
```

Corresponding dictionary entries for the `first_name` and `last_name` property would be:

{% tabs nestedProperty %}
{% tab nestedProperty Single-Value %}
```yaml
Employee:
 name:
  first_name: John
  last_name: Smith
```
{% endtab %}
{% tab nestedProperty Multi-Value %}
```yaml
Employee:
 name:
  first_name: 
  - John
  - Jane
  last_name:
  - Smith
  - Doe
```
{% endtab %}
{% endtabs %}

### Handling Arrays

For properties that are arrays, the values must also be an array in the dictionary
For example, given the `Employee` schema as follows:

```yaml
components:
  schemas:
    Employee:
      type: object
      required:
        - aliases
      properties:
        aliases:
          type: array
          items:
            type: string
```

Corresponding dictionary entries for the `aliases` array would be:

{% tabs entireArray %}
{% tab entireArray Single-Value %}
```yaml
Employee:
  aliases:
  - "John"
  - "Jane"
```
The entire array will be used
{% endtab %}
{% tab entireArray Multi-Value %}
```yaml
Employee:
  aliases:
  - ["John", "Jane"] # JSON style array
  - - "May" # YAML style array
    - "Jones"
```
One of the nested arrays will be `pseudo-randomly` selected and used
{% endtab %}
{% endtabs %}

#### Nested properties in Arrays

For example, given the `Employee` schema as follows:
```yaml
components:
  schemas:
    Employee:
      type: object
      required:
        - aliases
      properties:
        aliases:
          type: array
          items:
            type: object
            required:
              - first_name
            properties:
              first_name:
```

Corresponding dictionary entries for the `first_name` property within the `aliases` array would be:

{% tabs nestedPropertyInArray %}
{% tab nestedPropertyInArray Single-Value %}
```yaml
Employee:
  aliases:
  - first_name: "John"
```
{% endtab %}
{% tab nestedPropertyInArray Multi-Value %}
```yaml
Employee:
  aliases:
  - first_name: "John"
  - first_name: "Jane"
```
{% endtab %}
{% endtabs %}
{: .note}
> This nesting behaves correctly because `first_name` is not defined as a top-level property in the schema.
> It is also not necessary to specify all properties of the object within the array, any missing properties will be populated by Specmatic.

### Referencing Other Schemas

When a schema component utilizes `$ref` to reference another schema component, the dictionary for the referenced schema component with be defined with that schema component as the root entry (in other words directly start with the fields of the referenced schema)<br/>
For example, given the following `Employee` and `Address` schemas:

```yaml
components:
  schemas:
    Employee:
      type: object
      required:
        - addresses
      properties:
        first_name:
          type: string
        addresses:
          $ref: '#/components/schemas/Address'
    Address:
      type: object
      required:
        - city
      properties:
        street:
          type: string
        city:
          type: string
```

Corresponding dictionary entries for any property defined in the `Address` schema would be:

{% tabs nestedProperty %}
{% tab nestedProperty Single-Value %}
```yaml
Address:
  city: "New York"
  street: "Broadway"
```
{% endtab %}
{% tab nestedProperty Multi-Value %}
```yaml
Address:
  city:
  - "New York"
  - "London"
  street:
  - "Broadway"
  - "High Street"
```
{% endtab %}
{% endtabs %}
Notice that the keys begin with `Address` instead than `Employee`, because the dictionary accesses the fields from the referenced schema. This makes for convenient dictionary definition without have to nest the values deeply.

## Dictionary Generation
{: .d-inline-block }

Commercial
{: .label }

Manually creating a dictionary can be quite an involved process, especially when the schema is complex. This is where, [specmatic-openapi](https://hub.docker.com/r/specmatic/specmatic-openapi) offers a convenient method to generate dictionaries from OpenAPI specifications and existing examples.

{: .note}
Automated dictionary generation is only available in the commercial version of Specmatic. For further details, please check the [pricing page](https://specmatic.io/pricing).

Let's take a look at how we can generate a dictionary from an OpenAPI specification along with existing examples

### Specification

Create an OpenApi Specification file named `employees.yaml` as follows:

```yaml
openapi: 3.0.0
info:
  title: Employees
  version: '1.0'
servers: []
paths:
  /employees:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EmployeeDetails'
      responses:
        '200':
          description: Employee Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Employee'
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    Employee:
      type: object
      required:
        - id
        - name
        - department
      properties:
        id:
          type: integer
        employeeCode:
          type: string
        name:
          type: string
        department:
          type: string
    EmployeeDetails:
      type: object
      required:
        - name
        - department
      properties:
        name:
          type: string
        department:
          type: string
    Error:
      type: object
      required:
        - message
      properties:
        message:
          type: string
```

### Examples

Given that we have an OpenAPI specification, we should add a few examples for the `/employees` endpoint. Create a folder named `employees_examples` in the same directory as your `employees.yaml` file

1. Let's create an example for `john` named `employee_john.json`:<br/><br/>
```json
{
    "http-request": {
        "path": "/employees",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": {
            "name": "John",
            "department": "IT"
        }
    },
    "http-response": {
        "status": 200,
        "body": {
            "id": 123,
            "employeeCode": "EMP123",
            "name": "John",
            "department": "IT"
        },
        "status-text": "OK",
        "headers": {
            "Content-Type": "application/json"
        }
    }
}
```

2. Similarly, create an example for `jane` named `employee_jane.json`:<br/><br/>
```json
{
    "http-request": {
        "path": "/employees",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": {
            "name": "Jane",
            "department": "HR"
        }
    },
    "http-response": {
        "status": 200,
        "body": {
            "id": 456,
            "employeeCode": "EMP456",
            "name": "Jane",
            "department": "HR"
        },
        "status-text": "OK",
        "headers": {
            "Content-Type": "application/json"
        }
    }
}
```

3. Now let's create a bad-request example named `bad_request.json`, where we've mutated the `department` field:<br/><br/>
```json
{
    "http-request": {
        "path": "/employees",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": {
            "name": "James",
            "department": 123
        }
    },
    "http-response": {
        "status": 400,
        "body": {
            "message": "BAD REQUEST - Invalid field: department, value: 123 <number>, expected: <string>"
        },
        "status-text": "Bad Request",
        "headers": {
            "Content-Type": "application/json"
        }
    }
}
```

The `_examples` suffix is a naming convention that indicates to Specmatic to look for examples in that directory.
{: .note}

### Generating the Dictionary

Create a file named `employees_dictionary.yaml` in the same directory as your `employees.yaml` file with an empty object i.e. `{}`, so we volume mount this file to the Docker container
{: .important }

After setting up, we can execute the `examples dictionary` command using the `specmatic-openapi` Docker image and provide the path to our `employees.yaml` file as shown below:

```shell
docker run --rm -v "$(pwd)/employees.yaml:/usr/src/app/employees.yaml" -v "$(pwd)/employees_examples:/usr/src/app/employees_examples" -v "$(pwd)/employees_dictionary.yaml:/usr/src/app/employees_dictionary.yaml" specmatic/specmatic-openapi examples dictionary --spec-file employees.yaml
```

### Understanding the Dictionary

After executing the command, the `employees_dictionary.yaml` file will be updated with the following contents:

```yaml
EmployeeDetails:
  name:
  - Jane
  - John
  - James
  department:
  - HR
  - IT
Employee:
  id:
  - 456
  - 123
  employeeCode:
  - EMP456
  - EMP123
  name:
  - Jane
  - John
  department:
  - HR
  - IT
Error:
  message:
  - 'BAD REQUEST - Invalid field: department, value: 123 <number>, expected: <string>'
```

- Note how the hierarchy of the dictionary reflects the schema outlined in the OpenAPI specification.
- Each key in the dictionary aligns with a property in the schema, while the values represent the possible values for that property.

We have not included the invalid value of `department` in the bad-request example. This filtering is not restricted to `4xx` examples,
the command will include only valid values in the dictionary, allowing it to be executed even with invalid examples.
{: .note }

## Dictionary with Contract Testing

The Dictionary can be utilized in contract testing, allowing Specmatic to use the values defined in the dictionary when generating requests for tests. To illustrate this process, we will use the previous specification and dictionary as an example. 

For the moment, we will remove the `employees_examples` directory to observe how contract testing operates without examples.

### Run the tests
Now to execute contract tests on the specification using the dictionary a service is required, we will utilize [service-virtualization](/documentation/service_virtualization_tutorial.html) for this purpose.

{% tabs test %}
{% tab test java %}
```shell
java -jar specmatic.jar stub employees.yaml
```
{% endtab %}
{% tab test npm %}
```shell
npx specmatic stub employees.yaml
```
{% endtab %}
{% tab test docker %}
```shell
docker run --rm --network host -v "$(pwd)/employees.yaml:/usr/src/app/employees.yaml" -v "$(pwd)/employees_dictionary.yaml:/usr/src/app/employees_dictionary.yaml" specmatic/specmatic stub "employees.yaml"
```
{% endtab %}
{% endtabs %}

Next, execute the contract tests by running the following command:

{% tabs test %}
{% tab test java %}
```shell
java -jar specmatic.jar test employees.yaml
```
{% endtab %}
{% tab test npm %}
```shell
npx specmatic test employees.yaml
```
{% endtab %}
{% tab test docker %}
```shell
docker run --rm --network host -v "$(pwd)/employees.yaml:/usr/src/app/employees.yaml" -v "$(pwd)/employees_dictionary.yaml:/usr/src/app/employees_dictionary.yaml" specmatic/specmatic test "employees.yaml"
```
{% endtab %}
{% endtabs %}

We can now examine the request sent to the service by reviewing the logs.
```shell
POST /employees
Accept-Charset: UTF-8
Accept: */*
Content-Type: application/json
{
    "name": "James",
    "department": "IT"
}
```
The values from the dictionary are used in the requests. Keep in mind that these values are selected in a `pseudo-random` manner from the list, so you may encounter different values each time.
{: .note }

### Generative Tests

As it's evident that only valid values can be included in the dictionary. hence, generative tests will ignore the values in the dictionary for the key being mutated.
The other keys will still retrieve values from the dictionary if available; otherwise, random values will be generated.

For instance, if you execute the specification with generative tests enabled, one of the request will appear as follows:
```shell
POST /employees
Accept-Charset: UTF-8
Accept: */*
Content-Type: application/json
{
  "name": null,
  "department": "IT"
}
```

In this case, the key `name` is being mutated, which results in the value from the dictionary being disregarded.
While the values for `department` is still being retrieved from the dictionary

## Dictionary with Service Virtualization

The Dictionary can be utilized with service virtualization, where Specmatic will leverage the values in the dictionary to generate responses for incoming requests. To illustrate this functionality, let's consider the previous specification and dictionary as an example. We will remove the `employees_examples` directory to observe how service virtualization functions without examples.

### Run Service Virtualization

To start service virtualization, use the following command:

{% tabs test %}
{% tab test java %}
```shell
java -jar specmatic.jar stub employees.yaml
```
{% endtab %}
{% tab test npm %}
```shell
npx specmatic stub employees.yaml
```
{% endtab %}
{% tab test docker %}
```shell
docker run --rm -p 9000:9000 -v "$(pwd)/employees.yaml:/usr/src/app/employees.yaml" -v "$(pwd)/employees_dictionary.yaml:/usr/src/app/employees_dictionary.yaml" specmatic/specmatic stub "employees.yaml"
```
{% endtab %}
{% endtabs %}

### Making Requests

Execute the following curl command:
{% tabs commands %}
{% tab commands unix or CMD %}
```shell
curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"Jamie\",\"department\":\"IT\"}" http://localhost:9000/employees
```
{% endtab %}
{% tab commands powershell %}
```shell
Invoke-RestMethod -Uri "http://localhost:9000/employees" -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"name":"Jamie","department":"IT"}'
```
{% endtab %}
{% endtabs %}

You'll get the following response:
```json
{
  "id": 123,
  "employeeCode": "EMP123",
  "name": "Jane",
  "department": "IT"
}
```

The values from the dictionary are used in the responses. Keep in mind that these values are selected in a `pseudo-random` manner from the list, so you may encounter different values each time.
{: .note }

## Dictionary with Examples

You can also utilize dictionary with the example commands and the examples interactive server, allowing values to be retrieved from the dictionary for both request and response generation of examples, refer to [External Examples](/documentation/external_examples.html) for more details.
