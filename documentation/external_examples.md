---
layout: default
title: External Examples
parent: Documentation
nav_order: 7
---

# External Examples

- [External Examples](#external-examples)
  - [Validating Examples](#validating-examples)
    - [Quick Start](#quick-start)
    - [Advanced Usage](#advanced-usage)
      - [Working with Multiple Specifications](#working-with-multiple-specifications)
      - [Custom Example Directory](#custom-example-directory)
  - [Practical Example](#practical-example)
  - [Identifying Duplicate Examples](#identifying-duplicate-examples)
  - [Pro Tips](#pro-tips)

Learn how to validate your API examples against your specifications using Specmatic's powerful validation tools. Whether you have a single specification or multiple specs across different directories, Specmatic makes it easy to ensure your examples stay in sync with your API definitions.

## Validating Examples

### Quick Start
The fastest way to validate examples for a single specification:

{% tabs examples-validate %}
{% tab examples-validate docker %}
```shell
docker run -v "$(pwd)/employee_details.yaml:/usr/src/app/employee_details.yaml" -v "$(pwd)/employee_details_examples:/usr/src/app/employee_details_examples" znsio/specmatic examples validate --spec-file "employee_details.yaml"
```
{% endtab %}
{% tab examples-validate java %}
```shell
java -jar specmatic.jar examples validate --spec-file employee_details.yaml
```
{% endtab %}
{% tab examples-validate npm %}
```shell
npx specmatic examples validate --spec-file employee_details.yaml
```
{% endtab %}
{% endtabs %}

By default, Specmatic looks for examples in a directory named `{specification-name}_examples` in the same location as your specification file. For instance, if your spec file is named `employee_details.yaml`, Specmatic will look for examples in the `employee_details_examples` directory.

### Advanced Usage

#### Working with Multiple Specifications
If you're managing multiple API specifications, Specmatic provides flexible options to validate all their examples:

1. **Validate Multiple Specs with Default Example Locations**:
```shell
specmatic examples validate --specs-dir ./api-specs
```
This will look for example directories alongside each specification file.

2. **Organize Examples in a Separate Directory Structure**:
```shell
specmatic examples validate --specs-dir ./api-specs --examples-base-dir ./all-examples
```
This helps when you want to keep your examples organized separately from your specifications.

#### Custom Example Directory
For a single specification, you can specify a custom examples directory:
```shell
specmatic examples validate --spec-file employee_details.yaml --examples-dir ./custom-examples
```

## Practical Example

Let's walk through a complete example to see how example validation works in practice.

**1.** Create an API specification file named `employee_details.yaml`:

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
        '400':
          description: Error response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    Error:
      type: object
      required:
        - message
      properties:
        message:
          type: string
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

**2.** Create an example in `employee_details_examples/example.json`:

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

**3.** Validate your example:

{% tabs examples-validate %}
{% tab examples-validate docker %}
```shell
docker run -v "$(pwd)/employee_details.yaml:/usr/src/app/employee_details.yaml" -v "$(pwd)/employee_details_examples:/usr/src/app/employee_details_examples" znsio/specmatic examples validate --spec-file "employee_details.yaml"
```
{% endtab %}
{% tab examples-validate java %}
```shell
java -jar specmatic.jar examples validate --spec-file employee_details.yaml
```
{% endtab %}
{% tab examples-validate npm %}
```shell
npx specmatic examples validate --spec-file employee_details.yaml
```
{% endtab %}
{% endtabs %}

You'll notice the validation fails because the request is missing required fields (`name`, `department`, and `designation`). The error message will guide you to fix these issues.

**4.** Check the exit code:
- On MacOS/Linux: `echo $?`
- On Windows: `echo %errorlevel%`

A return code of `1` indicates validation failure, while `0` indicates success.

**5.** Fix the example by adding the required fields and run the validation again - you'll see it succeed!

## Identifying Duplicate Examples

When working with multiple examples, it's important to ensure that an example request is unique. If more than one example has the same request, there may be consequences. For example, when an incoming request matches multiple examples, Specmatic stub server will pick one example and show it's response, ignoring the others.

You can detect this issue early by using Specamtic to validate your examples.

Let's try the validation out. We shall continue to use the `employee_details.yaml` spec from above.

**1.** Create an example in `employee_details_examples/employees_PATCH_200.json`:

```json
{
  "http-request": {
    "method": "PATCH",
    "path": "/employees",
    "body": {
      "name": "Jamie",
      "employeeCode": "pqrxyz"
    }
  },
  "http-response": {
    "status": 200,
    "body": {
      "id": 10,
      "employeeCode": "pqrxyz",
      "name": "Jamie",
      "department": "Backend",
      "designation": "Engineer"
    }
  }
}
```

**2.** Create a duplicate example in `employee_details_examples/employees_PATCH_400.json`:

```json
{
  "http-request": {
    "method": "PATCH",
    "path": "/employees",
    "body": {
      "name": "Jamie",
      "employeeCode": "pqrxyz"
    }
  },
  "http-response": {
    "status": 400,
    "body": {
      "message": "Invalid value"
    }
  }
}
```

Note that, for the same request payload, it has a different response.

**3.** Validate your examples:

```shell
docker run \
  -v "$(pwd)/employee_details.yaml:/usr/src/app/employee_details.yaml" \
  -v "$(pwd)/employee_details_examples:/usr/src/app/employee_details_examples" \
  znsio/specmatic-openapi examples validate --spec-file "employee_details.yaml"
```

Specmatic detects this, and prints the following warning:

```log
WARNING: Multiple examples detected having the same request.
  This may have consequences. For example when Specmatic stub runs, only one of the examples would be taken into consideration, and the others would be skipped.

  - Found following duplicate examples for request PATCH /employees
    - example in file '/usr/src/app/employee_details_examples/employees_PATCH_200.json'
    - example in file '/usr/src/app/employee_details_examples/employees_PATCH_400.json'
```

*NOTE*: While validation of examples for schema correctness is available *for free* in open source [Specmatic](https://github.com/znsio/specmatic), detection of duplicate examples as part of validation is a paid feature. Please visit the [pricing page](https://specmatic.io/pricing/) for more information.

## Pro Tips
- Use `--specs-dir` with `--examples-base-dir` when managing multiple APIs to keep your examples organized
- Specmatic automatically finds example directories using the `{spec-name}_examples` convention (e.g., `employee_details_examples` for `employee_details.yaml`)
- The validation command will exit with code `1` if any examples are out of sync, making it perfect for CI/CD pipelines

Need more details? Run the help command:
{% tabs examples-validate %}
{% tab examples-validate docker %}
```shell
docker run znsio/specmatic examples validate --help
```
{% endtab %}
{% tab examples-validate java %}
```shell
java -jar specmatic.jar examples validate --help
```
{% endtab %}
{% tab examples-validate npm %}
```shell
npx specmatic examples validate --help
```
{% endtab %}
{% endtabs %}
