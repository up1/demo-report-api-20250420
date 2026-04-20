# Develop REST API with NodeJS and Express

## Technologies
* NodeJS
* Express
* CORS middleware
* SQLite with [sqlite in node 22+](https://nodejs.org/api/sqlite.html)
* Don't add .env file to git, use .env.sample instead for reference

## Project structure with layer architecture
```
backend/
├── controllers/
│   └── reportController.js
├── services/
│   └── reportService.js
├── routes/
│   └── reportRoutes.js
├── database/
│   └── db.js
├── index.js
├── package.json
├── .env.sample
├── test_db.db
```

## Build and run the server
Install dependencies
```
$npm install
```

Start the server
```
$node index.js
```
Open http://localhost:3000 to view it in the browser

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
3. Send question and prompt template to OpenAI with [npm openai library](https://www.npmjs.com/package/openai) and Prompt template
   * Read OPENAI_API_KET from environment variable
   * use model=gpt-5.4-nano
4. Check result as SELECT sql from OpenAI
   * 4.1 Pass then go to step 5
   * 4.2 Fail then return error 500 to client
5. Execute SQL query to sqlite database in file test_db.db with [sqlite in node](https://nodejs.org/api/sqlite.html)
   * 5.1 Pass and not empty then generate result with code=200
   * 5.2 Pass and empty then generate result a with code=404 data not found
   * 5.3 Error then generate result with code=500 system error