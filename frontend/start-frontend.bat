@echo off
echo 🏀 Basketball Team - Iniciando Frontend
echo.
echo 📂 Navegando al directorio frontend...
cd /d "c:\Users\jzuta\proyectos\baloncestoteam\frontend"

echo 🔧 Verificando dependencias...
call npm install

echo.
echo 🌐 Iniciando aplicación React...
echo ✅ Backend debe estar corriendo en: http://localhost:5000
echo 🖥️  Frontend se iniciará en: http://localhost:3000
echo.
echo 🔐 Credenciales para probar:
echo   Admin: admin@basketballteam.com / admin123
echo   Jugador: player1@basketballteam.com / player123
echo.
echo 📱 NOTA: Asegúrate de que el backend esté corriendo primero
echo    (ejecuta start-server.bat en la carpeta backend)
echo.
echo Presiona Ctrl+C para detener la aplicación
echo.

call npm start

pause
