# Rutas y Servicios - Basketball Team

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

---

## API del Backend

Base URL: `http://localhost:5000/api/v1`

### Autenticacion

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| POST | `/auth/login` | Iniciar sesion, retorna JWT | No |
| POST | `/auth/register` | Crear nueva cuenta | No |
| POST | `/auth/logout` | Cerrar sesion (invalida token en Redis) | Si |

### Jugadores

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | `/players` | Listar todos los jugadores | No |
| GET | `/players/:id` | Obtener jugador por ID | No |
| POST | `/players` | Crear jugador | Si (admin) |
| PUT | `/players/:id` | Actualizar jugador | Si (admin) |
| DELETE | `/players/:id` | Eliminar jugador | Si (admin) |

### Usuarios

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | `/users` | Listar todos los usuarios | Si (admin) |
| GET | `/users/:id` | Obtener usuario por ID | Si |
| PUT | `/users/:id` | Actualizar usuario | Si (admin) |
| DELETE | `/users/:id` | Eliminar usuario | Si (admin) |
| PATCH | `/users/:id/toggle-active` | Activar/desactivar usuario | Si (admin) |

### Imagenes

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| POST | `/images/upload` | Subir imagen | Si (admin) |

### Otros

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| POST | `/contact` | Enviar mensaje de contacto | No |
| GET | `/profiles` | Obtener perfiles | Si |
| GET | `/health` | Health check del servidor | No |
| GET | `/api/v1/docs` | Documentacion Swagger/OpenAPI | No |

---

## Cliente HTTP (Frontend)

Definido en `frontend/src/api/client.js`. Incluye:
- Base URL configurada segun entorno
- Interceptor para anexar el token JWT en cabeceras `Authorization: Bearer <token>`
- Manejo centralizado de errores 401 (redireccion a login)
