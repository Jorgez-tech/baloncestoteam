# Backend - Basketball Team

API profesional para la gestión de equipos de baloncesto.

## 1. Requisitos y Setup

- Node.js >= 16
- MongoDB (local o remoto)
- Redis (opcional, para cache y sesiones)

### Instalación

1. Instala dependencias:
	 ```cmd
	 npm install
	 ```
2. Configura variables de entorno:
	 Copia `.env.example` a `.env` y edítalo.

## 2. Scripts

- Desarrollo: `npm run dev`
- Producción: `npm start`
- Lint: `npm run lint`
- Test: `npm test`

## 3. Documentación

Para detalles de arquitectura y despliegue, ver la documentación principal en `../docs/`.

- **API Docs**: `http://localhost:5000/api/v1/docs`
- **Troubleshooting**: Ver `../docs/reports/TROUBLESHOOTING.md`

## 4. Endpoints principales

- `GET /health` — Health check
- `POST /api/v1/auth/register` — Registro de usuarios
- `POST /api/v1/auth/login` — Login
- `GET /api/v1/players` — Lista de jugadores