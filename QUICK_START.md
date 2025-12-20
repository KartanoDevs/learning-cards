# 🚀 LEARNING CARDS - INSTRUCCIONES DE 1 PÁGINA

---

## ⚡ INICIO RÁPIDO - 3 PASOS

### 1️⃣ INSTALAR DOCKER DESKTOP
```
📥 Descarga: docker.com/products/docker-desktop
💿 Instala y reinicia el PC
✅ Abre Docker Desktop y espera a que inicie
```

### 2️⃣ CONSTRUIR (SOLO LA PRIMERA VEZ)
```powershell
# Abre PowerShell en: learning-cards/

> .\build_release.ps1 -Version "1.0.0"

⏱️ Espera 5-15 minutos
📦 Se crea automáticamente: release/
```

### 3️⃣ USAR CADA DÍA
```
📁 Carpeta: learning-cards/release/

▶️ Doble clic: START_APP.bat     → Inicia la app
🌐 Abre: http://localhost         → Usa la aplicación
⏸️ Doble clic: STOP_APP.bat      → Detén la app
```

---

## 📊 VERIFICAR QUE FUNCIONA

```powershell
# Ver contenedores (deben estar "healthy")
> docker ps

CONTAINER           STATUS
learning-cards-web  Up (healthy)
learning-cards-api  Up (healthy)
```

```
URLs de acceso:
✅ Frontend: http://localhost
✅ Backend:  http://localhost:4000/health
```

---

## ⚠️ PROBLEMAS COMUNES

### "Puerto 80 en uso"
```yaml
Archivo: release/docker-compose.yml
Busca: "80:80"
Cambia: "8080:80"
Acceso: http://localhost:8080
```

### "Docker no corriendo"
```
1. Abre Docker Desktop
2. Espera al ícono estático
3. Intenta de nuevo
```

### Backend "unhealthy"
```env
Archivo: release/.env
Verifica: MONGO_URI=mongodb+srv://...
Necesita: Internet activo
```

---

## 🗂️ ARCHIVOS IMPORTANTES

```
learning-cards/
│
├── build_release.ps1    🔨 Construir imágenes
├── .env                 ⚙️ Configuración MongoDB
│
└── release/             📦 Aplicación lista
    ├── START_APP.bat    ▶️ INICIAR
    ├── STOP_APP.bat     ⏸️ DETENER
    └── .env             ⚙️ Config producción
```

---

## 🔄 FLUJO COMPLETO

```
┌─────────────────────────────────────┐
│ PRIMERA VEZ (Solo 1 vez)            │
├─────────────────────────────────────┤
│ 1. Instalar Docker Desktop          │
│ 2. Ejecutar: build_release.ps1      │
│    ⏱️ Espera: 5-15 min              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ CADA DÍA                            │
├─────────────────────────────────────┤
│ 1. START_APP.bat       (30 seg)     │
│ 2. http://localhost    (usar app)   │
│ 3. STOP_APP.bat        (al terminar)│
└─────────────────────────────────────┘
```

---

## 🆘 COMANDOS DE AYUDA

```powershell
# Ver logs si hay errores
> docker logs learning-cards-api
> docker logs learning-cards-web

# Reiniciar contenedores
> cd release
> .\STOP_APP.bat
> .\START_APP.bat

# Limpiar todo Docker
> docker system prune -a
```

---

## ✅ CHECKLIST

```
REQUISITOS:
□ Docker Desktop instalado
□ Docker corriendo (icono estático)
□ .env configurado con MONGO_URI
□ Puertos 80 y 4000 libres

BUILD (1 VEZ):
□ PowerShell en: learning-cards/
□ Ejecutado: build_release.ps1
□ Carpeta release/ creada
□ 2 archivos .tar generados

USO DIARIO:
□ START_APP.bat ejecutado
□ http://localhost funciona
□ Aplicación corriendo OK
□ STOP_APP.bat al finalizar
```

---

## 🎯 RESUMEN

```
┌──────────────────────────────────┐
│ CONSTRUIR (1 VEZ)                │
│                                  │
│ build_release.ps1                │
│         ↓                        │
│   release/ creada                │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ USAR (CADA DÍA)                  │
│                                  │
│ START_APP.bat                    │
│         ↓                        │
│ http://localhost                 │
│         ↓                        │
│ STOP_APP.bat                     │
└──────────────────────────────────┘
```

---

## 🏗️ ARQUITECTURA SIMPLE

```
┌────────────┐
│  NAVEGADOR │
└──────┬─────┘
       │
       ▼
┌────────────┐    ┌───────────┐
│  FRONTEND  │───→│  BACKEND  │
│ (Angular)  │    │ (Node.js) │
│  Puerto 80 │    │ Puerto    │
└────────────┘    │   4000    │
                  └─────┬─────┘
                        │
                        ▼
                  ┌───────────┐
                  │  MongoDB  │
                  │   Atlas   │
                  │  (Nube)   │
                  └───────────┘
```

---

## 📞 CONTACTO & SOPORTE

```
Documentación completa:
📖 README.md
📖 README_DESPLIEGUE.md

Ayuda rápida:
> docker ps
> docker logs learning-cards-api
```

---

**🎉 ¡Todo listo para usar! 🚀**

```
✅ Aplicación funcionando
🌐 http://localhost
📚 Learning Cards activo
```
