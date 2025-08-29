# � Variables de Entorno - Basketball Team Project

> **Documentación completa** de todas las variables de entorno utilizadas en el sistema de gestión de equipos de baloncesto, organizadas por módulo, entorno y nivel de seguridad.

---

## 🎯 **Variables por Módulo**

### ⚛️ **Frontend (React SPA)**

| Variable | Desarrollo | Producción | Descripción | Requerida | Seguridad |
|----------|------------|------------|-------------|-----------|-----------|
| `REACT_APP_API_URL` | `http://localhost:5000/api/v1` | `https://api.tudominio.com/api/v1` | URL base de la API backend | ✅ | 🔒 |
| `REACT_APP_API_TIMEOUT` | `10000` | `10000` | Timeout para peticiones HTTP (ms) | ❌ | 🟢 |
| `REACT_APP_JWT_STORAGE_KEY` | `basketball_token` | `basketball_token` | Clave para almacenar JWT | ❌ | 🔒 |
| `REACT_APP_TOKEN_REFRESH_THRESHOLD` | `300` | `300` | Umbral para refresh automático (s) | ❌ | 🔒 |
| `REACT_APP_ENV` | `development` | `production` | Entorno de ejecución | ❌ | 🟢 |
| `REACT_APP_VERSION` | `2.0.0` | `2.0.0` | Versión de la aplicación | ❌ | 🟢 |
| `REACT_APP_DEBUG` | `true` | `false` | Habilitar modo debug | ❌ | 🟡 |
| `REACT_APP_MOCK_API` | `false` | `false` | Usar API mock para desarrollo | ❌ | 🟡 |
| `REACT_APP_GA_TRACKING_ID` | `` | `GA-XXXXXXXXX` | Google Analytics ID | ❌ | 🔒 |
| `REACT_APP_SENTRY_DSN` | `` | `https://...` | Sentry DSN para error tracking | ❌ | 🔒 |
| `GENERATE_SOURCEMAP` | `true` | `false` | Generar source maps en build | ❌ | 🟡 |
| `INLINE_RUNTIME_CHUNK` | `true` | `false` | Inline runtime chunk | ❌ | 🟢 |

### 🖥️ **Backend (Node.js + Express)**

| Variable | Desarrollo | Producción | Descripción | Requerida | Seguridad |
|----------|------------|------------|-------------|-----------|-----------|
| `NODE_ENV` | `development` | `production` | Entorno de Node.js | ✅ | 🟢 |
| `PORT` | `5000` | `5000` | Puerto del servidor | ✅ | 🟢 |
| `MONGO_URI` | `mongodb://localhost:27017/basketball_dev` | `mongodb+srv://user:pass@cluster.mongodb.net/basketball` | URI de conexión MongoDB | ✅ | 🔴 |
| `JWT_SECRET` | `dev_jwt_secret_no_produccion` | `CAMBIAR_SUPER_SECRETO_64_CHARS` | Secreto para firmar JWT | ✅ | 🔴 |
| `JWT_EXPIRE` | `7d` | `7d` | Tiempo de expiración JWT | ❌ | 🔒 |
| `JWT_REFRESH_EXPIRE` | `30d` | `30d` | Tiempo expiración refresh token | ❌ | 🔒 |
| `FRONTEND_URL` | `http://localhost:3000` | `https://tudominio.com` | URL frontend para CORS | ✅ | 🔒 |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | `https://tudominio.com,https://www.tudominio.com` | Orígenes permitidos CORS | ❌ | 🔒 |
| `REDIS_URL` | `redis://localhost:6379` | `redis://user:pass@host:port/db` | URL conexión Redis (cache) | ❌ | 🔴 |
| `SESSION_SECRET` | `dev_session_secret` | `CAMBIAR_SESSION_SECRET_SEGURO` | Secreto para sesiones | ❌ | 🔴 |
| `BCRYPT_ROUNDS` | `10` | `12` | Rondas hash bcrypt | ❌ | 🔒 |
| `RATE_LIMIT_WINDOW_MS` | `900000` | `900000` | Ventana rate limiting (15min) | ❌ | 🔒 |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | `50` | Máx requests por ventana | ❌ | 🔒 |
| `UPLOAD_MAX_SIZE` | `5242880` | `5242880` | Tamaño máx archivos (5MB) | ❌ | 🔒 |
| `UPLOAD_ALLOWED_TYPES` | `image/jpeg,image/png,image/gif,image/webp` | `image/jpeg,image/png,image/gif,image/webp` | Tipos MIME permitidos | ❌ | 🔒 |
| `LOG_LEVEL` | `debug` | `info` | Nivel de logging | ❌ | 🟢 |
| `LOG_FILE` | `logs/basketball-dev.log` | `logs/basketball-prod.log` | Archivo de logs | ❌ | 🟢 |
| `EMAIL_HOST` | `smtp.mailtrap.io` | `smtp.gmail.com` | Host SMTP para emails | ❌ | 🔒 |
| `EMAIL_PORT` | `2525` | `587` | Puerto SMTP | ❌ | 🟢 |
| `EMAIL_USER` | `mailtrap_user` | `tu_email@gmail.com` | Usuario SMTP | ❌ | 🔴 |
| `EMAIL_PASS` | `mailtrap_pass` | `app_password_gmail` | Password SMTP | ❌ | 🔴 |

