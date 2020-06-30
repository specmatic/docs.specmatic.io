---
layout: default
title: Older Releases
parent: Releases
nav_order: 2
---

### Release 0.12.1

Date: 25th June 2020

What's new:
- Unexpected JSON keys in the response are not accepted now in test mode, unless the type defines a ... key with no value, which is an explicit declaration that unexpected keys must be accepted and ignored
- Files in stub directories that are not loaded are logged to the console
- Improved error messages

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/0.12.1/qontract.jar)

### Release 0.12.0

Date: 23rd June 2020

What's new:
- Improved error message in several areas
- Added basic instrumentation for when Qontract runs as a server for service virtualisation in a test environment

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/0.12.0/qontract.jar)

### Release 0.11.1

Date: 16th June 2020

What's new:
- Added nicer error messages for multipart mismatch errors
- Added strict flag for stub mode, with which the stub will respond with the concerned mismatch errors in case the stub doesn't match any input, instead of returning random values

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/0.11.1/qontract.jar)

### Release 0.11.0

Date: 12th June 2020

What's new:
- Big improvements to Postman import
- Added back the backward compatibility test command

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/0.11.0/qontract.jar)

### Release 0.10.0

Date: 1st June 2020

What's new:
- Convert stub files into Qontract files
- Convert Postman collections into Qontract files
- Improved support for CORS

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/0.10.0/qontract.jar)

### Release 0.9.0

Date: 25th May 2020

What's new:
- Helper methods for invoking Kafka from Karate
- Dynamic stub over an HTTP API after Qontract has been started
- Stub reloads when contract files or stub files are updated
- Suggestions can be passed as a commandline argument
- Improvements to XML support

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/0.9.0/qontract.jar)

### Release 0.8.0

Date: 19th May 2020

What's new:
- Support for message in Kafka
- Faster comparison of contracts

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/0.8.0/qontract.jar)

### Release 0.7.0

Date: 10th May 2020

What's new:
- Test mode can now hit an https end point
- Added preliminary support for multipart form data 
- Added the version checkGitFile command to test whether the latest file checked out is compatible with the file at the same path in the last commit.

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/0.7.0/qontract.jar)

### Release 0.6.1

Date: 5th May 2020

What's new:
- Qontract can suggest the version number of a contract using the new command `version`
- Qontract stub now logs requests and responses

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/0.6.1/qontract.jar)

### Release 0.6.0

Date: 4th May 2020

What's new:
- Headers can be marked optional
- Stub data for multiple contracts can be loaded from a single directory.
- Sub types can now be stubbed out. E.g. if the contract says (string?), (string) and (null) can both be used in the stub data instead of literal values.
- Improved support for nullable keys and values in stub data
- A java helper method for setting up stubs with data
- A java helper to pick up a contract by specifying the major and minor version

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/0.6.0/qontract.jar)

### Release 0.5.0

Date: 27th April 2020

Notes:
- Added versioning flows
- Stubs can now contain a type in the expectation instead of only hardcoded values, which will match any incoming input of that type.
- Multiple contracts can now be loaded into a single process.

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/0.5.0/qontract.jar)

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

Standalone jar - [qontract.jar](https://github.com/qontract/qontract/releases/download/0.4.0/qontract.jar)

### Release 0.3.1

Date: 11th April 2020

Notes:
- Improved commandline output of compare and test commands
- Fixed a few bugs

Standalone jar - [qontract-0.3.0-all.jar](https://github.com/qontract/qontract/releases/download/0.3.1/qontract-0.3.1-all.jar)

### Release 0.3.0

Date: 11th April 2020

Notes:
- Improved error messages
- Added support for (datetime), (url) and (url https)
- Added the compare command to the executable. It compares two contracts, and reports on whether they are compatible, or whether one is backward compatible with the other

Standalone jar - [qontract-0.3.0-all.jar](https://github.com/qontract/qontract/releases/download/0.3.0/qontract-0.3.0-all.jar)

### Release 0.2.0

Date: 5th April 2020

Notes:
* Added support for nulls
* Improved test and stub commands, now there's no need to specify run and start respectively at the end

Standalone jar - [qontract-0.2.0-all.jar](https://github.com/qontract/qontract/releases/download/0.2.0/qontract-0.2.0-all.jar)

### Release 0.1

Date: 27th March 2020

Notes:
* adding JUnit 5 support as library
* adding form field support
* bug fixes

Standalone jar - [qontract-0.1.0-all.jar](https://github.com/qontract/qontract/releases/download/0.1/qontract-0.1.0-all.jar)

### Release 0.1.0

Date: 19th March 2020

Notes: Trial release to MavenCentral

**DEPRECATED**

Features:
* Programmatic support for Contract as Mock and Contract as Test
* Commandline support for Contract Stub, Contract as Test

Standalone jar - [qontract-0.0.1-all.jar](https://github.com/qontract/qontract/releases/download/v0.0.1/qontract-0.0.1-all.jar)
