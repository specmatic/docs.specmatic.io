---
layout: default
title: External Examples
parent: Documentation
nav_order: 7
---

External Examples
=================

- [External Examples](#external-examples)
  - [Validate External Examples](#validate-external-examples)

## Validate External Examples

All examples in a specification can be easily validated using the command `java -jar specmatic.jar examples validate --contract-file <path to openapi file>`

This command validates examples that can be run (either as test or stub), including:

1. external examples in the `_examples` directory of the specification
2. inline request and response examples having matching names
3. inline requests where the response has no body
4. inline responses where the request has no body

It will exit with return code `1` if any example is not in sync.

Let's try this out.

- Create an api specification file named `employee_details.yaml` with the following content:

  ```yaml
    openapi: 3.0.0
    info:
      title: Employees
      version: '1.0'
    servers: []
    paths:
      '/employees':
        patch:
          summary: ''
          requestBody:
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/EmployeeDetails'
          responses:
            '200':
              description: Employee Created Response
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/Employee'
    components:
      schemas:
        Employee:
          type: object
          required:
            - id
            - name
            - department
            - designation
          properties:
            id:
              type: integer
            employeeCode:
              type: string
            name:
              type: string
            department:
              type: string
            designation:
              type: string

        EmployeeDetails:
          type: object
          required:
            - name
            - department
            - designation
          properties:
            name:
              type: string
            employeeCode:
              type: string
  ```

- Create an example in a file named `employee_details_examples/example.json` with the following content:

  ```json
  {
      "http-request": {
          "method": "PATCH",
          "path": "/employees",
          "body": {
              "employeeCode": "pqrxyz"
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

  Note: `name` is a mandatory request field but it is missing in the example.

- Run the following command: `java -jar specmatic.jar examples validate --contract-file employee_details.yaml`
  - The error in the example will be logged to the console.
- Check the exit code. On MacOS or *nix, run `echo $?`. On Windows, run `echo %errorlevel%`. You'll see the exit code of `1`.

Now add a name to the request in the above example, and try running the command again. This time the validation will succeed.
