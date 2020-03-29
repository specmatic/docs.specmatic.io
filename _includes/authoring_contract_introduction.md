Copy paste below text into a file with name "service.qontract". This, as you can see, uses the Gherkin syntax to describe a basic GET request. 

    Feature: Contract for the petstore service

    Scenario: Should be able to get a pet by petId
      When GET /pets/(petid:number)
      Then status 200
      And response-body {petid: "(number)"}

There are some extra keywords that make it easier to define APIs.
* GET and related URL
* status
* response-body
* (number) - placeholder for number datatype

These keywords are documented in the contract syntax reference. TODO
