# Resolucion de Problemas

## Problemas de Docker

### Backend no inicia / MongoTimeoutError
```bash
# Verificar estado de contenedores
docker compose ps

# Ver logs del backend
docker compose logs backend

# Verificar que MONGO_URI usa el nombre del servicio, no localhost
docker compose exec backend env | grep MONGO_URI
# Debe mostrar: MONGO_URI=mongodb://mongo:27017/basketball_team
```

### Datos desaparecen al reiniciar
**Causa**: El volumen `mongo_data` no estaba configurado.  
**Solucion actual**: El `docker-compose.yml` ya tiene el volumen `mongo_data` configurado. Verificar con `docker volume ls | grep mongo`.

### JWT_SECRET vacio — contenedor no levanta
```bash
# Verificar que .env existe y tiene el valor
cat .env | grep JWT_SECRET

# Si esta vacio, generar uno
openssl rand -base64 32
```

---

## Problemas de Frontend

### Error: "useAuth must be used within an AuthProvider"
**Causa**: El componente no estaba envuelto en `<AuthProvider>`.  
**Solucion**: `AuthProvider` ya esta integrado en `frontend/src/App.js` envolviendo todas las rutas. Si aparece este error, verificar que el componente afectado esta dentro del arbol de rutas de `App.js`.

### CORS — peticiones API bloqueadas en el navegador
1. Verificar configuracion CORS en `backend/server.js`
2. Verificar headers en `frontend/nginx.conf` (CSP y proxy headers)

---

## Problemas de CI/CD

### Tests fallan en GitHub Actions — DB no disponible
**Causa**: El workflow no tenia el servicio `mongodb` configurado.  
**Solucion**: Ya agregado en `.github/workflows/ci.yml` como servicio `mongodb`.

---

## Comandos de diagnostico rapido

```bash
# Estado general
docker compose ps

# Logs de todos los servicios
docker compose logs --tail=50

# Verificar conexion a DB desde backend
docker compose exec backend node -e "require('./config/db')()"

# Contar documentos (verificar datos reales)
docker compose exec mongo mongosh basketball_team --eval "db.players.countDocuments()"
```

---

Ver [HISTORY_AND_LEARNINGS.md](HISTORY_AND_LEARNINGS.md) para el historial completo de incidentes resueltos.  
Ver [ARCHITECTURE.md](ARCHITECTURE.md) para configuracion de entorno y despliegue.
