# ?? Gu�a de Desarrollo Est�ndar � Proyecto Basketball Team ??

> Esta gu�a sirve como referencia para mantener orden, calidad y consistencia en el desarrollo del proyecto. Est� organizada por sprints, buenas pr�cticas, automatizaciones y criterios de finalizaci�n. Se puede marcar el progreso con `[x]` y consultar en cualquier momento.

---

## Gap Analysis y Checklist Priorizado

### Estado por Sprint

#### Sprint 1 � Funcionalidades base
- Backend API: Hecho
  - CRUD jugadores, JWT con roles, CORS/Helmet/Rate limiting, validaciones b�sicas (Mongoose/type checks), Swagger (openapi.yaml), health y 404 handler.
  - Brecha menor: validaci�n de entrada m�s robusta (express-validator/Joi) en endpoints cr�ticos.
- Frontend React: Hecho
  - Vistas Home, Login, Signup, PlayerList, PlayerProfile, Gallery; React Router v6; AuthContext; 404 (�P�gina no encontrada�).
  - Nota: Hay logs en Header (�HEADER user: null��); conviene removerlos o proteger con NODE_ENV.
- Landing Page: Hecho
  - Hero, galer�a, formulario, conexi�n al backend desde assets/script.js.

#### Sprint 2 � Testing y automatizaci�n
- Pruebas: Parcial
  - Frontend: tests de rutas con RTL y Jest funcionando (3/4 -> ahora 4/4 OK tras ajustar 404).
  - Backend: No hay suite de tests visible (pendiente: Jest + supertest + mongodb-memory-server).
  - Cobertura ?70%: No medido a�n; requerir� m�s pruebas (componentes, hooks y flujos).
- Automatizaci�n: Pendiente
  - GitHub Actions: no hay workflow.
  - ESLint + Prettier: no veo configuraci�n consolidada (pendiente .eslintrc, .prettierrc, scripts).
  - Convencional Commits: usado de facto, pero no validado (pendiente commitlint + husky).

#### Sprint 3 � Limpieza y buenas pr�cticas
- C�digo: Parcial
  - Logs innecesarios: hay logs en Header; limpiar o usar logger nivel DEBUG.
  - Modularizaci�n/nombres: En general bien; ojo con duplicado/case de Header (Header.jsx vs header.js) por FS de Windows.
  - Comentarios: correctos; mantener concisos.
- Documentaci�n: Parcial
  - README ra�z muy completo; backend/README presente. Falta CONTRIBUTING.md y un README en frontend con scripts/estructura/tests.

#### Sprint 4 � Seguridad y rendimiento
- Seguridad: Hecho/Parcial
  - Helmet, CORS, rate limiting, JWT sin exponer password. Falta endurecer validaci�n de entrada uniformemente.
- Rendimiento: Parcial
  - Code splitting/lazy en rutas: no aplicado (React.lazy/Suspense).
  - Optimizaci�n im�genes: landing ok; revisar carga diferida/gallery.
  - Bundle: CRA ya minimiza; revisar an�lisis con source-map-explorer si se desea.

#### Sprint 5 � Despliegue y demo
- Backend: Parcial
  - Instrucciones y .env.example OK; falta pipeline o definici�n de entorno productivo (.env.production).
- Frontend: Parcial
  - Build con CRA listo; faltan pasos automatizados de deploy (Vercel/Netlify).
- Monitoreo: Parcial
  - /health OK, error handler global backend OK; faltan logs estructurados y policy de observabilidad.

---

## Ajustes recomendados a la gu�a
- Sprint 2
  - A�adir: �Crear test utils con render con providers� (customRender que envuelva QueryClientProvider, AuthProvider y Router para evitar repetir en cada test).
  - Definir KPI de cobertura por paquete: Frontend ?70% l�neas/branches; Backend ?70% l�neas/branches.
  - Incluir matriz m�nima de pruebas: rutas p�blicas, rutas protegidas, flujo de login/logout, lista de jugadores, perfil, errores API.
- Sprint 3
  - A�adir tarea espec�fica: �Eliminar header.js duplicado o asegurar �nico Header.jsx� (consistencia de casing en Windows).
  - A�adir �logger central con niveles (info/warn/error/debug) y desactivar debug en prod/test�.
- Sprint 4
  - A�adir �migrar validaciones a express-validator/Joi con esquemas compartidos�.
  - A�adir �lazy load para AdminDashboard, PlayerProfile y Gallery con React.lazy + Suspense�.
- Sprint 5
  - A�adir �workflows de CI (build, lint, test) y CD (deploy frontend y backend)�.
  - A�adir �.env.production de ejemplo y tabla de variables por entorno�.

---

## Siguientes pasos priorizados (1-2 d�as)
1) Seguridad y coherencia de auth (r�pido impacto)
- Cambiar �secret� por process.env.JWT_SECRET y validar presencia (backend).
- Implementar /auth/profile (GET) con middleware auth (usa id del token) y /auth/logout (POST) idempotente.
- Agregar CORS, Helmet, rate limit si a�n no est�n en server.js.

2) Limpieza y riesgos CI (baja fricci�n)
- Eliminar archivo duplicado frontend/src/components/header.js (mantener Header.jsx).
- Quitar logs de depuraci�n o condicionar por NODE_ENV.
- Agregar .editorconfig para consistencia.

3) Testing base
- Frontend: crear test utils (customRender); tests de:
  - /login render y submit OK (mock authAPI).
  - /admin redirige sin auth (ProtectedRoute).
  - PlayerList estados loading/error/success (mock playersAPI).
- Backend: configurar Jest + supertest + mongodb-memory-server y cubrir:
  - /players GET lista, GET not found, POST/PUT/DELETE con/sin auth.

4) Automatizaci�n m�nima
- ESLint + Prettier + scripts npm (lint, format, lint:fix).
- commitlint + husky (commit-msg hook).
- GitHub Actions (workflow: install ? lint ? test backend y frontend).

5) Rendimiento incremental
- React.lazy + Suspense en AdminDashboard/PlayerProfile/Gallery.
- Revisi�n de im�genes (lazy en gallery/landing).

6) Documentaci�n
- README frontend (scripts, estructura, tests).
- CONTRIBUTING.md (flujo ramas, commits, PRs).
- Tabla de variables (.env.*) en README o docs/.

---

## Notas y riesgos
- FS Windows es case-insensitive: evitar coexistencia Header.jsx/header.js. En CI Linux romper�.
- authAPI en frontend usa /auth/logout y /auth/profile; backend a�n no los expone: alinear.
- jwt.sign expiraci�n y secret deben venir de env; �secret� en c�digo es un riesgo.
- Proxy CRA apunta a http://localhost:5000; documentar REACT_APP_API_URL para producci�n.

---

## Gu�a original y checklist por sprint

[Incluye aqu� la gu�a est�ndar y checklist por sprint, como referencia]

---

**�ltima actualizaci�n:** [fecha]
**Responsable:** Jorge Zuta
**Repositorio:** [GitHub - Basketball Team](https://github.com/Jorgez-tech/baloncestoteam)
