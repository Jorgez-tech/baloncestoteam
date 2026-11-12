# Panel de Administracion (AdminDashboard)

> Documento operativo subordinado a `.agents/` (Centro de Operaciones).
> Alcance funcional y reglas: `.agents/SPEC.md`, `.agents/SYSTEMS_MAP.md` y `.agents/rules/frontend-rules.md`.

**Implementado**: 17 Agosto 2025
**Archivos principales**:
- `frontend/src/pages/AdminDashboard.jsx`
- `frontend/src/pages/AdminDashboard.css`
- `frontend/src/__tests__/Admin.test.jsx` (proteccion de ruta)
- `frontend/src/__tests__/AdminUsers.test.jsx` (gestion de usuarios)
- `frontend/src/__tests__/AdminMembers.test.jsx` (gestion de socios)
- `frontend/src/__tests__/AdminAudit.test.jsx` (registro de auditoria)

---

## Pestanas del panel

| Pestana | Contenido |
|---|---|
| Resumen | Estadisticas (usuarios, usuarios activos, jugadores) |
| Jugadores | CRUD de jugadores |
| Socios | Listado de socios y activacion/desactivacion |
| Usuarios | Listado, edicion y eliminacion de usuarios |
| Auditoria | Registro de auditoria con filtros y paginacion |

---

## Acceso

Solo usuarios con `role: 'admin'` pueden acceder a `/admin`. El componente `ProtectedRoute` con `requireAdmin={true}` verifica esto en el frontend, y cada endpoint del backend verifica el rol nuevamente de forma independiente.

```javascript
// Verificacion triple en el componente
const { user, isAuthenticated, isAdmin } = useAuth();
if (!isAuthenticated || !user || user.role !== 'admin') {
    return <AccessDenied />;
}
```

### Flujo de seguridad

```
Usuario accede /admin
        |
        v
¿Autenticado? -- No --> Redirect /login
        |
       Si
        v
¿Role = admin? -- No --> Mensaje: Acceso Denegado
        |
       Si
        v
Registra acceso al panel (log en cliente, solo dev)
        v
Cargar Dashboard
```

---

## Funcionalidades: Gestion de Jugadores

CRUD completo desde el dashboard admin.

| Accion | Endpoint | Notas |
|---|---|---|
| Listar | `GET /api/v1/players` | Visible para todos |
| Crear | `POST /api/v1/players` | Solo admin |
| Editar | `PUT /api/v1/players/:id` | Solo admin |
| Eliminar | `DELETE /api/v1/players/:id` | Requiere confirmacion |

---

## Funcionalidades: Gestion de Usuarios

| Funcionalidad | Endpoint | Metodo | Solo Admin | Confirmacion |
|---|---|---|---|---|
| Listar usuarios | `/api/v1/users` | GET | Si | No |
| Editar usuario | `/api/v1/users/:id` | PUT | Si | No |
| Activar/Desactivar | `/api/v1/users/:id/toggle-active` | PATCH | Si | Si |
| Eliminar usuario | `/api/v1/users/:id` | DELETE | Si | Si |

### Campos editables en un usuario

- Email, Username, Nombre, Apellido, Rol (user/admin)
- **No editable desde aqui**: Contrasena (requiere endpoint separado)

### Restricciones de seguridad

- El admin no puede eliminarse ni desactivarse a si mismo
- Eliminacion de usuario NO elimina jugadores asociados
- Las contrasenas nunca se devuelven en respuestas (`.select('-password')`)

### Validaciones

**Backend:**
```javascript
// Control de acceso
if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado.' });
}
// Prevencion de auto-eliminacion
if (req.user._id.toString() === id) {
    return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
}
```

**Frontend:**
- Email: regex de formato valido
- Username: 3-30 caracteres (letras, numeros, guion bajo)

---

## Funcionalidades: Gestion de Socios

| Funcionalidad | Endpoint | Metodo | Solo Admin | Confirmacion |
|---|---|---|---|---|
| Listar socios | `/api/v1/members` | GET | Si | No |
| Activar/Desactivar socio | `/api/v1/members/:id` | PUT | Si | Si |

- Desactivar un socio anula sus cuotas pendientes.
- El backend responde `409` si el socio mantiene dependientes con inscripcion activa; el mensaje
  se muestra al administrador en el toast de error.

---

## Funcionalidades: Registro de Auditoria

La pestana de Auditoria consume `GET /api/v1/audit` (lectura exclusiva de admin) con paginacion y
filtros por accion y entidad objetivo.

| Campo mostrado | Origen |
|---|---|
| Fecha | `timestamp` |
| Actor | `actorEmail` |
| Accion | `action` |
| Entidad | `targetEntity` |
| Objetivo | `targetId` |
| IP | `ip` |

- Filtros disponibles: accion (lista blanca de acciones) y entidad objetivo (lista blanca de entidades).
- Paginacion server-side: `page` y `limit` (default 20); el rango 1-100 se valida en el backend.
- Ante `403` se muestra un mensaje de permisos y una accion de reintento.

---

## Seguridad Implementada

| Capa | Medida |
|---|---|
| Backend | Rate limiting, Helmet (headers), CORS |
| Autenticacion | JWT en cookies HttpOnly + rotacion de refresh token |
| Autorizacion | Role-based access control (RBAC) |
| Datos | bcrypt para contrasenas, express-validator |
| Auditoria | Registro persistente server-side (`audit.service` -> coleccion de auditoria), escritura asincrona append-only |

La auditoria de las acciones relevantes se registra desde el backend con `auditService.logAction(...)`
(login, logout, reset de contrasena, CRUD de usuarios/jugadores/socios, obligaciones, etc.). El
registro de acceso al panel que aun se emite en el cliente es solo un `console.info` en desarrollo.

```javascript
// Registro de auditoria persistente (backend)
auditService.logAction({
    actorId: user._id.toString(),
    actorEmail: user.email,
    action: 'LOGIN_SUCCESS',
    targetEntity: 'Auth',
    targetId: user._id.toString(),
    ip: req.ip,
    userAgent: req.headers['user-agent']
});
```

---

## Cobertura de Tests

| Suite | Archivo | Tests |
|---|---|---|
| Proteccion de ruta (acceso, roles) | `Admin.test.jsx` | 2 |
| Gestion de usuarios (403/reintento, auto-eliminacion) | `AdminUsers.test.jsx` | 2 |
| Gestion de socios (listado, bloqueo 409, cancelacion) | `AdminMembers.test.jsx` | 3 |
| Auditoria (listado, filtro, paginacion, 403) | `AdminAudit.test.jsx` | 4 |
| Utilidades de test (puente `test-utils`) | `test-utils/index.js` | 1 |
| **Total** | | **12** |

---

## Mejoras Futuras

1. Two-Factor Authentication (2FA)
2. Session timeout automatico
3. IP whitelisting para acceso admin

