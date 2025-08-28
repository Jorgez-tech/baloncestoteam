# Basketball Team Backend

## Configuración del Backend

### Requisitos previos

- Node.js (versión 16 o superior)
- MongoDB (local o remoto)
- Redis (opcional, para cache y sesiones)

### Instalación

1. Instalar dependencias:

```bash
cd backend
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
```

3. Editar el archivo `.env` con tus configuraciones:

- Configurar MONGO_URI con tu conexión a MongoDB
- Cambiar JWT_SECRET por uno seguro
- Configurar Redis si lo usas

### Ejecución

Desarrollo:

```bash
npm run dev
```

Producción:

```bash
npm start
```

### Endpoints principales

- `GET /health` - Health check
- `POST /api/v1/auth/register` - Registro de usuarios
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/players` - Lista de jugadores
- `POST /api/v1/players` - Crear jugador (requiere auth)

### Documentación API

Una vez iniciado el servidor, la documentación estará disponible en:
`http://localhost:5000/api/v1/docs`

### Estructura de directorios

```
backend/
├── config/          # Configuraciones
├── middleware/      # Middlewares personalizados
├── models/          # Modelos de base de datos
├── routers/         # Rutas de la API
├── docs/           # Documentación OpenAPI
├── uploads/        # Archivos subidos
└── server.js       # Punto de entrada
```
