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

---

## Flujo de Trabajo Git

### Nomenclatura de ramas

| Tipo | Patron | Ejemplo |
|---|---|---|
| Feature | `feat/nombre` | `feat/player-stats` |
| Fix | `fix/nombre` | `fix/login-error` |
| Chore | `chore/descripcion` | `chore/update-deps` |
| Docs | `docs/descripcion` | `docs/api-reference` |

### Commits: Conventional Commits

```
feat: add player statistics view
fix: resolve JWT expiration issue
docs: update deployment guide
style: format auth middleware
refactor: simplify player model
chore: update npm dependencies
test: add players API tests
```

### Proceso de merge

1. Crear rama desde `main`
2. Commits con formato Conventional Commits
3. Pull Request con descripcion clara
4. Review antes de merge a `main`

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
**Ultima actualizacion**: Febrero 2026
