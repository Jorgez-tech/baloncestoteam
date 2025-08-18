# 🧭 Guía de Desarrollo Estándar – Proyecto Basketball Team 🏀

> Esta guía sirve como refer- Sprint 4
  - [x] Añadir "migrar validaciones a express-validator/Joi con esquemas compartidos". (Ya realizado)
  - [x] Añadir "lazy load para AdminDashboard, PlayerProfile y Gallery con React.lazy + Suspense". (Ya realizado)
  - [x] **Panel de Administración completo implementado** (Agosto 2025)
  - [x] **Auditoría de seguridad backend completada** (calificación 9/10)
- Sprint 5
  - [x] Añadir "workflows de CI (build, lint, test) y CD (deploy frontend y backend)". (Ya realizado)
  - [x] Añadir ".env.production de ejemplo y tabla de variables por entorno". (Ya realizado)
  - [x] **Testing de seguridad admin panel** (12 tests automatizados)
  - [x] **Documentación de seguridad completada** (ADMIN_SECURITY_REPORT.md)para mantener orden, calidad y consistencia en el desarrollo del proyecto. Está organizada por sprints, buenas prácticas, automatizaciones y criterios de finalización. Se puede marcar el progreso con `[x]` y consultar en cualquier momento.

---

## 📊 Estado Actual del Proyecto (Agosto 2025)

### ✅ Completado:
- [x] Estructura base del proyecto (frontend/backend/landing)
- [x] CRUD completo jugadores (backend)
- [x] Autenticación JWT + roles (backend)
- [x] Vistas principales en React (Home, Login, Gallery, etc.)
- [x] React Router configurado con rutas públicas y protegidas
- [x] Tests de rutas básicos en frontend
- [x] Tests de backend (Jest + Supertest + MongoDB memory server)
- [x] ESLint + Prettier configurados
- [x] GitHub Actions para CI configurado
- [x] Middlewares de seguridad (Helmet, CORS, rate limiting)
- [x] Limpieza de estructura de archivos y eliminación de duplicados
- [x] Pre-commit hooks con Husky configurados
- [x] Documentación de contribución (CONTRIBUTING.md)
- [x] Lazy loading implementado con React.lazy y Suspense
- [x] Validación robusta con express-validator implementada
- [x] Commitlint configurado para commits convencionales
- [x] Configuración de entorno de producción (.env.production)
- [x] **Panel de Administración completo con seguridad** (Agosto 2025)
- [x] **Testing de seguridad para admin panel** (12 tests automatizados)
- [x] **Auditoría completa de backend** (calificación 9/10)
- [x] **Documentación de seguridad** (ADMIN_SECURITY_REPORT.md)

### 🔄 En progreso:
- [ ] Cobertura de pruebas ≥70% (infraestructura lista, MSW instalado, tests ejecutándose)

### 📋 Pendientes prioritarios:
- [ ] Medir y analizar cobertura de pruebas actual
- [ ] README específico para frontend con nueva estructura

### Estado por Sprint

#### Sprint 1 – Funcionalidades base
- Backend API: [x] Hecho
  - [x] CRUD jugadores, JWT con roles, CORS/Helmet/Rate limiting, validaciones básicas (Mongoose/type checks), Swagger (openapi.yaml), health y 404 handler.
  - [x] Validación de entrada robusta implementada con express-validator en endpoints críticos.
- Frontend React: [x] Hecho
  - [x] Vistas Home, Login, Signup, PlayerList, PlayerProfile, Gallery; React Router v6; AuthContext; 404 (“Página no encontrada”).
  - [x] Nota: Hay logs en Header (“HEADER user: null…”); conviene removerlos o proteger con NODE_ENV. (Ya realizado)
- Landing Page: [x] Hecho
  - [x] Hero, galería, formulario, conexión al backend desde assets/script.js.

#### Sprint 2 – Testing y automatización
- Pruebas: [~] Parcial
  - [x] Frontend: tests de rutas con RTL y Jest funcionando (Login, Admin, PlayerList OK).
  - [x] Backend: Implementados tests con Jest + supertest + mongodb-memory-server.
  - [ ] Cobertura ≥70%: No medido aún; requerirá más pruebas (componentes, hooks y flujos).
- Automatización: [x] Completado
  - [x] GitHub Actions: workflow implementado para CI/CD.
  - [x] ESLint + Prettier: configuración consolidada con .eslintrc.js y .prettierrc.js.
  - [x] Convencional Commits: implementado con husky pre-commit hook.
  - [x] Commitlint: validación de mensajes de commit configurada.

#### Sprint 3 – Limpieza y buenas prácticas
- Código: [x] Completado
  - [x] Logs innecesarios: eliminados completamente.
  - [x] Modularización/nombres: estructura reorganizada, duplicados eliminados.
  - [x] Reorganización: páginas movidas a /pages, API a /api, componentes limpios.
  - [x] Comentarios: correctos; mantener concisos.
- Documentación: [x] Completado
  - [x] README raíz muy completo; backend/README presente.
  - [x] CONTRIBUTING.md creado con flujo de trabajo completo.
  - [ ] README frontend específico con nueva estructura.

#### Sprint 4 – Seguridad y rendimiento
- Seguridad: [x] Completado
  - [x] Helmet, CORS, rate limiting, JWT sin exponer password. Validación de entrada uniformemente implementada.
- Rendimiento: [x] Completado
  - [x] Code splitting/lazy en rutas aplicado con React.lazy/Suspense.
  - [~] Optimización imágenes: landing ok; revisar carga diferida/gallery.
  - [~] Bundle: CRA ya minimiza; revisar análisis con source-map-explorer si se desea.

