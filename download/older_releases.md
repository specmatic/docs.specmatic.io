---
layout: default
title: Older Releases
parent: Download
nav_order: 2
---

### Release 0.26.2

Date: 30th May 2021

What's new:
- Added handling for imported WSDL and schema files

### Release 0.26.1

Date: 6th May 2021

What's new:
- Improved error message for xml mismatch

### Release 0.26.0

Date: 29th April 2021

What's new:
- Fix to contract tests when specying a file name in `request-part`, in which the specified file name is resolved relative to the contract file in which it was specified.

### Release 0.25.5

Date: 29th April 2021

What's new:
- Stability improvements to backward compatibility check
- Improvements to XML/SOAP error messages

### Release 0.25.2

Date: 23rd April 2021

What's new:
- Bug fix: Under some cirucmstances, the contract file path was being dropped

### Release 0.25.1

Date: 19th April 2021

What's new:
- Bug fix: The test command now exits with 0, as it should, when WIP scenarios fail

### Release 0.25.0

Date: 16th April 2021

What's new:
- Huge speed up of backward compatibility test

### Release 0.24.2

Date: 15th March 2021

What new:
- Bug fixes and improvements to WSDL support

### Release 0.24.1

Date: 17th March 2021

What new:
- Renamed Qontract to Specmatic
- Implemented a new variable and environment feature that makes it possible to wire up contracts to authentication APIs

### Release 0.23.1

Date: 10th March 2021

What new:
- Ability to convert WSDL files into Qontract files

### Release 0.22.1

Date: 8th February 2021

What new:
- Improvements to type generation of reponse when generating Gherkin out of a json stub file

### Release 0.22.0

Date: 3rd February 2021

What's new:
- Bug fix for building the Specmatic bundle in a mono repo

### Release 0.21.2

Date: 7th January 2021

What's new:
- Minor bug fix

### Release 0.21.1

Date: 16th December 2020

What's new:
- Bug fixes to new feature: [Forward Unrecognized URLs To An Actual Service](/documentation/service_virtualisation.html#forward-unstubbed-requests-to-an-actual-service)

### Release 0.21.0

Date: 15th December 2020

What's new:
- Added a new feature in which the stub that forwards unknown urls to another url whose url is provided to it at startup ([Forward Unrecognized URLs To An Actual Service](/documentation/service_virtualisation.html#forward-unstubbed-requests-to-an-actual-service))

### Release 0.20.1

Date: 21st October 2020

What's new:
- Added the ability to stub out a delayed response to a request

### Release 0.19.1

Date: 21st October 2020

What's new:
- Improvements to xml type matching

### Release 0.18.1

Date: 1st October 2020

What's new:
- Minor improvements and fixes

### Release 0.18.0

Date: 17th September 2020

What's new:
- Improvements to the test command
- Improvements to stub command
- Improvements to some error message
- Improvements to contract generation

### Release 0.17.1

Date: 12th September 2020

What's new:
- Bug fix to Proxy mode

### Release 0.17.0

Date: 9th September 2020

What's new:
- qontract.json is now supported in test mode
- new qontract bundle command for use in CI
- support for recursive type definitions

### Release 0.16.0

Date: 2nd September 2020

What's new:
- updated qontract.json format
- better error messages

### Release 0.15.0

Date: 12th August 2020

What's new:
- Improvements to the proxy command

### Release 0.14.2

Date: 8th August 2020

What's new:
- Renamed backwardCompatible to compatible, and improved it for use in CI

### Release 0.14.1

Date: 2nd August 2020

What's new:
- Minor enhancements for XML support

### Release 0.14.0

Date: 31st July 2020

What's new:
- Improved CI support (new push command for pushing contract changes, new subscribe command to have the ci pipeline run when changes occur)
- Bug fixes

### Release 0.13.1

Date: 9th July 2020

What's new:
- Fixes for optional value matching in json objects

### Release 0.13.0

Date: 8th July 2020

What's new:
- Experimental support for recording contracts and stubs in proxy mode
- Rewritten support for XML
- Improved support for CI

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.13.0/qontract.jar)

### Release 0.12.2

Date: 30th June 2020

What's new:
- Improved support for CI

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.12.2/qontract.jar)

### Release 0.12.1

Date: 25th June 2020

What's new:
- Unexpected JSON keys in the response are not accepted now in test mode, unless the type defines a ... key with no value, which is an explicit declaration that unexpected keys must be accepted and ignored
- Files in stub directories that are not loaded are logged to the console
- Improved error messages

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.12.1/qontract.jar)

### Release 0.12.0

Date: 23rd June 2020

