@echo off
echo 🎨 Basketball Team - Iniciando Frontend React
echo.
echo 📊 Configuración:
echo   - Puerto: 3000
echo   - API Backend: http://localhost:5000
echo   - Modo: development
echo.
echo 🔧 Limpiando caché y reinstalando dependencias...
cd /d "%~dp0frontend"
rmdir /s /q node_modules 2>nul
npm cache clean --force
npm install
echo.
echo 🚀 Iniciando aplicación React...
npm start
