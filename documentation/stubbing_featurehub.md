---
layout: default
title: Feature Hub Stubbing
parent: Documentation
nav_order: 32
---
# FeatureHub Stubbing

## Introduction to FeatureHub Stubbing

FeatureHub is a scalable cloud-native feature flag service. You can [read more about it here](https://www.featurehub.io).

FeatureHub Stubbing uses SSE(Server Sent Events) which is based on the concept of events. In SSE, the server sends events to the client, which the client can handle and process as they arrive.


### Pre-requisite Setup
The following dependency needs to be added to pom.xml.

```xml
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>3.3.0</version>
    <scope>test</scope>
</dependency>
```

### Set Feature Flag Expectation

- Set feature flag expectation in BeforeEach method
```code
@BeforeEach
public void before() throws IOException {
    setFeatureFlag();
}
```

- Create a json file `featurehub.json` with following content and keep it in src/test/resources folder
 ```json
{
  "event": "features",
  "id": "332f8278",
  "data": "[{\"id\":\"532657c7-740c-48ee-bc9d-9e101506965a\",\"key\":\"<Feature_Flag_key_Value>\",\"l\":true,\"version\":1,\"type\":\"BOOLEAN\",\"value\":\"<Boolean>\"}]"
}
```
The fields in above-mentioned json refers to :
> event: the event type defined by application </br>
> id: id for each event/message </br>
> data: the data field for the event or message </br>

- Make a POST request to "http://localhost:9000/_specmatic/sse-expectations" with above json body

```code
private static final String featureHubURL = "http://localhost:9000/_specmatic/sse-expectations";

public static void setFeatureFlag() throws IOException {
        final String featureFlagExpectation = FileUtils.readFileToString(new File("src/test/resources/featurehub_expectations/featurehub.json"), StandardCharsets.UTF_8);

        RequestSpecification request = RestAssured.given();
        request.contentType(ContentType.JSON);
        request.baseUri(featureHubURL);
        request.body(featureFlagExpectation);
        Response response = request.post();
        ValidatableResponse validatableResponse = response.then();
        validatableResponse.statusCode(200);
    }
```