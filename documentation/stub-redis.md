
## Introduction to Redis Stubbing
This documentation describes how to stub out redis using JUnit 5

### Pre-requisite Setup
Below-mentioned dependency needs to be in pom.xml

```
<dependency>
    <groupId>in.specmatic</groupId>
    <artifactId>specmatic-redis</artifactId>
    <version>0.5.0</version>
</dependency>
```

### Start Redis Server

Below code section shows how to start redis server
```
@BeforeAll
public void startRedis() throws Exception {
    RedisMock redisMock = new RedisMock();
    redisMock.start();
}
```

* This will start two servers :

  * A mock redis server running on port: 6379 on localhost
  * A specmatic stub server running on port: 9000 on localhost 
  * You can override the default host/port values of redis server by providing them if requires:

    ```
    RedisMock redisMock = new RedisMock("localhost", 61919);
    ```

### Stop Redis Server

Below code section shows how to shut-down redis server
```
@AfterAll
public void stopRedis() throws Exception {
    redisMock.stop();
}
```

### Set Redis Expectations

Below code sections shows how to set expectation for Redis
```
redisMock.setExpectation(<expectation json file>);
```

### Stub Format
Here's the redis [contract](./redis-stubbing/redis-mock.yaml)

[Here's an example](./redis-stubbing/get_a_string.json) of how to stub out a Redis call that sends a key and gets back a string.

[Here's an example](./redis-stubbing/get_a_number.json) of how to stub out a Redis call that sends a key and gets back a number.

[Here's an example](./redis-stubbing/pass_an_lrange_and_return_an_array.json) of how to stub out a Redis call that sends an lrange and gets back an array.

[Here's an example](./redis-stubbing/get_a_map.json) of how to stub out a Redis call that sends a key and gets back a map object.


