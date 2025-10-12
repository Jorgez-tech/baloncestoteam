# 🔍 Guía de Validación de Integración Backend-Frontend

**📅 Fecha:** 11 de Octubre 2025  
**🌿 Rama:** `main`  
**🧪 Último resultado automático:** `backend/npm test` ✅ · `frontend/npm test -- --watchAll=false` ✅

---

## 🧾 Resumen 11/10/2025

- 🔄 La rama `integracion-backend-frontend` fue fusionada en `main` sin conflictos; todas las ramas accesorias se eliminaron.
- 🧪 Se ejecutaron y superaron las suites automatizadas de backend y frontend. Persisten avisos conocidos (React Router v7, timers de Jest) sin impacto funcional.
- 🧹 Se limpiaron artefactos generados (`build/`, `coverage/`, logs) y se actualizó la documentación general (README).
- 📌 Pendiente: validación manual final de vistas completas antes del despliegue.

---

## ✅ Fase 1: Correcciones Críticas (COMPLETADA)

### Cambios Aplicados

1. ✅ **Unificación de cliente API**
   - Migrado `players.js` de `fetch` a `playersAPI` (axios)
   - Migrado `contacto.jsx` de `fetch` a `apiClient` (axios)
   
2. ✅ **Configuración de react-toastify**
   - `ToastContainer` añadido en `App.js`
   - Todas las notificaciones ahora usan `toast`
   
3. ✅ **Mejora de manejo de errores**
   - Diferenciación entre errores de red, servidor y validación
   - Mensajes de error claros y específicos

---

## 🧪 Fase 2: Validación Funcional

### 🆕 Actualización 11/10/2025 – Consolidación final

- ✅ `frontend/src/__tests__/AdminUsers.test.jsx` cubre escenarios de error/reintento en la pestaña de usuarios y bloqueo de autodestrucción.
- ✅ `frontend/src/__tests__/Admin.test.jsx` verifica acceso protegido y renderizado del panel admin.
- ✅ Se documentó la ejecución de `npm test` (backend) y `npm test -- --watchAll=false` (frontend) con resultado exitoso.
- 📝 Manual: queda pendiente confirmar visualmente los flujos descritos abajo, especialmente gestión de usuarios y contacto.

### 🆕 Actualización 05/10/2025 – AdminDashboard

- 🎯 Se restauró el listado de jugadores en la pestaña "Jugadores" usando el modelo `jersey_number` y mapeos de posiciones.
- 🧩 La pestaña "Usuarios" ahora maneja respuestas 403/errores parciales sin romper el panel, mostrando un mensaje contextual cuando el endpoint falla.
- 🧹 Se redujo el ruido de consola dejando trazas de auditoría condicionadas al modo desarrollo.
- 🧪 Ejecución de `npm run test -- --watchAll=false` (frontend) → ❌ Falló por módulo ausente `./test-utils` referenciado en `src/__tests__/Admin.test.jsx`. Se requiere reconstruir utilidades de pruebas para volver a ejecutar la suite.
- 🔐 Los tokens JWT ahora incluyen `role` y `email`; los administradores deben cerrar sesión y volver a iniciar para obtener el nuevo permiso.


### 1️⃣ **Flujos de Autenticación**

#### A. Registro de Usuario

**Endpoint:** `POST /api/v1/auth/register`

**Pasos de prueba:**

1. Ir a `/registro`
2. Completar formulario con datos válidos
3. Verificar que:
   - ✅ Se muestre mensaje de éxito
   - ✅ Se redirija a `/login` después de 2 segundos
   - ✅ Usuario se guarde en MongoDB

**Casos de error a validar:**

- ❌ Email duplicado → mensaje "Email already registered"
- ❌ Contraseña < 6 caracteres → mensaje de validación
- ❌ Contraseñas no coinciden → mensaje de validación

---

#### B. Login de Usuario

**Endpoint:** `POST /api/v1/auth/login`

**Pasos de prueba:**

1. Ir a `/login`
2. Ingresar credenciales válidas
3. Verificar que:
   - ✅ Se guarde `token` en localStorage
   - ✅ Se guarde `user` en localStorage
   - ✅ Se redirija a `/` (usuario normal) o `/admin` (admin)
   - ✅ El header muestre "Cerrar Sesión" en lugar de "Iniciar Sesión"

**Casos de error a validar:**

