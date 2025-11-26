# Basketball Team Management System

![Project Status](https://img.shields.io/badge/status-production--ready-green)
![Docker](https://img.shields.io/badge/docker-supported-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

Sistema de gestión integral para equipos de baloncesto, construido con el stack MERN (MongoDB, Express, React, Node.js) y totalmente dockerizado.

## 📚 Documentación

La documentación completa del proyecto se encuentra en la carpeta `docs/`.

### 🏗️ Arquitectura y Despliegue
*   [Guía de Despliegue (Docker)](docs/architecture/DEPLOYMENT.md)
*   [Base de Datos](docs/architecture/DATABASE.md)
*   [Historial de Cambios](docs/HISTORY.md)

### 👩‍💻 Desarrollo
*   [Guía de Desarrollo](docs/guides/DEVELOPMENT.md)
*   [Guía de Vistas Frontend](docs/guides/FRONTEND_VIEWS.md)
*   [Guía de Contribución](docs/guides/CONTRIBUTING.md)

### 📊 Reportes y API
*   [Rutas de API](docs/api/ROUTES.md)
*   [Resolución de Problemas](docs/reports/TROUBLESHOOTING.md)
*   [Informe de Incidentes](docs/reports/INCIDENT_DB_NOV2025.md)

## 🚀 Inicio Rápido

### Prerrequisitos
*   Docker Desktop instalado

### Ejecución
```bash
# 1. Clonar repositorio
git clone <repo-url>

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env
# (Ajustar JWT_SECRET en .env)

# 3. Iniciar servicios
docker compose up --build

# 4. Poblar base de datos (Primera vez)
docker compose exec backend node seed-db.js seed
```

Visita:
*   **Frontend**: http://localhost:3000
*   **Backend API**: http://localhost:5000
*   **API Docs**: http://localhost:5000/api/v1/docs

## 🛠️ Tecnologías

*   **Frontend**: React 17, React Router 6, Context API.
*   **Backend**: Node.js, Express, JWT Auth.
*   **Database**: MongoDB 6.0 (Dockerizado).
*   **Cache**: Redis 7.
*   **DevOps**: Docker Compose, GitHub Actions.

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
