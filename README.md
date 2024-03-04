# Backend Challenge: Financial Transactions API

## Motivation

The primary goal of this challenge is to design and implement a robust HTTP API that can handle financial transactions securely and efficiently, with a strong emphasis on proper error handling and validation. This API simulates a simplified banking system where users (clients) can perform credit and debit transactions and retrieve their account statements.

## Features

### Transactions

- **Endpoint**: `POST /clientes/[id]/transacoes`
- **Payload**:
  ```json
  {
      "valor": int,
      "tipo": "c"|"d",
      "descricao": "string(1-10 chars)"
  }
  ```
- **Rules**:

  - `[id]` must be an integer representing the client's ID.
  - `valor` must be a positive integer representing the amount in cents.
  - `tipo` can only be 'c' (credit) or 'd' (debit).
  - `descricao` must be a string of 1 to 10 characters.
  - All fields are mandatory.

- **Successful Response**:

  - HTTP 200 OK
  - Body:
    ```json
    {
        "limite": int,
        "saldo": int
    }
    ```
  - `limite` is the client's registered limit.
  - `saldo` is the new balance after the transaction.

- **Error Handling**:
  - If a debit transaction would result in a balance lower than the client's limit, return HTTP 422.
  - HTTP 422 or 400 for invalid payload fields.
  - HTTP 404 if the client ID does not exist.

### Account Statement

- **Endpoint**: `GET /clientes/[id]/extrato`
- **Rules**:

  - `[id]` must be an integer representing the client's ID.

- **Successful Response**:

  - HTTP 200 OK
  - Body:
    ```json
    {
      "saldo": {
        "total": int,
        "data_extrato": "datetime",
        "limite": int
      },
      "ultimas_transacoes": [
        {
          "valor": int,
          "tipo": "c"|"d",
          "descricao": "string",
          "realizada_em": "datetime"
        }
      ]
    }
    ```
  - The statement includes the total balance, statement date, limit, and up to the last 10 transactions.

- **Error Handling**:
  - HTTP 404 if the client ID does not exist.

### Initial Client Setup

- Only five clients should be pre-registered with specific IDs, limits, and initial balances as follows:

| id  | limite   | saldo inicial |
| --- | -------- | ------------- |
| 1   | 100000   | 0             |
| 2   | 80000    | 0             |
| 3   | 1000000  | 0             |
| 4   | 10000000 | 0             |
| 5   | 500000   | 0             |

- Do not register a client with ID 6 to ensure proper handling of non-existent client requests.

## Conclusion

This challenge is designed to test not only the technical capabilities in building RESTful APIs but also the ability to handle edge cases, validate input rigorously, and manage errors effectively. The focus on concurrency and error handling simulates real-world conditions where robustness and reliability are paramount.
