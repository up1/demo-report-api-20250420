# Backend Testing with nodejs

## Libraries
- Jest
- [Supertest](https://www.npmjs.com/package/supertest)
- Must create test cases in folder `__tests__` and name files with `.test.js` suffix (e.g. `api.test.js`).

## Goal of testing
- Must mock dependencies (e.g. database, external APIs) to isolate the code being tested.
  - In project must mock sqlite and openai dependencies.
- To ensure that the backend API endpoints are working correctly and returning the expected responses.
- To catch any bugs or issues in the backend code before they reach production.
- To improve the overall quality and reliability of the backend code.

## Test cases
1. Success case: When the API endpoint is called with valid input, it should return the expected response.
2. Error case: When the API endpoint is called with invalid input, it should return an appropriate error response.
3. Edge case: When the API endpoint is called with edge case input (e.g. empty input, very large input), it should handle the input gracefully and return an appropriate response.

## REST API Endpoints
* Success case (200 OK)
  * Results with dynamic column names and values
  * Pagination information (page number and size)
* Data not found case (404 Not Found)
  * Message indicating data not found
* System error case (500 Internal Server Error)
  * Message indicating system error

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