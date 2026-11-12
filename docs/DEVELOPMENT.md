# Guía de Desarrollo - Basketball Team

## Inicio Rápido

```bash
# 1. Clonar repositorio
git clone <repo-url>

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env
# Ajustar JWT_SECRET en backend/.env

# 3. Iniciar todos los servicios
docker compose up -d --build

# 4. Verificar que los 4 contenedores esten activos
docker compose ps
```

Ver [ARCHITECTURE.md](ARCHITECTURE.md) para configuracion detallada de entorno y despliegue.

## Centro de operaciones y estado de implementación

La fuente única de verdad para gobernanza, arquitectura, decisiones y roadmap es
[`.agents/`](../.agents/). Esta documentación es operativa y no redefine su contenido.

Orden de consulta obligatorio:

1. [`.agents/AGENTS.md`](../.agents/AGENTS.md)
2. [Auditoría de refactorización](../.agents/AUDITORIA_REFACTORIZACION_2026-10-16.md)
3. [Plan de implementación](../.agents/IMPLEMENTATION_PLAN.md)
4. Especificación, reglas y ADR de [`.agents/`](../.agents/)

La refactorización permanece abierta. El siguiente trabajo debe comenzar por P0:
sesión con cookies HttpOnly, `withCredentials`, refresh automático y pruebas de
regresión. No iniciar nuevas funcionalidades mientras P0 esté abierto.

---

## Flujo de Trabajo Git

> Regla canonica: [`.agents/rules/git-workflow.md`](../.agents/rules/git-workflow.md). A continuacion, el resumen practico.

### Modelo de ramas (GitFlow adaptado)

```
main (produccion, estable)  <- solo merges desde release/*
release/*                   <- preparacion de entrega
develop                     <- integracion continua
   ├── refactor/<fase>-<descripcion>
   ├── feature/<fase>-<descripcion>
   └── hotfix/<descripcion>
```

**Regla invariante:** `main` nunca recibe commits directos. Toda entrega pasa por `develop -> release -> main`.

### Nomenclatura de ramas

| Tipo | Patron | Ejemplo |
|---|---|---|
| Refactor | `refactor/<fase>-<descripcion>` | `refactor/fase1-estructura` |
| Feature | `feature/<fase>-<descripcion>` | `feature/fase2-club` |
| Hotfix | `hotfix/<descripcion>` | `hotfix/fix-login` |

### Commits: Conventional Commits

```
feat(players): add player statistics view
fix(auth): resolve refresh token not invalidated on logout
docs: update deployment guide
refactor(auth): extract token validation to service
chore(deps): update npm dependencies
test(players): add players API tests
```

### Proceso de merge

1. Crear la rama desde `develop` actualizado (los hotfix, desde `main`)
2. Commits con formato Conventional Commits
3. Pull Request con descripcion clara hacia `develop`
4. CI en verde y revision antes del merge
5. `main` solo recibe merges desde `release/*`

---

## Testing

### Backend

```bash
# Ejecutar todos los tests
docker compose exec backend npm test

# Modo watch
docker compose exec backend npm run test:watch
```

### Frontend

```bash
cd frontend
npm test
```

### Tests de humo (smoke tests)

```bash
docker compose exec backend node scripts/smoke.js
```

---

## Estandares de Codigo

- **Linting**: `npm run lint`
- **Formato**: `npm run format`
- **Sin emojis**: Prohibido en codigo fuente y documentacion tecnica

---

## Estructura de documentacion

```
docs/
  ARCHITECTURE.md          Infraestructura, Docker, base de datos, despliegue
  DEVELOPMENT.md           Este archivo: flujo de trabajo, git, testing
  ROUTES_AND_SERVICES.md   Rutas frontend + endpoints backend
  ADMIN_DASHBOARD.md       Funcionalidades y seguridad del panel admin
  HISTORY_AND_LEARNINGS.md Historia del proyecto, incidentes e imprendizajes
  TROUBLESHOOTING.md       Problemas comunes y soluciones
```

---
**Ultima actualizacion**: Noviembre 2026
