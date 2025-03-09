# Banking API - Fintech Mobile Application Backend

This is a NestJS application that provides RESTful APIs for a fintech banking mobile application.

## Implemented Features

- **User Management**
  - User registration and authentication
  - JWT-based security

- **Account Management**
  - Create and manage different account types (checking, savings)
  - Account balance tracking
  - View account details

- **Transaction Processing**
  - Deposits
  - Withdrawals
  - Transfers between accounts
  - Transaction history

## Tech Stack

- **NestJS** - Node.js framework for building efficient and scalable server-side applications
- **TypeORM** - ORM for TypeScript and JavaScript
- **SQLite/PostgreSQL** - Database (SQLite for development, PostgreSQL for production)
- **JWT** - Authentication
- **Jest** - Testing
- **Swagger** - API Documentation

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (optional, SQLite is used by default)

## Project Structure

```
banking-api/
├── src/
│   ├── config/             # Configuration files
│   ├── modules/            # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── users/          # User management
│   │   ├── accounts/       # Account management
│   │   └── transactions/   # Transaction processing
│   ├── common/             # Shared utilities
│   ├── app.module.ts       # Main application module
│   └── main.ts             # Application entry point
├── docs/                   # Documentation
│   ├── schema.md           # Database schema documentation
│   └── banking-api.postman_collection.json # Postman collection
├── test/                   # Test files
└── .env                    # Environment variables
```

## Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Environment configuration

Copy the `.env.example` file to `.env` and adjust the values as needed:

```bash
cp .env.example .env
```

## Database Configuration

By default, the application uses SQLite for simplicity. To use PostgreSQL:

1. Modify the `.env` file:
```
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=banking_api
```

2. Create the PostgreSQL database:
```bash
createdb banking_api
```

## Running the Application

```bash
# Development mode
npm run start

# Watch mode (auto-restart on file changes)
npm run start:dev

# Production mode
npm run start:prod
```

The application will be available at http://localhost:3000

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

http://localhost:3000/api

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user

### Accounts
- `POST /accounts` - Create a new account
- `GET /accounts` - Get all accounts for the authenticated user
- `GET /accounts/:id` - Get account by ID
- `GET /accounts/:id/balance` - Get account balance

### Transactions
- `POST /transactions` - Create a new transaction (deposit, withdrawal, transfer)
- `GET /transactions` - Get all transactions for the authenticated user
- `GET /transactions/:id` - Get transaction by ID
- `GET /transactions/account/:accountId` - Get transactions for a specific account

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Schema Diagram

The database schema diagram is available in the `docs` folder as `schema.md`.

## API Collection

A Postman collection of API endpoints is available in the `docs` folder as `banking-api.postman_collection.json`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
