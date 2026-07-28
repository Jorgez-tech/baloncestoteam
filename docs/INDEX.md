# Indice de Documentacion Tecnica

**Ultima actualizacion:** Julio 2026

Esta carpeta contiene la documentacion tecnica integral del proyecto. Cada archivo tiene un proposito especifico y un publico objetivo.

---

## Documentacion de Arquitectura

Ubicacion: `docs/architecture/`

| Documento | Descripcion | Publico |
|---|---|---|
| [VISION_AND_DOMAIN.md](architecture/VISION_AND_DOMAIN.md) | Vision del producto, modelo de dominio, bounded contexts, relaciones y reglas de negocio | Architects, Tech Leads, Product |
| [CLEAN_ARCHITECTURE.md](architecture/CLEAN_ARCHITECTURE.md) | Capas del sistema (Dominio, Aplicacion, Infraestructura, Presentacion), direccion de dependencias, ports and adapters | Todos los desarrolladores |
| [MODULES.md](architecture/MODULES.md) | Definicion de cada modulo, responsabilidades, limites y mapa de dependencias | Todos los desarrolladores |
| [SECURITY_STRATEGY.md](architecture/SECURITY_STRATEGY.md) | Estrategia de autenticacion, autorizacion (RBAC/ABAC), auditoria y seguridad en capas | Security, Backend |

## Documentacion de Ingenieria

Ubicacion: `docs/engineering/`

| Documento | Descripcion | Publico |
|---|---|---|
| [DEVELOPMENT_PHASES.md](engineering/DEVELOPMENT_PHASES.md) | Roadmap en 4 fases con entregables y criterios de completitud | Todos |
| [ENGINEERING_GUIDELINES.md](engineering/ENGINEERING_GUIDELINES.md) | Convenciones de codigo, commits, estructura de modulos, anti-patrones prohibidos | Todos los desarrolladores |

## Documentacion de QA

Ubicacion: `docs/qa/`

| Documento | Descripcion | Publico |
|---|---|---|
| [QA_STRATEGY.md](qa/QA_STRATEGY.md) | Estrategia de testing por capa, tipos de tests, umbrales de cobertura, pipeline CI | QA, Backend, Frontend |

## Documentacion Operativa (existente)

| Documento | Descripcion |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Infraestructura Docker, base de datos, despliegue |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Inicio rapido, flujo git, testing actual |
| [ROUTES_AND_SERVICES.md](ROUTES_AND_SERVICES.md) | Rutas del frontend y endpoints del backend |
| [ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md) | Panel de administracion, funcionalidades y seguridad |
| [DEPLOYMENT_PROPOSAL.md](DEPLOYMENT_PROPOSAL.md) | Opciones de hosting y despliegue en produccion |
| [HISTORY_AND_LEARNINGS.md](HISTORY_AND_LEARNINGS.md) | Historia del proyecto, incidentes resueltos, aprendizajes |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Problemas comunes y soluciones |

---

## Relacion entre Documentos

Para entender el sistema de arriba hacia abajo:

```
VISION_AND_DOMAIN.md        <- que problema resolvemos y que entidades existen
        |
        v
CLEAN_ARCHITECTURE.md       <- como se organiza el codigo internamente
        |
        v
MODULES.md                  <- cuales son las partes del sistema y sus limites
        |
        v
SECURITY_STRATEGY.md        <- como se protege el sistema
        |
        v
DEVELOPMENT_PHASES.md       <- en que orden construimos cada parte
        |
        v
ENGINEERING_GUIDELINES.md   <- como escribimos el codigo
        |
        v
QA_STRATEGY.md              <- como verificamos que funciona correctamente
```
