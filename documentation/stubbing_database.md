---
layout: default
title: Database Stubbing (Private Beta)
parent: Documentation
nav_exclude: true
---

# Database Stubbing (Private Beta)

> The `database-mock` module described in this document is currently in private beta. Please get in touch with us through the `Contact Us` form at https://specmatic.in if you'd like to try it out.

## Introduction to Database Stubbing

This documentation describes how to stub out the Database.

### Pre-requisites
The following dependencies should be added to `pom.xml`.

```xml
<dependency>
   <artifactId>database-mock</artifactId>
   <groupId>io.specmatic</groupId>
   <scope>test</scope>
   <version>{{ site.db_release }}</version>
   <exclusions>
       <exclusion>
           <groupId>io.specmatic</groupId>
           <artifactId>specmatic-core</artifactId>
       </exclusion>
   </exclusions>
</dependency>

<dependency>
   <groupId>p6spy</groupId>
   <artifactId>p6spy</artifactId>
   <version>3.9.1</version>
   <scope>test</scope>
</dependency>

<dependency>
   <groupId>com.mockrunner</groupId>
   <artifactId>mockrunner-jdbc</artifactId>
   <version>2.0.6</version>
   <scope>test</scope>
</dependency>

<dependency>
   <groupId>io.specmatic</groupId>
   <artifactId>specmatic-core</artifactId>
   <version>{{ site.latest_release }}</version>
   <scope>test</scope>
</dependency>
```

Sometimes there is a Xerces library version conflict. Find out the version of Xerces used by Specmatic, and pin it in the pom.xml dependencies. For example:

```xml
<dependency>
  <groupId>xerces</groupId>
  <artifactId>xercesImpl</artifactId>
  <version>2.12.0</version>
  <scope>test</scope>
</dependency>
```

### Setup The Stub Server

Specmatic's database mock leverages the Specmatic HTTP server, as the two have a number of features in common.

Due to this, there are two ways to start-up a database mock.

#### Approach 1 (default, recommended)

* Setup the following bean in the test section. Make sure to annotate either the bean or it's `@Configuration` class with `@Primary`.

  ```java
  DataSource mockDataSource = null;

  JdbcMockFactory jdbcMockFactory = null;

  @Bean(destroyMethod = "close")
  public JdbcMockFactory jdbcMockFactory() {
      if (jdbcMockFactory == null) jdbcMockFactory = new JdbcMockFactory(new DBStub("localhost",9090));
      if (mockDataSource == null) mockDataSource = jdbcMockFactory.createDataSource();
      return jdbcMockFactory;
  }
  ```

* And in the properties file:

  ```properties
  spring.main.allow-bean-definition-overriding=true
  ```

Note that we are passing port 9090 to the DBStub class.The internal Specmatic server will be started up on this port. All expectations must be set on this port. We will see more on how to set expectations below.

#### Approach 2

Specmatic can leverage an external HTTP stub server. This can prove useful when DB expectations need to be set even before the Spring beans are constructed.

* Ensure that [this contract](./database_stubbing_files/db.yaml) is in one of the "consumes" sections in `specmatic.json`.

* Configure your DataSource for the database as below, by using JdbcMockFactory and pointing to ExternalStub of the Specmatic stub server.

  ```java
  DataSource mockDataSource = null;

  JdbcMockFactory jdbcMockFactory = null;

  @Bean(destroyMethod = "close")
  public JdbcMockFactory jdbcMockFactory() {
      if (jdbcMockFactory == null) jdbcMockFactory = new JdbcMockFactory(new ExternalStub("localhost", 9000));
      if (mockDataSource == null) mockDataSource = jdbcMockFactory.createDataSource();
      return jdbcMockFactory;
  }
  ```
 
- From the above code you can return the DataSource object created in the jdbcMockFactory method to your DataSource.
- Add the below property in the respective profile application properties file.

  ```properties
  spring.main.allow-bean-definition-overriding=true
  ```

### How To Set Expectations
* We can use the following setup to post multiple expectations,
  1. Create the `db_stub_expectations` directory under the `src/test/resources/` package. 
  2. Keep all database query expectation files inside the `db_stub_expectations` directory.
  3. Dynamically send those expectations to the 

* Post an expectation to `http://localhost:9090/_specmatic/expectations` with the expected data. Set the port in the above URL to port on which the Specmatic HTTP stub is running.

* We can declare the database stub server URL in a variable

  ```java
    private static final String dbExpectationsURL = "http://localhost:9090/_specmatic/expectations";
  ```

* We need to set expectations inside before each tagged method.

  ```java
  @BeforeEach
  public void before() throws Exception {
  setDBExpectations();
  }
  ```

* Use the following helper methods for database expectation setting:-

  ```java
  private void setDBExpectations() throws IOException {
      File directoryPath = new File("src/test/resources/db_stub_expectations");
      File[] filesList = directoryPath.listFiles();
      assert filesList != null;
      Arrays.sort(filesList);
      for (File file : filesList) {
      setExpectation(FileUtils.readFileToString(new File(file.getPath())),dbExpectationsURL);
      }
  }

  private static void setExpectation(String expectation, String dbExpectations) {
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);
      headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
      HttpEntity<String> request = new HttpEntity<>(expectation, headers);
      ResponseEntity<String> response = new RestTemplate().postForEntity(dbExpectations, request, String.class);
      assert response.getStatusCode() == HttpStatus.OK;
  }
  ```    

## Setting Database stub expectations.

Below are some examples of how we can set the expectations for database stubbing.

### Stubbing out SELECT statements (SELECT * FROM)

SELECT statements return data.

To stub out `SELECT * FROM NAMES` and return 2 rows containing names:

```json
{
  "http-request": {
    "path": "/",
    "method": "POST",
    "body": "SELECT * from NAMES"
  },
  "http-response": {
    "status": "200",
    "body": {
      "rows": [
        {
          "name": "Sumita"
        },
        {
          "name": "Ashok"
        }
      ]
    }
  }
}
```

The keys should be the column names expected by the application.

### Stubbing out DML statements (INSERT, UPDATE and DELETE statements)

Usually INSERT, UPDATE and DELETE statements return no data. But they affect certain rows and return the number of rows affected.

To stub out `UPDATE EMPLOYEES set language="English" where country="US"`, which updates 2 rows in the DB:

```json
{
"http-request": {
    "path": "/",
    "method": "POST",
    "body": "UPDATE EMPLOYEES set language=\"English\" where country=\"US\""
},
"http-response": {
    "status": "200",
    "body": {
        "affectedRows": 2
    }
}
}
```

### Regex matching

To match a query where some parameters are hard to guess but where most of the query is known, use `bodyRegex`.

```json
{
  "http-request": {
      "path": "/",
      "method": "POST",
      "body": "(string)",
      "bodyRegex": "UPDATE EMPLOYEES set language=\".*\" where country=\".*\""
  },
  "http-response": {
      "status": "200",
      "body": {
          "affectedRows": 2
      }
  }
}
```

This will match any a query with any language and country.
