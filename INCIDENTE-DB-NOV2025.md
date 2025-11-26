# Reporte de Incidente - Base de Datos (11 Nov 2025)

## Resumen del Incidente

**Fecha**: 11 de Noviembre de 2025  
**Severidad**: Alta (Afortunadamente no se perdieron datos)  
**Tipo**: Error de configuración y suposiciones incorrectas  
**Estado**: Documentado y prevenido para el futuro

---

## Lo Que Pasó

### Error Cometido:
Durante la sesión de deployment con Docker, **asumí incorrectamente** que:
1. El proyecto no tenía base de datos existente
2. Necesitaba crear una DB nueva llamada `basketball-team`
3. Debía ejecutar el script `seed-db.js` para poblar datos
4. Los datos de prueba serían apropiados

### Realidad:
1. El proyecto tiene **1 año de desarrollo** (~desde enero 2025)
2. Existe una base de datos **real en producción**: `basketball_team`
3. Contiene **datos reales** creados el 2 de julio de 2025
4. Incluye 3 jugadores con avatares personalizados

---

## Análisis de Causa Raíz

### Por Qué Ocurrió:

1. **Falta de verificación inicial**
   - No consulté el estado de la base de datos antes de actuar
   - No pregunté sobre datos existentes

2. **Asunciones incorrectas**
   - Asumí que era un proyecto nuevo por el deployment de Docker
   - No consideré la historia del proyecto (1 año de desarrollo)

3. **Nombre de DB confuso**
   - MongoDB convierte `basketball-team` → `basketball_team` automáticamente
   - Esto causó confusión sobre cuál era la DB correcta

4. **Falta de documentación previa**
   - No había documento que indicara el estado de producción
   - No estaba claro qué datos eran reales vs. de prueba

---

## Impacto

### Impacto Real:
- **Datos NO se perdieron** (afortunadamente)
- Se creó confusión sobre qué DB usar
- Se propuso ejecutar seed que hubiera sobrescrito datos reales
- Pérdida de confianza en las sugerencias del asistente

### Impacto Potencial (Si se hubiera ejecutado seed):
- Pérdida de 3 jugadores con datos reales
- Pérdida de usuarios existentes
- Pérdida de ~5 meses de datos (julio → noviembre)
- Necesidad de restaurar desde backup (si existía)

---

## Acciones Correctivas Tomadas

### 1. Documentación Actualizada

#### Archivo: `.github/copilot-instructions.md`
- Agregadas **REGLAS CRÍTICAS** al inicio
- Documentado estado real de la base de datos
- Prohibido ejecutar seed-db.js sin confirmación
- Agregado checklist pre-sesión
- Documentados comandos de verificación (solo lectura)

#### Archivo: `docs/DATABASE_MANAGEMENT.md`
- Guía completa de gestión de base de datos
- Diferencias entre MongoDB local vs Atlas
- Procedimientos de backup
- Comandos de conexión correctos

#### Archivo: `RESOLUCION_PROBLEMAS.md`
- Documentación de problemas resueltos (AuthProvider, CSP)
- Proceso de validación
- Lecciones aprendidas

### 2. Cambios en el Proceso

**ANTES** (Incorrecto):
```
Usuario pide deployment → Asumo proyecto nuevo → Creo DB → Ejecuto seed
```

**DESPUÉS** (Correcto):
```
Usuario pide deployment
  ↓
Leer copilot-instructions.md
  ↓
Verificar estado actual (comandos de lectura)
  ↓
Preguntar al usuario sobre datos existentes
  ↓
Planificar cambios
  ↓
Obtener confirmación explícita
  ↓
Ejecutar cambios aprobados
  ↓
Validar resultados
```

---

## Lecciones Aprendidas

### Para el Asistente (Copilot):

1. **Siempre verificar primero**
   ```bash
   # SIEMPRE ejecutar ANTES de proponer cambios:
   docker compose exec mongo mongosh --eval "show dbs"
   docker compose exec mongo mongosh basketball_team --eval "db.players.countDocuments()"
   ```

2. **Preguntar, no asumir**
   - "¿Tienes datos existentes en la base de datos?"
   - "¿Este es un proyecto nuevo o existente?"
   - "¿Puedo ejecutar el script seed?"

3. **Leer instrucciones completas**
   - Siempre leer `.github/copilot-instructions.md` primero
   - Revisar documentación existente
   - Buscar archivos README, DEPLOYMENT, etc.