- ❌ Credenciales incorrectas → mensaje "Invalid credentials"
- ❌ Usuario no existe → mensaje "Invalid credentials"
- ❌ Backend apagado → mensaje "Error de conexión"

---

#### C. Logout

**Acción:** Hacer clic en "Cerrar Sesión"

**Pasos de prueba:**

1. Estando logueado, hacer clic en "Cerrar Sesión"
2. Verificar que:
   - ✅ Se elimine `token` de localStorage
   - ✅ Se elimine `user` de localStorage
   - ✅ Se redirija a `/login`
   - ✅ El header muestre "Iniciar Sesión"

---

#### D. Rutas Protegidas

**Ruta:** `/admin` (requiere rol `admin`)

**Pasos de prueba:**

1. Sin autenticar, intentar acceder a `/admin`
   - ✅ Debe redirigir a `/login`

2. Logueado como `user`, intentar acceder a `/admin`
   - ✅ Debe redirigir a `/`

3. Logueado como `admin`, acceder a `/admin`
   - ✅ Debe mostrar el AdminDashboard

---

### 2️⃣ **CRUD de Jugadores**

#### A. Listar Jugadores (Vista Pública)

**Endpoint:** `GET /api/v1/players`

**Pasos de prueba:**

1. Ir a `/jugadores`
2. Verificar que:
   - ✅ Se muestren todos los jugadores
   - ✅ Se muestren avatares correctamente
   - ✅ Se muestre nombre, posición

**Caso de error:**

- ❌ Backend apagado → mostrar array vacío o mensaje de error

---

#### B. Crear Jugador (Admin)

**Endpoint:** `POST /api/v1/players`

**Pasos de prueba:**

1. Loguearse como admin
2. Ir a `/admin` → pestaña "Jugadores"
3. Hacer clic en "➕ Agregar Jugador"
4. Completar formulario con datos válidos
5. Hacer clic en "Crear"
6. Verificar que:
   - ✅ Se muestre toast de éxito
   - ✅ El jugador aparezca en la tabla
   - ✅ El modal se cierre

**Casos de error:**

- ❌ Número de jugador duplicado → mensaje de error
- ❌ Campos obligatorios vacíos → mensaje de validación
- ❌ Valores fuera de rango → mensaje de validación

---

#### C. Editar Jugador (Admin)

**Endpoint:** `PUT /api/v1/players/:id`

**Pasos de prueba:**

1. En `/admin` → pestaña "Jugadores"
2. Hacer clic en "✏️ Editar" en un jugador
3. Modificar datos
4. Hacer clic en "Actualizar"
5. Verificar que:
   - ✅ Se muestre toast de éxito
   - ✅ Los cambios se reflejen en la tabla
   - ✅ El modal se cierre

---

#### D. Eliminar Jugador (Admin)

**Endpoint:** `DELETE /api/v1/players/:id`

**Pasos de prueba:**

1. En `/admin` → pestaña "Jugadores"
2. Hacer clic en "🗑️ Eliminar" en un jugador
3. Confirmar la eliminación
4. Verificar que:
   - ✅ Se muestre toast de éxito
   - ✅ El jugador desaparezca de la tabla

---

### 3️⃣ **Gestión de Usuarios (Admin)**

#### A. Listar Usuarios

**Endpoint:** `GET /api/v1/users`

**Pasos de prueba:**

1. Loguearse como admin
2. Ir a `/admin` → pestaña "Usuarios"
3. Verificar que:
   - ✅ Se muestren todos los usuarios
   - ✅ Se muestren roles (admin/user)
   - ✅ Se muestren estados (activo/inactivo)

---

#### B. Editar Usuario

**Endpoint:** `PUT /api/v1/users/:id`

**Pasos de prueba:**

1. En `/admin` → pestaña "Usuarios"
2. Hacer clic en "✏️ Editar" en un usuario
3. Modificar rol o datos
4. Hacer clic en "Actualizar"
5. Verificar que:
   - ✅ Se muestre toast de éxito
   - ✅ Los cambios se reflejen en la tabla

---

#### C. Eliminar Usuario

**Endpoint:** `DELETE /api/v1/users/:id`

**Pasos de prueba:**

1. En `/admin` → pestaña "Usuarios"
2. Hacer clic en "🗑️ Eliminar" en un usuario (no el propio)
3. Confirmar la eliminación
4. Verificar que:
   - ✅ Se muestre toast de éxito
   - ✅ El usuario desaparezca de la tabla

