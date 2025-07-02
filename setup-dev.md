# 🔧 Configuración de Desarrollo

Este archivo te ayudará a configurar el entorno de desarrollo rápidamente.

## Instalar dependencias del backend

```cmd
cd backend
npm install
```

## Instalar dependencias del frontend

```cmd
cd frontend
npm install
```

## Configurar variables de entorno

```cmd
cd backend
copy .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
- Cambia `JWT_SECRET` por un valor seguro
- Configura `MONGO_URI` con tu conexión de MongoDB
- Ajusta otros valores según necesites

## Iniciar servicios de desarrollo

### Opción 1: Terminales separadas

**Terminal 1 (Backend):**
```cmd
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```cmd
cd frontend
npm start
```

### Opción 2: Script automatizado
Crea un archivo `start-dev.cmd` en la raíz:

```cmd
@echo off
echo Iniciando servicios de desarrollo...
start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm start"
echo Servicios iniciados!
pause
```

## URLs de desarrollo

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api/v1/docs
- Health: http://localhost:5000/health

## Comandos útiles

```cmd
# Reiniciar dependencias
cd backend && npm ci && cd ../frontend && npm ci

# Verificar puertos ocupados
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Limpiar cache
npm cache clean --force
```

¡Tu entorno de desarrollo está listo! 🚀
