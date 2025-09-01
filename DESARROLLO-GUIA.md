# 🧭 Guía de Desarrollo Estándar – Proyecto Basketball Team 🏀

> Esta guía sirve como referencia para mantener orden, calidad y consistencia en el desarrollo del proyecto. Está organizada por sprints, buenas prácticas, automatizaciones y criterios de finalización. Se puede marcar el progreso con `[x]` y consultar en cualquier momento.

---

## Gap Analysis y Checklist Priorizado

### Estado por Sprint

#### Sprint 1 – Funcionalidades base
- Backend API: [x] Hecho
  - [x] CRUD jugadores, JWT con roles, CORS/Helmet/Rate limiting, validaciones básicas (Mongoose/type checks), Swagger (openapi.yaml), health y 404 handler.
  - [~] Brecha menor: validación de entrada más robusta (express-validator/Joi) en endpoints críticos.
- Frontend React: [x] Hecho
  - [x] Vistas Home, Login, Signup, PlayerList, PlayerProfile, Gallery; React Router v6; AuthContext; 404 (“Página no encontrada”).
  - [x] Nota: Hay logs en Header (“HEADER user: null…”); conviene removerlos o proteger con NODE_ENV. (Ya realizado)
- Landing Page: [x] Hecho
  - [x] Hero, galería, formulario, conexión al backend desde assets/script.js.

#### Sprint 2 – Testing y automatización
- Pruebas: [~] Parcial
  - [x] Frontend: tests de rutas con RTL y Jest funcionando (Login, Admin, PlayerList OK).
  - [ ] Backend: No hay suite de tests visible (pendiente: Jest + supertest + mongodb-memory-server).
  - [ ] Cobertura ≥70%: No medido aún; requerirá más pruebas (componentes, hooks y flujos).
- Automatización: [ ] Pendiente
  - [ ] GitHub Actions: no hay workflow.
  - [ ] ESLint + Prettier: no veo configuración consolidada (pendiente .eslintrc, .prettierrc, scripts).
  - [ ] Convencional Commits: usado de facto, pero no validado (pendiente commitlint + husky).

#### Sprint 3 – Limpieza y buenas prácticas
- Código: [x] Realizado
  - [x] Logs innecesarios: hay logs en Header; limpiar o usar logger nivel DEBUG. (Ya realizado)
  - [x] Modularización/nombres: En general bien; ojo con duplicado/case de Header (Header.jsx vs header.js) por FS de Windows. (Ya realizado)
  - [x] Comentarios: correctos; mantener concisos.
- Documentación: [~] Parcial
  - [x] README raíz muy completo; backend/README presente. Falta CONTRIBUTING.md y un README en frontend con scripts/estructura/tests.

#### Sprint 4 – Seguridad y rendimiento
- Seguridad: [~] Hecho/Parcial
  - [x] Helmet, CORS, rate limiting, JWT sin exponer password. Falta endurecer validación de entrada uniformemente.
- Rendimiento: [~] Parcial
  - [ ] Code splitting/lazy en rutas: no aplicado (React.lazy/Suspense).
  - [~] Optimización imágenes: landing ok; revisar carga diferida/gallery.
  - [~] Bundle: CRA ya minimiza; revisar análisis con source-map-explorer si se desea.

#### Sprint 5 – Despliegue y demo
- Backend: [~] Parcial
  - [x] Instrucciones y .env.example OK; falta pipeline o definición de entorno productivo (.env.production).
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
- [x] commitlint + husky (commit-msg hook).
- [ ] GitHub Actions (workflow: install → lint → test backend y frontend).

5) Rendimiento incremental
- [ ] React.lazy + Suspense en AdminDashboard/PlayerProfile/Gallery.
- [ ] Revisión de imágenes (lazy en gallery/landing).

6) Documentación
- [ ] README frontend (scripts, estructura, tests).
- [ ] CONTRIBUTING.md (flujo ramas, commits, PRs).
- [ ] Tabla de variables (.env.*) en README o docs/.

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

**Última actualización:** [fecha]
**Responsable:** Jorge Zuta
**Repositorio:** [GitHub - Basketball Team](https://github.com/Jorgez-tech/baloncestoteam)

---

