@echo off
echo 🏀 Basketball Team - Sistema Completo
echo ================================================
echo.
echo 🚀 Iniciando Backend y Frontend automáticamente...
echo.

echo 📋 Verificando MongoDB...
echo    Asegúrate de que MongoDB esté corriendo en: mongodb://localhost:27017
echo.

echo 🔧 Paso 1: Iniciando Backend...
cd /d "c:\Users\jzuta\proyectos\baloncestoteam\backend"
start cmd /k "echo ⚡ BACKEND INICIANDO... && echo. && npm install && echo. && echo ✅ Backend ejecutándose en: http://localhost:5000 && echo 📊 API disponible en: http://localhost:5000/api/v1 && echo 📚 Documentación: http://localhost:5000/api-docs && echo. && npm run dev"

echo ⏱️  Esperando 10 segundos para que el backend se inicie...
timeout /t 10 /nobreak > nul

echo 🔧 Paso 2: Iniciando Frontend...
cd /d "c:\Users\jzuta\proyectos\baloncestoteam\frontend"
start cmd /k "echo ⚡ FRONTEND INICIANDO... && echo. && npm install && echo. && echo ✅ Frontend ejecutándose en: http://localhost:3000 && echo 🔗 Conectado al backend: http://localhost:5000 && echo. && echo 🔐 CREDENCIALES DE PRUEBA: && echo    Admin: admin@basketballteam.com / admin123 && echo    Jugador: player1@basketballteam.com / player123 && echo. && npm start"

echo.
echo ================================================
echo 🎉 SISTEMA INICIADO EXITOSAMENTE
echo ================================================
echo.
echo 🌐 URLs disponibles:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo    API:      http://localhost:5000/api/v1
echo    Docs:     http://localhost:5000/api-docs
echo.
echo 🔐 Credenciales de prueba:
echo    Admin:    admin@basketballteam.com / admin123
echo    Jugador:  player1@basketballteam.com / player123
echo.
echo 📱 INSTRUCCIONES:
echo 1. Espera a que ambas ventanas terminen de cargar
echo 2. Ve a http://localhost:3000 en tu navegador
echo 3. Usa las credenciales de arriba para hacer login
echo 4. Prueba las funcionalidades de admin y jugador
echo.
echo ⚠️  NOTA: Si MongoDB no está corriendo, inicia MongoDB primero
echo.
pause
