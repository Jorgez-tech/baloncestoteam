# Resolución de Problemas y Troubleshooting

Este documento recopila problemas comunes y sus soluciones encontrados durante el desarrollo y despliegue.

## 🔍 Problemas de Docker

### Base de datos no conecta
**Síntoma**: El backend falla al iniciar con "MongoTimeoutError".
**Solución**:
1. Verificar que el contenedor `mongo` esté saludable: `docker compose ps mongo`.
2. Verificar logs: `docker compose logs mongo`.
3. Asegurar que `MONGO_URI` sea `mongodb://mongo:27017/basketball_team`.

### Datos desaparecen al reiniciar
**Causa**: No se estaba usando un volumen persistente.
**Solución**: Se configuró el volumen `mongo_data` en `docker-compose.yml`.

## 🔍 Problemas de Frontend

### Error "useAuth must be used within an AuthProvider"
**Causa**: El componente no estaba envuelto en `<AuthProvider>`.
**Solución**: Envolver `App` o las rutas en `src/App.js` con el provider.

### CORS Errors
**Síntoma**: Bloqueo de peticiones API desde el navegador.
**Solución**:
1. Verificar configuración CORS en backend (`server.js`).
2. Si usas Nginx, verificar headers de proxy.

## 🔍 Problemas de CI/CD

### Tests fallan en GitHub Actions
**Causa**: Falta de base de datos en el entorno de CI.
**Solución**: Se agregó el servicio `mongodb` en el workflow `.github/workflows/ci.yml`.

---
Ver también: `docs/reports/INCIDENT_DB_NOV2025.md` para detalles sobre el incidente de base de datos.
