# Guía de Desarrollo - Basketball Team

Esta guía detalla el flujo de trabajo, estándares y procesos para el desarrollo del proyecto.

## Inicio Rápido

1.  **Clonar repositorio**
2.  **Configurar variables de entorno**
    *   Copiar `.env.example` a `.env` en `backend/`
    *   Copiar `.env.local.example` a `.env.local` en `frontend/`
3.  **Iniciar con Docker**
    ```bash
    docker compose up --build
    ```
4.  **Poblar base de datos**
    ```bash
    docker compose exec backend node seed-db.js seed
    ```

## Estructura del Proyecto

Ver `README.md` para la estructura detallada de directorios.

## Flujo de Trabajo (Git Flow)

1.  **Main Branch**: `main` (Producción)
2.  **Feature Branches**: `feat/nombre-feature`
3.  **Fix Branches**: `fix/nombre-bug`
4.  **Chore Branches**: `chore/mantenimiento`

### Commits
Usamos **Conventional Commits**:
*   `feat: add new player stats`
*   `fix: resolve login error`
*   `docs: update deployment guide`
*   `style: format code with prettier`
*   `refactor: simplify auth middleware`

## Testing

### Backend
```bash
# Ejecutar tests dentro del contenedor
docker compose exec backend npm test
```

### Frontend
```bash
# Ejecutar tests interactivos
cd frontend
npm test
```

## Documentación

Toda la documentación se encuentra en la carpeta `docs/`:
*   **Arquitectura**: `docs/architecture/`
*   **Guías**: `docs/guides/`
*   **Reportes**: `docs/reports/`
*   **API**: `docs/api/`

## Docker

El proyecto está completamente dockerizado.
*   **Backend**: Node.js 18
*   **Frontend**: Nginx (Prod) / Node (Dev)
*   **Database**: MongoDB 6.0
*   **Cache**: Redis 7

Para más detalles de despliegue, ver `docs/architecture/DEPLOYMENT.md`.

## Validación y Calidad

*   **Linting**: `npm run lint`
*   **Formatting**: `npm run format`
*   **No Emojis**: Está prohibido usar emojis en el código y documentación técnica (ver `CONTRIBUTING.md`).

---
**Última actualización**: Noviembre 2025
