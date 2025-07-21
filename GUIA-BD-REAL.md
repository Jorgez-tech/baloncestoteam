# 🏀 Basketball Team - Guía de Inicio con Base de Datos Real

## 🎯 Configuración Completada

### ✅ **Lo que ya está listo:**
- MongoDB configurado y poblado con datos de prueba
- Backend configurado para puerto 5000
- Frontend configurado para usar la API real
- 4 usuarios y 3 jugadores de prueba creados

## 🚀 **Cómo Iniciar la Aplicación**

### **Paso 1: Iniciar Backend**
```bash
# Opción A: Usar script automático
INICIAR-BACKEND.bat

# Opción B: Manual
cd backend
npm start
```

### **Paso 2: Iniciar Frontend**
```bash
# Opción A: Usar script automático  
INICIAR-FRONTEND.bat

# Opción B: Manual
cd frontend
npm start
```

### **Paso 3: Verificar Funcionamiento**
- Backend: http://localhost:5000/health
- Frontend: http://localhost:3000
- API Docs: http://localhost:5000/api/v1/docs

## 🎮 **Datos de Prueba**

### **👥 Usuarios:**
- **Admin:** admin@basketballteam.com / admin123
- **Player1:** player1@basketballteam.com / player123
- **Player2:** player2@basketballteam.com / player123  
- **Player3:** player3@basketballteam.com / player123

### **🏀 Jugadores:**
1. **Juan Carlos Rodriguez** - Point Guard
2. **Miguel Angel Torres** - Shooting Guard
3. **Carlos Alberto Mendez** - Center

## 🧪 **Scripts de Prueba**

```bash
# Probar conexión a BD
npm run db:test

# Poblar datos de prueba
npm run db:seed

# Probar endpoints API
node test-api-endpoints.js
```

## 🔧 **Configuración Técnica**

### **Backend:**
- Puerto: 5000
- Base de datos: MongoDB (basketball_team)
- API Base: http://localhost:5000/api/v1

### **Frontend:**
- Puerto: 3000
- Framework: React
- Routing: React Router
- State: React Query

## 🎯 **Funcionalidades Disponibles**

### **Públicas (sin login):**
- ✅ Lista de jugadores (/players)
- ✅ Perfil individual (/players/:id)
- ✅ Navegación entre perfiles
- ✅ Galería de imágenes

### **Protegidas (requieren login):**
- 🔒 Panel de administración (/admin)
- 🔒 Gestión de usuarios
- 🔒 CRUD de jugadores

## 📊 **Próximos Pasos**

1. **Probar navegación completa**
2. **Implementar AdminDashboard** 
3. **Agregar más funcionalidades CRUD**
4. **Optimizar performance**

---

**¡La aplicación está lista para usar con datos reales!** 🎉
