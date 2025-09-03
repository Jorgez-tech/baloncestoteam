npm install
npm run dev
npm start
npm run lint
npm run format
npm test
# Backend (Node.js/Express)
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
	 Copia `.env.example` a `.env` y edítalo:
	 ```env
	 PORT=5000
	 NODE_ENV=development
	 MONGO_URI=mongodb://localhost:27017/basketball_team
	 JWT_SECRET=tuSecretoMuySeguro_cambiame_en_produccion
	 JWT_EXPIRE=7d
	 FRONTEND_URL=http://localhost:3000
	 ```

## 2. Scripts

- Desarrollo:
	```cmd
	npm run dev
	```
- Producción:
	```cmd
	npm start
	```
- Lint:
	```cmd
	npm run lint
	```
- Formateo:
	```cmd
	npm run format
	```
- Test (fallan por restricciones de MongoDB Memory Server):
	```cmd
	npm test
	```

## 3. Estructura de directorios

```
backend/
├── config/          # Configuraciones
├── middleware/      # Middlewares personalizados
├── models/          # Modelos de base de datos
├── routers/         # Rutas de la API
├── docs/            # Documentación OpenAPI
├── uploads/         # Archivos subidos
└── server.js        # Punto de entrada
```

## 4. Endpoints principales

- `GET /health` — Health check
- `POST /api/v1/auth/register` — Registro de usuarios
- `POST /api/v1/auth/login` — Login
- `GET /api/v1/players` — Lista de jugadores
- `POST /api/v1/players` — Crear jugador (requiere auth)

## 5. Documentación API

Disponible en `http://localhost:5000/api/v1/docs` cuando el servidor está en ejecución.

## 6. Troubleshooting & Notas

- El backend requiere conexión a MongoDB; el servidor se detiene si no está disponible.
- Los tests fallan por restricciones de descarga de MongoDB Memory Server (ver guía de desarrollo).
- Para ver la documentación de la API, accede a `/api/v1/docs`.
- Health check disponible en `/health`.

## 7. Recomendaciones profesionales

- Ejecuta lint y format antes de cada commit.
- Mantén las variables de entorno seguras y actualizadas.
- Documenta nuevos endpoints y funcionalidades en este README.

## 8. Contacto y soporte

Para dudas o incidencias, contacta al mantenedor del proyecto o abre un issue en GitHub.