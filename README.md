# Basketball Team Management System

![Project Status](https://img.shields.io/badge/status-production--ready-green)
![Docker](https://img.shields.io/badge/docker-supported-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

Sistema de gestion integral para equipos de baloncesto, construido con el stack MERN (MongoDB, Express, React, Node.js) y totalmente dockerizado.

> **Validacion local (Febrero 2026):** La solucion fue probada satisfactoriamente en entorno local — frontend (http://localhost:3000), backend (http://localhost:5000) y base de datos MongoDB en Docker, todos funcionales con datos reales persistentes.

---

## Inicio Rapido

### Prerrequisitos
- Docker Desktop instalado y en ejecucion

### Ejecucion

```bash
# 1. Clonar repositorio
git clone <repo-url>

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env y establecer un JWT_SECRET seguro

# 3. Iniciar todos los servicios
docker compose up -d --build

# 4. Verificar que los 4 contenedores esten activos
docker compose ps
```

> **ADVERTENCIA:** Si el proyecto ya tiene datos reales en la base de datos, NO ejecutar `seed-db.js`. Ese script elimina todos los datos existentes antes de insertar los de prueba.

### URLs de acceso

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api/v1 |
| API Docs | http://localhost:5000/api/v1/docs |
| Health Check | http://localhost:5000/health |

---

## Tecnologias

- **Frontend**: React 17, React Router 6, Context API
- **Backend**: Node.js 18, Express, JWT Auth
- **Base de datos**: MongoDB 6.0 (Dockerizado)
- **Cache**: Redis 7
- **DevOps**: Docker Compose, GitHub Actions

---

## Documentacion

| Archivo | Contenido |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Infraestructura, Docker, base de datos, despliegue, checklist de produccion |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Flujo de trabajo, Git flow, Conventional Commits, testing |
| [docs/ROUTES_AND_SERVICES.md](docs/ROUTES_AND_SERVICES.md) | Rutas del frontend + todos los endpoints del backend |
| [docs/ADMIN_DASHBOARD.md](docs/ADMIN_DASHBOARD.md) | Panel de administracion: funcionalidades, seguridad, tests |
| [docs/HISTORY_AND_LEARNINGS.md](docs/HISTORY_AND_LEARNINGS.md) | Historia del proyecto, incidentes resueltos y lecciones aprendidas |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Problemas comunes y sus soluciones |

---

## Licencia

Este proyecto esta bajo la licencia MIT.
