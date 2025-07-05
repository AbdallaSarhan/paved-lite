# Paved Lite

> This project is inspired by the Paved platform and was developed to demonstrate relevant full-stack skills. It showcases a modern Rails + React architecture, role-based onboarding, JWT authentication, and request management between advertisers and publishers.

## Core Features

- **JWT Authentication:** Secure login and signup with Devise and JWT tokens.
- **Onboarding Flow:** Users select a role (Advertiser or Publisher) and complete a profile before accessing dashboards.
- **Role-Based Dashboards:**
  - **Advertisers:**
    - Browse and search for publishers/newsletters.
    - Send sponsorship requests to publishers, including a message and budget.
    - View request history and statuses (pending, accepted, declined, completed).
  - **Publishers:**
    - View incoming requests from advertisers.
    - Accept, decline, or mark requests as complete.

## Database Setup (Postgres via Docker)

This project uses PostgreSQL for the backend database, managed via Docker Compose.

### Steps to Start the Postgres Container

1. Make sure you have [Docker](https://www.docker.com/products/docker-desktop/) installed and running.
2. In the project root, run:
   ```bash
   docker-compose up -d
   ```
   This will start a Postgres 16 container with the following settings:
   - **User:** postgres
   - **Password:** postgres
   - **Database:** paved_development
   - **Port:** 5432 (exposed to your host)
   - **Data Persistence:** Data is stored in a Docker volume (`postgres_data`) so it persists across restarts.
3. To stop the container:
   ```bash
   docker-compose down
   ```

## Backend (Rails)

The backend is a Rails API application with Devise JWT authentication.

### Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   bundle install
   ```

3. Set up the database:

   ```bash
   bin/rails db:create
   bin/rails db:migrate
   ```

4. Start the Rails server:
   ```bash
   bin/rails server
   ```

The backend will be available at `http://localhost:3000`

### API Endpoints

- `POST /login` - User login
- `POST /signup` - User registration
- `DELETE /logout` - User logout

## Frontend (React)

The frontend is a React TypeScript application with authentication components.

### Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Usage

1. Start both the backend and frontend servers
2. Navigate to `http://localhost:5173`
3. Create an account or sign in
4. Access the protected dashboard

## Development

- Backend: Rails 8.0 with Devise JWT
- Frontend: React 19 with TypeScript
- Authentication: JWT tokens stored in localStorage
- Styling: Custom CSS
