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

## Plan de Validación Lógica (Frontend y Backend)

**Objetivo:**
Asegurar que todas las funcionalidades implementadas cumplen con los requisitos del proyecto y están alineadas con la lógica de negocio antes de avanzar con la auditoría de tests.

### 1. Listado de funcionalidades clave a validar
- Autenticación y registro de usuarios (roles, JWT, flujo completo)
- Gestión de jugadores (CRUD, filtros, paginación, estadísticas)
- Panel de administración (acceso, acciones, restricciones)
- Navegación y rutas protegidas (React Router, redirecciones)
- Formularios y validaciones (frontend y backend)
- Seguridad (CORS, Helmet, rate limiting, validación de datos)
- Integración entre frontend y backend (API endpoints, manejo de errores)
- Notificaciones y feedback al usuario

### 2. Criterios de validación
- ¿La funcionalidad cumple con el flujo esperado?
- ¿Existen casos borde o errores no gestionados?
- ¿La lógica de negocio está documentada y es consistente?
- ¿El usuario recibe feedback claro en cada acción?
- ¿Las restricciones de roles y permisos funcionan correctamente?

### 3. Acciones recomendadas
- Revisar cada funcionalidad en la aplicación y documentar hallazgos.
- Actualizar la guía de desarrollo y el README con el estado de cada funcionalidad.
- Marcar lo que está validado y lo que requiere revisión/refactorización.
- Solo después de esta validación, avanzar con la auditoría y mejora de los tests.


---

## Siguientes pasos priorizados (1-2 días)

## Siguientes pasos priorizados
1) Validar la lógica de negocio y funcionalidad en frontend y backend.
2) Documentar hallazgos y actualizar la guía y los README.
3) Auditar y mejorar la suite de tests (solo después de validar la lógica).
4) Implementar CI/CD y optimizaciones de rendimiento.
5) Mantener la documentación técnica y funcional actualizada.

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

