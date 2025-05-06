---
layout: default
title: External Examples
parent: Documentation
nav_order: 7
---

# External Examples
<!-- TOC -->
* [External Examples](#external-examples)
  * [Introduction](#introduction)
  * [Creating, Validating and Fixing Examples](#creating-validating-and-fixing-examples)
  * [Interactive Examples GUI](#interactive-examples-gui)
    * [Generating and Updating Examples](#generating-and-updating-examples)
    * [Validating Examples](#validating-examples)
    * [Fixing Examples](#fixing-examples)
  * [Creating Examples Manually](#creating-examples-manually)
  * [Using CLI to Validate Examples](#using-cli-to-validate-examples)
  * [Example Format](#example-format)
  * [Working with Multiple Specifications](#working-with-multiple-specifications)
  * [Custom Example Directory](#custom-example-directory)
  * [Identifying Competing Examples](#identifying-competing-examples)
    * [Competing examples by identical requests](#competing-examples-by-identical-requests)
    * [Competing data type-based examples by similar requests](#competing-data-type-based-examples-by-similar-requests)
    * [Competing data-type based examples by overlapping requests](#competing-data-type-based-examples-by-overlapping-requests)
    * [Lenient mode](#lenient-mode)
  * [Pro Tips](#pro-tips)
<!-- TOC -->

## Introduction

It may not always be possible to add examples inline in the OpenAPI specifications. And sometimes certain examples may not belong in the API specification. In such cases, we add examples outside the spec in the form of JSON files.

## Creating, Validating and Fixing Examples

Create an API specification file named `employee_details.yaml` using the content below. We will use this file as a reference for creating, validating and fixing examples.

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
        department:
          type: string
        designation:
          type: string
```

## Interactive Examples GUI

To start the GUI execute below command,
{% tabs examples-gui %}
{% tab examples-gui docker %}
```shell
docker run --rm -v "$(pwd):/specs" -p "9001:9001" znsio/specmatic-openapi examples interactive --spec-file /specs/employee_details.yaml
```
{% endtab %}
{% tab examples-gui java %}
```shell
java -jar specmatic-openapi.jar examples interactive --spec-file employee_details.yaml
```
{% endtab %}
{% endtabs %}

You can then click on the link in the console, or by visiting http://localhost:9001/_specmatic/examples

### Generating and Updating Examples

> ![Generate](../images/gui-generate.png)

The generated files will be saved alongside your specification in a `{specification-name}_examples` directory. In this case it will be `employee_details_examples` directory.

> ![View details](../images/gui-more-details.png)

View details section will give additional info and a live code editor to make changes in the generated example.

> ![Update](../images/gui-update.png)

This page will help you to edit, update, validate, fix and save your examples.

### Validating Examples

You can validate one example at a time (as we saw above), or you validate them in bulk.

> ![Validate](../images/gui-validate.png)

### Fixing Examples

> ![Fix](../images/gui-fix.png)

> ![After Fix](../images/gui-after-fix.png)

Fix can also be done in bulk (similar to validate).

**NOTE**: The Interactive Examples GUI is only available in the commercial version of Specmatic. Please visit the [pricing page](https://specmatic.io/pricing/) for more information.

## Creating Examples Manually

If you do not have access to the commercial version of Specmatic, you can create examples manually.

Create an example file `employee_details_examples/example.json` with below content.

```json
{
    "http-request": {
        "method": "PATCH",
        "path": "/employees",
        "body": {
            "employeeCode": "pqrxyz",
            "name": "Jamie",
            "department": "IT",
            "designation": "Manager"
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

By default, Specmatic looks for examples in a directory named `{specification-name}_examples` in the same location as your specification file. For instance, if your spec file is named `employee_details.yaml`, Specmatic will look for examples in the `employee_details_examples` directory.

For complete example format, please refer to [Example Format](#example-format).

## Using CLI to Validate Examples

While you have done the validation in Interactive Examples GUI, You can also run it in a non-interactive manner which is useful for e.g. CI Pipelines, [PR Pre-Merge Checks](https://github.com/znsio/specmatic-order-contracts/blob/abb92cc3e9acabeb420abc7ca233492e2581cc18/.github/workflows/pull_request_merge_checks.yaml#L66C1-L70C100) etc. In a non-interactive manner Specmatic will exit with a `non-zero` exit-code in case of validation failure, and `0` in case of successful validation.

{% tabs examples-validate %}
{% tab examples-validate docker %}
```shell
docker run -v "$(pwd)/:/specs" znsio/specmatic examples validate --spec-file "/specs/employee_details.yaml"
```
{% endtab %}
{% tab examples-validate java %}
```shell
java -jar specmatic.jar examples validate --spec-file employee_details.yaml
```
{% endtab %}
{% endtabs %}

## Example Format

Examples can be externalized to `json` files as seen in the above section, You will find the example format reference below,

```json
{
    "http-request": {
        "method": "POST",
        "path": "/path/(number)/some/more/path",
        "headers": {
            "X-Header-Name": "(string)",
            "X-Header-ID": "(string)"
        },
        "query": {
            "id": "(number)",
            "type": "(string)"
        },
        "form-fields": {
            "Data": "(PredefinedJsonType)",
            "MoreData": "some hardcoded value"
        },
        "multipart-formdata": [
            {
                "name": "customers",
                "content": "(string)",
                "filename": "@data.csv",
                "contentType": "text/plain",
                "contentEncoding": "gzip"
            }
        ],
        "body": {
            "name": "Jane Doe",
            "address": "22 Baker Street"
        }
    },

    "http-response": {
        "status": 200,
        "headers": {
            "X-Header-Name": "(string)",
            "X-Header-ID": "(string)"
        },
        "body": "some value"
    }
}
```

**Notes on the `request` format:**

1. Multipart Form-data:
- You can either provide `content` or `filename`, but not both
- `filename` must start with @
- `contentType` is optional, and is matched against the `Content-Type` header
- `contentEncoding` is matched against the `Content-Encoding` header

2. Body can also just be a `string`, such "Hello world", or an `array`, such as [1, 2, 3]

**Notes on the `response` format:**

1. In contract tests, only the `status` field is required. Other fields will be ignored if provided such as headers, body etc.

## Working with Multiple Specifications

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

## Custom Example Directory

For a single specification, you can specify a custom examples directory:
```shell
specmatic examples validate --spec-file employee_details.yaml --examples-dir ./custom-examples
```

## Identifying Competing Examples

When using multiple examples, it's important to ensure each request is unique. If two examples share the same request but have different responses (e.g., one returns HTTP 200 and another HTTP 400), the Specmatic stub server will pick one response, ignoring the others.

You can detect such competing example issues early by using Specamtic to validate your examples.

Let's try the validation out. We shall continue to use the `employee_details.yaml` [spec from above](https://docs.specmatic.io/documentation/external_examples.html#creating-validating-and-fixing-examples).

### Competing examples by identical requests

**1.** Create following examples with the same request but a different response in `employee_details_examples`:

<table>
  <colgroup>
    <col width="50%"/>
    <col width="50%"/>
  </colgroup>
  <thead>
    <tr class="header">
      <th>employees_PATCH_200.json</th>
      <th>employees_PATCH_400.json</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="top">
        {% highlight json %}
        {
          "http-request": {
            "method": "PATCH",
            "path": "/employees",
            "body": {
              "name": "Jamie",
              "department": "Backend",
              "designation": "Engineer"
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
        {% endhighlight %}
      </td>
      <td valign="top">
        {% highlight json %}
        {
          "http-request": {
            "method": "PATCH",
            "path": "/employees",
            "body": {
              "name": "Jamie",
              "department": "Backend",
              "designation": "Engineer"
            }
          },
          "http-response": {
            "status": 400,
            "body": {
              "message": "Invalid value"
            }
          }
        }
        {% endhighlight %}
      </td>
    </tr>
  </tbody>
</table>

**2.** Validate your examples:

{% tabs competing-examples %}
{% tab competing-examples docker %}
```shell
docker run -v "$(pwd)/:/specs" znsio/specmatic-openapi examples validate --spec-file "/specs/employee_details.yaml"
```
{% endtab %}
{% tab competing-examples java %}
```shell
java -jar specmatic-openapi.jar examples validate --spec-file employee_details.yaml
```
{% endtab %}
{% endtabs %}

Let's analyse the request body of the incoming request and check if it is competing for both examples.

<table>
  <colgroup>
    <col width="50%"/>
    <col width="50%"/>
  </colgroup>
  <thead>
    <tr class="header">
      <th>Incoming request with body</th>
      <th>Are the examples competing for this request?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="top">
        {% highlight json %}
        {
          "name": "Jamie",
          "department": "Backend",
          "designation": "Engineer"
        }
        {% endhighlight %}
      </td>
      <td align="center" valign="top">
        Yes <br/>
        both <code>employees_PATCH_200.json</code> and <code>employees_PATCH_400.json</code> are competing examples for this request
      </td>
    </tr>
  </tbody>
</table>

Specmatic detects such competing examples, exits with a non-zero exit code after printing the following error:

```log
ERROR: Multiple examples detected having the same request.
  This may have consequences. For example when Specmatic stub runs, only one of the examples would be taken into consideration, and the others would be skipped.

  - Found following duplicate examples for request PATCH /employees
    - example in file '/usr/src/app/employee_details_examples/employees_PATCH_200.json'
    - example in file '/usr/src/app/employee_details_examples/employees_PATCH_400.json'
```

### Competing data type-based examples by similar requests

Similar to [Competing examples by identical requests](https://docs.specmatic.io/documentation/external_examples.html#competing-examples-by-identical-requests), lets see how [data type-based examples](https://docs.specmatic.io/documentation/service_virtualization_tutorial.html#data-type-based-examples) could turn out to be competing for few requests.

**1.** Create following examples with the data type assigned to same key in the request but a different response in `employee_details_examples`:

<table>
  <colgroup>
    <col width="50%"/>
    <col width="50%"/>
  </colgroup>
  <thead>
    <tr class="header">
      <th>employees_PATCH_200_any_name.json</th>
      <th>employees_PATCH_400_any_name_copy.json</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="top">
        {% highlight json %}
        {
          "http-request": {
            "method": "PATCH",
            "path": "/employees",
            "body": {
              "name": "(string)",
              "department": "Backend",
              "designation": "Engineer"
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
        {% endhighlight %}
      </td>
      <td valign="top">
        {% highlight json %}
        {
          "http-request": {
            "method": "PATCH",
            "path": "/employees",
            "body": {
              "name": "(string)",
              "department": "Backend",
              "designation": "Engineer"
            }
          },
          "http-response": {
            "status": 400,
            "body": {
              "message": "Invalid value"
            }
          }
        }
        {% endhighlight %}
      </td>
    </tr>
  </tbody>
</table>

**2.** Validate your examples:

{% tabs competing-examples %}
{% tab competing-examples docker %}
```shell
docker run -v "$(pwd)/:/specs" znsio/specmatic-openapi examples validate --spec-file "/specs/employee_details.yaml"
```
{% endtab %}
{% tab competing-examples java %}
```shell
java -jar specmatic-openapi.jar examples validate --spec-file employee_details.yaml
```
{% endtab %}
{% endtabs %}

Let's analyse the request body of the incoming request and check if it is competing for
* both the examples in Step 1 above
* and `employees_PATCH_200.json` from [Competing examples by identical requests](https://docs.specmatic.io/documentation/external_examples.html#competing-examples-by-identical-requests)

<table>
  <colgroup>
    <col width="50%"/>
    <col width="50%"/>
  </colgroup>
  <thead>
    <tr class="header">
      <th>Incoming request with body</th>
      <th>Are the examples competing for this request?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="top">
        {% highlight json %}
        {
          "name": "Jamie",
          "department": "Backend",
          "designation": "Engineer"
        }
        {% endhighlight %}
      </td>
      <td align="center" valign="top">
        <strong>No</strong> <br/>
        Specmatic identifies <code>employees_PATCH_200.json</code> to be more precise example for this request over <code>employees_PATCH_200_any_name.json</code> or <code>employees_PATCH_400_any_name_copy.json</code>
      </td>
    </tr>
    <tr>
      <td valign="top">
        {% highlight json %}
        {
          "name": "Jack",
          "department": "Backend",
          "designation": "Engineer"
        }
        {% endhighlight %}
      </td>
      <td align="center" valign="top">
        <strong>Yes</strong> <br/>
        As the request does not match <code>employees_PATCH_200.json</code>, both <code>employees_PATCH_200_any_name.json</code> and <code>employees_PATCH_400_any_name_copy.json</code> are competing examples for this request
      </td>
    </tr>
  </tbody>
</table>

Specmatic detects such competing examples, exits with a non-zero exit code after printing the following error:

```log
ERROR: Multiple examples detected having the same request.
  This may have consequences. For example when Specmatic stub runs, only one of the examples would be taken into consideration, and the others would be skipped.

  - Found following overlapping examples for request PATCH /employees
    - example in file '/usr/src/app/employee_details_examples/employees_PATCH_200_any_name.json'
    - example in file '/usr/src/app/employee_details_examples/employees_PATCH_400_any_name_copy.json'
```

### Competing data-type based examples by overlapping requests

Now, lets try creating competing examples having [data type](https://docs.specmatic.io/documentation/service_virtualization_tutorial.html#data-type-based-examples) assigned to different keys in request and with different responses but still potentially competing for a request.

**1.** Create following examples with the data type assigned to different parts of request and having a different response in `employee_details_examples`:

<table>
  <colgroup>
    <col width="50%"/>
    <col width="50%"/>
  </colgroup>
  <thead>
    <tr class="header">
      <th>employees_PATCH_200_any_name.json</th>
      <th>employees_PATCH_400_any_designation.json</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="top">
        {% highlight json %}
        {
          "http-request": {
            "method": "PATCH",
            "path": "/employees",
            "body": {
              "name": "(string)",
              "department": "Backend",
              "designation": "Engineer"
            }
          },
          "http-response": {
            "status": 200,
            "body": {
              "id": 10,
              "employeeCode": "pqrxyz",
              "name": "Ralph",
              "department": "Backend",
              "designation": "Engineer"
            }
          }
        }
        {% endhighlight %}
      </td>
      <td valign="top">
        {% highlight json %}
        {
          "http-request": {
            "method": "PATCH",
            "path": "/employees",
            "body": {
              "name": "Tom",
              "department": "Backend",
              "designation": "(string)"
            }
          },
          "http-response": {
            "status": 400,
            "body": {
              "message": "Invalid value"
            }
          }
        }
        {% endhighlight %}
      </td>
    </tr>
  </tbody>
</table>

**2.** Validate your examples:

{% tabs competing-examples %}
{% tab competing-examples docker %}
```shell
docker run -v "$(pwd)/:/specs" znsio/specmatic-openapi examples validate --spec-file "/specs/employee_details.yaml"
```
{% endtab %}
{% tab competing-examples java %}
```shell
java -jar specmatic-openapi.jar examples validate --spec-file employee_details.yaml
```
{% endtab %}
{% endtabs %}

Let's analyse the request body of the incoming request and check if it is competing for
* both the examples in Step 1 above
* and `employees_PATCH_200.json` from [Competing examples by identical requests](https://docs.specmatic.io/documentation/external_examples.html#competing-examples-by-identical-requests)

<table>
  <colgroup>
    <col width="50%"/>
    <col width="50%"/>
  </colgroup>
  <thead>
    <tr class="header">
      <th>Incoming request with body</th>
      <th>Are the examples competing for this request?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="top">
        {% highlight json %}
        {
          "name": "Jamie",
          "department": "Backend",
          "designation": "Engineer"
        }
        {% endhighlight %}
      </td>
      <td align="center" valign="top">
        <strong>No</strong> <br/>
        Specmatic identifies <code>employees_PATCH_200.json</code> to be more precise example for this request over <code>employees_PATCH_200_any_name.json</code> or <code>employees_PATCH_400_any_designation.json</code>
      </td>
    </tr>
    <tr>
      <td valign="top">
        {% highlight json %}
        {
          "name": "Ralph",
          "department": "Backend",
          "designation": "Engineer"
        }
        {% endhighlight %}
      </td>
      <td align="center" valign="top">
        <strong>No</strong> <br/>
        Specmatic identifies <code>employees_PATCH_200_any_name.json</code> to be the most precise example for this request
      </td>
    </tr>
    <tr>
      <td valign="top">
        {% highlight json %}
        {
          "name": "Tom",
          "department": "Backend",
          "designation": "Administrator"
        }
        {% endhighlight %}
      </td>
      <td align="center" valign="top">
        <strong>No</strong> <br/>
        Specmatic identifies <code>employees_PATCH_200_any_designation.json</code> to be the most precise example for this request
      </td>
    </tr>
    <tr>
      <td valign="top">
        {% highlight json %}
        {
          "name": "Tom",
          "department": "Backend",
          "designation": "Engineer"
        }
        {% endhighlight %}
      </td>
      <td align="center" valign="top">
        <strong>Yes</strong> <br/>
        As the request does not match <code>employees_PATCH_200.json</code>, both <code>employees_PATCH_200_any_name.json</code> and <code>employees_PATCH_400_any_designation.json</code> are competing examples for this request
      </td>
    </tr>
  </tbody>
</table>

Specmatic detects such competing examples, exits with a non-zero exit code after printing the following error:

```log
ERROR: Multiple examples detected having the same request.
  This may have consequences. For example when Specmatic stub runs, only one of the examples would be taken into consideration, and the others would be skipped.

  - Found following overlapping examples for request PATCH /employees
    - example in file '/usr/src/app/employee_details_examples/employees_PATCH_200_any_name.json'
    - example in file '/usr/src/app/employee_details_examples/employees_PATCH_400_any_designation.json'
```

### Lenient mode

To treat such competing example issues as a warning instead of an error, use the `--competing-example-detection=LENIENT` flag. This will display above message as `WARNING` and exit with code zero.

{: .note}
**Note:** While validation of examples for schema correctness is available in [Specmatic](https://github.com/znsio/specmatic) open-source version, detection of competing examples as part of validation is only available in the commercial version of Specmatic. Please visit the [pricing page](https://specmatic.io/pricing/) for more information.

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
{% endtabs %}
