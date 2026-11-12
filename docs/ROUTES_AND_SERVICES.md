# Rutas y Servicios - Basketball Team

> Documento operativo subordinado a `.agents/` (Centro de Operaciones).
> Para la arquitectura y el alcance de cada modulo, consultar `.agents/SYSTEMS_MAP.md` y `.agents/SPEC.md`.
> Fuente de verdad del contrato HTTP: `backend/docs/openapi.yaml`.

## Rutas del Frontend

Definidas en `frontend/src/App.js`:

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | `Home` | Publico |
| `/nosotros` | `Nosotros` | Publico |
| `/jugadores` | `Jugadores` | Publico |
| `/contacto` | `Contacto` | Publico |
| `/login` | `Login` | Publico |
| `/registro` | `Registro` | Publico |
| `/admin` | `AdminDashboard` | Privado (solo admin) |

> Rutas protegidas gestionadas por `ProtectedRoute` + `AuthContext`.
> El panel `/admin` se organiza en pestanas: Resumen, Jugadores, Socios, Usuarios y Auditoria.

---

## API del Backend

Base URL: `http://localhost:5000/api/v1`

### Autenticacion (`/auth`)

La sesion se establece mediante cookies `HttpOnly` (`accessToken` 15 min, `refreshToken` 7 dias)
con rotacion de refresh token. Ver ADR-004 en `.agents/DECISIONS.md`.

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| POST | `/auth/register` | Crear nueva cuenta | No |
| POST | `/auth/login` | Iniciar sesion; setea cookies HttpOnly | No |
| POST | `/auth/refresh` | Rotar tokens a partir de la cookie `refreshToken` | No |
| POST | `/auth/forgot-password` | Solicitar codigo de recuperacion (6 digitos) | No |
| POST | `/auth/verify-reset-code` | Verificar codigo y obtener `sessionToken` | No |
| POST | `/auth/reset-password` | Establecer nueva contrasena con `sessionToken` | No |
| GET | `/auth/profile` | Obtener perfil del usuario autenticado | Si |
| POST | `/auth/logout` | Cerrar sesion; limpia cookies e invalida refresh token | Cookie |

### Jugadores (`/players`)

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | `/players` | Listar todos los jugadores | No |
| GET | `/players/:id` | Obtener jugador por ID | No |
| POST | `/players` | Crear jugador | Si |
| PUT | `/players/:id` | Actualizar jugador | Si |
| DELETE | `/players/:id` | Eliminar jugador (borrado logico) | Si |

### Usuarios (`/users`)

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | `/users` | Listar todos los usuarios | Si (admin) |
| GET | `/users/:id` | Obtener usuario por ID | Si |
| PUT | `/users/:id` | Actualizar usuario | Si |
| DELETE | `/users/:id` | Eliminar usuario (borrado logico) | Si |
| PATCH | `/users/:id/toggle-active` | Activar/desactivar usuario | Si |

### Deportes (`/sports`)

Clubes, categorias, equipos, staff y roster. Consulta abierta a autenticados; gestion solo admin
(o coach del equipo en el roster). Detalle en `.agents/SYSTEMS_MAP.md`.

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| POST | `/sports/clubs` | Crear club | Si (admin) |
| GET | `/sports/clubs` | Listar clubes | Si |
| PUT | `/sports/clubs/:id` | Actualizar club | Si (admin) |
| POST | `/sports/categories` | Crear categoria | Si (admin) |
| GET | `/sports/categories` | Listar categorias | Si |
| PUT | `/sports/categories/:id` | Actualizar categoria | Si (admin) |
| POST | `/sports/teams` | Crear equipo | Si (admin) |
| GET | `/sports/teams` | Listar equipos | Si |
| PUT | `/sports/teams/:id` | Actualizar equipo | Si (admin) |
| POST | `/sports/teams/:teamId/staff` | Asignar miembro al staff | Si (admin) |
| GET | `/sports/teams/:teamId/staff` | Listar staff del equipo | Si (acceso al equipo) |
| DELETE | `/sports/teams/:teamId/staff/:userId` | Revocar miembro del staff | Si (admin) |
| POST | `/sports/teams/:teamId/roster` | Agregar jugador al roster | Si (admin/coach) |
| GET | `/sports/teams/:teamId/roster` | Listar roster del equipo | Si (acceso al equipo) |
| PUT | `/sports/teams/:teamId/roster/:playerId` | Actualizar jugador del roster | Si (admin/coach) |
| DELETE | `/sports/teams/:teamId/roster/:playerId` | Quitar jugador del roster | Si (admin/coach) |

