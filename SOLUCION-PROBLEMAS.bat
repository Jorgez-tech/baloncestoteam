@echo off
echo ========================================
echo  SOLUCION DE PROBLEMAS - BASKETBALL TEAM
echo ========================================

echo Paso 1: Instalando dependencias actualizadas...
cd /d "c:\Users\jzuta\proyectos\baloncestoteam\frontend"
call npm install

echo.
echo Paso 2: Iniciando Backend en puerto 5001...
cd /d "c:\Users\jzuta\proyectos\baloncestoteam\backend"
start "Backend Demo" cmd /k "node server-demo.js"

echo.
echo Paso 3: Esperando 5 segundos...
timeout /t 5 /nobreak >nul

echo.
echo Paso 4: Iniciando Frontend...
cd /d "c:\Users\jzuta\proyectos\baloncestoteam\frontend"
start "Frontend React" cmd /k "npm start"

echo.
echo ========================================
echo          PROBLEMAS SOLUCIONADOS
echo ========================================
echo.
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo Jugadores: http://localhost:3000/players
echo.
echo Si no funciona, revisar:
echo 1. Node.js version: node --version
echo 2. NPM version: npm --version
echo 3. Dependencias: npm install
echo.
pause
