# 🏀 Basketball Team - Guía de Pruebas

## 🚀 Cómo Iniciar y Probar el Sistema

### Paso 1: Verificar MongoDB
Asegúrate de que MongoDB esté corriendo en tu sistema:
- MongoDB debe estar en: `mongodb://localhost:27017`
- Base de datos: `basketball_team`

### Paso 2: Iniciar el Sistema Completo
Ejecuta el script maestro desde la carpeta raíz:
```cmd
start-full-system.bat
```

O manualmente:

#### Backend (Terminal 1):
```cmd
cd c:\Users\jzuta\proyectos\baloncestoteam\backend
npm run dev
```

#### Frontend (Terminal 2):
```cmd
cd c:\Users\jzuta\proyectos\baloncestoteam\frontend
npm start
```

### Paso 3: Acceder a la Aplicación
1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:5000/api/v1
3. **Documentación**: http://localhost:5000/api-docs

## 🔐 Credenciales de Prueba

### Administrador
- **Email**: `admin@basketballteam.com`
- **Password**: `admin123`
- **Funciones**: Acceso completo al sistema

### Jugadores
- **Jugador 1**: `player1@basketballteam.com` / `player123`
  - Juan Carlos Rodriguez - Point Guard
- **Jugador 2**: `player2@basketballteam.com` / `player123`
  - Miguel Angel Torres - Shooting Guard
- **Jugador 3**: `player3@basketballteam.com` / `player123`
  - Carlos Alberto Mendez - Center

## 🧪 Pruebas a Realizar

### 1. Prueba de Login
1. Ve a http://localhost:3000
2. Haz clic en "Iniciar Sesión"
3. Usa las credenciales del administrador
4. Verifica que aparezca tu información en el dashboard

### 2. Prueba de API Directa
Puedes probar la API directamente en el navegador:
- **Ver usuarios**: http://localhost:5000/api/v1/users
- **Ver jugadores**: http://localhost:5000/api/v1/players
- **Documentación**: http://localhost:5000/api-docs

### 3. Prueba de Funcionalidades
- **Como Admin**: Gestionar usuarios y jugadores
- **Como Jugador**: Ver perfil y estadísticas
- **Sin login**: Ver página principal con credenciales de prueba

## 📊 Datos de Prueba en la Base de Datos

La base de datos contiene:
- ✅ 4 usuarios (1 admin + 3 jugadores)
- ✅ 3 jugadores con estadísticas completas
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Relaciones entre usuarios y jugadores

## 🛠️ Solución de Problemas

### Error de conexión a MongoDB
```cmd
cd c:\Users\jzuta\proyectos\baloncestoteam\backend
node seed-db.js test
```

### Backend no inicia
1. Verifica que MongoDB esté corriendo
2. Verifica las dependencias: `npm install`
3. Revisa el archivo `.env`

### Frontend no inicia
1. Verifica las dependencias: `npm install`
2. Verifica que el backend esté corriendo en puerto 5000
3. Revisa la configuración del proxy en `package.json`

## 📱 URLs de Prueba Rápida

Una vez que todo esté corriendo:

### API Endpoints (Usar con Postman o navegador)
```
GET  http://localhost:5000/api/v1/players
GET  http://localhost:5000/api/v1/users
POST http://localhost:5000/api/v1/auth/login
```

### Frontend
```
http://localhost:3000           - Página principal
http://localhost:3000/login     - Login
http://localhost:3000/signup    - Registro
```

## ✨ Características Implementadas

✅ Sistema de autenticación JWT
✅ Base de datos MongoDB con datos de prueba
✅ API RESTful completa
✅ Frontend React con rutas protegidas
✅ Subida de imágenes
✅ Gestión de perfiles
✅ Documentación Swagger
✅ Middleware de seguridad
✅ Validación de datos
✅ Manejo de errores
