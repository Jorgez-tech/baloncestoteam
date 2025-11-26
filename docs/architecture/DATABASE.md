# Gestión de Base de Datos - Basketball Team

## 📊 Resumen

La base de datos del proyecto **Basketball Team** utiliza **MongoDB 6.0** ejecutándose en un **contenedor Docker aislado**. Esto garantiza que el entorno de desarrollo sea idéntico para todos los desarrolladores y no interfiera con bases de datos locales.

## 🏗️ Arquitectura Actual

### Tipo de Base de Datos
- **Tecnología:** MongoDB 6.0
- **Ubicación:** Contenedor Docker (`basketball-mongo`)
- **Puerto:** 27017 (expuesto al host)
- **Nombre DB:** `basketball_team`
- **Persistencia:** Volumen Docker `mongo_data`

### Diagrama de Conexión

```
┌─────────────────────────────────────────┐
│   Docker Network (basketball-network)   │
│                                         │
│  ┌────────────────────────────────┐    │
│  │   Service: mongo               │    │
│  │   Container: basketball-mongo  │    │
│  │   Port: 27017                  │    │
│  └──────────────┬─────────────────┘    │
│                 │                       │
│                 ▼                       │
│  ┌────────────────────────────────┐    │
│  │   Service: backend             │    │
│  │   MONGO_URI:                   │    │
│  │   mongodb://mongo:27017/...    │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## 🔧 Configuración en Docker Compose

```yaml
mongo:
  image: mongo:6.0
  container_name: basketball-mongo
  ports:
    - "27017:27017"
  volumes:
    - mongo_data:/data/db
  networks:
    - basketball-network
```

## 📝 Conexión

### Desde el Backend (Docker)
El backend se conecta usando el nombre del servicio `mongo`:
`MONGO_URI=mongodb://mongo:27017/basketball_team`

### Desde tu Máquina (Host)
Puedes conectar herramientas como **MongoDB Compass** o **Studio 3T** usando:
`mongodb://localhost:27017/basketball_team`

## 🌱 Población de Datos (Seeding)

Para poblar la base de datos con datos de prueba (Admin, Jugadores, etc.):

```bash
# Ejecutar seed dentro del contenedor backend
docker compose exec backend node seed-db.js seed
```

⚠️ **Nota:** Este comando borrará los datos existentes en el contenedor `basketball-mongo` y los recreará. Es seguro ejecutarlo ya que no afecta a tu máquina local.

## 📦 Backups y Restauración

### Crear Backup
```bash
docker compose exec mongo mongodump --db basketball_team --out /dump
docker cp basketball-mongo:/dump ./backup_$(date +%Y%m%d)
```

### Restaurar Backup
```bash
docker cp ./backup_folder basketball-mongo:/dump
docker compose exec mongo mongorestore --db basketball_team /dump/basketball_team
```

## 🔐 Seguridad

Actualmente, la base de datos está configurada para desarrollo (sin autenticación estricta dentro de la red Docker). Para producción, se recomienda habilitar autenticación con usuario y contraseña en `docker-compose.yml`.
