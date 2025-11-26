# Basketball Team Management Application

This project is a full-stack application for managing a basketball team. It includes a React frontend and a Node.js/Express backend with a MongoDB database.

## Running with Docker

This application is containerized using Docker and can be run easily with Docker Compose.

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.

### Quick Start

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Configure environment variables:**

    ```bash
    # Copy the Docker environment template
    cp .env.docker .env
    
    # Generate a secure JWT secret
    openssl rand -base64 32
    
    # Edit .env and paste the JWT_SECRET (REQUIRED)
    # You can use any text editor
    ```
    
    **Important:** The `JWT_SECRET` is required. The backend will not start without it.

3.  **Run the application:**

    ```bash
    docker compose up --build
    ```

4.  **Populate the database (first time only):**

    ```bash
    docker compose exec backend node seed-db.js seed
    ```

5.  **Access the application:**

    - **Frontend:** Open your browser and navigate to `http://localhost:3000`
    - **Backend API:** The API will be available at `http://localhost:5000`
    - **API Documentation:** `http://localhost:5000/api/v1/docs`

6.  **Stopping the application:**

    To stop the application, press `Ctrl+C` in the terminal where `docker compose` is running, and then run:

    ```bash
    docker-compose down
    ```

## Development Without Docker

If you prefer to run the services individually without Docker:

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

**Note:** You'll need MongoDB and optionally Redis running locally.

## Architecture

- **Backend**: Node.js/Express with JWT authentication, MongoDB, Redis cache
- **Frontend**: React 17 with React Router 6, Axios, React Toastify
- **Database**: MongoDB for data persistence
- **Cache**: Redis for sessions and rate limiting
- **Deployment**: Docker Compose orchestration with healthchecks

## Key Features

- User authentication with roles (admin/user)  
- Player management (CRUD operations)  
- Admin dashboard with protected routes  
- Image upload for players  
- Security: CORS, Helmet, rate limiting, input validation  
- API documentation with Swagger  
- Containerized deployment ready  
- CI/CD validation with GitHub Actions

## Project Status

**Production Ready** - The project is fully containerized and ready for deployment in any Docker-compatible environment.

**Last Major Update**: November 9, 2025 - Complete Docker implementation

## Documentation

- `DESARROLLO-GUIA.md` - Development guide and sprint tracking
- `VALIDACION_INTEGRACION.md` - Integration validation checklist
- Backend API docs: `http://localhost:5000/api/v1/docs` (when running)

---

**Repository**: [GitHub - Basketball Team](https://github.com/Jorgez-tech/baloncestoteam)  
**Author**: Jorge Zuta
