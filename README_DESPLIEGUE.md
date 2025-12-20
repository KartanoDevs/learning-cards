# 🚀 LEARNING CARDS - Guía de Despliegue

## 📋 REQUISITOS PREVIOS

Antes de empezar, asegúrate de tener instalado:

### ✅ Software Necesario
- **Docker Desktop** (versión 20.10 o superior)
- **Windows 10/11** con PowerShell
- **8 GB RAM mínimo** recomendado
- **Puertos libres**: 80 (Frontend) y 4000 (Backend)

---

## 🎯 INSTALACIÓN INICIAL

### Paso 1️⃣ - Instalar Docker Desktop
1. Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop
2. Ejecuta el instalador
3. Reinicia el PC si se solicita
4. Abre Docker Desktop y espera a que inicie completamente
5. Verifica que el icono de Docker en la bandeja del sistema esté **sin animación**

### Paso 2️⃣ - Verificar Docker
Abre PowerShell y ejecuta:
```powershell
docker --version
```
Deberías ver algo como: `Docker version 29.0.1, build eedd969`

---

## 🔧 PREPARAR EL PROYECTO

### Paso 3️⃣ - Descargar o Clonar el Proyecto
1. Copia la carpeta completa del proyecto a tu PC
2. La estructura debe verse así:
```
learning-cards/
├── back/                   (Backend - API)
├── front/                  (Frontend - Angular)
├── release/                (Se generará automáticamente)
├── .env                    (Configuración)
├── build_release.ps1       (Script de construcción)
├── check_docker.ps1        (Verificar Docker)
└── docker-compose.prod.yml (Configuración Docker)
```

### Paso 4️⃣ - Configurar Variables de Entorno
1. Abre el archivo `.env` en la raíz del proyecto
2. Verifica que la variable `MONGO_URI` esté correctamente configurada:
```env
MONGO_URI=mongodb+srv://kartano92:IfTn9kojLZfeEwub@cards.dfcroyh.mongodb.net/vocab?retryWrites=true&w=majority&appName=cards
PORT=4000
NODE_ENV=production
CORS_ORIGIN=*
```

---

## 🏗️ CONSTRUCCIÓN DE LA APLICACIÓN

### Paso 5️⃣ - Verificar que Docker está Listo
Abre PowerShell en la carpeta del proyecto y ejecuta:
```powershell
.\check_docker.ps1
```

**¿Qué esperar?**
- ✅ Mensaje: "Docker está CORRIENDO correctamente"
- ❌ Si falla: Abre Docker Desktop y espera a que inicie

### Paso 6️⃣ - Construir las Imágenes Docker
Ejecuta el script de construcción:
```powershell
.\build_release.ps1 -Version "1.0.0"
```

**Este proceso:**
- ⏱️ Tarda entre **5-15 minutos** (según tu conexión y PC)
- 🔨 Compila el Backend (Node.js + TypeScript)
- 🔨 Compila el Frontend (Angular 19)
- 📦 Crea imágenes Docker optimizadas
- 💾 Genera archivos `.tar` en la carpeta `release/`

**Progreso esperado:**
```
>>> Verificando motor de Docker...
OK: Docker detectado
>>> Construyendo imagen del Backend...
OK: Backend construido
>>> Construyendo imagen del Frontend...
OK: Frontend construido
>>> Exportando imágenes a .tar...
OK: Imágenes exportadas
```

---

## 📦 CONTENIDO DE LA RELEASE

Después del build, encontrarás en `release/`:

```
release/
├── backend.tar           (~200-300 MB)
├── frontend.tar          (~150-200 MB)
├── docker-compose.yml    (Configuración de contenedores)
├── .env                  (Variables de entorno)
├── START_APP.bat         (🚀 INICIAR APLICACIÓN)
└── STOP_APP.bat          (🛑 DETENER APLICACIÓN)
```

---

## 🎮 USO DIARIO

