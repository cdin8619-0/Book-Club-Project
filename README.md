# Book Club Project

This is a full-stack application for managing a book club. It includes a backend built with Fastify and TypeScript, a frontend built with React and TailwindCSS, and a Postgres database.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Running the Application
1. Clone the repository.
2. Navigate to the project root directory.
3. Run `docker-compose up` to start the Postgres database.
4. Follow the setup instructions in the `backend` and `frontend` directories for their respective environments.

### Backend
- Navigate to the `backend` directory.
- Install dependencies: `npm install`.
- Run migrations: `npm run migrate`.
- Start the server: `npm run dev`.

### Frontend
- Navigate to the `frontend` directory.
- Install dependencies: `npm install`.
- Start the development server: `npm run dev`.

## Common Scripts
- `docker-compose up`: Start the database.
- `docker-compose down`: Stop the database.
- `npm run dev`: Start the development server (backend/frontend).
- `npm run build`: Build the production version (frontend).

## Environment Variables
- `POSTGRES_USER`: Database username.
- `POSTGRES_PASSWORD`: Database password.
- `POSTGRES_DB`: Database name.