**Leyenda de Seguridad:**
- 🔴 **Crítico** - Nunca exponer, rotar regularmente
- 🔒 **Sensible** - Proteger, validar acceso
- 🟡 **Moderado** - Cuidado en logs
- 🟢 **Público** - Safe para exponer

---

## ⚙️ **Configuración por Entorno**

### 🔧 **Desarrollo Local**

**Frontend** `.env.development.local`:
```env
# 🌐 API Configuration
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_API_TIMEOUT=10000

# 🔐 Authentication
REACT_APP_JWT_STORAGE_KEY=basketball_token
REACT_APP_TOKEN_REFRESH_THRESHOLD=300

# 🎯 Environment
REACT_APP_ENV=development
REACT_APP_VERSION=2.0.0
REACT_APP_DEBUG=true
REACT_APP_MOCK_API=false

# 📊 Analytics (development)
REACT_APP_GA_TRACKING_ID=
REACT_APP_SENTRY_DSN=

# 🔧 Build
GENERATE_SOURCEMAP=true
INLINE_RUNTIME_CHUNK=true
```

**Backend** `.env.development`:
```env
# 🌐 Server Configuration
NODE_ENV=development
PORT=5000

# 🗄️ Database
MONGO_URI=mongodb://localhost:27017/basketball_team_dev

# 🔐 Authentication
JWT_SECRET=dev_jwt_secret_no_usar_en_produccion_cambiar_siempre
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
SESSION_SECRET=dev_session_secret_cambiar_en_produccion

# 🔒 Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# 🌐 CORS
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# 📁 File Upload
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,image/webp

# 📝 Logging
LOG_LEVEL=debug
LOG_FILE=logs/basketball-dev.log

# 📧 Email (Development)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=tu_mailtrap_user
EMAIL_PASS=tu_mailtrap_pass

# 🔄 Cache (Optional)
REDIS_URL=redis://localhost:6379
```

### 🧪 **Testing Environment**

**Frontend** `.env.test`:
```env
REACT_APP_API_URL=http://localhost:5001/api/v1
REACT_APP_ENV=test
REACT_APP_DEBUG=false
REACT_APP_MOCK_API=true
REACT_APP_GA_TRACKING_ID=
REACT_APP_SENTRY_DSN=
GENERATE_SOURCEMAP=false
```

**Backend** `.env.test`:
```env
NODE_ENV=test
PORT=5001
MONGO_URI=mongodb://localhost:27017/basketball_team_test
JWT_SECRET=test_jwt_secret_para_testing_solamente
JWT_EXPIRE=1h
FRONTEND_URL=http://localhost:3001
LOG_LEVEL=error
LOG_FILE=logs/basketball-test.log
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=1000
```

