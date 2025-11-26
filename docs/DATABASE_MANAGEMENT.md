# Gestión de Base de Datos - Basketball Team

## 📊 Resumen

La base de datos del proyecto **Basketball Team** utiliza **MongoDB local en contenedor Docker**. No está en MongoDB Atlas (cloud), sino en tu máquina local.

## 🏗️ Arquitectura Actual

### Tipo de Base de Datos
- **Tecnología:** MongoDB 7 (Jammy)
- **Ubicación:** Contenedor Docker local
- **Puerto:** 27017
- **Nombre DB:** `basketball-team`

### ¿MongoDB Compass o MongoDB Atlas?

**Respuesta:** Ninguno de los dos (por defecto)

```
┌─────────────────────────────────────────┐
│   Tu Máquina Local                      │
│                                         │
│  ┌────────────────────────────────┐    │
│  │   Docker Container             │    │
│  │   (basketball-mongo)           │    │
│  │                                │    │
│  │   MongoDB 7                    │    │
│  │   Puerto: 27017                │    │
│  │   DB: basketball-team          │    │
│  │   Volumen: mongo-data          │    │
│  └────────────────────────────────┘    │
│            ↕                            │
│  ┌────────────────────────────────┐    │
│  │   Backend (Node.js)            │    │
│  │   Puerto: 5000                 │    │
│  │   MONGO_URI: mongodb://mongo:  │    │
│  │              27017/basketball- │    │
│  │              team               │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## 🔧 Configuración en Docker Compose

### Servicio MongoDB

```yaml
mongo:
  image: mongo:7-jammy
  container_name: basketball-mongo
  restart: unless-stopped
  ports:
    - "27017:27017"
  volumes:
    - mongo-data:/data/db  # ← Los datos persisten aquí
  environment:
    MONGO_INITDB_DATABASE: basketball-team
  networks:
    - basketball-network
```

### Volumen Persistente

```yaml
volumes:
  mongo-data:  # ← Docker volume persistente
```

**Ubicación física del volumen:**
```
Windows: C:\ProgramData\Docker\volumes\baloncestoteam_mongo-data\_data
Linux: /var/lib/docker/volumes/baloncestoteam_mongo-data/_data
```

## 📝 Conexión desde Backend

### Variables de Entorno

**Archivo:** `backend/.env` (desarrollo) o `.env.docker` (producción)

```env
# Dentro del contenedor (Docker network)
MONGO_URI=mongodb://mongo:27017/basketball-team

# Desde tu máquina local (para scripts)
MONGO_URI=mongodb://localhost:27017/basketball-team
```

### Código de Conexión

**Archivo:** `backend/config/db.js`

```javascript
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};
```

## 🌱 Población de Datos (Seeding)

### Script de Seed

**Archivo:** `backend/seed-db.js`

Este script crea:
- **4 usuarios** (1 admin + 3 players)
- **3 jugadores** con estadísticas

### Ejecutar el Seed

**Opción 1: Dentro del contenedor Docker**
```bash
# Desde tu máquina local
docker compose exec backend node seed-db.js seed
```

**Opción 2: Localmente (si tienes MongoDB instalado)**
```bash
cd backend
node seed-db.js seed
```

### Datos Creados

#### Usuarios:
```javascript
{
  email: "admin@basketballteam.com",
  password: "admin123",  // Se hashea automáticamente
  role: "admin"
}
// + 3 usuarios con role "user"
```

#### Jugadores:
```javascript
{
  name: "Juan Carlos Rodriguez",
  position: "Point Guard",
  height: 185,
  weight: 78,
  stats: {
    games_played: 24,
    points_per_game: 18.5,
    rebounds_per_game: 4.2,
    assists_per_game: 8.7
  }
}
// + 2 jugadores más
```

## 🔍 Cómo Acceder a la Base de Datos

### Opción 1: MongoDB Compass (Recomendado para Desarrollo)

**¿Qué es?** Cliente GUI para MongoDB

**Instalación:**
```bash
# Windows
winget install MongoDB.Compass

# O descargar desde
https://www.mongodb.com/try/download/compass
```

**Conexión:**
```
URI: mongodb://localhost:27017
Database: basketball-team
```

**Pasos:**
1. Abrir MongoDB Compass
2. Conectar a `mongodb://localhost:27017`
3. Seleccionar base de datos `basketball-team`
4. Ver colecciones: `users`, `players`

### Opción 2: MongoDB Shell (mongosh)

**Acceder desde Docker:**
```bash
docker compose exec mongo mongosh basketball-team
```

**Comandos útiles:**
```javascript
// Ver todas las bases de datos
show dbs

// Usar la base de datos del proyecto
use basketball-team

// Ver colecciones
show collections

// Ver usuarios
db.users.find().pretty()

// Ver jugadores
db.players.find().pretty()

// Contar documentos
db.users.countDocuments()
db.players.countDocuments()

// Buscar admin
db.users.findOne({ role: "admin" })
```

### Opción 3: Script de Test

**Desde tu máquina:**
```bash
cd backend
node seed-db.js test
```

