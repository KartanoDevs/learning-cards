@echo off
TITLE Learning Cards - Iniciando Sistema...
CLS

ECHO ========================================================
ECHO      LEARNING CARDS - SISTEMA DE DESPLIEGUE RAPIDO
ECHO ========================================================
ECHO.

:: 1. Comprobar si Docker está corriendo
docker info >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO [ERROR] Docker no parece estar funcionando.
    ECHO Por favor, abre "Docker Desktop" primero y espera a que arranque.
    ECHO.
    PAUSE
    EXIT
)

ECHO [OK] Docker detectado. Iniciando contenedores...
ECHO.

:: 2. Levantar los servicios (en segundo plano para no bloquear)
docker-compose up -d

IF %ERRORLEVEL% NEQ 0 (
    ECHO.
    ECHO [ERROR] Algo fallo al iniciar los contenedores.
    PAUSE
    EXIT
)

ECHO.
ECHO [EXITO] Sistema iniciado correctamente.
ECHO Abriendo navegador...

:: 3. Esperar unos segundos para asegurar que el servidor arranque
TIMEOUT /T 5 /NOBREAK >nul

:: 4. Abrir el navegador
START http://localhost

ECHO.
ECHO ========================================================
ECHO   Todo listo. Puedes minimizar esta ventana.
ECHO   Para detener todo, cierra Docker Desktop.
ECHO ========================================================
PAUSE
