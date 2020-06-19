---
layout: default
title: Suggestions
parent: Documentation
nav_order: 7
---
Suggestions
===========

Let us assume you are running the above test command against a real service. And let us also assume that only pet id 123 exists as per your data setup.
In this scenario when test generates a random petid you will most likely get a 404. So under these circumstances you can mention the petId as an example.

    Feature: Contract for the petstore service

    Scenario: Should be able to get a pet by petId url parameter
      When GET /pets/(petid:number)
      Then status 200
      And response-body {petid: "(number)"}
      Examples:
      | petid |
      | 123  |

What if the Examples vary by the environment. Example: Your staging environment may have petid 345.
Examples that vary by environment should be externalised to environment specific suggestion files.

In order to author a suggestion file, just copy over the same contract content to another file and remove everything except Feature, Scenario and Examples keywords.
Let us call it suggestions-staging.qontract just to indicate that this file is related to staging. You can call it anything you like.
Now we can remove the examples section in the contract. Below is an example.

service.qontract

    Feature: Contract for the petstore service
   
       Scenario: Should be able to get a pet by petId url parameter
         When GET /pets/(petid:number)
         Then status 200
         And response-body {petid: "(number)"}

suggestions-staging.qontract

    Feature: Contract for the petstore service

      Scenario: Should be able to get a pet by petId url parameter
        Examples:
        | petid |
        | 345   |
        
Note: It is mandatory to name the scenario and also scenario names must be unique when using suggestions. This is because test command needs to lookup the scenario by name in the contract and map the Examples in suggestions to it.    

### Command Line

    qontract test --suggestions="../petstore/qontract/suggestions-staging.qontract" --host="staging-server" --port="8000" "../petstore/qontract/service.qontract"

Alternatively:

    qontract test --suggestions='{"Contract for the petstore service": [{"petid": 345}]}' service.qontract

Consider the json object in above command. Note that the scenario name is used as the key, and each element of the array consist of a json object, with column names and values as keys and values respectively.

### Programmatic

TODO 