### 🚀 **Producción**

**Frontend** `.env.production`:
```env
# 🌐 API Configuration
REACT_APP_API_URL=https://api.basketballteam.com/api/v1
REACT_APP_API_TIMEOUT=10000

# 🔐 Authentication
REACT_APP_JWT_STORAGE_KEY=basketball_token
REACT_APP_TOKEN_REFRESH_THRESHOLD=300

# 🎯 Environment
REACT_APP_ENV=production
REACT_APP_VERSION=2.0.0
REACT_APP_DEBUG=false
REACT_APP_MOCK_API=false

# 📊 Analytics (production)
REACT_APP_GA_TRACKING_ID=GA-XXXXXXXXX-X
REACT_APP_SENTRY_DSN=https://xxxxxxxx@sentry.io/xxxxxxx

# 🔧 Build Optimization
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
```

**Backend** `.env.production`:
```env
# 🌐 Server Configuration
NODE_ENV=production
PORT=5000

# 🗄️ Database
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/basketball_team_prod

# 🔐 Authentication (CAMBIAR TODOS LOS SECRETOS)
JWT_SECRET=SUPER_SECRETO_PRODUCCION_MINIMO_64_CARACTERES_CAMBIAR_ESTO
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
SESSION_SECRET=SESSION_SECRET_PRODUCCION_TAMBIEN_CAMBIAR_ESTE

# 🔒 Security (Hardened)
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# 🌐 CORS
FRONTEND_URL=https://basketballteam.com
ALLOWED_ORIGINS=https://basketballteam.com,https://www.basketballteam.com

# 📁 File Upload
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,image/webp

# 📝 Logging
LOG_LEVEL=info
LOG_FILE=logs/basketball-prod.log

# 📧 Email (Production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@basketballteam.com
EMAIL_PASS=app_password_gmail_seguro

# 🔄 Cache (Redis Cloud)
REDIS_URL=redis://username:password@redis-host:port/database
```

---

## 🛡️ **Seguridad de Variables**

### 🚨 **Variables Críticas - NUNCA Exponer**

```javascript
// ❌ NUNCA hacer esto:
console.log('JWT Secret:', process.env.JWT_SECRET);
res.json({ jwtSecret: process.env.JWT_SECRET });

// ✅ Correcto:
console.log('JWT Secret: [HIDDEN]');
res.json({ message: 'Authentication successful' });
```

**Variables que NUNCA deben aparecer en:**
- Logs de aplicación
- Respuestas de API
- Cliente frontend
- Repositorios Git
- Error messages públicos

### 🔐 **Gestión de Secretos**

#### Desarrollo Local
```bash
# Usar herramientas como direnv
echo "export JWT_SECRET=dev_secret" >> ~/.envrc
direnv allow
```

#### Producción Recomendada
- **AWS Secrets Manager**
- **Azure Key Vault** 
- **Google Secret Manager**
- **HashiCorp Vault**
- **Docker Secrets**

### 🔄 **Rotación de Secretos**

```javascript
// backend/scripts/rotate-secrets.js
const rotateJWTSecret = async () => {
  const newSecret = crypto.randomBytes(64).toString('hex');
  
  // 1. Actualizar variable de entorno
  // 2. Reiniciar aplicación gradualmente
  // 3. Invalidar tokens antiguos después de período de gracia
  
  console.log('JWT Secret rotated successfully');
};
```

### ✅ **Validación de Variables**

