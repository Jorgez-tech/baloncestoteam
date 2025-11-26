# Funcionalidades de Gestión de Usuarios - AdminDashboard

## Fecha: 5 de Octubre 2025
## Rama: `integracion-backend-frontend`

---

## Funcionalidades Básicas Implementadas

### **1. Listar Usuarios**

**Descripción:** Muestra todos los usuarios registrados en el sistema.

**Columnas de la Tabla:**
- **Email**: Correo electrónico del usuario
- **Username**: Nombre de usuario
- **Rol**: `admin` o `user` (con badge de color)
- **Estado**: `Activo` o `Inactivo` (con badge de color)
- **Registro**: Fecha de creación de la cuenta
- **Acciones**: Botones de editar, activar/desactivar, eliminar

**Endpoint:** `GET /api/v1/users`

**Permisos:** Solo administradores

---

### **2. Editar Usuario**

**Descripción:** Permite modificar los datos de un usuario existente.

**Campos Editables:**
- Email
- Username
- Nombre (firstName)
- Apellido (lastName)
- Rol (user/admin)

**Campos NO Editables:**
- Contraseña (requiere endpoint específico)
- ID del usuario
- Fecha de creación

**Endpoint:** `PUT /api/v1/users/:id`

**Permisos:** Solo administradores

**Validaciones:**
- Email válido
- Username 3-30 caracteres (letras, números, _)
- No se puede cambiar contraseña desde este formulario

**Flujo:**
1. Clic en " Editar"
2. Modal se abre con datos pre-cargados
3. Modificar campos deseados
4. Clic en "Actualizar"
5. Toast de confirmación
6. Tabla se actualiza automáticamente

---

### **3. Activar/Desactivar Usuario**

**Descripción:** Permite cambiar el estado activo/inactivo de un usuario.

**Estados:**
- **Activo**: Usuario puede iniciar sesión
- **Inactivo**: Usuario NO puede iniciar sesión

**Endpoint:** `PATCH /api/v1/users/:id/toggle-active`

**Permisos:** Solo administradores

**Restricciones:**
- El admin NO puede desactivarse a sí mismo
- Se requiere confirmación antes de cambiar estado

**Flujo:**
1. Clic en "Desactivar" o "Activar"
2. Confirmación del diálogo
3. Estado cambia automáticamente
4. Toast de confirmación
5. Badge de estado se actualiza

**Uso Común:**
- Suspender temporalmente una cuenta sin eliminarla
- Reactivar cuentas previamente suspendidas
- Control de acceso sin pérdida de datos

---

### **4. Eliminar Usuario**

**Descripción:** Elimina permanentemente un usuario del sistema.

**Endpoint:** `DELETE /api/v1/users/:id`

**Permisos:** Solo administradores

**Restricciones:**
- El admin NO puede eliminarse a sí mismo
- Se requiere confirmación antes de eliminar
- Acción irreversible

**Flujo:**
1. Clic en "Eliminar"
2. Confirmación del diálogo: "¿Estás seguro de eliminar al usuario [email]?"
3. Usuario desaparece de la tabla
4. Toast de confirmación
5. Log de auditoría en backend

**Consideraciones:**
- Eliminar usuario NO elimina jugadores asociados (si existen)
- Se recomienda usar "Desactivar" en lugar de "Eliminar" para preservar datos

---

## Seguridad Implementada

### **Backend**

1. **Verificación de Permisos:**
   ```javascript
   if (req.user.role !== 'admin') {
       return res.status(403).json({
           success: false,
           message: 'Acceso denegado. Se requieren permisos de administrador.'
       });
   }
   ```

2. **Prevención de Auto-Eliminación:**
   ```javascript
   if (req.user._id.toString() === id) {
       return res.status(400).json({
           success: false,
           message: 'No puedes eliminar tu propia cuenta'
       });
   }
   ```

3. **Logs de Auditoría:**
   ```javascript
   console.log(`[AUDIT] User ${req.user.email} updated user ${user.email}`);
   ```

4. **Protección de Contraseñas:**
   - Las contraseñas NO se devuelven en las respuestas (`.select('-password')`)
   - No se puede cambiar contraseña desde el endpoint de actualización

### **Frontend**

1. **Validación de Formularios:**
   - Email válido (regex)
   - Username 3-30 caracteres (regex)

2. **Confirmaciones:**
   - Diálogos de confirmación para acciones destructivas

3. **Validación de Cuenta Propia:**
   ```javascript
   if (userItem._id !== user._id) {
       // Mostrar botones de acción
   }
   ```

---

## Tabla de Funcionalidades

