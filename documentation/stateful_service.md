---
layout: default
title: Stateful Service
parent: Documentation
nav_order: 36
---

# Stateful Service


<!-- TOC -->

- [Stateful Service](#stateful-service)
    - [Pre-requisites](#pre-requisites)
    - [Example Usage](#example-usage)
        - [Command Line Options](#command-line-options)
    - [Working with State](#working-with-state)
        - [Default Behavior](#default-behavior)
        - [Pre-loading State](#pre-loading-state)
    - [Common Use Cases](#common-use-cases)
        - [Local Development](#local-development)
        - [Integration Testing](#integration-testing)
        - [API Design Validation](#api-design-validation)
    - [Troubleshooting](#troubleshooting)
        - [Common Issues](#common-issues)
    - [See Also](#see-also)

<!-- /TOC -->

While Specmatic's service virtualization provides stateless API mocking capabilities, modern applications often require more sophisticated testing scenarios. The virtual service feature was introduced to address this need, providing stateful behavior that mirrors real-world API interactions.

**Key differences from service virtualization:**
- Maintains state across requests
- Enables testing of complex workflows
- Supports scenarios requiring data persistence
- Allows validation of state-dependent business logic

**This makes virtual-service particularly valuable for:**
- Testing multi-step API workflows
- Validating state transitions
- Simulating real-world API behaviors
- Development without external service dependencies

**Note:** RESTful api specification is mandatory for using Specmatic's stateful service feature.

## Pre-requisites

- Create a directory named `specmatic` in your home directory.
- Make sure you have installed Specmatic. Explore the [Getting Started](/documentation/service_virtualization_tutorial.html) page for all options for installing Specmatic.

## Example Usage

- Create a file named `employees.yaml` in the `specmatic` directory with the following contents.

```yaml
openapi: 3.0.0
info:
  title: Employees
  version: '1.0'
paths:
  /employees:
    get:
      summary: Get all employees
      responses:
        '200':
          description: List of employees
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/EmployeeWithId'
    post:
      summary: Create a new employee
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Employee'
      responses:
        '201':
          description: Employee created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmployeeWithId'
  /employees/{id}:
    get:
      summary: Get a single employee by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Employee details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmployeeWithId'
        '404':
          description: Employee not found
    put:
      summary: Update an existing employee
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Employee'
      responses:
        '200':
          description: Employee updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmployeeWithId'
        '404':
          description: Employee not found
    delete:
      summary: Delete an employee
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '204':
          description: Employee deleted
        '404':
          description: Employee not found

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
    EmployeeWithId:
      allOf:
        - $ref: '#/components/schemas/Employee'
        - type: object
          required:
            - id
          properties:
            id:
              type: integer
```

- In the same directory, create a file named `specmatic.yaml` with the following contents:

```yaml
version: 2
contracts:
- consumes:
    - employees.yaml
```

- `cd` into the `specmatic` directory and run the following command:

{% tabs test %}
{% tab test java %}
```shell
java -jar specmatic.jar virtual-service
```
{% endtab %}
{% tab test npm %}
```shell
npx specmatic virtual-service
```
{% endtab %}
{% tab test docker %}
```shell
docker run -p 9000:9000 -v "${PWD}/:/usr/src/app" znsio/specmatic virtual-service
```
{% endtab %}
{% endtabs %}

- In a new tab, run the following curl command:

  ```shell
  curl -X POST -H 'Content-Type: application/json' -d '{"name": "Jill Doe", "department": "Engineering", "designation": "Director"}' http://localhost:9000/employees
  ```

- You should get the following response back:

  ```json
  {
    "name": "Jill Doe",
    "department": "Engineering",
    "designation": "Director",
    "id": <ID>
  }
  ```

- Now in a new tab, try to query the `<ID>` received in the previous command using curl:

  ```shell
  curl http://localhost:9000/employees/<ID>
  ```

  and you will see below response,

  ```json
  {
    "name": "Jill Doe",
    "department": "Engineering",
    "designation": "Director",
    "id": <ID>
  }
  ```

You can now use other restful methods such as PUT, PATCH, DELETE etc to do the CRUD operations.

### Command Line Options

```bash
specmatic virtual-service [-hV] [--host=<host>] [--port=<port>] [--examples=<exampleDirectoryName>]
```

| Option | Description |
|--------|-------------|
| `-h, --help` | Show help message and exit |
| `--host=<host>` | Host for the virtual service (default: localhost) |
| `--port=<port>` | Port for the virtual service (default: 9000) |
| `--examples=<exampleDirectoryName>` | Directories containing JSON examples for initial state |
| `-v, --version` | Print version information and exit |

## Working with State

### Default Behavior

The virtual service maintains state automatically based on your API specifications. For example:

1. When you create a resource using a defined endpoint, it's stored in the service's state
2. Subsequent requests will interact with the stored state according to your API specifications
3. All operations defined in your contract specifications are supported with appropriate state management

### Pre-loading State

You can initialize the service with pre-defined data:

Start the service with pre-loaded examples:
```bash
specmatic virtual-service --examples="spec_file_name_examples"
```

Specmatic also provides GUI for generating example, checkout [Interactive Examples GUI](documentation/external_examples.html#interactive-examples-gui)


## Common Use Cases

### Local Development

```bash
# Start service on a specific port
specmatic virtual-service --port=8080
```

This allows developers to work against a realistic API implementation without depending on external services.

### Integration Testing

```bash
# Start with pre-loaded test data
specmatic virtual-service --examples="spec_file_name_examples"
```

Perfect for integration tests that require consistent initial state.

### API Design Validation

The virtual service helps validate API design decisions early by providing a working implementation that maintains state according to your specifications.

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Solution: Use a different port
   specmatic virtual-service --port=9001
   ```

2. **Example Files Not Loading**
   - Verify JSON format is valid
   - Check file permissions
   - Ensure path to examples directory is correct

3. **Resource Not Found**
  - Make sure your API specification follows REST architecture
  - RESTful architecture is mandatory for running stateful service

## See Also

- [Generating Examples Documentation](documentation/service_virtualization_tutorial.html#externalizing-example-data)
- [Contract Testing with Specmatic](documentation/contract_tests.html)
