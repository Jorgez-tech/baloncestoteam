# Basketball Team - Instrucciones de Arquitectura del Proyecto

## ⚠️ REGLAS CRÍTICAS - LEER PRIMERO

### 🚨 NUNCA HACER SIN CONFIRMACIÓN EXPLÍCITA DEL USUARIO:
1. **NO crear nuevas bases de datos** - El proyecto tiene una DB existente desde julio 2025
2. **NO ejecutar scripts seed** - Los datos reales ya existen
3. **NO modificar esquemas de DB** sin revisar datos existentes
4. **NO asumir configuraciones** - Siempre verificar estado actual primero
5. **NO inventar soluciones** - Preguntar antes de cambiar arquitectura

### 📋 ANTES DE CUALQUIER CAMBIO:
1. Leer este archivo completo
2. Verificar estado actual con comandos de consulta (no modificación)
3. Preguntar al usuario si hay dudas
4. Confirmar el plan de acción
5. Ejecutar cambios solo después de aprobación

---

## ESTADO ACTUAL DEL PROYECTO (Noviembre 2025)

### 🏗️ Arquitectura
- **Inicio del proyecto**: ~1 año atrás (aproximadamente enero 2025)
- **Backend**: Node.js + Express (puerto 5000) - FUNCIONAL
- **Frontend**: React + Sportpar template (puerto 3000) - FUNCIONAL
- **Base de Datos**: MongoDB `basketball_team` (con guion bajo)
- **Deployment**: Docker Compose con 4 servicios
- **Estado**: En producción con datos reales

### 🗄️ BASE DE DATOS EXISTENTE (CRÍTICO)

**Nombre real**: `basketball_team` (guion bajo, NO guion medio)
**Creación**: Julio 2, 2025 (según timestamps)
**Ubicación**: MongoDB local (puerto 27017)
**Estado**: PRODUCCIÓN - Contiene datos reales del usuario

#### Colecciones Confirmadas:
- **players** (3 jugadores con datos reales):
  - Juan Carlos Rodriguez (Point Guard, avatar: mj.jpg)
  - Miguel Angel Torres (Shooting Guard, avatar: hakeem.jpg)
  - Carlos Alberto Mendez (Center, avatar: dennis-rodman.jpg)
- **users** (cantidad desconocida - NO MODIFICAR)

#### ⚠️ PROHIBIDO:
- NO ejecutar `seed-db.js` (sobrescribiría datos reales)
- NO crear base de datos nueva
- NO usar nombre `basketball-team` (con guion)
- NO asumir que la DB está vacía

#### ✅ PERMITIDO:
- Consultar datos con `.find()`
- Verificar esquemas
- Hacer backups antes de cambios
- Conectarse en modo lectura

### 🔌 CONFIGURACIÓN DE CONEXIÓN

**Archivo**: `backend/.env`
```
MONGO_URI=mongodb://mongo:27017/basketball_team
```
**Nota**: Usar `basketball_team` (guion bajo), no `basketball-team`

**Para MongoDB Compass**:
```
mongodb://localhost:27017
Base de datos: basketball_team
```

### 📁 Archivos Clave

#### Frontend:
- `frontend/src/App.js` - Aplicación principal con AuthProvider
- `frontend/nginx.conf` - Configuración Nginx con CSP
- `frontend/public/css/` - Estilos del template Sportpar
- `frontend/public/images/` - Assets incluyendo avatares de jugadores

#### Backend:
- `backend/server.js` - Servidor Express con validación JWT
- `backend/config/db.js` - Conexión MongoDB
- `backend/models/player.js` - Modelo de jugadores (revisar antes de cambios)
- `backend/models/user.js` - Modelo de usuarios (revisar antes de cambios)
- `backend/seed-db.js` - ⚠️ NO EJECUTAR (sobrescribe datos reales)

#### Docker:
- `docker-compose.yml` - Orquestación de servicios
- `.env.docker` - Variables de entorno para producción
- Volumen: `mongo-data` (contiene todos los datos persistentes)

