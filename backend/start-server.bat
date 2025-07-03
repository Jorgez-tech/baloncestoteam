@echo off
echo 🏀 Basketball Team - Iniciador del Servidor
echo.

cd /d "c:\Users\jzuta\proyectos\baloncestoteam\backend"

echo 🔍 Verificando dependencias...
call npm install

echo.
echo 🧪 Probando conexión a la base de datos...
call node seed-db.js test

echo.
echo 🚀 Iniciando servidor backend...
echo 📱 Presiona Ctrl+C para detener el servidor
echo.

call npm run dev
