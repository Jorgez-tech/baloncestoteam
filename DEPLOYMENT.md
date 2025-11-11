# 🚀 Deployment Guide - Basketball Team Application

## Prerequisites for Production Deployment

- Docker Engine 20.10+
- Docker Compose V2
- A secure JWT secret key

## 🔐 Security Configuration (REQUIRED)

### 1. Generate a Secure JWT Secret

```bash
# Generate a secure random secret
openssl rand -base64 32
```

### 2. Create Environment File

Copy the example file and add your secure values:

```bash
cp .env.docker .env
```

Edit `.env` and set:
- `JWT_SECRET` - Use the generated secret from step 1 (REQUIRED)
- `FRONTEND_URL` - Your production domain (e.g., https://yourdomain.com)
- Other optional values as needed

⚠️ **IMPORTANT**: Never commit the `.env` file to version control. It's already in `.gitignore`.

## 🐳 Deployment Steps

### 1. Ensure `.env` is configured

```bash
# Verify your .env file exists and has JWT_SECRET
cat .env | grep JWT_SECRET
```

If JWT_SECRET is empty or missing, Docker Compose will fail to start.

### 2. Build and Start Services

```bash
# Build images and start all services
docker compose up -d --build

# Check service health
docker compose ps
```

### 3. Populate Database (First Time Only)

```bash
# Run database seed
docker compose exec backend node seed-db.js seed
```

This creates:
- 1 admin user
- 3 test player users
- 3 sample players

### 4. Verify Deployment

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1
- API Docs: http://localhost:5000/api/v1/docs
- Health Check: http://localhost:5000/health

## 🔄 Production Updates

### Update Application Code

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose down
docker compose up -d --build
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### Backup Database

```bash
# Backup MongoDB data
docker compose exec mongo mongodump --db basketball-team --out /dump

# Copy backup to host
docker cp basketball-mongo:/dump ./mongodb-backup-$(date +%Y%m%d)
```

## 🛡️ Production Checklist

- [ ] JWT_SECRET is set to a secure random value
- [ ] FRONTEND_URL points to your production domain
- [ ] MongoDB data is persisted in Docker volume
- [ ] Firewall rules are configured (only expose ports 80/443)
- [ ] SSL/TLS certificates are configured (use reverse proxy like Nginx)
- [ ] Backup strategy is in place for MongoDB volume
- [ ] Log monitoring is configured
- [ ] Health checks are passing

## 🌐 Reverse Proxy Configuration (Recommended)

For production, use Nginx or Traefik as reverse proxy:

```nginx
# Example Nginx configuration
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

## 🐛 Troubleshooting

### Backend unhealthy

```bash
# Check logs
docker compose logs backend

# Verify environment variables
docker compose exec backend env | grep JWT_SECRET
```

### Cannot login or create users

- Verify JWT_SECRET is set and not empty
- Check backend logs for authentication errors

### Database connection issues

```bash
# Verify MongoDB is healthy
docker compose ps mongo

# Check connection
docker compose exec backend node -e "require('./config/db')()"
```

## 📞 Support

For issues or questions, check:
- `DESARROLLO-GUIA.md` - Development guide
- `README.md` - Project overview
- GitHub Issues

---

**Last Updated**: November 11, 2025