**Frontend** `src/config/env.js`:
```javascript
class EnvValidator {
  static validate() {
    const required = ['REACT_APP_API_URL'];
    const missing = required.filter(env => !process.env[env]);
    
    if (missing.length > 0) {
      throw new Error(`Variables requeridas faltantes: ${missing.join(', ')}`);
    }
    
    // Validaciones adicionales
    this.validateAPIURL();
    this.validateEnvironment();
  }
  
  static validateAPIURL() {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl.startsWith('http')) {
      throw new Error('REACT_APP_API_URL debe ser una URL válida');
    }
  }
  
  static validateEnvironment() {
    const env = process.env.REACT_APP_ENV;
    const validEnvs = ['development', 'test', 'production'];
    if (env && !validEnvs.includes(env)) {
      throw new Error(`REACT_APP_ENV debe ser uno de: ${validEnvs.join(', ')}`);
    }
  }
}

// Validar al iniciar la aplicación
EnvValidator.validate();

export const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  env: process.env.REACT_APP_ENV || 'development',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  debug: process.env.REACT_APP_DEBUG === 'true',
  mockApi: process.env.REACT_APP_MOCK_API === 'true',
  jwtStorageKey: process.env.REACT_APP_JWT_STORAGE_KEY || 'basketball_token',
  tokenRefreshThreshold: parseInt(process.env.REACT_APP_TOKEN_REFRESH_THRESHOLD) || 300,
  analytics: {
    gaId: process.env.REACT_APP_GA_TRACKING_ID,
    sentryDsn: process.env.REACT_APP_SENTRY_DSN
  }
};
```

**Backend** `config/env.js`:
```javascript
const joi = require('joi');

const envSchema = joi.object({
  NODE_ENV: joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: joi.number().default(5000),
  MONGO_URI: joi.string().required(),
  JWT_SECRET: joi.string().min(32).required(),
  JWT_EXPIRE: joi.string().default('7d'),
  FRONTEND_URL: joi.string().uri().required(),
  BCRYPT_ROUNDS: joi.number().min(10).max(15).default(10),
  LOG_LEVEL: joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info')
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGO_URI,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  cors: {
    origin: envVars.FRONTEND_URL.split(','),
    credentials: true,
  },
  security: {
    bcryptRounds: envVars.BCRYPT_ROUNDS,
    rateLimitWindow: envVars.RATE_LIMIT_WINDOW_MS,
    rateLimitMax: envVars.RATE_LIMIT_MAX_REQUESTS,
  },
  logging: {
    level: envVars.LOG_LEVEL,
    file: envVars.LOG_FILE,
  }
};
```

---

## 🚀 **Deploy y Platforms**

### ☁️ **Vercel (Frontend)**

**Dashboard Configuration:**
```bash
# Production Environment Variables
REACT_APP_API_URL=https://basketball-api.railway.app/api/v1
REACT_APP_ENV=production
REACT_APP_DEBUG=false
REACT_APP_GA_TRACKING_ID=GA-XXXXXXXXX-X
REACT_APP_SENTRY_DSN=https://xxx@sentry.io/xxx
GENERATE_SOURCEMAP=false
```

**Via CLI:**
```bash
vercel env add REACT_APP_API_URL production
vercel env add REACT_APP_ENV production
vercel env add REACT_APP_DEBUG production
```

### 🚂 **Railway (Backend)**

**Dashboard Configuration:**
```bash
NODE_ENV=production
PORT=5000
MONGO_URI=${{MongoDB.MONGO_URI}}
JWT_SECRET=${{secrets.JWT_SECRET}}
FRONTEND_URL=https://basketball-team.vercel.app
```

**Via CLI:**
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET="$(openssl rand -base64 64)"
railway variables set MONGO_URI="mongodb+srv://..."
```

### 🟦 **Heroku (Backend)**

```bash
# Set config vars
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="$(openssl rand -base64 64)"
heroku config:set MONGO_URI="mongodb+srv://..."
heroku config:set FRONTEND_URL="https://basketball-team.vercel.app"

# View all config
heroku config

# Remove config
heroku config:unset VARIABLE_NAME
```

### 🌊 **DigitalOcean Apps**

**app.yaml:**
```yaml
name: basketball-backend
services:
- name: api
  source_dir: backend
  github:
    repo: tu-usuario/basketball-team
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    value: ${JWT_SECRET}
    type: SECRET
  - key: MONGO_URI
    value: ${MONGO_URI}
    type: SECRET