| Funcionalidad | Endpoint | Método | Requiere Auth | Solo Admin | Confirmación |
|---------------|----------|--------|---------------|------------|--------------|
| Listar usuarios | `/api/v1/users` | GET | Si | Si | No |
| Ver usuario específico | `/api/v1/users/:id` | GET | Si | Si* | No |
| Editar usuario | `/api/v1/users/:id` | PUT | Si | Si | No |
| Eliminar usuario | `/api/v1/users/:id` | DELETE | Si | Si | Si |
| Activar/Desactivar | `/api/v1/users/:id/toggle-active` | PATCH | Si | Si | Si |

*\* O el usuario consultando su propio perfil*

---

## Estilos de Botones

### **Editar (Azul)**
```css
.btn-edit {
    background: transparent;
    color: #4285f4;
    border: 1px solid #4285f4;
}
```

### **Desactivar (Naranja)**
```css
.btn-warning {
    background: transparent;
    color: #ff9800;
    border: 1px solid #ff9800;
}
```

### **Activar (Verde)**
```css
.btn-success {
    background: transparent;
    color: #4caf50;
    border: 1px solid #4caf50;
}
```

### **Eliminar (Rojo)**
```css
.btn-delete {
    background: transparent;
    color: #d33d33;
    border: 1px solid #d33d33;
}
```

---

## Casos de Uso

### **Caso 1: Moderador Suspende Usuario**
```
Escenario: Un usuario ha violado las normas del sitio

Acción:
1. Admin ve la lista de usuarios
2. Identifica al usuario infractor
3. Clic en "Desactivar"
4. Confirma la acción

Resultado:
- Usuario no puede iniciar sesión
- Cuenta sigue existiendo con todos sus datos
- Admin puede reactivar más tarde si es necesario
```

### **Caso 2: Promover Usuario a Admin**
```
Escenario: Un usuario de confianza será promovido a administrador

Acción:
1. Admin ve la lista de usuarios
2. Clic en "Editar" en el usuario
3. Cambia Rol de "user" a "admin"
4. Clic en "Actualizar"

Resultado:
- Usuario ahora tiene permisos de administrador
- Puede acceder al panel admin
- Toast de confirmación
```

### **Caso 3: Eliminar Cuenta de Spam**
```
Escenario: Se detecta una cuenta de spam que debe eliminarse

Acción:
1. Admin ve la lista de usuarios
2. Identifica la cuenta spam
3. Clic en "Eliminar"
4. Confirma la eliminación

Resultado:
- Usuario eliminado permanentemente
- Email liberado para nuevo registro
- Log de auditoría registrado
```

---

## Validaciones Frontend

### **Email**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    toast.error('Email no válido');
    return false;
}
```

### **Username**
```javascript
const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
if (!usernameRegex.test(username)) {
    toast.error('Username debe tener 3-30 caracteres (solo letras, números y _)');
    return false;
}
```

---

## Logs de Auditoría

Todas las acciones de gestión de usuarios se registran en el backend:

```javascript
[AUDIT] User admin@example.com updated user jorge@example.com
[AUDIT] User admin@example.com activated user test@example.com
[AUDIT] User admin@example.com deleted user spam@example.com
```

**Información Registrada:**
- Acción realizada (UPDATE, DELETE, TOGGLE_STATUS)
- Email del admin que ejecutó la acción
- Email del usuario afectado
- Timestamp (automático por console.log)

**Uso Futuro:**
- Estos logs pueden enviarse a una base de datos
- Implementar dashboard de auditoría
- Análisis de seguridad

---

## Próximas Mejoras (Opcional)

1. **Búsqueda y Filtros:**
   - Buscar por email/username
   - Filtrar por rol (admin/user)
   - Filtrar por estado (activo/inactivo)

2. **Paginación:**
   - Mostrar 20 usuarios por página
   - Navegación entre páginas

3. **Cambio de Contraseña:**
   - Endpoint específico para cambiar contraseña
   - Requiere contraseña actual para validación

4. **Exportar Lista:**
   - Exportar usuarios a CSV/Excel
   - Reportes de usuarios registrados

5. **Estadísticas:**
   - Usuarios registrados por mes
   - Usuarios activos vs inactivos
   - Distribución de roles

---

## Resumen de Funcionalidades

### Implementadas
- Listar todos los usuarios
- Editar usuario (email, username, nombre, apellido, rol)
- Activar/Desactivar usuario
- Eliminar usuario
- Validaciones de seguridad
- Logs de auditoría
- Confirmaciones de acciones
- Manejo de errores con toast

### Pendientes
- Búsqueda y filtros
- Paginación
- Cambio de contraseña
- Exportar datos
- Dashboard de estadísticas

---

**Última actualización:** 5 de Octubre 2025  
**Responsable:** GitHub Copilot + Jorge  
**Rama:** `integracion-backend-frontend`  
**Commit:** `125ab7b`
