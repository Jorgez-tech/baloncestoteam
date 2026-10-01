# Estrategia de Ramas — Refactorizacion del Sistema

**Version:** 1.0  
**Estado:** Propuesta aprobada — Aplicar a partir del inicio de Fase 1  
**Ultima actualizacion:** Agosto 2026

---

## Contexto y Benchmark

### ¿Como afronta un equipo consolidado una refactorizacion de este alcance?

Un equipo con experiencia en proyectos de tamano similar (monolito modular, ~5–15 desarrolladores, base de datos en produccion, sin downtime aceptable) aplica de forma estandar un modelo de ramas basado en **GitFlow adaptado** con las siguientes caracteristicas:

| Practica consolidada | Razon |
|---|---|
| `main` solo recibe merges desde `release/*` | Garantiza que lo que esta en produccion es exactamente lo que fue validado |
| `develop` es la rama de integracion continua | Todo trabajo se integra aqui antes de llegar a produccion |
| Las features viven en ramas cortas (< 2 semanas) | Reduce conflictos y facilita revisiones de codigo |
| Los hotfixes van directamente a `main` y se backportean a `develop` | Permite responder a incidentes sin bloquear el trabajo en curso |
| Cada merge requiere al menos un review | Cultura de calidad sostenida |
| Las ramas de refactorizacion estructural tienen su propio prefijo (`refactor/`) | Diferencian cambios de arquitectura de features de negocio |

Este proyecto adopta ese mismo modelo con ajustes para el tamano actual del equipo (1–3 personas) y la existencia de datos reales en produccion.

---

## Modelo de Ramas

```
main
│
├── release/1.0-consolidacion     <- tag de entrega, merge a main cuando Fase 1 este lista
│
develop                           <- punto de integracion de todo el trabajo
│
├── refactor/fase1-estructura      <- reorganizacion de capas y modulos (Fase 1)
├── refactor/fase1-seguridad       <- refresh tokens + HttpOnly cookies (Fase 1)
├── refactor/fase1-auditoria       <- coleccion audit_logs (Fase 1)
├── refactor/fase1-tests           <- tests de regresion (Fase 1)
│
├── feature/fase2-club             <- entidad Club + temporadas (Fase 2)
├── feature/fase2-teams            <- Category, Team, TeamPlayer (Fase 2)
├── feature/fase2-staff            <- Coach y Staff (Fase 2)
│
├── feature/fase3-socios           <- entidad Socio + DependentLink (Fase 3)
├── feature/fase3-obligaciones     <- PaymentObligation (Fase 3)
│
├── feature/fase4-billing          <- integracion de pagos (Fase 4)
│
└── hotfix/<descripcion-corta>     <- correcciones urgentes en produccion
```

---

## Ramas Permanentes

| Rama | Proposito | Merge origen | Merge destino |
|---|---|---|---|
| `main` | Codigo en produccion, siempre estable | `release/*` | — |
| `develop` | Integracion continua de todo el trabajo | `feature/*`, `refactor/*` | `release/*` |

**Regla invariante:** `main` nunca recibe merges directos de ramas de trabajo. Toda entrega pasa por `develop → release → main`.

---

## Ramas de Trabajo

### `refactor/`

Para cambios de arquitectura interna sin modificar el contrato publico de la API.

```
refactor/<fase>-<descripcion-corta>
```

Ejemplos:
- `refactor/fase1-estructura`
- `refactor/fase1-seguridad`
- `refactor/fase1-auditoria`

**Criterio de cierre:** la API publica no cambia, los tests pasan, los datos de produccion estan intactos.

### `feature/`

Para nuevas capacidades de dominio o funcionalidades visibles al usuario.

```
feature/<fase>-<descripcion-corta>
```

Ejemplos:
- `feature/fase2-club`
- `feature/fase3-socios`

**Criterio de cierre:** criterio de completitud de la entrega definido en `DEVELOPMENT_PHASES.md`.

### `hotfix/`

Para correciones urgentes sobre lo que esta en produccion (`main`).

```
hotfix/<descripcion-corta>
```

**Origen:** `main`  
**Destino del merge:** `main` Y `develop` (backport obligatorio)  
**Razon:** un hotfix sin backport produce divergencia entre produccion y la linea de desarrollo.

### `release/`

Rama de preparacion para una entrega concreta. Se abre cuando `develop` esta en estado entregable.

```
release/<version>-<nombre-fase>
```

Ejemplo: `release/1.0-consolidacion`

Solo se permiten en esta rama:
- Bumps de version
- Correcciones de bugs de ultimo momento descubiertas en QA
- Actualizacion de documentacion de entrega

---

## Flujo por Tipo de Trabajo

### Trabajo de Fase 1 (refactorizacion interna)