```

### 🐳 **Docker Compose**

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=${FRONTEND_URL}
    secrets:
      - jwt_secret
      - mongo_credentials
    
  frontend:
    build: ./frontend
    environment:
      - REACT_APP_API_URL=${API_URL}
      - REACT_APP_ENV=production

secrets:
  jwt_secret:
    external: true
  mongo_credentials:
    external: true
```

---

## 🔧 **Scripts de Gestión**

### 📋 **Validación de Entorno**

```bash
#!/bin/bash
# scripts/validate-env.sh

echo "🔍 Validando variables de entorno..."

# Frontend validation
if [ -z "$REACT_APP_API_URL" ]; then
  echo "❌ REACT_APP_API_URL es requerida"
  exit 1
fi

# Backend validation
if [ -z "$JWT_SECRET" ] || [ ${#JWT_SECRET} -lt 32 ]; then
  echo "❌ JWT_SECRET debe tener al menos 32 caracteres"
  exit 1
fi

if [ -z "$MONGO_URI" ]; then
  echo "❌ MONGO_URI es requerida"
  exit 1
fi

echo "✅ Todas las variables de entorno son válidas"
```

### 🔐 **Generación de Secretos**

```bash
#!/bin/bash
# scripts/generate-secrets.sh

echo "🔐 Generando secretos seguros..."

# JWT Secret (64 bytes, base64)
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
echo "JWT_SECRET=$JWT_SECRET"

# Session Secret (32 bytes, hex)
SESSION_SECRET=$(openssl rand -hex 32)
echo "SESSION_SECRET=$SESSION_SECRET"

# Admin API Key (16 bytes, hex)
ADMIN_API_KEY=$(openssl rand -hex 16)
echo "ADMIN_API_KEY=$ADMIN_API_KEY"

echo "✅ Secretos generados. Copia y pega en tu archivo .env"
```

### 📊 **Health Check**

```javascript
// scripts/health-check.js
const axios = require('axios');

const healthCheck = async () => {
  try {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
    
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 5000
    });
    
    console.log('✅ API Health Check:', response.data);
    return true;
  } catch (error) {
    console.error('❌ API Health Check Failed:', error.message);
    return false;
  }
};

healthCheck().then(success => {
  process.exit(success ? 0 : 1);
});
```

---

## 📞 **Troubleshooting**

### ❌ **Problemas Comunes**

**1. API_URL incorrecto:**
```bash
Error: Network Error
# Verificar REACT_APP_API_URL
echo $REACT_APP_API_URL
```

**2. JWT Secret muy corto:**
```bash
Error: JWT secret must be at least 32 characters
# Generar nuevo secret
openssl rand -base64 64
```

**3. CORS Error:**
```bash
Access to fetch blocked by CORS policy
# Verificar FRONTEND_URL en backend
# Verificar ALLOWED_ORIGINS
```

**4. MongoDB Connection:**
```bash
MongoNetworkError: failed to connect
# Verificar MONGO_URI
# Verificar conectividad de red
# Verificar credenciales
```

### 🔍 **Debug Commands**

```bash
# Listar todas las variables (desarrollo)
env | grep REACT_APP

# Verificar variables del backend
node -e "console.log(process.env.NODE_ENV)"

# Test de conexión MongoDB
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err.message));
"
```

---

<div align="center">

**🔐 Basketball Team - Environment Variables Documentation**

[![Security](https://img.shields.io/badge/Security-Hardened-brightgreen)](docs/SECURITY.md)
[![Config](https://img.shields.io/badge/Config-Validated-blue)](scripts/validate-env.sh)
[![Deploy](https://img.shields.io/badge/Deploy-Ready-success)](docs/DEPLOY.md)

**Última actualización**: 28 Agosto 2025  
**Responsable**: Jorge Zuta  
**Versión**: 2.0.0

</div>

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
