@echo off
echo ========================================
echo     BASKETBALL TEAM - INICIO RAPIDO
echo ========================================
echo.

echo 1. Iniciando servidor backend...
echo.
cd /d "c:\Users\jzuta\proyectos\baloncestoteam\backend"
start "Backend Server" cmd /k "node server-demo.js"

echo 2. Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo 3. Iniciando servidor frontend...
echo.
cd /d "c:\Users\jzuta\proyectos\baloncestoteam\frontend"
start "Frontend Server" cmd /k "npm start"

echo 4. Esperando que se abra el navegador...
timeout /t 5 /nobreak >nul

echo 5. Abriendo navegador...
start http://localhost:3000

echo.
echo ========================================
echo   SERVIDORES INICIADOS EXITOSAMENTE
echo ========================================
echo.
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
