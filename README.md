# NestJS Backend Template

A production-ready NestJS template for building scalable REST APIs with best practices, security, and clean architecture.

![GitHub Repo Stars](https://img.shields.io/github/stars/EuMotta/template-backend-nestjs?style=for-the-badge)
![GitHub Forks](https://img.shields.io/github/forks/EuMotta/template-backend-nestjs?style=for-the-badge)
![GitHub Issues](https://img.shields.io/github/issues/EuMotta/template-backend-nestjs?style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/EuMotta/template-backend-nestjs?style=for-the-badge)

---

## ✨ Features

### Core Functionality
- 🔐 **JWT Authentication** with bcrypt password hashing
- 👥 **User Management** with role-based access control (RBAC)
- 🏠 **Address Module** with user relationships
- ✉️ **Email Verification** system
- 📊 **Audit Logging** for tracking changes

### Architecture & Quality
- 🏗️ **Modular Architecture** following NestJS best practices
- 🛡️ **Security Guards** (AuthGuard, AdminOnly)
- ✅ **Input Validation** with class-validator
- 📄 **Auto-generated API Documentation** (Swagger/OpenAPI)
- 🚦 **Rate Limiting** to prevent abuse
- 🌐 **CORS** with multi-origin support
- 🔍 **Global Exception Filters** for consistent error responses
- 📝 **Request Logging Middleware**

### Developer Experience
- 🧪 **Testing Setup** with Jest
- 🎨 **Code Quality** enforced by ESLint and Prettier
- 📦 **TypeORM Migrations** for database versioning
- 🔄 **Hot Reload** in development mode

---

## 🏗️ Project Structure

```
src/
├── modules/              # Feature modules
│   ├── auth/            # Authentication & authorization
│   ├── users/           # User management
│   ├── address/         # Address management
│   └── email_verify/    # Email verification
├── db/                  # Database configuration
│   ├── entities/        # TypeORM entities
│   ├── migrations/      # Database migrations
│   └── pagination/      # Pagination utilities
├── guards/              # Custom guards (AdminOnly, etc.)
├── decorators/          # Custom decorators (GetUser, etc.)
├── middlewares/         # HTTP middlewares (logging, etc.)
├── interfaces/          # TypeScript interfaces
├── utils/               # Utility functions and constants
└── main.ts             # Application entry point
```

---

## 🛠️ Tech Stack

### Core Framework
- **NestJS 11** - Progressive Node.js framework
- **TypeScript 5.8** - Type-safe JavaScript
- **Node.js 23+** - JavaScript runtime

### Database & ORM
- **TypeORM 1.0** - ORM for TypeScript and JavaScript
- **PostgreSQL** - Primary database (via `pg` driver)
- **MongoDB** - Optional NoSQL support (via Mongoose)

### Authentication & Security
- **@nestjs/jwt** - JWT token generation and validation
- **bcrypt** - Password hashing
- **@nestjs/throttler** - Rate limiting

### Validation & Documentation
- **class-validator** - Decorator-based validation
- **class-transformer** - Object transformation
- **@nestjs/swagger** - OpenAPI/Swagger documentation

### Testing
- **Jest** - Testing framework
- **Supertest** - HTTP assertions
- **@nestjs/testing** - NestJS testing utilities

### Code Quality
- **ESLint** - Linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v23 or higher
- **npm** or **yarn**
- **PostgreSQL** database (or MongoDB if preferred)

### Installation

```bash
# Clone the repository
git clone https://github.com/EuMotta/template-backend-nestjs.git

# Navigate to project directory
cd template-backend-nestjs

# Install dependencies
npm install
```

### Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:
```env
# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION_TIME=3600

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_NAME=your-database

# Server Configuration
PORT=3001
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3001/api/v1`

---

## 📚 API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: `http://localhost:3001/api/v1/docs`
- **OpenAPI JSON**: `http://localhost:3001/api/v1/docs/json`
- **OpenAPI YAML**: `http://localhost:3001/api/v1/docs/yaml`

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

---

## 🗄️ Database Migrations

```bash
# Create a new migration
npm run migration:create --name=YourMigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

---

## � Security Features

- **JWT Secret Validation** - Application fails to start if `JWT_SECRET` is not configured
- **Password Hashing** - All passwords hashed with bcrypt (10 salt rounds)
- **Role-Based Access Control** - Admin-only routes protected with guards
- **Rate Limiting** - Configurable throttling on sensitive endpoints
- **CORS Protection** - Multi-origin support with validation
- **Input Validation** - All DTOs validated with class-validator
- **Timing Attack Prevention** - Generic error messages for authentication
- **Global Exception Filter** - Sanitized error responses (no stack traces in production)

---

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start` | Start the application |
| `npm run start:dev` | Start in development mode with hot reload |
| `npm run start:prod` | Start in production mode |
| `npm run build` | Build the application |
| `npm run lint` | Run ESLint and auto-fix issues |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Generate test coverage report |

---

## �️ Roadmap

- [x] JWT Authentication
- [x] User Management (CRUD)
- [x] Address Management
- [x] Email Verification
- [x] Role-Based Access Control
- [x] Swagger Documentation
- [x] Rate Limiting
- [x] Audit Logging
- [x] Global Exception Handling
- [x] Request Logging Middleware
- [ ] File Upload Support
- [ ] Internationalization (i18n)
- [ ] Docker & Docker Compose
- [ ] CI/CD Pipeline
- [ ] Redis Caching
- [ ] WebSocket Support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## � Author

**José Antonio Motta**

- LinkedIn: [@josé-antonio-bueno-motta](https://www.linkedin.com/in/jos%C3%A9-antonio-bueno-motta-61006a26b/)
- GitHub: [@EuMotta](https://github.com/EuMotta)

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [TypeORM](https://typeorm.io/) - Amazing ORM for TypeScript
- All contributors who help improve this template

---

**Project Link**: [https://github.com/EuMotta/template-backend-nestjs](https://github.com/EuMotta/template-backend-nestjs)