```
develop
  └─▶ refactor/fase1-estructura
        │  (cambios internos, tests pasan, API publica intacta)
        └─▶ PR → develop
              │
              └─▶ (cuando Fase 1 completa) release/1.0-consolidacion
                    └─▶ PR → main  (tag v1.0)
```

### Trabajo de nuevas features (Fase 2+)

```
develop
  └─▶ feature/fase2-club
        │  (nueva entidad, tests unitarios + integracion)
        └─▶ PR → develop
```

### Hotfix en produccion

```
main
  └─▶ hotfix/fix-jwt-expiry
        │  (correccion minima, test que reproduce el bug)
        ├─▶ PR → main   (merge y tag de patch, e.g. v1.0.1)
        └─▶ PR → develop  (backport)
```

---

## Convenciones de Commits

Se adopta **Conventional Commits** para permitir generacion automatica de changelogs y comunicacion clara entre miembros del equipo.

```
<tipo>(<ambito>): <descripcion en minusculas>
```

### Tipos permitidos

| Tipo | Cuando usarlo |
|---|---|
| `feat` | Nueva funcionalidad visible al usuario o nueva capacidad de dominio |
| `fix` | Correccion de un bug |
| `refactor` | Cambio de estructura interna sin cambio de comportamiento |
| `test` | Agregar o corregir tests |
| `docs` | Cambios exclusivos en documentacion |
| `chore` | Tareas de mantenimiento (deps, config, scripts) |
| `ci` | Cambios en pipelines de CI/CD |

### Ejemplos correctos

```
feat(players): add AssignPlayerToTeamUseCase with invariant check
refactor(auth): extract token validation to AuthService port
fix(audit): persist audit log entry on failed login attempt
test(members): add unit tests for DependentLink invariant
docs(architecture): add BRANCHING_STRATEGY.md
```

### Ambitos recomendados

`auth`, `players`, `club`, `teams`, `members`, `billing`, `store`, `audit`, `notifications`, `support`

---

## Ciclo de Vida de una Rama de Trabajo

```
1. Crear desde develop (actualizado)
   git checkout develop && git pull origin develop
   git checkout -b refactor/fase1-estructura

2. Trabajo incremental con commits atomicos
   git commit -m "refactor(players): extract repository interface"

3. Mantener sincronizada con develop (rebase preferido sobre merge)
   git fetch origin develop
   git rebase origin/develop

4. Abrir Pull Request hacia develop
   - Descripcion: que cambia, por que, como testearlo
   - Al menos 1 revisor

5. Merge por squash si la rama tiene commits de "trabajo en progreso"
   Merge normal si la historia de commits es limpia y util

6. Eliminar la rama despues del merge
```

---

## Reglas de Proteccion de Ramas (Configuracion Recomendada en GitHub)

| Rama | Regla |
|---|---|
| `main` | Require PR review (1), no force-push, no delete, require status checks |
| `develop` | Require PR review (1), no force-push |
| `release/*` | Require PR review (1), no direct push |

---

## Relacion con las Fases de Desarrollo

| Fase | Ramas de trabajo | Rama de release |
|---|---|---|
| Fase 1 — Consolidacion | `refactor/fase1-*` | `release/1.0-consolidacion` |
| Fase 2 — Dominio deportivo | `feature/fase2-*` | `release/2.0-sports-domain` |
| Fase 3 — Socios y pagos | `feature/fase3-*` | `release/3.0-members` |
| Fase 4 — Capacidades satelite | `feature/fase4-*` | `release/4.0-platform` |

---

## Gestion del Estado de la Base de Datos Durante Refactorizacion

La base de datos `basketball_team` contiene datos reales de produccion. Durante toda la Fase 1:

- **Ninguna rama de trabajo modifica esquemas de base de datos** sin migracion reversible documentada
- Los cambios de naming de archivos de modelo (e.g. `Photo.js → game.model.js`) no afectan los datos: el nombre que importa en Mongoose es el nombre de la coleccion, no el del archivo
- Antes de cualquier cambio de esquema: backup con `mongodump` y confirmacion del usuario
- Los tests de integracion usan `basketball_team_test`, nunca la base de produccion

---

## Ambiente de Trabajo por Rama

| Entorno | Rama fuente | Base de datos | Proposito |
|---|---|---|---|
| Local / dev | cualquier rama de trabajo | `basketball_team_test` | Desarrollo activo |
| Staging (futuro) | `develop` | Snapshot anonimizado de prod | Validacion pre-release |
| Produccion | `main` | `basketball_team` | Operacion real |

---

**Referencia:** Ver `DEVELOPMENT_PHASES.md` para el alcance de cada fase.  
**Referencia:** Ver `ENGINEERING_GUIDELINES.md` para convenciones de estructura de archivos.  
**Referencia:** Ver `../qa/QA_STRATEGY.md` para los criterios de calidad que debe cumplir cada PR.
