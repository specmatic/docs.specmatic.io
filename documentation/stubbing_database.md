---
layout: default
title: Troubleshooting
parent: Documentation
nav_exclude: true
---

## Introduction to Database Stubbing

This documentation describes how to stub out the Database using JUnit 5.

### Pre-requisite Setup
Add the below-mentioned dependencies in `pom.xml`. Use the latest version of the dependencies.

```
<dependency>
   <artifactId>database-mock</artifactId>
   <groupId>in.specmatic</groupId>
   <scope>test</scope>
   <version>0.61.6-db</version>
   <exclusions>
       <exclusion>
           <groupId>in.specmatic</groupId>
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
   <groupId>in.specmatic</groupId>
   <artifactId>specmatic-core</artifactId>
   <version>0.65.1</version>
   <scope>test</scope>
</dependency>
```

- Sometimes there is a Xerces library version conflict, and in this case, you could find out the version of Xerces used by Specmatic, and pin it in the pom.xml dependencies.

- Below is the dependency example for Xerces library.   
```
<dependency>
   <groupId>xerces</groupId>
   <artifactId>xercesImpl</artifactId>
   <version>2.12.0</version>
   <scope>test</scope>
</dependency>
```

### Setup guidelines

There are two approaches to stub out the database:

### 1. Approach First:

A database can be stubbed out like any other HTTP dependency by using a database contract [database specification file](./database_stubbing_files/db.yaml).

* We are setting database expectations on the Specmatic stub server (`http://localhost:9000`).

* Specmatic is using path `/` for database stubbing.


#### How it works

* Specmatic stubs a database using [database specification file](./database_stubbing_files/db.yaml) and sets the database expectations on stub server `http://localhost:9000`.

* When we hit the database stub server it returns a response with set expectations.

#### Configuration Setup guidelines

* You need to configure your DataSource for the database as below, by using JdbcMockFactory and pointing to ExternalStub of the Specmatic stub server.

  - Example:- Using JAVA
```
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

```
spring.main.allow-bean-definition-overriding=true
```

### Setting Expectations
  Refer to the [Setting Database stub expectations](#setting-database-stub-expectations) section for setting database expectations for specific queries.

  Database expectation setting can be done in two ways as follows:
1. Post an expectation to `http://localhost:9000/_specmatic/expectations` with the expected data.
2. By using the `contract-file-name_data` directory
   * Create the `db_stub_contracts` directory under the   `src/test/resources/` package.
   * Keep the [database specification file](./database_stubbing_files/db.yaml) inside `db_stub_contracts` directory.
   * Make a directory `db_data` inside the `db_stub_contracts` directory, which is a similar parent directory of `db.yaml`.
   * Keep all database query expectation files inside the `db_data` directory.

* We can start the stub server by giving the db.yaml file address using the Specmatic stub command.
* If you are using the specmatic.json file then, In the `specmatic.json` file in a local source add the address of the `db.yaml` file inside the value of the stub attribute.
  * Example:-
```
    "sources":[
        {
           "provider": "git",
           "stub": [
           "src/test/resources/db_stub_contracts/db.yaml"
             ]
        }
    ]
```

### 2. Approach Second:

Specmatic runs a stub server on port 9090 dedicated to database stubbing.

* We are setting database expectations on the Specmatic database stub server (`http://localhost:9090`).

* Specmatic is using path `/` for the database stubbing.


#### How it works

1. Specmatic runs a stub server on port 9090 dedicated to database stubbing and sets the data expectations which were posted on the `http://localhost:9090` server.
2. Specmatic installs a JDBC hook that intercepts DB queries and forwards them to the above stub server on port 9090 and returns the set expectations.

#### Configuration Setup guidelines

* You need to configure your DataSource for the database as below by using JdbcMockFactory and creating a new DBStub server on the 9090 port.

Example:- Using JAVA you can use the following helper code.
```
DataSource mockDataSource = null;

JdbcMockFactory jdbcMockFactory = null;

@Bean(destroyMethod = "close")
public JdbcMockFactory jdbcMockFactory() {
    if (jdbcMockFactory == null) jdbcMockFactory = new JdbcMockFactory(new DBStub("localhost",9090));
    if (mockDataSource == null) mockDataSource = jdbcMockFactory.createDataSource();
    return jdbcMockFactory;
}
```
 - From the above code you can return the DataSource object created in the jdbcMockFactory method to your DataSource. 
 - Add the below property in the respective profile application properties file.

```
spring.main.allow-bean-definition-overriding=true
```

### Setting Expectations

Refer to the [Setting Database stub expectations](#setting-database-stub-expectations) section for setting database expectations for specific queries.

Database expectation setup is as follows:

- Post an expectation to `http://localhost:9090/_specmatic/expectations` with the expected data.

We can use the following setup to post multiple expectations,
1. Create the `db_stub_expectations` directory under the `src/test/resources/` package. 
2. Keep all database query expectation files inside the `db_stub_expectations` directory.
3. You can use the following code to post multiple expectations to the database stub server.

* We can declare the database stub server URL in a variable:- 

    ```private static final String dbExpectationsURL = "http://localhost:9090/_specmatic/expectations";```

* We need to set expectations inside before each tagged method.
```
@BeforeEach
public void before() throws Exception {
setDBExpectations();
}
```
* Use the following helper methods for database expectation setting:-

```
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

For dynamic queries, we can use the Specmatic feature of [matching the request body with regular expressions](./service_virtualization_tutorial.md).

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