4. **Respetar datos de producción**
   - Nunca proponer seed sin confirmar
   - Siempre sugerir backup antes de cambios
   - Usar comandos de lectura primero

### Para el Usuario:

1. **Documentación es crítica**
   - Este incidente se pudo prevenir con mejor documentación inicial
   - Ahora existe: `.github/copilot-instructions.md` actualizado

2. **Comunicación clara**
   - Mencionar explícitamente: "tengo datos existentes"
   - Indicar antigüedad del proyecto
   - Especificar qué NO se debe tocar

3. **Backups regulares**
   - Considerar backups automáticos de MongoDB
   - Documentar procedimiento de restauración
   - Probar restauración periódicamente

---

## Medidas Preventivas

### Checklist Obligatorio Antes de Cada Sesión:

- [ ] Leer `.github/copilot-instructions.md` completo
- [ ] Ejecutar: `docker compose ps` (verificar servicios)
- [ ] Ejecutar: `docker compose exec mongo mongosh basketball_team --eval "db.players.countDocuments()"` (verificar datos)
- [ ] Revisar último commit: `git log --oneline -5`
- [ ] Preguntar objetivo de la sesión al usuario
- [ ] Si se menciona DB, preguntar sobre datos existentes

### Comandos Prohibidos Sin Confirmación:

```bash
# PROHIBIDO ejecutar sin confirmación explícita:
node seed-db.js seed
docker compose down -v  # Elimina volúmenes
db.collection.drop()
db.dropDatabase()
mongorestore --drop

# PERMITIDO (lectura):
db.collection.find()
db.collection.countDocuments()
show collections
show dbs
```

### Palabras Clave de Alerta:

Si el usuario menciona:
- "1 año de desarrollo"
- "datos existentes"
- "producción"
- "datos reales"
- "no toques X"

→ **DETENER** y pedir aclaraciones antes de continuar

---

## Estado Confirmado de la Base de Datos

### Base de Datos Real: `basketball_team`

**Verificado el**: 11 de Noviembre de 2025

```json
{
  "nombre": "basketball_team",
  "creacion": "2025-07-02",
  "colecciones": {
    "players": {
      "documentos": 3,
      "datos": [
        {
          "_id": "6864e33cdc46aea7191460a6",
          "name": "Juan Carlos Rodriguez",
          "position": "Point Guard",
          "height": 185,
          "weight": 78,
          "avatar": "/images/mj.jpg",
          "createdAt": "2025-07-02T07:43:56.415Z"
        },
        {
          "_id": "6864e33cdc46aea7191460a8",
          "name": "Miguel Angel Torres",
          "position": "Shooting Guard",
          "height": 190,
          "weight": 82,
          "avatar": "/images/hakeem.jpg",
          "createdAt": "2025-07-02T07:43:56.420Z"
        },
        {
          "_id": "6864e33cdc46aea7191460aa",
          "name": "Carlos Alberto Mendez",
          "position": "Center",
          "height": 205,
          "weight": 95,
          "avatar": "/images/dennis-rodman.jpg",
          "createdAt": "2025-07-02T07:43:56.425Z",
          "updatedAt": "2025-10-06T00:52:35.502Z"
        }
      ]
    },
    "users": {
      "documentos": "Desconocido - NO VERIFICADO"
    }
  }
}
```

---

## Próximos Pasos

### Inmediatos:
1. Documentación actualizada (completado)
2. Verificar que backend use `basketball_team` correctamente
3. Confirmar que no se creó DB duplicada
4. Crear backup de la DB actual

### A Mediano Plazo:
1. Implementar backups automáticos
2. Documentar esquemas de colecciones
3. Crear ambiente de staging separado
4. Configurar monitoring de DB

### A Largo Plazo:
1. Considerar migración a MongoDB Atlas (backups automáticos)
2. Implementar versionado de esquemas
3. Crear suite de tests de migración

---

## Notas Finales

Este incidente es un recordatorio importante de:
- **No asumir nunca el estado de un proyecto**
- **La documentación salva vidas (y datos)**
- **Preguntar siempre antes de ejecutar cambios destructivos**
- **Verificar primero, actuar después**

El proyecto ha estado en desarrollo durante **~1 año** y contiene **datos reales de producción**. Cualquier cambio debe ser tratado con extremo cuidado.

---

**Documento creado**: 11 de Noviembre de 2025  
**Autor**: Documentación post-incidente  
**Propósito**: Prevenir futuros errores similares  
**Estado**: Activo - Leer antes de cada sesión
