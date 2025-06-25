# PassVault API Documentation

## Overview

PassVault is a secure credential management API built with Go and Chi router.

## Base URL

```
http://localhost:8200/api/v1
```

## Endpoints

### Health Check

- **GET** `/health`
- **Description**: Check if the API is running
- **Response**:
  ```json
  {
    "status": "ok",
    "message": "PassVault API is running"
  }
  ```

### Credentials

#### Create Credential

- **POST** `/api/v1/credentials`
- **Description**: Store a new credential
- **Request Body**:
  ```json
  {
    "username": "john@example.com",
    "password": "securepassword123",
    "description": "My email account",
    "tags": "[]"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Credential stored successfully"
  }
  ```

#### Get All Credentials

- **GET** `/api/v1/credentials`
- **Description**: Retrieve all stored credentials
- **Response**:
  ```json
  [
    {
      "id": 1,
      "username": "john@example.com",
      "password": "securepassword123",
      "description": "My email account",
      "tags": "[]",
      "created_at": "2025-06-23T10:00:00Z",
      "updated_at": "2025-06-23T10:00:00Z"
    }
  ]
  ```

#### Get Single Credential

- **GET** `/api/v1/credentials/{id}`
- **Description**: Retrieve a specific credential by ID
- **Parameters**:
  - `id` (path): Credential ID
- **Response**: Same as individual credential object above

#### Delete Credential

- **DELETE** `/api/v1/credentials/{id}`
- **Description**: Delete a credential by ID
- **Parameters**:
  - `id` (path): Credential ID
- **Response**:
  ```json
  {
    "message": "Credential deleted successfully"
  }
  ```

## Validation Rules

### Username

- Minimum length: 3 characters
- Maximum length: 32 characters

### Password

- Minimum length: 8 characters
- Maximum length: 64 characters

## Environment Variables

| Variable              | Default                | Description               |
| --------------------- | ---------------------- | ------------------------- |
| `PORT`                | `8200`                 | Server port               |
| `DATABASE_PATH`       | `./credentials.sqlite` | SQLite database file path |
| `REQUEST_TIMEOUT`     | `20s`                  | HTTP request timeout      |
| `PASSWORD_MIN_LENGTH` | `8`                    | Minimum password length   |
| `PASSWORD_MAX_LENGTH` | `64`                   | Maximum password length   |
| `USERNAME_MIN_LENGTH` | `3`                    | Minimum username length   |
| `USERNAME_MAX_LENGTH` | `32`                   | Maximum username length   |

## Error Responses

All errors return appropriate HTTP status codes with JSON error messages:

```json
{
  "error": "Error description"
}
```

Common status codes:

- `400`: Bad Request (validation errors)
- `404`: Not Found (credential not found)
- `500`: Internal Server Error (database errors)

## Getting Started

1. Clone the repository
2. Navigate to the `api` directory
3. Run `go mod tidy` to install dependencies
4. Set environment variables (optional)
5. Run `go run main.go`
6. The API will be available at `http://localhost:8200`
