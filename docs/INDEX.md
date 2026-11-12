# Indice de Documentacion Tecnica

**Ultima actualizacion:** Noviembre 2026

Esta carpeta contiene la documentacion **operativa y de referencia** del proyecto.

> **Centro de Operaciones:** la arquitectura vigente, las decisiones (ADR), las reglas de código y el roadmap viven en **`.agents/`**, la fuente única de verdad. `docs/` explica el sistema de forma práctica y **nunca redefine** lo que dicta `.agents/`.

---

## Documentacion operativa

| Documento | Descripcion | Publico |
|---|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Infraestructura Docker, base de datos, despliegue y checklist de produccion | DevOps, Backend |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Inicio rapido, flujo Git, testing y estructura del proyecto | Todos los desarrolladores |
| [ROUTES_AND_SERVICES.md](ROUTES_AND_SERVICES.md) | Rutas del frontend y endpoints del backend | Full-stack |
| [ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md) | Panel de administracion: funcionalidades y seguridad | Frontend, Product |
| [DEPLOYMENT_PROPOSAL.md](DEPLOYMENT_PROPOSAL.md) | Opciones de hosting y despliegue en produccion | DevOps, Tech Leads |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Problemas comunes y soluciones | Todos |
| [HISTORY_AND_LEARNINGS.md](HISTORY_AND_LEARNINGS.md) | Historia del proyecto, incidentes y aprendizajes | Todos |

## Documentacion de referencia (subordinada a `.agents/`)

| Documento | Descripcion | Publico |
|---|---|---|
| [architecture/VISION_AND_DOMAIN.md](architecture/VISION_AND_DOMAIN.md) | Vision del producto, modelo de dominio y reglas de negocio | Architects, Tech Leads |
| [architecture/SECURITY_STRATEGY.md](architecture/SECURITY_STRATEGY.md) | Defensa en profundidad: autenticacion, autorizacion, secretos y transporte | Security, Backend |
| [qa/QA_STRATEGY.md](qa/QA_STRATEGY.md) | Estrategia de testing por capa, umbrales de cobertura y pipeline CI | QA, Backend, Frontend |

---

## Centro de Operaciones (`.agents/`)

| Documento | Contenido |
|---|---|
| `.agents/AGENTS.md` | Gobernanza, principios no negociables y reglas de aprobacion |
| `.agents/SPEC.md` | Especificacion tecnica, clases, DTOs y contratos de API |
| `.agents/ARCHITECTURE_RULES.md` | Leyes de negocio (soft deletion, roster-driven billing, ABAC) |
| `.agents/DECISIONS.md` | Architecture Decision Records (ADR 001–007) |
| `.agents/SYSTEMS_MAP.md` | Mapa de subsistemas y limites de dominio |
| `.agents/IMPLEMENTATION_PLAN.md` | Roadmap por fases y sprints + Definition of Done |
| `.agents/rules/` | Reglas de codigo (backend, frontend, flujo Git) |
| `.agents/AUDITORIA_REFACTORIZACION_2026-10-16.md` | Informe de auditoria integral de la refactorizacion |
| `.agents/AUDITORIA_DOCUMENTACION_2026-10-16.md` | Auditoria y curaduria de la documentacion |

**Estado vigente:** la refactorización sigue abierta. La auditoría mantiene como
bloqueador P0 la alineación del login web con cookies HttpOnly. El plan post-auditoría
en [`IMPLEMENTATION_PLAN.md`](../.agents/IMPLEMENTATION_PLAN.md) es la ruta activa.

---

## Relacion entre documentos

```
.agents/ (fuente unica de verdad)
        |
        v
docs/  (operativo + referencia)
   ARCHITECTURE.md      -> como se despliega
   DEVELOPMENT.md       -> como se trabaja
   ROUTES_AND_SERVICES.md -> que expone el sistema
   architecture/        -> dominio y seguridad en detalle
   qa/                  -> como se verifica
```