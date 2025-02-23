# Leave Management System

A comprehensive leave management system built with NestJS, PostgreSQL, and TypeORM.

## Features

- 🔐 JWT Authentication with refresh tokens
- 👥 Role-based access control (Admin, Manager, Employee)
- 📅 Multiple leave types support
- 💼 Leave balance tracking
- ✅ Leave request workflow
- 📧 Email notifications
- 📚 Swagger API documentation
- 🔄 Database migrations and seeding

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v12 or later)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd leave-management
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=leave_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=1h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
```

4. Create the database:
```sql
CREATE DATABASE leave_management;
```

5. Run database migrations:
```bash
npm run migration:run
```

6. Seed the database with initial data:
```bash
npm run seed
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3000`.
API documentation will be available at `http://localhost:3000/api/docs`.

## Default Users

After seeding the database, you can log in with the following credentials:

```
Admin User:
Email: admin@example.com
Password: Admin123!
```

## API Endpoints

### Authentication
- POST /api/auth/login - User login
- POST /api/auth/refresh-token - Refresh access token
- POST /api/auth/logout - User logout
- GET /api/auth/profile - Get current user profile

### Users
- GET /api/users - Get all users (Admin only)
- GET /api/users/:id - Get user by ID
- POST /api/users - Create new user (Admin only)
- PATCH /api/users/:id - Update user (Admin only)
- DELETE /api/users/:id - Delete user (Admin only)

### Leave Types
- GET /api/leave-types - Get all leave types
- GET /api/leave-types/:id - Get leave type by ID
- POST /api/leave-types - Create leave type (Admin only)
- PATCH /api/leave-types/:id - Update leave type (Admin only)
- DELETE /api/leave-types/:id - Delete leave type (Admin only)

### Leave Balances
- GET /api/leave-balances - Get all leave balances
- GET /api/leave-balances/user/:userId - Get user's leave balances
- POST /api/leave-balances - Create leave balance (Admin only)
- PATCH /api/leave-balances/:id - Update leave balance (Admin only)

### Leave Requests
- GET /api/leave-requests - Get all leave requests
- GET /api/leave-requests/:id - Get leave request by ID
- POST /api/leave-requests - Create leave request
- POST /api/leave-requests/:id/approve - Approve leave request (Admin/Manager only)
- POST /api/leave-requests/:id/reject - Reject leave request (Admin/Manager only)
- POST /api/leave-requests/:id/cancel - Cancel leave request

## Project Structure

```
src/
├── auth/                 # Authentication module
├── common/              # Shared utilities, decorators, etc.
├── config/              # Configuration files
├── database/            # Database migrations and seeds
├── email/               # Email service module
├── leave/               # Leave management module
├── users/               # User management module
└── app.module.ts        # Root module
```

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Available Scripts

- `npm run start:dev` - Start application in development mode
- `npm run build` - Build application
- `npm run start:prod` - Start application in production mode
- `npm run lint` - Run linting
- `npm run test` - Run tests
- `npm run seed` - Seed database with initial data
- `npm run migration:generate` - Generate database migrations
- `npm run migration:run` - Run database migrations
- `npm run migration:revert` - Revert last migration

## License

This project is licensed under the MIT License.
