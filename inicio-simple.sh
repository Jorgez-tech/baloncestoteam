#!/bin/bash

echo "==================================="
echo "  BASKETBALL TEAM - INICIO SIMPLE"
echo "==================================="
echo ""

echo "1. Iniciando Backend Demo..."
cd "c:/Users/jzuta/proyectos/baloncestoteam/backend"
start "" cmd /c "node server-demo.js & pause"

echo "2. Esperando 3 segundos..."
sleep 3

echo "3. Iniciando Frontend..."
cd "c:/Users/jzuta/proyectos/baloncestoteam/frontend"
start "" cmd /c "npm start"

echo "4. Abriendo navegador..."
sleep 5
start "http://localhost:3000"

echo ""
echo "==================================="
echo "     SERVIDORES INICIADOS"
echo "==================================="
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:3000"
echo "Jugadores: http://localhost:3000/players"
echo ""