### ▶️ INICIAR la Aplicación

**Método 1: Doble clic en el archivo**
1. Ve a la carpeta `release/`
2. Haz **doble clic** en `START_APP.bat`
3. Espera a que termine el proceso (30-60 segundos)
4. Se abrirá automáticamente tu navegador en `http://localhost`

**Método 2: Desde PowerShell**
```powershell
cd release
.\START_APP.bat
```

**¿Qué hace START_APP.bat?**
1. Carga las imágenes Docker (solo la primera vez)
2. Inicia los contenedores (Backend + Frontend)
3. Espera a que todo esté listo
4. Abre el navegador automáticamente

### ⏸️ DETENER la Aplicación

**Cuando termines de usar la app:**
1. Ve a la carpeta `release/`
2. Haz **doble clic** en `STOP_APP.bat`
3. Los contenedores se detendrán y liberarán recursos

---

## 🔍 VERIFICAR QUE TODO FUNCIONA

### Acceder a la Aplicación
- **Frontend (Web)**: http://localhost
- **Backend (API)**: http://localhost:4000/health
- **Health Check**: http://localhost:4000/health (Debe responder: `{"ok":true,"status":"healthy"}`)

### Ver Estado de los Contenedores
Abre PowerShell y ejecuta:
```powershell
docker ps
```

Deberías ver 2 contenedores corriendo:
```
CONTAINER ID   IMAGE                          STATUS
abc123def456   learning-cards-frontend:latest Up (healthy)
789ghi012jkl   learning-cards-backend:latest  Up (healthy)
```

### Ver Logs del Backend
Si hay problemas, revisa los logs:
```powershell
docker logs learning-cards-api
```

### Ver Logs del Frontend
```powershell
docker logs learning-cards-web
```

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### ❌ Error: "Puerto 80 ya está en uso"
**Causa:** Otro programa está usando el puerto 80 (XAMPP, IIS, Skype, etc.)

**Solución:**
1. Detén el programa que use el puerto 80, O
2. Edita `release/docker-compose.yml`:
```yaml
frontend:
  ports:
    - "8080:80"  # Cambia 80 por 8080
```
3. Accede en: http://localhost:8080

### ❌ Error: "Puerto 4000 ya está en uso"
**Causa:** Otro servicio usa el puerto 4000

**Solución:**
1. Edita `release/.env`:
```env
PORT=5000  # Cambia a otro puerto
```
2. Edita `release/docker-compose.yml`:
```yaml
backend:
  ports:
    - "5000:5000"  # Cambia ambos valores
```

### ❌ Backend "unhealthy" o no conecta a MongoDB
**Causa:** URI de MongoDB incorrecta o red bloqueada

**Solución:**
1. Verifica que `MONGO_URI` en `.env` sea correcto
2. Comprueba que tengas conexión a Internet
3. Verifica que tu firewall no bloquee Docker

### ❌ "Docker no está corriendo"
**Solución:**
1. Abre **Docker Desktop**
2. Espera a que el icono deje de animarse
3. Intenta de nuevo

---

## 🔄 ACTUALIZAR LA APLICACIÓN

Si hay una nueva versión:

1. **Detén** los contenedores actuales:
```powershell
cd release
.\STOP_APP.bat
```

2. **Reconstruye** las imágenes:
```powershell
cd ..
.\build_release.ps1 -Version "1.1.0"
```

3. **Inicia** la nueva versión:
```powershell
cd release
.\START_APP.bat
```

---

## 🗑️ DESINSTALAR / LIMPIAR

### Eliminar Contenedores
```powershell
docker-compose down
```

### Eliminar Imágenes
```powershell
docker rmi learning-cards-backend:latest
docker rmi learning-cards-frontend:latest
```

### Limpiar TODO Docker (⚠️ Cuidado)
```powershell
docker system prune -a
```

---

## 📞 COMANDOS ÚTILES DE DOCKER

