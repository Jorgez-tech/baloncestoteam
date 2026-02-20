# Panel de Administracion (AdminDashboard)

**Implementado**: 17 Agosto 2025
**Archivos principales**:
- `frontend/src/pages/AdminDashboard.jsx`
- `frontend/src/pages/AdminDashboard.css`
- `frontend/src/__tests__/Admin.test.jsx`
- `frontend/src/__tests__/AdminUsers.test.jsx`

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
Log: [AUDIT] acceso registrado
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

## Seguridad Implementada

| Capa | Medida |
|---|---|
| Backend | Rate limiting, Helmet (headers), CORS |
| Autenticacion | JWT + Redis blacklist (logout) |
| Autorizacion | Role-based access control (RBAC) |
| Datos | bcrypt para contrasenas, express-validator |
| Auditoria | Logs de acceso y acciones admin |

```javascript
// Log de auditoria automatico
console.log(`[AUDIT] ${new Date().toISOString()} - Admin: ${user.email} - ${action}`);
```

---

## Cobertura de Tests

| Categoria | Tests | Resultado |
|---|---|---|
| Seguridad (acceso, roles, auth) | 8 | Pasados |
| Funcionalidad (CRUD, navegacion) | 4 | Pasados |
| **Total** | **12** | **100%** |

---

## Mejoras Futuras

1. Two-Factor Authentication (2FA)
2. Session timeout automatico
3. IP whitelisting para acceso admin
4. Audit logs cifrados en base de datos