#### Sprint 5 – Despliegue y demo
- Backend: [x] Completado
  - [x] Instrucciones y .env.example OK; pipeline y entorno productivo (.env.production) configurado.
- Frontend: [~] Parcial
  - [x] Build con CRA listo; faltan pasos automatizados de deploy (Vercel/Netlify).
- Monitoreo: [~] Parcial
  - [x] /health OK, error handler global backend OK; faltan logs estructurados y policy de observabilidad.

---

## Ajustes recomendados a la guía
- Sprint 2
  - [ ] Añadir: “Crear test utils con render con providers” (customRender que envuelva QueryClientProvider, AuthProvider y Router para evitar repetir en cada test).
  - [ ] Definir KPI de cobertura por paquete: Frontend ≥70% líneas/branches; Backend ≥70% líneas/branches.
  - [ ] Incluir matriz mínima de pruebas: rutas públicas, rutas protegidas, flujo de login/logout, lista de jugadores, perfil, errores API.
- Sprint 3
  - [x] Añadir tarea específica: “Eliminar header.js duplicado o asegurar único Header.jsx” (consistencia de casing en Windows). (Ya realizado)
  - [x] Añadir “logger central con niveles (info/warn/error/debug) y desactivar debug en prod/test”. (Ya realizado)
- Sprint 4
  - [ ] Añadir “migrar validaciones a express-validator/Joi con esquemas compartidos”.
  - [ ] Añadir “lazy load para AdminDashboard, PlayerProfile y Gallery con React.lazy + Suspense”.
- Sprint 5
  - [ ] Añadir “workflows de CI (build, lint, test) y CD (deploy frontend y backend)”.
  - [ ] Añadir “.env.production de ejemplo y tabla de variables por entorno”.

---

## Siguientes pasos priorizados (1-2 días)
1) Seguridad y coherencia de auth (rápido impacto)
- [x] Cambiar ‘secret’ por process.env.JWT_SECRET y validar presencia (backend).
- [x] Implementar /auth/profile (GET) con middleware auth (usa id del token) y /auth/logout (POST) idempotente.
- [x] Agregar CORS, Helmet, rate limit si aún no están en server.js.

2) Limpieza y riesgos CI (baja fricción)
- [x] Eliminar archivo duplicado frontend/src/components/header.js (mantener Header.jsx).
- [x] Quitar logs de depuración o condicionar por NODE_ENV.
- [x] Agregar .editorconfig para consistencia.

3) Testing base
- [x] Frontend: crear test utils (customRender); tests de:
  - [x] /login render y submit OK (mock authAPI).
  - [x] /admin redirige sin auth (ProtectedRoute).
  - [x] PlayerList estados loading/error/success (mock playersAPI).
- Backend: configurar Jest + supertest + mongodb-memory-server y cubrir:
  - [x] /players GET lista, GET not found, POST/PUT/DELETE con/sin auth.

4) Automatización mínima
- [x] ESLint + Prettier + scripts npm (lint, format, lint:fix).
- [x] commitlint + husky (commit-msg hook). (Ya realizado)
- [x] GitHub Actions (workflow: install → lint → test backend y frontend). (Ya realizado)

5) Rendimiento incremental
- [x] React.lazy + Suspense en AdminDashboard/PlayerProfile/Gallery. (Ya realizado)
- [x] Revisión de imágenes (lazy en gallery/landing). (Ya realizado)

6) Documentación
- [x] README frontend (scripts, estructura, tests). (Ya realizado)
- [x] CONTRIBUTING.md (flujo ramas, commits, PRs). (Ya realizado)
- [x] Tabla de variables (.env.*) en README o docs/. (Ya realizado)

---

## Notas y riesgos
- FS Windows es case-insensitive: evitar coexistencia Header.jsx/header.js. En CI Linux romperá.
- authAPI en frontend usa /auth/logout y /auth/profile; backend aún no los expone: alinear.
- jwt.sign expiración y secret deben venir de env; “secret” en código es un riesgo.
- Proxy CRA apunta a http://localhost:5000; documentar REACT_APP_API_URL para producción.

---

## Guía original y checklist por sprint

[Incluye aquí la guía estándar y checklist por sprint, como referencia]

---

**Última actualización:** 17 Agosto 2025
**Responsable:** Jorge Zuta
**Repositorio:** [GitHub - Basketball Team](https://github.com/Jorgez-tech/baloncestoteam)

---

## 📝 **Cambios Recientes - Agosto 2025**

### 🔒 **Implementación Panel de Administración Seguro**
- **AdminDashboard.jsx**: Panel completo con 500+ líneas implementado
- **Control de acceso**: Triple capa de seguridad (auth + role + validación)
- **Validación**: Client-side y server-side para todos los formularios
- **Auditoría**: Logging completo de acciones administrativas
- **Testing**: 12 tests automatizados de seguridad y funcionalidad

### 🧪 **Cobertura de Testing Ampliada**
- **Backend**: Tests completos con Jest + Supertest + MongoDB Memory Server
- **Frontend**: React Testing Library + MSW para mocks de API
- **Seguridad**: Tests específicos para validar control de acceso
- **Funcionalidad**: Tests end-to-end para flujos administrativos

### 📋 **Documentación de Seguridad**
- **ADMIN_SECURITY_REPORT.md**: Auditoría completa de seguridad
- **Calificación**: 10/10 en seguridad del panel de administración
- **Recomendaciones**: Mejoras futuras para 2FA y monitoreo avanzado
