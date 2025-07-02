@echo off
echo.
echo =============================================
echo    Basketball Team - Git Helper Script
echo =============================================
echo.

:menu
echo Selecciona una opcion:
echo.
echo 1. Ver estado del repositorio (git status)
echo 2. Agregar todos los cambios (git add .)
echo 3. Hacer commit interactivo
echo 4. Subir cambios a GitHub (git push)
echo 5. Ver historial de commits (git log)
echo 6. Ver ramas (git branch)
echo 7. Crear nueva rama
echo 8. Cambiar de rama
echo 9. Ver diferencias (git diff)
echo 0. Salir
echo.
set /p choice="Ingresa tu opcion (0-9): "

if "%choice%"=="1" goto status
if "%choice%"=="2" goto add
if "%choice%"=="3" goto commit
if "%choice%"=="4" goto push
if "%choice%"=="5" goto log
if "%choice%"=="6" goto branch
if "%choice%"=="7" goto newbranch
if "%choice%"=="8" goto checkout
if "%choice%"=="9" goto diff
if "%choice%"=="0" goto exit
goto invalid

:status
echo.
echo === Estado del repositorio ===
git status
echo.
pause
goto menu

:add
echo.
echo === Agregando archivos ===
git add .
echo Archivos agregados exitosamente!
echo.
pause
goto menu

:commit
echo.
echo === Hacer commit ===
git status
echo.
set /p message="Ingresa el mensaje del commit: "
git commit -m "%message%"
echo.
pause
goto menu

:push
echo.
echo === Subiendo cambios a GitHub ===
git push
echo.
if %ERRORLEVEL% EQU 0 (
    echo Cambios subidos exitosamente!
) else (
    echo Error al subir cambios. Verifica tu conexion y credenciales.
)
echo.
pause
goto menu

:log
echo.
echo === Historial de commits ===
git log --oneline -10
echo.
pause
goto menu

:branch
echo.
echo === Ramas del repositorio ===
git branch -a
echo.
pause
goto menu

:newbranch
echo.
set /p branchname="Ingresa el nombre de la nueva rama: "
git checkout -b %branchname%
echo Rama '%branchname%' creada y activada!
echo.
pause
goto menu

:checkout
echo.
echo === Ramas disponibles ===
git branch
echo.
set /p branchname="Ingresa el nombre de la rama: "
git checkout %branchname%
echo.
pause
goto menu

:diff
echo.
echo === Diferencias en archivos ===
git diff
echo.
pause
goto menu

:invalid
echo.
echo Opcion invalida. Por favor, selecciona un numero del 0 al 9.
echo.
pause
goto menu

:exit
echo.
echo Gracias por usar el Git Helper!
echo.
pause
exit
