# 🚀 GUÍA DE INICIO RÁPIDO - Basketball Team App

## 🎯 Pasos para Iniciar la Aplicación

### 1. **Iniciar MongoDB (IMPORTANTE)**
MongoDB debe estar funcionando antes de iniciar el backend.

#### Opción A: MongoDB instalado localmente
```bash
# Abrir terminal como administrador
net start MongoDB
# o
mongod --dbpath C:\data\db
```

#### Opción B: MongoDB Atlas (en la nube)
- Cambiar la URL en `.env` por tu connection string de MongoDB Atlas
- Ejemplo: `MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/basketball_team`

### 2. **Iniciar Backend (Puerto 5000)**
```bash
# Abrir terminal en VS Code
# Navegar al directorio backend
cd c:\Users\jzuta\proyectos\baloncestoteam\backend

# Instalar dependencias (si no está hecho)
npm install

# Iniciar servidor
npm start
# o
node server.js
```

**Salida esperada:**
```
🚀 Server running on port 5000
📚 API Documentation: http://localhost:5000/api/v1/docs
🏥 Health Check: http://localhost:5000/health
```

### 3. **Iniciar Frontend (Puerto 3000)**
```bash
# Abrir NUEVA terminal en VS Code
# Navegar al directorio frontend
cd c:\Users\jzuta\proyectos\baloncestoteam\frontend

# Instalar dependencias (si no está hecho)
npm install

# Iniciar servidor de desarrollo
npm start
```

**Salida esperada:**
```
Compiled successfully!
Local:            http://localhost:3000
On Your Network:  http://192.168.x.x:3000
```

## 🔧 Solución de Problemas

### ❌ Error: "ERR_CONNECTION_REFUSED"
**Causa:** Los servidores no están corriendo
**Solución:** Seguir los pasos 1, 2 y 3 arriba

### ❌ Error: "MongoDB connection failed"
**Causa:** MongoDB no está corriendo
**Solución:** 
- Iniciar MongoDB: `net start MongoDB`
- O usar MongoDB Atlas en la nube

### ❌ Error: "Port 5000 is already in use"
**Causa:** Otro proceso está usando el puerto
**Solución:** 
```bash
# Buscar proceso en puerto 5000
netstat -ano | findstr 5000
# Matar proceso (reemplazar PID)
taskkill /F /PID [PID_NUMBER]
```

### ❌ Error: "npm command not found"
**Causa:** Node.js no está instalado
**Solución:** Instalar Node.js desde https://nodejs.org/

## 📋 Checklist de Verificación

### ✅ **Pre-requisitos:**
- [ ] Node.js instalado
- [ ] MongoDB corriendo (local o Atlas)
- [ ] Dependencias instaladas en backend y frontend

### ✅ **Servidores funcionando:**
- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] Sin errores en terminales

### ✅ **URLs para probar:**
- [ ] Backend: http://localhost:5000/health
- [ ] Frontend: http://localhost:3000
- [ ] Jugadores: http://localhost:3000/players
- [ ] API docs: http://localhost:5000/api/v1/docs

## 🌐 URLs Finales para Revisar

Una vez que ambos servidores estén funcionando:

1. **Página Principal**: http://localhost:3000
2. **Lista de Jugadores**: http://localhost:3000/players
3. **Perfil de Jugador**: http://localhost:3000/players/[ID]
4. **API Health**: http://localhost:5000/health

## 🚨 Pasos Manuales Rápidos

### Para Backend:
1. Abrir terminal
2. `cd c:\Users\jzuta\proyectos\baloncestoteam\backend`
3. `node server.js`
4. Verificar que dice "Server running on port 5000"

### Para Frontend:
1. Abrir NUEVA terminal
2. `cd c:\Users\jzuta\proyectos\baloncestoteam\frontend`
3. `npm start`
4. Esperar a que abra navegador automáticamente

## 🎯 Resultado Esperado

Si todo funciona correctamente:
- Backend en puerto 5000 ✅
- Frontend en puerto 3000 ✅
- Navegador abre automáticamente ✅
- Puedes navegar entre jugadores ✅
- Todas las funcionalidades implementadas funcionan ✅

---

**¡Sigue estos pasos y deberías poder ver las vistas funcionando perfectamente!** 🚀
