# Informe de Incidente: Confusión de Base de Datos (Noviembre 2025)

**Fecha:** Noviembre 2025
**Gravedad:** Alta (Riesgo de pérdida de datos)
**Estado:** Resuelto

## Descripción del Incidente

Durante las pruebas de despliegue con Docker, se identificó un riesgo crítico donde el script de "seed" (población de datos) del backend estaba configurado para conectarse a la base de datos del **host** (Windows) en lugar de una base de datos aislada en Docker.

Esto significaba que ejecutar `docker compose up` y luego el script de limpieza `seed-db.js` borraba los datos de producción locales del desarrollador.

## Análisis de Causa Raíz

1.  **Configuración Docker Insegura**: `docker-compose.yml` usaba `host.docker.internal` para conectar el backend a MongoDB.
    ```yaml
    MONGO_URI=mongodb://host.docker.internal:27017/basketball_team
    ```
2.  **Script Destructivo**: `seed-db.js` ejecutaba `deleteMany({})` sin confirmar el entorno.

## Solución Implementada

1.  **Aislamiento de Base de Datos**:
    Se agregó un servicio dedicado `mongo` en `docker-compose.yml`.
    ```yaml
    mongo:
      image: mongo:6.0
      container_name: basketball-mongo
      # ...
    ```
2.  **Actualización de Conexión**:
    El backend ahora se conecta internamente al contenedor:
    ```yaml
    MONGO_URI=mongodb://mongo:27017/basketball_team
    ```
3.  **Validación**:
    Se verificó que el contenedor `basketball-backend` ahora resuelve `mongo` como su host de base de datos, dejando intacta la base de datos local de Windows.

## Lecciones Aprendidas

*   Nunca usar `host.docker.internal` para bases de datos en entornos que ejecutan scripts destructivos.
*   Siempre aislar los entornos de datos de Docker usando volúmenes y servicios dedicados.
*   Implementar checks de seguridad en scripts de seed para evitar ejecuciones accidentales en producción.
