@echo off
echo 🏀 Iniciando Frontend - Basketball Team
echo.
cd /d "c:\Users\jzuta\proyectos\baloncestoteam\frontend"

echo 📋 Verificando que el backend esté corriendo...
curl -s http://localhost:5000/api/v1/players > nul
if %ERRORLEVEL% == 0 (
    echo ✅ Backend detectado en puerto 5000
) else (
    echo ❌ Backend no detectado. Inicia el backend primero.
    pause
    exit /b 1
)

echo.
echo 🚀 Iniciando React...
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
npm start
pause
