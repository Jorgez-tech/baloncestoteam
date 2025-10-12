# 🧭 Guía de Desarrollo Estándar – Proyecto Basketball Team 🏀

> Esta guía sirve como referencia para mantener orden, calidad y consistencia en el desarrollo del proyecto. Está organizada por sprints, buenas prácticas, automatizaciones y criterios de finalización. Se puede marcar el progreso con `[x]` y consultar en cualquier momento.

---

## Gap Analysis y Checklist Priorizado

### Estado por Sprint

#### Sprint 1 – Funcionalidades base
- Backend API: [x] Hecho
  - [x] CRUD jugadores, JWT con roles, CORS/Helmet/Rate limiting, validaciones básicas (Mongoose/type checks), Swagger (openapi.yaml), health y 404 handler.
  - [x] Validaciones reforzadas con `express-validator` en rutas sensibles (players/users).
- Frontend React: [x] Hecho
  - [x] Vistas Home, Login, Signup, PlayerList, PlayerProfile, Gallery; React Router v6; AuthContext; 404 (“Página no encontrada”).
  - [x] Nota: Hay logs en Header (“HEADER user: null…”); conviene removerlos o proteger con NODE_ENV. (Ya realizado)
- Landing Page: [x] Hecho
  - [x] Hero, galería, formulario, conexión al backend desde assets/script.js.

#### Sprint 2 – Testing y automatización
- Pruebas: [~] Parcial
  - [x] Frontend: tests de rutas con RTL y Jest funcionando (Login, Admin, PlayerList, AdminUsers).
  - [x] Backend: Suite Jest (players/docs) documentada y en uso.
  - [ ] Cobertura ≥70%: No medido aún; requerirá ampliar pruebas (componentes, hooks y flujos).
- Automatización: [~] Parcial
  - [ ] GitHub Actions: no hay workflow.
  - [x] ESLint + Prettier configurados (.prettierrc, scripts y lint-staged).
  - [x] Convencional Commits validados vía commitlint + husky.

#### Sprint 3 – Limpieza y buenas prácticas
- Código: [x] Realizado
  - [x] Logs innecesarios: hay logs en Header; limpiar o usar logger nivel DEBUG. (Ya realizado)
  - [x] Modularización/nombres: En general bien; ojo con duplicado/case de Header (Header.jsx vs header.js) por FS de Windows. (Ya realizado)
  - [x] Comentarios: correctos; mantener concisos.
- Documentación: [x] Actualizada
  - [x] README raíz y `VALIDACION_INTEGRACION.md` sincronizados.
  - [x] CONTRIBUTING.md y documentación de apoyo vigentes.

#### Sprint 4 – Seguridad y rendimiento

- Seguridad: [x] Hecho
  - [x] Helmet, CORS, rate limiting, JWT sin exponer password y validaciones unificadas (`express-validator`).
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

1) Validar manualmente la lógica de negocio completa (checklist en `VALIDACION_INTEGRACION.md`).
2) Ampliar la suite de tests (cobertura y casos e2e) tras la validación manual.
3) Implementar CI/CD (GitHub Actions) y pipeline de despliegue.
4) Optimizar rendimiento (lazy loading, análisis de bundle) y accesibilidad.
5) Documentar procedimientos de despliegue/operación.

---

## Notas y riesgos

- Evitar crear archivos cuyo casing solo difiera en una letra (Windows vs Linux).
- Revisar límites de rate limiting en despliegue productivo (optimizar según tráfico real).
- Ejecutar smoke test (`node backend/scripts/smoke.js`) antes de cualquier release.
- Mantener actualizados los secretos (`JWT_SECRET`, conexiones DB/Redis) en entornos seguros.

---

## Guía original y checklist por sprint

[Incluye aquí la guía estándar y checklist por sprint, como referencia]

---

## Notas finales (11/10/2025)

- **Meta del sprint final:** dejar la plataforma preparada para QA y despliegue, con panel admin estable y flujos clave cubiertos.
- **Desafíos resueltos:** inconsistencias de `jersey_number`, restricciones de usuarios admin, manejo de errores en contacto y saneamiento de artefactos.
- **Aprendizajes:** la centralización de clientes Axios simplifica el control de errores; coordinar pruebas unitarias de frontend/backend ayuda a detectar regresiones; mantener documentación viva acelera la preparación del release.

---

**Última actualización:** [fecha]
**Responsable:** Jorge Zuta
**Repositorio:** [GitHub - Basketball Team](https://github.com/Jorgez-tech/baloncestoteam)

---

