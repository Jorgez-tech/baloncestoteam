# Arquitectura y Despliegue - Basketball Team

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 17, React Router 6, Context API |
| Backend | Node.js 18, Express, JWT |
| Base de datos | MongoDB 6.0 (Docker) |
| Cache | Redis 7 (Docker) |
| Infraestructura | Docker Compose |

---

## Base de Datos

### Configuración

- **Nombre:** `basketball_team` (guion bajo, no guion medio)
- **Contenedor:** `basketball-mongo`
- **Puerto:** 27017 (expuesto al host)
- **Persistencia:** Volumen Docker `mongo_data`

> **PRODUCCION:** La base de datos contiene datos reales. NO ejecutar `seed-db.js` sin hacer backup previo. El script elimina todos los datos existentes.

### Diagrama de conexión

```
┌─────────────────────────────────────────┐
│   Docker Network (basketball-network)   │
│                                         │
│  ┌────────────────────────────────┐     │
│  │   Service: mongo               │     │
│  │   Container: basketball-mongo  │     │
│  │   Port: 27017                  │     │
│  └──────────────┬─────────────────┘     │
│                 │                        │
│                 ▼                        │
│  ┌────────────────────────────────┐     │
│  │   Service: backend             │     │
│  │   MONGO_URI:                   │     │
│  │   mongodb://mongo:27017/...    │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

### Conexión desde el backend (Docker)
```
MONGO_URI=mongodb://mongo:27017/basketball_team
```

### Conexión desde el host (MongoDB Compass, Studio 3T)
```
mongodb://localhost:27017/basketball_team
```

### Backup y restauración

```bash
# Crear backup
docker compose exec mongo mongodump --db basketball_team --out /dump
docker cp basketball-mongo:/dump ./backup_$(date +%Y%m%d)

# Restaurar backup
docker cp ./backup_folder basketball-mongo:/dump
docker compose exec mongo mongorestore --db basketball_team /dump/basketball_team
```

---

## Despliegue con Docker

### Prerrequisitos

- Docker Engine 20.10+
- Docker Compose V2

### Variables de entorno

```bash
# Generar un JWT_SECRET seguro
openssl rand -base64 32

# Copiar plantilla y configurar
cp .env.docker .env
```

Editar `.env` y establecer:
- `JWT_SECRET` — valor generado en el paso anterior (obligatorio)
- `FRONTEND_URL` — dominio de producción

> Nunca hacer commit del archivo `.env`. Ya está en `.gitignore`.

### Iniciar servicios

```bash
docker compose up -d --build
docker compose ps
```

Los 4 contenedores deben estar en estado `healthy`:
- `basketball-frontend`
- `basketball-backend`
- `basketball-redis`
- `basketball-mongo`

### Verificar despliegue

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api/v1 |
| API Docs | http://localhost:5000/api/v1/docs |
| Health Check | http://localhost:5000/health |

### Actualizar la aplicación

```bash
git pull origin main
docker compose down
docker compose up -d --build
```

### Ver logs

```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

---

## Checklist de producción

- [ ] `JWT_SECRET` configurado con valor seguro aleatorio
- [ ] `FRONTEND_URL` apunta al dominio de producción
- [ ] Volumen `mongo_data` verificado con datos persistentes
- [ ] Puertos únicamente 80/443 expuestos (firewall)
- [ ] Certificados SSL/TLS configurados (reverse proxy)
- [ ] Estrategia de backup de MongoDB activa
- [ ] Monitoreo de logs configurado
- [ ] Health checks pasando

## Reverse proxy (Nginx — ejemplo)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Troubleshooting rápido

| Problema | Comando de diagnóstico |
|---|---|
| Backend no inicia | `docker compose logs backend` |
| DB no conecta | `docker compose ps mongo` |
| JWT no funciona | `docker compose exec backend env \| grep JWT_SECRET` |

Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md) para soluciones detalladas.

---
**Ultima actualizacion**: Febrero 2026
