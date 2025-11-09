---
layout: default
title: Specmatic License Keys
parent: Enterprise Onboarding
nav_order: 1
redirect_from:
  - /documentation/license_key.html
---

# Provisioning and Using Specmatic License Keys

<!-- TOC -->
* [Provisioning and Using Specmatic License Keys](#provisioning-and-using-specmatic-license-keys)
  * [Types of Specmatic Licenses](#types-of-specmatic-licenses)
    * [User Licenses](#user-licenses)
      * [How to retrieve your user license](#how-to-retrieve-your-user-license)
    * [Service Account Licenses](#service-account-licenses)
      * [Setting Up the License Key (for service accounts)](#setting-up-the-license-key-for-service-accounts)
  * [Using Specmatic with Docker](#using-specmatic-with-docker)
<!-- TOC -->

## Types of Specmatic Licenses

Specmatic provides two types of licenses:

**User License:** Intended for individual users such as developers and testers who use Specmatic interactively (locally, or for manual contract authoring and testing). Each user should generate their own license key from the Specmatic Insights Server.

**Service Account License:** Intended for automated systems, build servers, or shared environments where Specmatic is run as part of a service or automation. Service account licenses can be generated and managed centrally for use by these systems.

Both license types are managed and downloaded from the Specmatic Insights Server. The setup and usage instructions for each are provided in the sections below.

### User Licenses

User licenses are intended for developers and testers who use Specmatic interactively, such as running Specmatic locally, or for manual contract authoring and testing. Each user should download their own license key from the Specmatic Insights Server.

#### How to retrieve your user license
{: style="font-size:1rem!important;letter-spacing:0.5px;margin-bottom:1rem" }

To download your user license, execute the following command in your terminal:

{: style="margin:0;" }
{% tabs commands %}
{% tab commands Executable %}
```shell
specmatic get-license
```
{% endtab %}
{% tab commands Docker-Unix %}
```shell
docker run -it --rm -v ~/.specmatic:/root/.specmatic specmatic/specmatic get-license
```
{% endtab %}
{% tab commands Docker-Windows-Powershell %}
```shell
docker run -it --rm -v "${env:USERPROFILE}/.specmatic:/root/.specmatic" specmatic/specmatic get-license
```
{% endtab %}
{% tab commands Docker-Windows-CommandPrompt %}
```shell
docker run -it --rm -v "%USERPROFILE%\.specmatic:/root/.specmatic" specmatic/specmatic get-license
```
{% endtab %}
{% endtabs %}

Executing the command will result in the following output appearing in your terminal:
```shell
Specmatic Version: v2.24.0

Please visit https://insights.specmatic.io/dashboard/validate-license?code=XXXXX and validate your license request
```

Click the link to validate your license request in the browser, following the given instructions.<br/>
Once validated, Specmatic will automatically download your license and display the retrieved license details in the terminal as follows:

```plain
License successfully retrieved.
Got license:
Licensed to: your-email@example.com
Start date: September 26, 2025 at 10:10:17 PM IST
Expiry date: October 3, 2025 at 10:10:17 PM IST
License type: ENTERPRISE
Rate limit: 100
Organisation ID: ...
Insights server: https://insights.specmatic.io
License ID: ...
```

The retrieved license file must be stored in `~/.specmatic`. If you are using Docker, make sure to mount this directory to `/root/.specmatic` within your Docker container.
If you are executing the commands mentioned above as-is, this will be handled automatically.
{: .note}

### Service Account Licenses

![License Key Download](../../images/insights-license.gif)

1. Login to your [Specmatic Insights account](https://insights.specmatic.io).
2. Navigate to the "Settings" section.
3. Select the "License" tab.
4. Click on the "Generate" button.
5. Enter the license name, and any tags you wish to associate with the license.
6. Click "Generate" to create the license key.
7. Click the "Download" button to download the license file (`specmatic-license.txt`)

#### Setting Up the License Key (for service accounts)

The license file can be placed in one of the following locations, in order of priority:

1. **Central Contract Repository**
   We recommend checking in the license file with the name `specmatic-license.txt` into the [central contract repository](/documentation/tutorials/central_contract_repository.html). When Specmatic executes, it will checkout the central contract repository as specified in your Specmatic config. It will then scan for the license file (`specmatic-license.txt`) in any subfolders of the repository. This ensures the license is available to everyone using the central contract repository.

2. **Home Directory (One-Time Setup)**
   If the above option is not feasible, you can save the license file under `$HOME/.specmatic/specmatic-license.txt` as a one-time setup.

3. **Custom Location with Environment Variable**
   If neither of the above options work, you can save the license file in any location of your choice and set the environment variable `SPECMATIC_LICENSE_PATH` to point to the license file.

## Using Specmatic with Docker

When using Specmatic with Docker, you must pass the license key as follows:

```shell
docker run -it \
  -v /path/to/specmatic-license.txt:/root/.specmatic/specmatic-license.txt \
 specmatic/specmatic-[IMAGE_NAME]
```
