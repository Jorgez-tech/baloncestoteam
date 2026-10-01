# Plan de Implementación y Auditoría Técnica: Fase 1 (Consolidación del Núcleo)

**Proyecto:** `baloncestoteam`  
**Fecha:** Septiembre 2026  
**Estado:** Listo para ejecución técnica en la próxima sesión  

---

## 1. 📌 Resumen de la Auditoría Técnica (Código Real vs. Arquitectura)

### Diagnóstico General
- **Backend**: Monolito en Express + MongoDB (`basketball_team`). Presenta acoplamiento directo entre routers y base de datos, tipos y parámetros sin whitelisting (uso directo de `req.body`), modelos con nombres desactualizados (`Photo.js` = `Game`, `Description.js` = `Practice`), auditoría mediante `console.log`, y un bug en `profiles.js` (`req.user.userId` vs `req.user.id`).
- **Frontend**: React 17 funcional, pero maneja tokens JWT en `localStorage`, auditoría en cliente con `console.info`, y discrepancias en campos del formulario de usuario/jugador en `AdminDashboard.jsx`.
- **Datos en Producción**: Base de datos `basketball_team` con 3 jugadores reales y usuarios activos. **Prohibido ejecutar scripts destructivos (`seed-db.js`)**.

---

## 2. 🗂️ Matriz de Hallazgos y Soluciones Inmediatas

| Archivo | Severidad | Hallazgo | Solución Fase 1 |
|---|---|---|---|
| `backend/routers/profiles.js` | 🔴 Alta | `req.user.userId` es `undefined` | Unificar a `req.user.id` |
| `backend/package.json` | 🔴 Alta | `"db:reset": "node seed-db.js seed"` expone a pérdida de datos | Eliminar/proteger comando destructivo |
| `backend/server.js` | 🟡 Media | `app.listen()` corre al importar `server.js` (fuga de handles en tests) | Separar creación de `app` del listener |
| `backend/models/Photo.js` | 🟡 Media | Archivo llamado `Photo.js` define el modelo `Game` | Renombrar a `game.model.js` (mantener colección MongoDB) |
| `backend/models/Description.js` | 🟡 Media | Archivo llamado `Description.js` define el modelo `Practice` | Renombrar a `practice.model.js` |
| `backend/routers/players.js` | 🔴 Alta | Inyección directa `new Player(req.body)` y lógica en router | Crear `PlayerService` + DTOs con validación estricta |
| `backend/routers/users.js` | 🟡 Media | `console.log('[AUDIT]')` | Implementar colección `audit_logs` en MongoDB |
| `backend/routers/contact.js` | 🟡 Media | Respuesta simulada en consola | Conectar a servicio de notificación/mailer |
| `frontend/src/context/AuthContext.js` | 🔴 Alta | Almacenamiento de tokens en `localStorage` | Migrar a cookies `HttpOnly` y Refresh Tokens |

---

## 3. 🚀 Hoja de Ruta de Ejecución Técnica (Fase 1)

### Paso 1: Inicialización de Ramas
```bash
# 1. Integrar la suite de arquitectura a main
git checkout main
git merge copilot/architectural-proposal-evolution

# 2. Crear rama de integración develop
git checkout -b develop

# 3. Crear primera rama de refactorización
git checkout -b refactor/fase1-hotfixes-and-models
```

### Paso 2: Saneamiento Inmediato y Modelos (Fase 1.1 y 1.2)
- [ ] Corregir `req.user.userId` en `backend/routers/profiles.js`.
- [ ] Eliminar script `"db:reset"` de `backend/package.json`.
- [ ] Separar `app.js` (configuración de Express y middlewares) de `server.js` (arranque del listener) para tests limpios en Jest.
- [ ] Renombrar modelos a convención estándar:
  - `backend/models/Photo.js` $\to$ `backend/models/game.model.js`
  - `backend/models/Description.js` $\to$ `backend/models/practice.model.js`
  - `backend/models/player.js` $\to$ `backend/models/player.model.js`
  - `backend/models/user.js` $\to$ `backend/models/user.model.js`

### Paso 3: DTOs y Capa de Servicios Ligera (Fase 1.3 y 1.4)
- [ ] Crear DTOs de entrada y salida para `Players` y `Auth`.
- [ ] Extraer lógica de negocio de los routers hacia `services/player.service.js`, `services/auth.service.js` y `services/user.service.js`.
- [ ] Asegurar que el contrato de API pública y respuestas JSON no se alteren.

### Paso 4: Auditoría Persistente (Fase 1.5)
- [ ] Crear modelo `backend/models/audit_log.model.js` (colección `audit_logs`).
- [ ] Crear `services/audit.service.js` para registrar acciones de forma persistente.
- [ ] Reemplazar todos los `console.log('[AUDIT]')` por llamadas al servicio.

### Paso 5: Seguridad y Flujo de Recuperación (Fase 1.7)
- [ ] Implementar endpoints `/auth/forgot-password`, `/auth/verify-reset-code` y `/auth/reset-password`.
- [ ] Implementar cookies `HttpOnly` y rotación de tokens.

---

## 4. 🔒 Garantías de Invariantes del Proyecto
1. **Datos de Producción Intactos**: La base de datos `basketball_team` y sus documentos reales de jugadores no serán modificados ni reseteados.
2. **Cero Downtime / 100% Retrocompatibilidad**: Todo cambio en el backend mantendrá la interfaz que consume el frontend actual.
3. **Anti Sobre-Ingeniería (KISS)**: Separación limpia en 3 capas reales (*Presentation $\to$ Application $\to$ Infrastructure*), sin boilerplate excesivo.
