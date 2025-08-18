# 🏀 Basketball Team Backend

Backend API REST para el sistema de gestión de equipos de baloncesto, desarrollado con Node.js, Express y MongoDB.

## 🏗️ Características principales

- **API REST** completa con operaciones CRUD
- **Autenticación JWT** con middleware de autorización
- **Validación robusta** con express-validator
- **Base de datos MongoDB** con Mongoose ODM
- **Seguridad** con Helmet, CORS y rate limiting
- **Testing** con Jest, Supertest y MongoDB Memory Server
- **Documentación** con OpenAPI/Swagger
- **Variables de entorno** para diferentes configuraciones

## 📋 Estructura del proyecto

```
backend/
├── server.js           # Servidor principal con Express
├── config/            # Configuración de servicios
│   ├── db.js          # Conexión a MongoDB
│   └── redis.js       # Configuración de Redis (opcional)
├── models/            # Modelos de datos (Mongoose)
│   ├── user.js        # Modelo de usuario
│   ├── player.js      # Modelo de jugador
│   ├── Photo.js       # Modelo de foto
│   └── Description.js # Modelo de descripción
├── routers/           # Rutas de la API
│   ├── auth.js        # Autenticación y registro
│   ├── players.js     # Gestión de jugadores
│   ├── users.js       # Gestión de usuarios
│   ├── images.js      # Subida y gestión de imágenes
│   └── profiles.js    # Perfiles de usuario
├── middleware/        # Middleware personalizado
│   ├── auth.js        # Middleware de autenticación JWT
│   └── validation.js  # Validaciones con express-validator
├── docs/              # Documentación
│   └── openapi.yaml   # Especificación OpenAPI
├── __tests__/         # Tests unitarios y de integración
└── package.json       # Dependencias y scripts
```

## 🚀 Instalación y configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- MongoDB (local o en la nube via MongoDB Atlas)
- Redis (opcional, para cache y sesiones)
- Git

### 1. Instalación de dependencias

```bash
cd backend
npm install
```

### 2. Configuración de variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:

```env
# Base de datos
MONGO_URI=mongodb://localhost:27017/basketball-team
# O para MongoDB Atlas (reemplaza los valores entre llaves):
# MONGO_URI=mongodb+srv://{USERNAME}:{PASSWORD}@{CLUSTER}.mongodb.net/basketball-team

# Autenticación
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRE=24h

# Servidor
PORT=5000
NODE_ENV=development

# Archivos (opcional)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Redis (opcional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 3. Configuración de base de datos

Asegúrate de que MongoDB esté ejecutándose:

```bash
# Si usas MongoDB local
mongod

# O usa MongoDB Atlas para una base de datos en la nube
```

## 🎯 Scripts disponibles

```bash
# Desarrollo con recarga automática
npm run dev

# Producción
npm start

# Testing
npm test                    # Ejecutar tests
npm run test:watch         # Tests en modo watch
npm run test:coverage      # Tests con cobertura

# Linting y formato
npm run lint               # Ejecutar ESLint
npm run lint:fix          # Corregir problemas automáticamente
npm run format            # Formatear código con Prettier
```

## 📡 Endpoints de la API

### Autenticación
- `POST /api/v1/auth/register` - Registro de usuarios
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/profile` - Obtener perfil del usuario autenticado
- `POST /api/v1/auth/logout` - Cerrar sesión

### Jugadores
- `GET /api/v1/players` - Lista de jugadores (con filtros y paginación)
- `GET /api/v1/players/:id` - Obtener jugador por ID
- `POST /api/v1/players` - Crear jugador (requiere autenticación)
- `PUT /api/v1/players/:id` - Actualizar jugador (requiere autenticación)
- `DELETE /api/v1/players/:id` - Eliminar jugador (requiere autenticación)

### Usuarios
- `GET /api/v1/users` - Lista de usuarios (admin)
- `PUT /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario

### Imágenes
- `POST /api/v1/images/upload` - Subir imagen
- `GET /api/v1/images/:filename` - Obtener imagen

### Sistema
- `GET /health` - Health check del servidor

## 🔒 Autenticación y seguridad

### JWT (JSON Web Tokens)
- Tokens firmados con algoritmo HS256
- Expiración configurable (por defecto 24h)
- Middleware de verificación automática

### Validaciones
- **express-validator** para validación de datos de entrada
- Validaciones específicas para cada endpoint
- Mensajes de error descriptivos en español

### Medidas de seguridad implementadas
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso cross-origin
- **Rate limiting**: Límite de peticiones por IP
- **Sanitización**: Validación y limpieza de datos
- **Hash de contraseñas**: bcryptjs para cifrado seguro

## 📚 Documentación de la API

### OpenAPI/Swagger
Una vez iniciado el servidor, la documentación interactiva estará disponible en:
`http://localhost:5000/api/v1/docs`

### Ejemplos de uso

#### Registro de usuario
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

#### Crear jugador (requiere token)
```bash
curl -X POST http://localhost:5000/api/v1/players \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Michael Jordan",
    "position": "Escolta",
    "number": 23,
    "height": 1.98,
    "weight": 98,
    "age": 58
  }'
```

## 🧪 Testing

El proyecto incluye tests completos con Jest y Supertest:

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch para desarrollo
npm run test:watch
```

### Estructura de testing
- **Jest**: Framework de testing
- **Supertest**: Testing de endpoints HTTP
- **MongoDB Memory Server**: Base de datos en memoria para tests
- **Setup/Teardown**: Configuración automática de entorno de pruebas

## 🚀 Despliegue

### Variables de entorno de producción

Crear archivo `.env.production`:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://{USERNAME}:{PASSWORD}@{CLUSTER}.mongodb.net/basketball-team-prod
JWT_SECRET=tu_jwt_secret_super_seguro_para_produccion
JWT_EXPIRE=24h
```

### Comandos de despliegue

```bash
# Build y inicio en producción
npm run build    # Si tienes proceso de build
npm start

# Con PM2 (recomendado para producción)
npm install -g pm2
pm2 start server.js --name "basketball-backend"
```

## 🛠️ Desarrollo

### Estructura de desarrollo
- **Nodemon**: Recarga automática en desarrollo
- **ESLint**: Linting con configuración estándar
- **Prettier**: Formateo automático de código
- **Husky**: Pre-commit hooks para calidad de código

### Convenciones de código
- Nombres de archivos en camelCase
- Rutas RESTful estándar
- Manejo de errores consistente
- Logs estructurados por niveles

---

**Última actualización:** Agosto 2025

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
