# 📋 Instrucciones de Instalación

## 🚀 Guía Rápida de Instalación

### 1. Prerequisitos
- [Node.js](https://nodejs.org/) v16 o superior
- [MongoDB](https://www.mongodb.com/try/download/community) (local o MongoDB Atlas)
- [Git](https://git-scm.com/)

### 2. Instalación del Backend

```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
copy .env.example .env

# Editar .env con tus configuraciones
notepad .env
```

#### Variables de entorno necesarias (.env):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/basketball_team
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Instalación del Frontend

```bash
# Navegar al directorio frontend
cd ../frontend

# Instalar dependencias
npm install
```

### 4. Iniciar los Servicios

#### Opción A: Usando múltiples terminales

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### Opción B: Usando un solo comando (requiere concurrently)
```bash
# En la raíz del proyecto
npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm start"
```

### 5. Verificar Instalación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/health
- **Documentación**: http://localhost:5000/api/v1/docs
- **Landing Page**: Abrir `index.html` en el navegador

## ⚠️ Solución de Problemas

### Error: MongoDB no conecta
```bash
# Verificar que MongoDB está ejecutándose
mongod --version

# Iniciar MongoDB (Windows)
net start MongoDB

# Iniciar MongoDB (Mac/Linux)
sudo systemctl start mongod
```

### Error: Puerto ya en uso
```bash
# Encontrar proceso en puerto 5000
netstat -ano | findstr :5000

# Matar proceso (Windows)
taskkill /PID <PID> /F

# Cambiar puerto en .env
PORT=5001
```

### Error: Módulos no encontrados
```bash
# Limpiar cache e instalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📱 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend React | http://localhost:3000 | Aplicación principal |
| Backend API | http://localhost:5000 | API REST |
| Documentación | http://localhost:5000/api/v1/docs | Swagger UI |
| Health Check | http://localhost:5000/health | Estado del servidor |
| Landing Page | file:///index.html | Página de aterrizaje |

## 🔧 Comandos Útiles

```bash
# Backend
npm run dev          # Desarrollo con nodemon
npm start           # Producción
npm test            # Ejecutar tests

# Frontend
npm start           # Desarrollo
npm run build       # Build para producción
npm test            # Ejecutar tests
npm run eject       # Exponer configuración (¡irreversible!)
```

## 📦 Estructura de Dependencias

### Backend
- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **jsonwebtoken**: Autenticación JWT
- **bcryptjs**: Hash de contraseñas
- **cors**: Configuración CORS
- **helmet**: Headers de seguridad
- **dotenv**: Variables de entorno

### Frontend
- **react**: Librería UI
- **react-router-dom**: Enrutamiento
- **axios**: Cliente HTTP
- **react-query**: Gestión de estado servidor
- **react-hook-form**: Manejo de formularios
- **react-toastify**: Notificaciones

¡Listo! Tu aplicación Basketball Team debería estar funcionando correctamente. 🏀
