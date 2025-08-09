# Estructura y rutas principales

## Frontend (React)

**Carpetas clave:**
- `src/components/`: Componentes React (UI, páginas, formularios)
- `src/api/`: Cliente API centralizado (axios)
- `src/context/`: Contextos globales (Auth)
- `src/styles/`: CSS por componente
- `public/`: Archivos estáticos y HTML

**Rutas públicas:**
- `/`               Inicio
- `/gallery`        Galería
- `/players`        Jugadores
- `/players/:id`    Perfil de jugador
- `/login`          Iniciar sesión (redirige a / si ya estás logueado)
- `/signup`         Registro (redirige a / si ya estás logueado)

**Rutas protegidas:**
- `/admin`          Panel Admin (requiere user.role === 'admin')

**Notas:**
- ProtectedRoute: redirige a /login si no hay usuario.
- PublicOnlyRoute: redirige a / si ya hay usuario.

## Backend (Node/Express)

**Carpetas clave:**
- `routers/`: Endpoints Express (auth, players, users, images, profiles)
- `models/`: Modelos de datos (Mongoose)
- `middleware/`: Middlewares (auth)
- `config/`: Configuración (db, redis)
- `docs/`: Documentación OpenAPI

**Rutas principales:**
- `/auth/register`   Registro de usuario
- `/auth/login`      Login de usuario
- `/players`         CRUD de jugadores
- `/users`           Gestión de usuarios
- `/images`          Gestión de imágenes

Ver detalles y parámetros en `docs/openapi.yaml`.
