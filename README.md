# Campaign Management API
A robust campaign management system built with NestJS, TypeScript, and PostgreSQL.
The application is deployed: https://cmwapp-fe.vercel.app/

## 🚀 Features
- RESTful API endpoints for campaign management
- Built with TypeScript for type safety
- PostgreSQL database with Knex ORM
- Containerized with Docker for easy deployment
- Database migrations system
- Role-based system, to access all features register as `admin`

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
3. Start the containers and run latest migrations:
   ```bash
   docker compose up
   ```
## 🏃‍♂️ Running the Application
The application will be available at http://localhost:3000 (or your configured port).

## 🔧 Configuration
The application can be configured through environment variables. Create a .env file in the root directory and follow the structure in the .env.example:
   ```env
   DB_HOST=postgres
   DB_PORT=5432
   DB_NAME=campaign_management
   DB_USER=postgres
   DB_PASSWORD=postgres
   NODE_ENV=development
   PORT=2222
   JWT_SECRET=super-secret-key
   JWT_EXPIRES_IN='1d'
   ```

## 🧪 Running Tests
   ```bash
   npm run test
   ```
