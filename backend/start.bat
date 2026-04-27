@echo off
echo ========================================
echo   SPORTA BACKEND - INICIO RAPIDO
echo ========================================
echo.

echo [1/3] Verificando configuracion...
node test-server.js

echo.
echo [2/3] Iniciando servidor...
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm start
