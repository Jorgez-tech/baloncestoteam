# 🔧 Git & GitHub - Comandos Útiles

## 📋 Comandos Básicos de Git

### Estado y configuración
```bash
# Ver estado del repositorio
git status

# Ver configuración actual
git config --list

# Configurar usuario (primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Agregar y commitear cambios
```bash
# Agregar todos los archivos
git add .

# Agregar archivo específico
git add archivo.js

# Hacer commit con mensaje
git commit -m "Descripción del cambio"

# Commit con mensaje detallado
git commit -m "Título del commit

Descripción más detallada de los cambios realizados.
- Cambio 1
- Cambio 2"
```

### Trabajar con ramas
```bash
# Ver todas las ramas
git branch -a

# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Cambiar de rama
git checkout main

# Fusionar rama
git merge feature/nueva-funcionalidad

# Eliminar rama local
git branch -d feature/nueva-funcionalidad
```

### Sincronizar con GitHub
```bash
# Subir cambios
git push origin main

# Descargar cambios
git pull origin main

# Ver repositorios remotos
git remote -v

# Agregar repositorio remoto
git remote add origin https://github.com/usuario/repositorio.git
```

## 🌟 Comandos Avanzados

### Historial y diferencias
```bash
# Ver historial de commits
git log --oneline

# Ver cambios en archivos
git diff

# Ver cambios en staging
git diff --staged

# Ver historial de un archivo
git log --follow archivo.js
```

### Deshacer cambios
```bash
# Deshacer cambios en archivo (no commiteado)
git checkout -- archivo.js

# Quitar archivo del staging
git reset HEAD archivo.js

# Volver al commit anterior (¡cuidado!)
git reset --hard HEAD~1

# Crear commit que deshace cambios
git revert HEAD
```

### Trabajar con stash
```bash
# Guardar cambios temporalmente
git stash

# Ver lista de stash
git stash list

# Recuperar último stash
git stash pop

# Aplicar stash específico
git stash apply stash@{0}
```

## 🚀 Flujo de Trabajo Recomendado

### Para nuevas funcionalidades:
```bash
# 1. Actualizar rama principal
git checkout main
git pull origin main

# 2. Crear rama para funcionalidad
git checkout -b feature/nombre-funcionalidad

# 3. Hacer cambios y commits
git add .
git commit -m "Implementar nueva funcionalidad"

# 4. Subir rama a GitHub
git push origin feature/nombre-funcionalidad

# 5. Crear Pull Request en GitHub
# 6. Después de aprobación, fusionar
git checkout main
git merge feature/nombre-funcionalidad
git push origin main

# 7. Limpiar rama
git branch -d feature/nombre-funcionalidad
git push origin --delete feature/nombre-funcionalidad
```

### Para hotfixes:
```bash
# 1. Crear rama desde main
git checkout main
git checkout -b hotfix/descripcion-problema

# 2. Hacer fix y commit
git add .
git commit -m "Fix: descripción del problema"

# 3. Subir y crear PR urgente
git push origin hotfix/descripcion-problema
```

## 🔄 Scripts de Automatización

### Script de commit rápido:
```bash
# Windows (quick-commit.cmd)
@echo off
git add .
set /p message="Mensaje del commit: "
git commit -m "%message%"
git push

# Linux/Mac (quick-commit.sh)
#!/bin/bash
git add .
echo -n "Mensaje del commit: "
read message
git commit -m "$message"
git push
```

### Script de sincronización:
```bash
# sync.cmd (Windows)
@echo off
echo Descargando cambios...
git pull origin main
echo Subiendo cambios locales...
git push origin main
echo Sincronizacion completa!
```

## 📱 Comandos para este Proyecto

### Desarrollo diario:
```bash
# Actualizar y trabajar
git pull
git checkout -b feature/nueva-funcionalidad

# Después de desarrollar
git add .
git commit -m "feat: descripción de la funcionalidad"
git push origin feature/nueva-funcionalidad
```

### Deploy a producción:
```bash
# Merge a main
git checkout main
git merge feature/nueva-funcionalidad
git tag -a v1.0.1 -m "Versión 1.0.1"
git push origin main --tags
```

## ⚠️ Buenas Prácticas

### Mensajes de commit:
- `feat:` para nuevas funcionalidades
- `fix:` para corrección de bugs
- `docs:` para documentación
- `style:` para cambios de estilo/formato
- `refactor:` para refactorización
- `test:` para tests
- `chore:` para tareas de mantenimiento

### Estructura de ramas:
- `main`: código de producción
- `develop`: código en desarrollo
- `feature/nombre`: nuevas funcionalidades
- `hotfix/nombre`: correcciones urgentes
- `release/version`: preparación de versiones

---

## 🆘 Comandos de Emergencia

### Si algo sale mal:
```bash
# Ver qué ha pasado
git log --oneline
git status

# Volver al último estado estable
git reset --hard HEAD

# Si necesitas ayuda
git help comando
```

### Contacto del proyecto:
- **Repositorio**: https://github.com/Jorgez-tech/baloncestoteam
- **Issues**: Reportar problemas en GitHub
- **Documentación**: Ver README.md