### Socios (`/members`)

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| POST | `/members` | Crear socio (asociar usuario + numero de socio) | Si (admin) |
| GET | `/members` | Listar socios | Si (admin) |
| PUT | `/members/:id` | Actualizar socio | Si (admin) |
| GET | `/members/:memberId/dependents` | Listar dependientes del socio | Si (socio/admin) |
| POST | `/members/:memberId/dependents` | Vincular jugador dependiente | Si (socio/admin) |
| DELETE | `/members/:memberId/dependents/:playerId` | Desvincular jugador dependiente | Si (socio/admin) |

### Obligaciones de pago (`/obligations`)

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| POST | `/obligations/webhook/mercadopago` | Webhook de Mercado Pago | No (firma MP) |
| POST | `/obligations` | Crear obligacion manual | Si (admin) |
| POST | `/obligations/batch` | Generacion masiva de un periodo | Si (admin) |
| PATCH | `/obligations/:id/status` | Marcar pagado / anular | Si (admin) |
| GET | `/obligations/member/:memberId` | Estado de cuenta de un socio | Si (socio/admin) |
| POST | `/obligations/:id/checkout` | Generar link de pago (Mercado Pago) | Si |

### Auditoria (`/audit`)

Registro append-only de acciones sensibles. Lectura **exclusivamente admin**.

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | `/audit` | Consultar el log con paginacion y filtros | Si (admin) |

Query params validados: `page` (>=1), `limit` (1-100, default 20), `action`, `targetEntity`,
`actorId` (ObjectId), `from` y `to` (ISO 8601). Respuesta: `{ data: [...], meta: { total, page, limit, totalPages } }`.

### Imagenes (`/images`)

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| POST | `/images/upload` | Subir imagen (multipart, `image`) | Si |
| GET | `/images/:filename` | Obtener imagen por nombre de archivo | No |

### Perfiles (`/profiles`)

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | `/profiles/me` | Perfil del usuario autenticado | Si |
| PUT | `/profiles/me` | Actualizar perfil propio | Si |
| PUT | `/profiles/player` | Actualizar datos de jugador | Si (rol user) |

### Otros

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| POST | `/contact` | Enviar mensaje de contacto | No |
| GET | `/health` | Health check del servidor | No |
| GET | `/api/v1/docs` | Documentacion Swagger/OpenAPI | No |

---

## Cliente HTTP (Frontend)

Definido en `frontend/src/api/client.js`. Expone `authAPI`, `playersAPI`, `usersAPI`, `membersAPI`,
`auditAPI` e `imagesAPI`.

- Base URL configurada segun entorno (`REACT_APP_API_URL`, default `http://localhost:5000/api/v1`).
- Interceptor de request que anexa `Authorization: Bearer <token>` desde `localStorage`.
- Interceptor de response que ante 401 limpia el almacenamiento y redirige a `/login`.

> **Nota de alineacion pendiente:** el backend ya emite cookies `HttpOnly`, pero el cliente aun
> conserva la ruta legada basada en `localStorage` + cabecera Bearer. La migracion completa del
> consumo de cookies en el frontend esta pendiente (ver hallazgo C-02 en
> `.agents/AUDITORIA_REFACTORIZACION_2026-10-16.md`).
