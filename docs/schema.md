# Fintech Banking API - Database Schema

## Entity Relationships

```
┌─────────────┐     ┌───────────────┐     ┌────────────────┐
│    User     │     │    Account     │     │  Transaction   │
├─────────────┤     ├───────────────┤     ├────────────────┤
│ id          │─┐   │ id            │  ┌─>│ id             │
│ firstName   │ │   │ accountNumber │  │  │ referenceNumber│
│ lastName    │ │   │ accountType   │  │  │ amount         │
│ email       │ │   │ balance       │  │  │ type           │
│ phoneNumber │ │   │ currency      │  │  │ description    │
│ password    │ │   │ isActive      │  │  │ accountId      │
│ isVerified  │ │   │ userId        │──┘  │ recipientAccId │
│ role        │ └──>│ createdAt     │     │ status         │
│ createdAt   │     │ updatedAt     │     │ createdAt      │
│ updatedAt   │     └───────────────┘     └────────────────┘
└─────────────┘
```

## Table Descriptions

### Users Table
Stores information about registered users.

- **id**: UUID, Primary Key
- **firstName**: String, User's first name
- **lastName**: String, User's last name
- **email**: String, User's email address (unique)
- **phoneNumber**: String, User's phone number (nullable)
- **password**: String, Hashed password
- **isEmailVerified**: Boolean, Whether the email is verified
- **role**: String, User role (customer, admin, etc.)
- **createdAt**: DateTime, When the record was created
- **updatedAt**: DateTime, When the record was last updated

### Accounts Table
Represents bank accounts owned by users.

- **id**: UUID, Primary Key
- **accountNumber**: String, Unique account number
- **accountType**: String, Type of account (checking, savings, credit)
- **balance**: Decimal, Current account balance
- **currency**: String, Currency of the account (default: USD)
- **isActive**: Boolean, Whether the account is active
- **userId**: UUID, Foreign Key to Users table
- **createdAt**: DateTime, When the record was created
- **updatedAt**: DateTime, When the record was last updated

### Transactions Table
Records financial transactions on accounts.

- **id**: UUID, Primary Key
- **referenceNumber**: String, Unique transaction reference
- **amount**: Decimal, Transaction amount
- **type**: String, Transaction type (deposit, withdrawal, transfer)
- **description**: String, Transaction description (nullable)
- **accountId**: UUID, Foreign Key to Accounts table
- **recipientAccountId**: UUID, Foreign Key to Accounts table (nullable, for transfers)
- **status**: String, Transaction status (pending, completed, failed)
- **createdAt**: DateTime, When the transaction occurred

## Relationships

1. **User to Account**: One-to-Many
   - A user can have multiple accounts
   - Each account belongs to one user

2. **Account to Transaction**: One-to-Many
   - An account can have multiple transactions
   - Each transaction is associated with one primary account
   - For transfers, a transaction also references a recipient account 