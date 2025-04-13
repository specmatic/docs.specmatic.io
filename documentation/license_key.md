---
layout: default
title: Specmatic License Keys
parent: Documentation
nav_order: 35
---

# Using and Deploying Specmatic License Keys

Specmatic commercial modules come with a default license key, which limits the number of specs you can run. To request a license key, please [contact us]({{ site.contact_us_url }}).

### Setting Up the License Key

The license file can be placed in one of the following locations, in order of priority:

1. **Central Contract Repository**
   We recommend checking in the license file with the name `specmatic-license.txt` into the [central contract repository](central_contract_repository). When Specmatic executes, it will checkout the central contract repository as specified in your Specmatic config. It will then scan for the license file (`specmatic-license.txt`) in any subfolders of the repository. This ensures the license is available to everyone using the central contract repository.

2. **Home Directory (One-Time Setup)**
   If the above option is not feasible, you can save the license file under `$HOME/.specmatic/specmatic-license.txt` as a one-time setup.

3. **Custom Location with Environment Variable**
   If neither of the above options work, you can save the license file in any location of your choice and set the environment variable `SPECMATIC_LICENSE_PATH` to point to the license file.

### Using Specmatic with Docker

When using Specmatic with Docker, you must pass the license key as follows:

```shell
docker run -it \
  -v /path/to/specmatic-license.txt:/specmatic/license.txt \
  -e SPECMATIC_LICENSE_PATH=/specmatic/license.txt znsio/specmatic-[IMAGE_NAME]
```