What's new:
- Improved error message in several areas
- Added basic instrumentation for when Specmatic runs as a server for service virtualisation in a test environment

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.12.0/qontract.jar)

### Release 0.11.1

Date: 16th June 2020

What's new:
- Added nicer error messages for multipart mismatch errors
- Added strict flag for stub mode, with which the stub will respond with the concerned mismatch errors in case the stub doesn't match any input, instead of returning random values

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.11.1/qontract.jar)

### Release 0.11.0

Date: 12th June 2020

What's new:
- Big improvements to Postman import
- Added back the backward compatibility test command

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.11.0/qontract.jar)

### Release 0.10.0

Date: 1st June 2020

What's new:
- Convert stub files into Specmatic files
- Convert Postman collections into Specmatic files
- Improved support for CORS

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.10.0/qontract.jar)

### Release 0.9.0

Date: 25th May 2020

What's new:
- Helper methods for invoking Kafka from Karate
- Dynamic stub over an HTTP API after Specmatic has been started
- Stub reloads when contract files or stub files are updated
- Suggestions can be passed as a commandline argument
- Improvements to XML support

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.9.0/qontract.jar)

### Release 0.8.0

Date: 19th May 2020

What's new:
- Support for message in Kafka
- Faster comparison of contracts

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.8.0/qontract.jar)

### Release 0.7.0

Date: 10th May 2020

What's new:
- Test mode can now hit an https end point
- Added preliminary support for multipart form data 
- Added the version checkGitFile command to test whether the latest file checked out is compatible with the file at the same path in the last commit.

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.7.0/qontract.jar)

### Release 0.6.1

Date: 5th May 2020

What's new:
- Specmatic can suggest the version number of a contract using the new command `version`
- Specmatic stub now logs requests and responses

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.6.1/qontract.jar)

### Release 0.6.0

Date: 4th May 2020

What's new:
- Headers can be marked optional
- Stub data for multiple contracts can be loaded from a single directory.
- Sub types can now be stubbed out. E.g. if the contract says (string?), (string) and (null) can both be used in the stub data instead of literal values.
- Improved support for nullable keys and values in stub data
- A java helper method for setting up stubs with data
- A java helper to pick up a contract by specifying the major and minor version

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.6.0/qontract.jar)

### Release 0.5.0

Date: 27th April 2020

Notes:
- Added versioning flows
- Stubs can now contain a type in the expectation instead of only hardcoded values, which will match any incoming input of that type.
- Multiple contracts can now be loaded into a single process.

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.5.0/qontract.jar)

### Release 0.4.0

Date: 19th April 2020

Notes:
- Introduced pattern in string,  e.g. (number in string) will match "10" but not "hello"
- Contract in stub mode watches the contract file for changes
- Improved error messages
- Updated to Kotlin 1.3.72
- Upgrade kotlinx.serialization to 0.20.0
- Bug fixes
- Under the hood improvements

Standalone jar - [qontract.jar](https://github.com/znsio/specmatic/releases/download/0.4.0/qontract.jar)

### Release 0.3.1

Date: 11th April 2020

Notes:
- Improved commandline output of compare and test commands
- Fixed a few bugs

Standalone jar - [qontract-0.3.0-all.jar](https://github.com/znsio/specmatic/releases/download/0.3.1/qontract-0.3.1-all.jar)

### Release 0.3.0

Date: 11th April 2020

Notes:
- Improved error messages
- Added support for (datetime), (url) and (url https)
- Added the compare command to the executable. It compares two contracts, and reports on whether they are compatible, or whether one is backward compatible with the other

Standalone jar - [qontract-0.3.0-all.jar](https://github.com/znsio/specmatic/releases/download/0.3.0/qontract-0.3.0-all.jar)

### Release 0.2.0

Date: 5th April 2020

Notes:
* Added support for nulls
* Improved test and stub commands, now there's no need to specify run and start respectively at the end

Standalone jar - [qontract-0.2.0-all.jar](https://github.com/znsio/specmatic/releases/download/0.2.0/qontract-0.2.0-all.jar)

### Release 0.1

Date: 27th March 2020

Notes:
* adding JUnit 5 support as library
* adding form field support
* bug fixes

Standalone jar - [qontract-0.1.0-all.jar](https://github.com/znsio/specmatic/releases/download/0.1/qontract-0.1.0-all.jar)

### Release 0.1.0

Date: 19th March 2020

Notes: Trial release to MavenCentral

**DEPRECATED**

Features:
* Programmatic support for Contract as Mock and Contract as Test
* Commandline support for Contract Stub, Contract as Test

Standalone jar - [qontract-0.0.1-all.jar](https://github.com/znsio/specmatic/releases/download/v0.0.1/qontract-0.0.1-all.jar)
