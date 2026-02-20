# Historia, Aprendizajes y Desafios Superados

Este documento registra la evolucion del proyecto, los incidentes relevantes y las lecciones aprendidas.

---

## Cronologia del Proyecto

### Septiembre 2025 — Arquitectura Base
- Setup inicial del proyecto MERN (MongoDB, Express, React, Node.js)
- Configuracion de Express, Mongoose y React 17
- Creacion de `docker-compose.yml` inicial

### Octubre 2025 — Integracion Frontend-Backend
- Conexion completa de vistas React con la API Node.js
- Implementacion de `AuthContext` y rutas protegidas
- CRUD de jugadores funcional desde el dashboard de administracion

### Agosto 2025 — Panel de Administracion
- Implementacion completa de `AdminDashboard.jsx`
- Suite de 12 tests de seguridad y funcionalidad (100% cobertura)
- Sistema de auditoria de acciones administrativas

### Noviembre 2025 — Dockerizacion, Seguridad y Estabilizacion
- Aislamiento completo de la base de datos en un contenedor Docker dedicado (ver incidente abajo)
- Correccion del pipeline CI/CD en GitHub Actions (servicio MongoDB faltante)
- Reestructuracion completa de la documentacion en carpeta `docs/`
- Establecimiento del estandar "Sin Emojis" en codigo y documentacion tecnica
- Remediacion de fuga de credenciales MongoDB Atlas (ver incidente abajo)
- Solucion a problemas de AuthProvider y CSP en frontend
- Login y visualizacion de jugadores verificados y funcionales

### Febrero 2026 — Estandarizacion de documentacion
- Auditoria completa de 22 archivos de documentacion
- Consolidacion de 15 archivos en 6, eliminando duplicidades y referencias rotas
- Correccion de rutas documentadas para que coincidan con la realidad de `App.js`
- Validacion local completa: frontend, backend y base de datos funcionando correctamente

---

## Incidentes y Desafios Superados

### Incidente 1: Confusion de Base de Datos (Noviembre 2025)

**Gravedad**: Alta — Riesgo de perdida de datos  
**Estado**: Resuelto

**Que ocurrio**: Durante las pruebas de despliegue Docker, el backend estaba configurado para conectarse a la base de datos del host (Windows) mediante `host.docker.internal`. Ejecutar el script de seed (`seed-db.js`) borraba los datos de produccion locales del desarrollador.

**Causa raiz**:
```yaml
# Configuracion INCORRECTA (anterior)
MONGO_URI=mongodb://host.docker.internal:27017/basketball_team
```

**Solucion implementada**: Se agrego un servicio `mongo` dedicado en `docker-compose.yml` con volumen persistente. El backend ahora se conecta a este contenedor directamente:
```yaml
# Configuracion CORRECTA (actual)
MONGO_URI=mongodb://mongo:27017/basketball_team
```

**Leccion aprendida**:
- Nunca usar `host.docker.internal` para bases de datos cuando se ejecutan scripts destructivos
- Siempre aislar datos en volumenes Docker dedicados
- Implementar checks de seguridad en scripts de seed para evitar ejecuciones en produccion

---

### Incidente 2: Fuga de Credenciales MongoDB Atlas (27 Noviembre 2025)

**Gravedad**: Alta — Credencial expuesta publicamente  
**Estado**: Accion requerida (ver abajo)

**Que ocurrio**: GitHub detecto una credencial de MongoDB Atlas (`mongodb+srv://...`) expuesta en el historial del repositorio, en el commit `f8b885b`. El archivo original (`docs/DATABASE_MANAGEMENT.md`) ya no existe en la version actual.

**Analisis**: Se realizo un escaneo completo de los archivos actuales — la credencial NO esta presente en ningun archivo activo. La alerta persiste porque el secreto existe en el historial de Git.

**Acciones requeridas (pendientes de confirmar)**:
1. **Revocar credencial en MongoDB Atlas** — ir a Database Access, eliminar o cambiar la contrasena del usuario afectado
2. **Cerrar alerta en GitHub** — marcarla como "Revoked" una vez revocada
3. **Limpiar historial** (opcional) — usar BFG Repo-Cleaner o `git filter-branch`

**Leccion aprendida**:
- Nunca hacer commit de archivos `.env` con credenciales reales
- Usar `.env.example` con valores ficticios para compartir configuraciones
- Considerar pre-commit hooks o `git-secrets` para prevenir fugas

---

### Desafio 3: AuthProvider y CSP (Noviembre 2025)

**Estado**: Resuelto

**Que ocurrio**: El componente `App.js` no tenia el `AuthProvider` envuelto correctamente, causando errores `useAuth must be used within an AuthProvider`. Ademas, la Content Security Policy (CSP) en `nginx.conf` bloqueaba las llamadas a la API desde el frontend.

**Solucion**: Se integro `AuthProvider` en `App.js` y se configuro la CSP en `frontend/nginx.conf` para permitir llamadas al backend.

---

## Integracion Validada (Noviembre 2025)

Estado verificado en entorno local con Docker:

| Componente | Estado |
|---|---|
| Login con JWT | Funcional |
| Persistencia de sesion | Funcional |
| Logout e invalidacion de token | Funcional |
| Proteccion de rutas | Funcional |
| CRUD de jugadores | Funcional |
| Gestion de usuarios (admin) | Funcional |
| Comunicacion entre contenedores Docker | Funcional |
| Base de datos aislada y persistente | Funcional |

---

## Validacion Local — Febrero 2026

**Resultado**: La solucion fue probada satisfactoriamente en entorno local:
- **Frontend** (http://localhost:3000): Funcional
- **Backend** (http://localhost:5000): Funcional
- **Base de Datos** (MongoDB en Docker): Conectada y con datos reales persistentes

---
**Ultima actualizacion**: Febrero 2026
