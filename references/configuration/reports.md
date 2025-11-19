---
layout: default
title: Reports
parent: Configuration
grand_parent: References
nav_order: 6
---

# Reports

## Report Configuration

Specmatic can generate reports based on the below configuration:

{% tabs report_configuration %}
{% tab report_configuration specmatic.yaml %}
```yaml
version: 2
report:
  formatters:
    - type: text
      layout: table
  types:
    APICoverage:
      OpenAPI:
        successCriteria:
          minThresholdPercentage: 100
          maxMissedEndpointsInSpec: 0
          enforce: true
```
{% endtab %}
{% tab report_configuration specmatic.json %}
```json
{
  "version": 2,
  "report": {
    "formatters": [
      {
        "type": "text",
        "layout": "table"
      }
    ],
    "types": {
      "APICoverage": {
        "OpenAPI": {
          "successCriteria": {
            "minThresholdPercentage": 100,
            "maxMissedEndpointsInSpec": 0,
            "enforce": true
          }
        }
      }
    }
  }
}
```
{% endtab %}
{% endtabs %}

## Formatters

If no formatters are provided, `text` and `html` formatters are used by default. The `text` formatter will print the report on to the console / terminal.

### CTRF Report

To generate a CTRF report for contract tests, add a formatter of type `ctrf` as shown below:

{% tabs ctrf_report_configuration %}
{% tab ctrf_report_configuration specmatic.yaml %}
```yaml
report:
  formatters:
    - type: ctrf
```
{% endtab %}
{% tab ctrf_report_configuration specmatic.json %}
```json
{
  "report": {
    "formatters": [
      {
        "type": "ctrf"
      }
    ]
  }
}
```
{% endtab %}
{% endtabs %}

The CTRF report for contract tests will be generated in the `build/reports/specmatic/ctrf` directory.

{: .note}
The CTRF report generation is only available in the commercial version of Specmatic. Please visit the [pricing page](https://specmatic.io/pricing/) for more information.

## API Coverage Report

This gives you a comprehensive analysis of any mismatch between your api specification and implementation. [Here](https://specmatic.io/demonstration/detect-mismatches-between-your-api-specifications-and-implementation-specmatic-api-coverage-report/#gsc.tab=0) is an article with a detailed write-up about this feature.
