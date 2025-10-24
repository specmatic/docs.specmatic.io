---
layout: default
title: Database Stubbing
parent: Documentation
nav_exclude: true
---

# Database Stubbing
{: .d-inline-block }
Commercial
{: .label }

- [Database Stubbing](#database-stubbing)
    - [Introduction to Database Stubbing](#introduction-to-database-stubbing)
    - [Pre-requisites](#pre-requisites)
    - [Setup The Stub Server](#setup-the-stub-server)
    - [Setting Up Database Expectations](#setting-up-database-expectations)
      - [Using a Directory of Expectations](#using-a-directory-of-expectations)
      - [Posting Expectations](#posting-expectations)
    - [Expectations Formats](#expectations-formats)
      - [SELECT statements](#select-statements)
      - [DML Statements (INSERT, UPDATE, DELETE)](#dml-statements-insert-update-delete)
        - [INSERT statements](#insert-statements)
        - [UPDATE statements](#update-statements)
        - [DELETE statements](#delete-statements)
      - [Mocking Aggregate or Computed Results](#mocking-aggregate-or-computed-results)
      - [Using Placeholders and Special Value Types](#using-placeholders-and-special-value-types)
      - [Regex Matching for Flexible Queries](#regex-matching-for-flexible-queries)
    - [Sample Applications](#sample-applications)


{: .note}
The `specmatic-jdbc` module described in this document is available in the [Pro plan](https://specmatic.io/pricing/) or higher. Please get in touch with us through the `Contact Us` form at [specmatic.io](https://specmatic.io) if you'd like to try it out.

### Introduction to Database Stubbing

Database stubbing allows you to simulate database behavior without connecting to a real database. It’s useful for testing application logic, verifying SQL queries, and controlling predictable responses during development. 

By defining stubs for different SQL operations such as `SELECT`, `INSERT`, `UPDATE`, and `DELETE` you can emulate how your application interacts with the database while keeping tests fast, isolated, and reproducible.

### Pre-requisites

The below-mentioned dependency needs to be in your application's `build.gradle` or `pom.xml`

{% tabs dependencies %}
{% tab dependencies maven %}
```xml
<dependency>
   <artifactId>specmatic-jdbc</artifactId>
   <groupId>io.specmatic.jdbc</groupId>
   <scope>test</scope>
   <version>{{ site.specmatic-jdbc-version }}</version>
</dependency>
```
{% endtab %}
{% tab dependencies gradle %}
```shell
testImplementation("io.specmatic.jdbc:specmatic-jdbc:{{ site.specmatic-jdbc-version }}")
```
{% endtab %}
{% endtabs %}

Sometimes there is a Xerces library version conflict. Find out the version of Xerces used by Specmatic, and pin it in your `build.gradle` or `pom.xml`, for example:

{% tabs XercesConflict %}
{% tab XercesConflict maven %}
```xml
<dependency>
  <groupId>xerces</groupId>
  <artifactId>xercesImpl</artifactId>
  <version>2.12.0</version>
  <scope>test</scope>
</dependency>
```
{% endtab %}
{% tab XercesConflict gradle %}
```shell
testImplementation("xerces:xercesImpl:2.12.0")
```
{% endtab %}
{% endtabs %}

### Setup The Stub Server

Specmatic JDBC leverages the Specmatic HTTP server, as the two have a number of features in common<br/>

* Setup the following bean in the test section:

  ```java
  @Primary
  @Bean
  public DataSource dataSource() {
      return new JdbcStubFactory().createDataSource(DATABASE_STUB_PORT, DATABASE_EXPECTATIONS_DIRECTORY);
  }
  ```

* And in the properties file:

  ```properties
  spring.main.allow-bean-definition-overriding=true
  ```

### Setting Up Database Expectations
When writing integration or contract tests involving database stubs, you need to set expectations representing the database queries and their expected results. This is typically done by posting expectation JSON files to the running Specmatic stub server before executing tests, or passing the expectations as part of the test setup.

#### Using a Directory of Expectations

If you have a directory containing multiple database expectation files, the easiest and cleanest approach is to instantiate `Specmatic-JDBC` with the stub port and the path to that directory. This allows Specmatic to automatically read and post all expectations for you, keeping your test setup simple and maintainable.

```java
jdbcMockFactory.createDataSource(DATABASE_STUB_PORT, DATABASE_EXPECTATIONS_DIRECTORY);
```
* `DATABASE_STUB_PORT`: The port on which the Specmatic database stub runs (e.g., `9090`).
* `DATABASE_EXPECTATIONS_DIRECTORY`: The path to your expectations folder (e.g., `src/test/resources/db_stub_expectations`).

#### Posting Expectations

In some cases, you may want to post expectations from specific files located anywhere for example `src/test/resources/` directory, rather than processing an entire folder. For such scenarios, you can explicitly list and post only those files to the expectations endpoint `http://localhost:{PORT}}/_specmatic/expectations`

```java
// Assuming the stub server is running on port 9090
private static final String dbExpectationsURL = "http://localhost:9090/_specmatic/expectations";

@BeforeEach
public void before() throws Exception {
    setSpecificDBExpectations();
}

private void setSpecificDBExpectations() throws IOException {
    List<String> files = Arrays.asList(
        "src/test/resources/db_stub_expectations/user_query.json",
        "src/test/resources/special_expectations/order_summary.json"
    );

    for (String filePath : files) {
        String expectation = FileUtils.readFileToString(new File(filePath), StandardCharsets.UTF_8);
        setExpectation(expectation, dbExpectationsURL);
    }
}

private static void setExpectation(String expectation, String dbExpectationsURL) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
    HttpEntity<String> request = new HttpEntity<>(expectation, headers);
    ResponseEntity<String> response = new RestTemplate().postForEntity(dbExpectationsURL, request, String.class);
    assert response.getStatusCode() == HttpStatus.OK;
}
```

This method gives you fine-grained control to load expectations only from the files relevant to that test, rather than loading the entire directories.

### Expectations Formats

The Expectations Formats define how to specify database query stubs for `Specmatic-JDBC` mock. Each expectation describes how a particular SQL statement should behave when executed, allowing you to define fixed results for `SELECT` queries or control update effects for `INSERT`, `UPDATE`, and `DELETE` statements.

The following examples show consistent patterns for defining expectations across different SQL operations.

#### SELECT statements

`SELECT` statements are used to retrieve data from a table. When stubbing these, you simulate the database returning rows of structured data that the application would expect.

Here’s an example showing how to mock a `SELECT` query for a column called name, returning two rows:

```json
{
  "query": "SELECT name FROM NAMES",
  "response": {
    "rows": [
      { "name": "Sumita" },
      { "name": "Ashok" }
    ]
  }
}
```

#### DML Statements (INSERT, UPDATE, DELETE)

`INSERT`, `UPDATE`, and `DELETE` statements affect table data but typically don’t return rows. 
Instead, they return metadata such as how many rows were modified or what new keys were generated.

##### INSERT statements

This stub represents an INSERT operation into the STUDENTS table, creating a new student named Charles and returning a generated key, 
It communicates that one row was inserted and assigns the auto-generated ID 10 to the new record.

```json
{
  "query": "INSERT INTO STUDENTS (id, name) values (default, \"Charles\")",
  "response": {
    "affectedRows": 1,
    "generatedKeys": [
      { "id": 10 }
    ]
  }
}
```

##### UPDATE statements

This stub simulates an `UPDATE` query that modifies two rows in the database:

```json
{
  "query": "UPDATE EMPLOYEES set language=\"English\" where country=\"US\"",
  "response": {
    "affectedRows": 2
  }
}
```

##### DELETE statements

This stub indicates that one row was deleted when the query was executed:

```json
{
  "query": "DELETE FROM STUDENTS",
  "response": {
    "affectedRows": 1
  }
}
```

#### Mocking Aggregate or Computed Results

Sometimes, the query doesn’t return full records but rather computed values such as counts or averages. You can stub these the same way as regular `SELECT` results.

Here’s an example that mocks a query returning the result of a count operation, This example simulates a query reporting that the table contains 10 records:

```json
{
  "query": "SELECT COUNT(*) FROM some_table",
  "response": {
    "rows": [
      { "COUNT(*)": 10 }
    ]
  }
}
```

#### Using Placeholders and Special Value Types

Sometimes, mock data needs to convey not just the value but also its intended data type, for example, to show that a field should be treated as a date rather than as plain text.

You can do this by using typed placeholders with the format `(mocktype:<type>)`, These markers indicate what kind of data the value represents.

```json
{
  "query": "SELECT date_value FROM some_table",
  "response": {
    "rows": [
      { "date_value": "(mocktype:date) 2019-01-01" }
    ]
  }
}
```

#### Regex Matching for Flexible Queries

When query parameters vary but you want to match the general pattern, you can use `queryRegex` instead of an exact query field. This allows for pattern-based matching.
For example this stub matches any `UPDATE` statement that changes the language column for some country, regardless of the specific values:

```json
{
  "queryRegex": "UPDATE EMPLOYEES set language=\".*\" where country=\".*\"",
  "response": {
    "affectedRows": 2
  }
}
```

It acts like a flexible template that matches multiple similar update statements with different values, You can also use regex for `SELECT` statements. 
For example this captures any vaguely similar SELECT statement and returns a mock record:

```json
{
  "queryRegex": "select from .*",
  "response": {
    "rows": [
      { "statement":  "hello \"world\"" }
    ]
  }
}
```

### Sample Applications

Please have a look at one of the below mentioned sample applications to understand how to utilize `Specmatic-JDBC` in your application
- [specmatic-jdbc-sample](https://github.com/specmatic/specmatic-jdbc-sample/tree/master/src/test/java/com/component/products)