### Ver todas las imágenes
```powershell
docker images
```

### Ver todos los contenedores (incluso detenidos)
```powershell
docker ps -a
```

### Reiniciar un contenedor específico
```powershell
docker restart learning-cards-api
docker restart learning-cards-web
```

### Entrar a un contenedor (para debugging)
```powershell
docker exec -it learning-cards-api sh
```

### Ver uso de recursos
```powershell
docker stats
```

---

## 📊 ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────┐
│           USUARIO (Navegador Web)               │
└─────────────────┬───────────────────────────────┘
                  │
                  │ HTTP (Puerto 80)
                  ▼
┌─────────────────────────────────────────────────┐
│  FRONTEND (Nginx + Angular)                     │
│  - Contenedor: learning-cards-web               │
│  - Puerto: 80                                   │
│  - Imagen: learning-cards-frontend:latest       │
└─────────────────┬───────────────────────────────┘
                  │
                  │ API Calls (Puerto 4000)
                  ▼
┌─────────────────────────────────────────────────┐
│  BACKEND (Node.js + Express + TypeScript)       │
│  - Contenedor: learning-cards-api               │
│  - Puerto: 4000                                 │
│  - Imagen: learning-cards-backend:latest        │
└─────────────────┬───────────────────────────────┘
                  │
                  │ MongoDB Driver
                  ▼
┌─────────────────────────────────────────────────┐
│  MONGODB ATLAS (Cloud Database)                 │
│  - Base de datos: vocab                         │
│  - Colecciones: groups, cards                   │
└─────────────────────────────────────────────────┘
```

---

## 🎯 CHECKLIST DE DESPLIEGUE

### Pre-Despliegue
- [ ] Docker Desktop instalado y corriendo
- [ ] PowerShell disponible
- [ ] Puertos 80 y 4000 libres
- [ ] Archivo `.env` configurado con `MONGO_URI` correcto
- [ ] Al menos 5 GB de espacio libre en disco

### Durante el Build
- [ ] Script `build_release.ps1` ejecutado sin errores
- [ ] Carpeta `release/` creada con todos los archivos
- [ ] Archivos `.tar` generados (backend.tar y frontend.tar)

### Post-Despliegue
- [ ] Contenedores corriendo: `docker ps` muestra 2 contenedores
- [ ] Estado "healthy" en ambos contenedores
- [ ] Frontend accesible en http://localhost
- [ ] Backend responde en http://localhost:4000/health
- [ ] Aplicación funciona correctamente

---

## 📚 RECURSOS ADICIONALES

- **Docker Documentation**: https://docs.docker.com/
- **Angular Documentation**: https://angular.dev/
- **Node.js Documentation**: https://nodejs.org/docs/
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/

---

## 📝 NOTAS IMPORTANTES

### 🔒 Seguridad
- El archivo `.env` contiene credenciales sensibles
- **NO compartas** el archivo `.env` públicamente
- Usa contraseñas fuertes para MongoDB

### 💾 Respaldos
- La base de datos está en MongoDB Atlas (en la nube)
- Los datos persisten aunque detengas los contenedores
- Considera hacer respaldos periódicos de MongoDB Atlas

### 🔄 Actualizaciones
- Frontend: Cambios en código Angular requieren `build_release.ps1`
- Backend: Cambios en código Node.js requieren `build_release.ps1`
- Variables `.env`: Solo reiniciar: `STOP_APP.bat` → `START_APP.bat`

---

## ✅ TODO LISTO

Si llegaste hasta aquí y todos los pasos funcionaron:

**¡FELICIDADES! 🎉**

Tu aplicación Learning Cards está corriendo en:
- **Frontend**: http://localhost
- **Backend**: http://localhost:4000

**Para uso diario:**
- Inicia: Doble clic en `release/START_APP.bat`
- Detén: Doble clic en `release/STOP_APP.bat`

**¡Disfruta de tu aplicación!** 🚀
