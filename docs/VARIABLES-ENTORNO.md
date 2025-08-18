# 📋 Variables de Entorno - Basketball Team

Esta documentación describe todas las variables de entorno utilizadas en el proyecto, organizadas por módulo y entorno.

## 🎯 Tabla de Variables por Entorno

### Frontend

| Variable | Desarrollo | Producción | Descripción | Requerida |
|----------|------------|------------|-------------|-----------|
| `REACT_APP_API_URL` | `http://localhost:5000/api/v1` | `https://api.tudominio.com/api/v1` | URL base de la API | ✅ |
| `REACT_APP_API_TIMEOUT` | `5000` | `10000` | Timeout para peticiones (ms) | ❌ |
| `REACT_APP_APP_NAME` | `Basketball Team` | `Basketball Team` | Nombre de la aplicación | ❌ |
| `REACT_APP_VERSION` | `1.0.0` | `1.0.0` | Versión de la aplicación | ❌ |
| `REACT_APP_ENVIRONMENT` | `development` | `production` | Entorno actual | ❌ |
| `REACT_APP_ENABLE_ANALYTICS` | `false` | `true` | Habilitar analytics | ❌ |
| `REACT_APP_ENABLE_NOTIFICATIONS` | `true` | `true` | Habilitar notificaciones | ❌ |
| `REACT_APP_ENABLE_DEBUG` | `true` | `false` | Habilitar modo debug | ❌ |
| `GENERATE_SOURCEMAP` | `true` | `false` | Generar source maps | ❌ |
| `INLINE_RUNTIME_CHUNK` | `true` | `false` | Inline runtime chunk | ❌ |

### Backend

| Variable | Desarrollo | Producción | Descripción | Requerida |
|----------|------------|------------|-------------|-----------|
| `NODE_ENV` | `development` | `production` | Entorno de Node.js | ✅ |
| `PORT` | `5000` | `5000` | Puerto del servidor | ✅ |
| `MONGO_URI` | `mongodb://localhost:27017/basketball_team` | `mongodb+srv://...` | URI de MongoDB | ✅ |
| `JWT_SECRET` | `dev_jwt_secret` | `CAMBIAR_EN_PRODUCCION` | Secreto para JWT | ✅ |
| `JWT_EXPIRE` | `7d` | `7d` | Expiración de tokens JWT | ❌ |
| `FRONTEND_URL` | `http://localhost:3000` | `https://tudominio.com` | URL del frontend para CORS | ✅ |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | `https://tudominio.com,https://www.tudominio.com` | Orígenes permitidos | ❌ |
| `REDIS_URL` | `redis://localhost:6379` | `redis://usuario:pass@host:port` | URL de Redis (opcional) | ❌ |
| `RATE_LIMIT_WINDOW_MS` | `900000` | `900000` | Ventana de rate limiting (ms) | ❌ |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | `100` | Máximo de requests por ventana | ❌ |
| `UPLOAD_MAX_SIZE` | `5242880` | `5242880` | Tamaño máximo de archivos (bytes) | ❌ |
| `UPLOAD_ALLOWED_TYPES` | `image/jpeg,image/png,image/gif` | `image/jpeg,image/png,image/gif` | Tipos de archivo permitidos | ❌ |
| `LOG_LEVEL` | `debug` | `info` | Nivel de logging | ❌ |
| `LOG_FILE` | `logs/app.log` | `logs/app.log` | Archivo de logs | ❌ |
| `BCRYPT_ROUNDS` | `10` | `12` | Rondas de encriptación bcrypt | ❌ |
| `SESSION_SECRET` | `dev_session_secret` | `CAMBIAR_EN_PRODUCCION` | Secreto de sesión | ❌ |

## 🔧 Configuración por Entorno

### Desarrollo Local

**Frontend** (`.env.development.local`):
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENABLE_DEBUG=true
```

**Backend** (`.env.development`):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/basketball_team_dev
JWT_SECRET=dev_jwt_secret_no_usar_en_produccion
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
```

### Testing

**Frontend** (`.env.test`):
```env
REACT_APP_API_URL=http://localhost:5001/api/v1
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG=false
```

**Backend** (`.env.test`):
```env
NODE_ENV=test
PORT=5001
MONGO_URI=mongodb://localhost:27017/basketball_team_test
JWT_SECRET=test_jwt_secret
LOG_LEVEL=error
```

### Producción

**Frontend** (`.env.production`):
```env
REACT_APP_API_URL=https://api.tudominio.com/api/v1
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG=false
GENERATE_SOURCEMAP=false
```

**Backend** (`.env.production`):
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/basketball_team
JWT_SECRET=tu_jwt_secret_super_seguro_cambiar_esto
FRONTEND_URL=https://tudominio.com
LOG_LEVEL=info
BCRYPT_ROUNDS=12
```

## 🔒 Seguridad

### Variables Críticas

⚠️ **NUNCA** incluir estas variables en el código fuente:

- `JWT_SECRET` - Debe ser único y fuerte en producción
- `SESSION_SECRET` - Debe ser único y fuerte en producción  
- `MONGO_URI` - Contiene credenciales de base de datos
- `REDIS_URL` - Puede contener credenciales
- Cualquier API key o token de servicios externos

### Buenas Prácticas

1. **Usar diferentes secretos por entorno**
2. **Rotar secretos regularmente en producción**
3. **Usar gestores de secretos en la nube** (AWS Secrets Manager, Azure Key Vault, etc.)
4. **Validar variables requeridas al inicio de la aplicación**
5. **No logear variables sensibles**

## 📝 Validación de Variables

### Frontend

```javascript
// src/config/env.js
const requiredEnvVars = [
  'REACT_APP_API_URL'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Variable de entorno requerida: ${envVar}`);
  }
});

export const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 5000,
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  enableDebug: process.env.REACT_APP_ENABLE_DEBUG === 'true',
};
```

### Backend

```javascript
// config/env.js
const requiredEnvVars = [
  'NODE_ENV',
  'PORT', 
  'MONGO_URI',
  'JWT_SECRET',
  'FRONTEND_URL'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Variable de entorno requerida: ${envVar}`);
  }
});

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  frontendUrl: process.env.FRONTEND_URL,
  logLevel: process.env.LOG_LEVEL || 'info',
};
```

## 🚀 Deploy

### Vercel (Frontend)

Configurar en el dashboard de Vercel:
```
REACT_APP_API_URL=https://tu-backend.herokuapp.com/api/v1
REACT_APP_ENABLE_ANALYTICS=true
GENERATE_SOURCEMAP=false
```

### Heroku (Backend)

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu_jwt_secret_super_seguro
heroku config:set MONGO_URI=mongodb+srv://...
heroku config:set FRONTEND_URL=https://tu-frontend.vercel.app
```

### Railway (Backend)

Configurar en el dashboard de Railway o via CLI:
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=tu_jwt_secret_super_seguro
railway variables set MONGO_URI=mongodb+srv://...
```

---

**Última actualización:** Agosto 2025
**Responsable:** Jorge Zuta