**Validación:**

- ❌ No se debe poder eliminar el propio usuario → mensaje de error

---

### 4️⃣ **Formulario de Contacto**

**Endpoint:** `POST /api/v1/contact`

**Pasos de prueba:**

1. Ir a `/contacto`
2. Completar formulario con datos válidos
3. Hacer clic en "Enviar"
4. Verificar que:
   - ✅ Se muestre toast de éxito
   - ✅ El formulario se limpie
   - ✅ El mensaje se registre en el backend (consola)

**Casos de error:**

- ❌ Email inválido → toast de error
- ❌ Campos obligatorios vacíos → toast de error
- ❌ Backend apagado → toast "Error de conexión"

---

## 🔧 Manejo de Errores Global

### Casos a Validar

1. **Error 401 (No Autorizado)**
   - ✅ Debe eliminar token y redirigir a `/login`
   - ✅ Se dispara automáticamente por el interceptor

2. **Error 4xx (Cliente)**
   - ✅ Debe mostrar toast con mensaje del servidor
   - ✅ Ejemplo: "Email already registered"

3. **Error 5xx (Servidor)**
   - ✅ Debe mostrar toast genérico
   - ✅ Ejemplo: "Error del servidor. Intenta más tarde"

4. **Error de Red**
   - ✅ Debe mostrar toast de conexión
   - ✅ Ejemplo: "Error de conexión. Verifica tu internet"

---

## 📝 Checklist de Validación

### Autenticación

- [ ] Registro exitoso
- [ ] Registro con email duplicado (error)
- [ ] Login exitoso (user)
- [ ] Login exitoso (admin)
- [ ] Login con credenciales incorrectas (error)
- [ ] Logout
- [ ] Ruta protegida sin autenticar (redirect a login)
- [ ] Ruta protegida admin sin rol (redirect a home)

### Jugadores

- [x] Listar jugadores (vista pública) ✅
- [x] Crear jugador (admin) ✅ CONFIRMADO
- [x] Editar jugador (admin) ✅ CONFIRMADO
- [x] Eliminar jugador (admin) ✅ CONFIRMADO
- [x] Validaciones de formulario (número duplicado, campos vacíos) ✅

### Usuarios

- [ ] Listar usuarios (admin) — *Cobertura automática: `AdminUsers.test.jsx`.*
- [ ] Editar usuario (admin) — *Realizar prueba manual (ver sección correspondiente).* 
- [ ] Eliminar usuario (admin) — *Realizar prueba manual.*
- [ ] No eliminar propio usuario (validación) — *Cobertura automática; confirmar manualmente.*

### Contacto

- [ ] Enviar mensaje exitoso (manual)
- [ ] Validación de campos obligatorios (manual)
- [ ] Validación de email (manual)
- [ ] Manejo de error de red (manual)

### Errores Globales

- [ ] Error 401 → redirect a login
- [ ] Error 4xx → toast con mensaje
- [ ] Error 5xx → toast genérico
- [ ] Error de red → toast de conexión

---

## 🚀 Recomendaciones Post-Validación

1. **Agregar tests automatizados** (Jest, React Testing Library)
2. **Implementar rate limiting en frontend** (evitar spam de requests)
3. **Agregar loading states globales** (spinner durante llamadas API)
4. **Implementar refresh token** (para sesiones más largas)
5. **Agregar logs de auditoría persistentes** (backend)
6. **Mejorar UX con skeleton screens** (mientras carga data)

---

## 📊 Estado Actual

**✅ Completado:**

- Unificación de cliente API (Axios centralizado) y react-toastify en frontend.
- Validaciones de jugadores en backend (`middleware/validation.js`).
- Manejo de errores del formulario de contacto con mensajes detallados.
- Panel de administración estabilizado (jugadores + usuarios) con pruebas unitarias asociadas.
- Limpieza de artefactos (`build/`, `coverage/`, logs) y actualización de README.

**🔄 En Progreso:**

- Validación manual de flujos de autenticación y panel admin posterior a merge.
- Documentación de resultados manuales (este documento se actualizará tras dicha verificación).

**⏳ Pendiente:**

- Ejecutar smoke test (`node backend/scripts/smoke.js`) contra entorno representativo.
- Preparación del plan de despliegue (infraestructura y CI/CD).

---

**Última actualización:** 11 de Octubre 2025  
**Responsable:** GitHub Copilot + Jorge  
**Rama:** `main`
