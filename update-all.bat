@echo off
echo Actualizando todas las páginas...
cd Public
node update-pages.js
echo.
echo ¡Actualización completada! Presiona cualquier tecla para salir.
pause > nul
