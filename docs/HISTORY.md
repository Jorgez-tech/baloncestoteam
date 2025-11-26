# Historial del Proyecto y Hitos

## Noviembre 2025

### 🚀 Dockerización y Seguridad
- **Hito**: Aislamiento completo de la base de datos en Docker.
- **Detalle**: Se migró de usar la DB del host a un contenedor `mongo` dedicado para evitar pérdida de datos accidentales.
- **Fix**: Corrección de pipeline CI/CD en GitHub Actions agregando servicio MongoDB.
- **Doc**: Reestructuración completa de la documentación en carpeta `docs/`.

### 🧹 Limpieza de Código
- **Hito**: Eliminación de emojis en código y documentación técnica.
- **Regla**: Se estableció estándar "No Emojis" en `CONTRIBUTING.md`.

## Octubre 2025

### 🔄 Integración Frontend-Backend
- **Hito**: Conexión completa de vistas React con API Node.js.
- **Feature**: Implementación de `AuthContext` y rutas protegidas.
- **Feature**: CRUD de jugadores funcional desde el dashboard de admin.

## Septiembre 2025

### 🏗️ Arquitectura Base
- **Hito**: Configuración inicial del proyecto MERN.
- **Tech**: Setup de Express, Mongoose, React 17.
- **Infra**: Creación de `docker-compose.yml` inicial.