**Output esperado:**
```
🔗 Probando conexión a MongoDB...
✅ Conexión exitosa a MongoDB
📋 Base de datos: basketball-team
🌐 Host: localhost
🔌 Puerto: 27017

📂 Colecciones encontradas:
  - users
  - players

📊 Documentos en la base de datos:
👥 Usuarios: 4
🏀 Jugadores: 3
```

## 🔄 MongoDB Atlas vs MongoDB Local

### Configuración Actual: MongoDB Local (Docker)

**Ventajas:**
- ✅ Gratis, sin límites
- ✅ Control total
- ✅ Rápido para desarrollo
- ✅ No requiere internet
- ✅ Datos privados en tu máquina

**Desventajas:**
- ❌ Solo accesible localmente
- ❌ No hay backups automáticos
- ❌ Requiere Docker corriendo
- ❌ No escalable para producción

### Migrar a MongoDB Atlas (Cloud)

Si en el futuro quieres usar MongoDB Atlas:

#### 1. Crear cuenta en Atlas
```
https://www.mongodb.com/cloud/atlas/register
```

#### 2. Crear cluster gratis (M0)
- Seleccionar región
- Crear database user
- Whitelist IP (0.0.0.0/0 para desarrollo)

#### 3. Obtener Connection String
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/basketball-team?retryWrites=true&w=majority
```

#### 4. Actualizar variables de entorno
```env
# .env.docker o backend/.env
MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/basketball-team
```

#### 5. Re-ejecutar seed
```bash
docker compose restart backend
docker compose exec backend node seed-db.js seed
```

## 📦 Persistencia de Datos

### ¿Los datos se pierden al reiniciar Docker?

**NO** - Los datos persisten gracias al volumen Docker

```bash
# Datos persisten después de:
docker compose down
docker compose up

# Datos se BORRAN solo con:
docker compose down -v  # ⚠️ Elimina volúmenes
```

### Backup Manual

**Exportar datos:**
```bash
# Desde tu máquina (requiere mongodump instalado)
mongodump --uri="mongodb://localhost:27017/basketball-team" --out=./backup

# O desde Docker
docker compose exec mongo mongodump --db=basketball-team --out=/backup
docker cp basketball-mongo:/backup ./backup
```

**Restaurar datos:**
```bash
# Desde tu máquina
mongorestore --uri="mongodb://localhost:27017" --db=basketball-team ./backup/basketball-team

# O desde Docker
docker cp ./backup basketball-mongo:/backup
docker compose exec mongo mongorestore --db=basketball-team /backup/basketball-team
```

## 🔐 Seguridad

### Configuración Actual (Desarrollo)

```yaml
# Sin autenticación (solo accesible localmente)
ports:
  - "27017:27017"  # ← Expuesto solo a localhost
```

### Para Producción

Deberías agregar autenticación:

```yaml
mongo:
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    MONGO_INITDB_DATABASE: basketball-team
```

Y actualizar MONGO_URI:
```
mongodb://admin:password@mongo:27017/basketball-team?authSource=admin
```

## 🧪 Testing de Conexión

### Verificar que MongoDB está corriendo

```bash
# Ver status del contenedor
docker compose ps mongo

# Ver logs
docker compose logs mongo --tail=50

# Test de conectividad
docker compose exec mongo mongosh --eval "db.adminCommand('ping')"
```

### Verificar desde Backend

```bash
# Health check del backend incluye DB status
curl http://localhost:5000/health

# Respuesta esperada:
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2025-11-11T..."
}
```

## 📊 Herramientas Recomendadas

### Para Desarrollo:
1. **MongoDB Compass** - GUI visual (mejor para explorar datos)
2. **mongosh** - CLI rápido (mejor para scripts)
3. **test-api.html** - Testing de endpoints (incluido en el proyecto)

### Para Producción:
1. **MongoDB Atlas** - Cloud hosting
2. **MongoDB Charts** - Visualización de datos
3. **Monitoring tools** - Alertas y métricas

## 🎓 Resumen

| Aspecto | Estado Actual |
|---------|---------------|
| **Tipo** | MongoDB Local (Docker) |
| **Acceso GUI** | MongoDB Compass (localhost:27017) |
| **Acceso Cloud** | No (no está en Atlas) |
| **Persistencia** | Sí (volumen Docker) |
| **Seed automático** | Manual (`seed-db.js`) |
| **Backups** | Manual |
| **Producción Ready** | No (requiere Atlas o setup seguro) |

---

## 🚀 Pasos Sugeridos

### Para Desarrollo (Estado Actual - Perfecto):
```bash
# 1. Levantar servicios
docker compose up -d

# 2. Verificar MongoDB
docker compose ps mongo

# 3. Poblar datos (si es primera vez)
docker compose exec backend node seed-db.js seed

# 4. Acceder con Compass
# URI: mongodb://localhost:27017
# DB: basketball-team
```

### Para Producción (Futuro):
1. Migrar a MongoDB Atlas
2. Configurar autenticación
3. Implementar backups automáticos
4. Configurar monitoring
5. Actualizar variables de entorno

---

**Documento creado:** 2025-11-11  
**Proyecto:** Basketball Team Management System  
**DB Version:** MongoDB 7 (Jammy)
