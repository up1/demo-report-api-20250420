# Develop REST API with NodeJS and Express

## Technologies
* Java and Spring Boot for backend development
* Spring Web MVC for REST API
* Spring Data JPA for H2 database access and query execution
  * https://docs.spring.io/spring-data/jpa/reference/jpa.html
* Spring H2 with in-memory database for data storage
  * Intialize tables and generate test data when application start
* Spring AI SDK for OpenAI integration
  * https://docs.spring.io/spring-ai/reference/api/chat/openai-chat.html

## Project structure with layer architecture
```
demojava/src/main/java/com/example/demojava/
├── controllers/
│   └── ReportController.java
├── services/
│   └── ReportService.java
├── repositories/
│   └── ReportRepository.java
├── models/
│   └── ReportRequest.java
│   └── ReportResponse.java
```

## Best practices for REST API development with Java and Spring Boot
1. Use appropriate HTTP methods (GET, POST, PUT, DELETE) for different operations.
2. Use meaningful and consistent endpoint naming conventions (e.g. /api/report).
3. Use appropriate status codes in API responses (e.g. 200 OK, 404 Not Found, 500 Internal Server Error).
4. Validate inputs from client requests and return appropriate error responses if validation fails.
5. Use environment variables to store sensitive information (e.g. API keys) and avoid hardcoding them in the codebase.
6. Handle exceptions gracefully and return appropriate error responses to clients.
7. Use Java Lambda expressions and Stream API for cleaner and more efficient code.
8. Use Spring's dependency injection to manage dependencies and promote loose coupling between components.
9. Use logging to track API requests and responses for debugging and monitoring purposes.
10. Write unit tests for the service layer to ensure the business logic is working correctly and to catch any bugs or issues before they reach production.
11. Configure in application.properties file for database connection and OpenAI API key
```
# OpenAI API configuration
openai.api.key=${OPENAI_API_KEY}
```

## Build and run the server
Build the project
```
$./mvnw clean install
```

Run the server
```
$export OPENAI_API_KEY=your_openai_api_key
$./mvnw spring-boot:run
```
Open http://localhost:8080 to view it in the browser

## Database design
```
CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER)
```

## REST API Endpoints
```
POST /api/report
HTTP Request body
{
  "question": "<input>"
}

HTTP Response with JSON format
code=200 with dynamic column_name and value
{
    "results"[
        "column_name_1": "value1",
        "column_name_2": "value2",
        "column_name_3": "value3",
    ],
    "page_no": 1,
    "size": 10
}

code=404 with data not found
{
   "message": "Data not found"
}

code=500
{
   "message": "System error"
}
```

## Prompt template
System prompt
```
As expert SQL Generator, create SELECT statement from tables in section [[TABLES]] only

and following from rules in section [[RULES]]



[[TABLES]]

<tables schema>


[[RULES]]

Output show only SQL statement and not show other information

Generate on SELECT statement

If user want to other operations, the return value "No No No !!"
```
User prompt
```
<question from user>
```

## Workflow of API
1. Client send request to API
2. Validate inputs from request
   * All fields are required
   * Use validation library (e.g. [Spring Validation](https://spring.io/guides/gs/validating-form-input/)) to validate inputs
   * If validation fail then return error 400 to client
3. Send question and prompt template to OpenAI SDK  and Prompt template
   * Read OPENAI_API_KET from environment variable
   * use model=gpt-5.4-nano
4. Check result as SELECT sql from OpenAI
   * 4.1 Pass then go to step 5
   * 4.2 Fail then return error 500 to client
5. Execute SQL query to H2 database and generate result with Spring Data JPA
   * 5.1 Pass and not empty then generate result with code=200
   * 5.2 Pass and empty then generate result a with code=404 data not found
   * 5.3 Error then generate result with code=500 system error