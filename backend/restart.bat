@echo off
echo ========================================
echo   SPORTA BACKEND - REINICIO
echo ========================================
echo.

echo [1/3] Deteniendo procesos en puerto 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    echo Matando proceso %%a
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo.
echo [2/3] Verificando configuracion...
node test-server.js

echo.
echo [3/3] Iniciando servidor...
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm start
