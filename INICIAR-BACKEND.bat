@echo off
echo 🏀 Basketball Team - Iniciando Backend con MongoDB
echo.
echo 📊 Configuración:
echo   - Puerto: 5000
echo   - Base de datos: MongoDB (basketball_team)
echo   - Modo: development
echo.
cd /d "%~dp0backend"
echo 🚀 Iniciando servidor...
node server.js