### 🚀 Comandos de Desarrollo

#### Iniciar servicios:
```bash
docker compose up -d
```

#### Verificar estado (SIEMPRE PRIMERO):
```bash
docker compose ps
docker compose logs backend --tail=20
docker compose logs frontend --tail=20
```

#### Acceder a MongoDB (SOLO LECTURA):
```bash
# Ver bases de datos
docker compose exec mongo mongosh --eval "show dbs"

# Ver colecciones
docker compose exec mongo mongosh basketball_team --eval "show collections"

# Ver jugadores (lectura)
docker compose exec mongo mongosh basketball_team --eval "db.players.find().pretty()"

# Contar documentos
docker compose exec mongo mongosh basketball_team --eval "db.players.countDocuments()"
```

### 🔧 Problemas Resueltos (No Reintroducir)

#### ✅ Solucionado el 11/Nov/2025:
1. **AuthProvider faltante** - Ya integrado en `App.js`
2. **CSP bloqueando API** - Ya configurado en `nginx.conf`
3. **Login no funcional** - Ya resuelto y probado
4. **Jugadores no aparecen** - Ya funcional

### 🎯 Flujo de Trabajo para Cambios

#### 1. INVESTIGACIÓN (Solo lectura):
```bash
# Ver estructura de datos actual
docker compose exec mongo mongosh basketball_team --eval "db.players.findOne()"

# Verificar esquema
docker compose exec mongo mongosh basketball_team --eval "db.players.findOne()"
```

#### 2. PLANIFICACIÓN:
- Documentar cambios propuestos
- Identificar archivos afectados
- Listar riesgos
- **Preguntar al usuario**: "¿Procedo con estos cambios?"

#### 3. BACKUP (Antes de modificar DB):
```bash
# Backup manual
docker compose exec mongo mongodump --db=basketball_team --out=/backup
docker cp basketball-mongo:/backup ./backup-$(date +%Y%m%d)
```

#### 4. EJECUCIÓN:
- Hacer cambios aprobados
- Probar inmediatamente
- Documentar en commit message

#### 5. VALIDACIÓN:
- Verificar funcionalidad
- Confirmar datos intactos
- Obtener confirmación del usuario

### 📊 Historial de Cambios Recientes

**11 de Noviembre 2025**:
- ✅ Integrado AuthProvider en App.js
- ✅ Configurado CSP para permitir API calls
- ✅ Creado `test-api.html` para testing
- ✅ Documentado en `RESOLUCION_PROBLEMAS.md`
- ⚠️ ERROR: Asumí DB nueva en lugar de conectar a existente

**Lección aprendida**: Siempre verificar estado actual antes de asumir

### 🎓 Principios de Desarrollo

1. **Pregunta primero, ejecuta después**
2. **Verifica antes de modificar**
3. **Documenta todo cambio**
4. **Respeta datos existentes**
5. **No asumas, confirma**

### 🔍 Checklist Antes de Cada Sesión

- [ ] Leer este archivo completo
- [ ] Verificar `docker compose ps`
- [ ] Confirmar conexión DB: `docker compose exec mongo mongosh basketball_team --eval "db.players.countDocuments()"`
- [ ] Revisar último commit: `git log --oneline -5`
- [ ] Preguntar al usuario sobre el objetivo de la sesión

### 📞 Referencias Importantes

- **Documentación DB**: `docs/DATABASE_MANAGEMENT.md`
- **Troubleshooting**: `RESOLUCION_PROBLEMAS.md`
- **Deployment**: `DEPLOYMENT.md`
- **Guía desarrollo**: `DESARROLLO-GUIA.md`

---

## PRÓXIMAS FASES (Solo con Aprobación)

- Personalización gradual del contenido
- Integración de formularios con backend
- Sistema de gestión de jugadores
- Mejoras de UI/UX

**IMPORTANTE**: Cualquier cambio debe ser discutido y aprobado primero.