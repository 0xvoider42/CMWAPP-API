# Campaign Management API

A robust campaign management system built with NestJS, TypeScript, and PostgreSQL.

## 🚀 Features

- RESTful API endpoints for campaign management
- Built with TypeScript for type safety
- PostgreSQL database with Knex ORM
- Containerized with Docker for easy deployment
- Database migrations system

## 📋 Prerequisites

- Node.js
- Docker and Docker Compose
- npm package manager

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd campaign-management-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the containers:
   ```bash
   docker compose up
   ```
4. Run database migrations:
   ```bash
   npm run migrate
   ```
## 🏃‍♂️ Running the Application

The application will be available at http://localhost:3000 (or your configured port).

## 🔧 Configuration

The application can be configured through environment variables. Create a .env file in the root directory and follow the structure in the .env.example:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=campaign_management
   DB_USER=postgres
   DB_PASSWORD=postgres
   NODE_ENV=development
   LOG_LEVEL=debug
   PORT=2222
   ```

## 🧪 Running Tests
   ```bash
   npm run test
   ```
