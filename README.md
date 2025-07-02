# 🏀 Basketball Team - Proyecto Completo

## 📖 Descripción del Proyecto

Este es un proyecto completo para la gestión de un equipo de baloncesto que incluye:

- **Landing Page** (HTML/CSS/JS): Sitio web público con información del equipo
- **Frontend React**: Aplicación web interactiva para gestión de jugadores
- **Backend API**: API REST con Node.js, Express y MongoDB
- **Base de datos**: MongoDB para almacenar información de usuarios y jugadores
- **Autenticación**: Sistema JWT con middleware de seguridad

## 🏗️ Arquitectura del Sistema

```
basketball-team/
├── index.html              # Landing page principal
├── assets/                 # Recursos para landing page
│   ├── script.js           # JavaScript con conexión al backend
│   ├── css/               # Estilos CSS
│   └── image/             # Imágenes del equipo
├── backend/               # API REST con Node.js
│   ├── server.js          # Servidor principal
│   ├── config/            # Configuración de DB y Redis
│   ├── models/            # Modelos de datos (MongoDB)
│   ├── routers/           # Rutas de la API
│   ├── middleware/        # Middleware de autenticación
│   └── docs/              # Documentación OpenAPI
└── frontend/              # Aplicación React
    ├── src/
    │   ├── components/    # Componentes React
    │   ├── context/       # Context API para estado global
    │   └── styles/        # Estilos CSS
    └── public/
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- MongoDB (local o remoto)
- Git

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd baloncestoteam
```

### 2. Configurar el Backend

```bash
cd backend
npm install

# Copiar archivo de configuración
cp .env.example .env

# Editar variables de entorno en .env
nano .env
```

#### Variables de entorno requeridas:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/basketball_team

# JWT Configuration
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

### 4. Iniciar los servicios

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

#### Terminal 3 - Landing Page (opcional):
```bash
# Usar un servidor estático para el landing page
npx serve . -p 8080
```

## 📱 URLs del Proyecto

- **Landing Page**: http://localhost:8080
- **Frontend React**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Documentación API**: http://localhost:5000/api/v1/docs
- **Health Check**: http://localhost:5000/health

## 🔧 Características Principales

### Backend API

#### Autenticación
- ✅ Registro de usuarios con validación
- ✅ Login con JWT tokens
- ✅ Middleware de autenticación
- ✅ Blacklist de tokens (Redis)
- ✅ Roles de usuario (admin/user)

#### Gestión de Jugadores
- ✅ CRUD completo de jugadores
- ✅ Filtros y búsqueda
- ✅ Paginación
- ✅ Estadísticas de jugadores

#### Seguridad
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad
- ✅ Rate limiting
- ✅ Validación de datos
- ✅ Manejo de errores

### Frontend React

#### Componentes Principales
- ✅ Sistema de autenticación
- ✅ Dashboard de administración
- ✅ Lista de jugadores
- ✅ Galería de imágenes
- ✅ Formularios con validación

#### Características
- ✅ React Router para navegación
- ✅ React Query para gestión de estado
- ✅ Context API para autenticación
- ✅ Responsive design
- ✅ Notificaciones toast

### Landing Page

#### Secciones
- ✅ Hero section con call-to-action
- ✅ Galería de imágenes interactiva
- ✅ Lista de jugadores desde API
- ✅ Formulario de inscripción
- ✅ Footer con información de contacto

#### Funcionalidades
- ✅ Navegación suave
- ✅ Menú móvil responsive
- ✅ Animaciones CSS
- ✅ Conexión con backend API
- ✅ Sistema de notificaciones

## 📊 API Endpoints

### Autenticación
```http
POST /api/v1/auth/register    # Registro de usuario
POST /api/v1/auth/login       # Login
POST /api/v1/auth/logout      # Logout
GET  /api/v1/auth/profile     # Perfil del usuario
```

### Jugadores
```http
GET    /api/v1/players        # Lista de jugadores (paginada)
POST   /api/v1/players        # Crear jugador (requiere auth)
PUT    /api/v1/players/:id    # Actualizar jugador (requiere auth)
DELETE /api/v1/players/:id    # Eliminar jugador (requiere auth)
```

### Sistema
```http
GET /health                   # Health check
GET /api/v1/docs             # Documentación Swagger
```

## 🗄️ Modelos de Datos

### Usuario
```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Jugador
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: 'User'),
  position: String (required),
  height: Number (required),
  weight: Number (required),
  stats: {
    games_played: Number (default: 0),
    points_per_game: Number (default: 0),
    rebounds_per_game: Number (default: 0),
    assists_per_game: Number (default: 0)
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Backend
```bash
cd backend
npm test                     # Ejecutar tests
npm run test:watch          # Tests en modo watch
npm run test:coverage       # Coverage report
```

### Frontend
```bash
cd frontend
npm test                    # Ejecutar tests de React
npm run test:coverage       # Coverage report
```

## 🚀 Despliegue

### Backend (Heroku/Railway/DigitalOcean)

1. Configurar variables de entorno en producción
2. Configurar base de datos MongoDB (MongoDB Atlas)
3. Configurar Redis (Redis Cloud)
4. Deploy con:

```bash
# Heroku
git push heroku main

# Railway
railway up

# Docker
docker build -t basketball-backend .
docker run -p 5000:5000 basketball-backend
```

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# Deploy a Vercel
vercel --prod

# Deploy a Netlify
netlify deploy --prod --dir=build
```

## 📈 Métricas y Monitoreo

- **Health Check**: `/health` endpoint para monitoreo
- **Logs**: Console logs estructurados
- **Error Tracking**: Manejo global de errores
- **Performance**: Rate limiting y optimizaciones

## 🔒 Seguridad

### Implementado
- ✅ HTTPS en producción
- ✅ JWT tokens seguros
- ✅ Validación de entrada
- ✅ Rate limiting
- ✅ CORS apropiado
- ✅ Headers de seguridad

### Recomendaciones adicionales
- [ ] Implementar refresh tokens
- [ ] Audit logs
- [ ] Captcha en formularios
- [ ] 2FA para administradores

## 🤝 Contribución

### Flujo de trabajo

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de código

- **JavaScript**: ESLint + Prettier
- **Commits**: Conventional Commits
- **Testing**: Jest para backend, React Testing Library para frontend

## 📞 Soporte

### Contacto
- **Email**: tu@email.com
- **GitHub**: tu-usuario
- **LinkedIn**: tu-perfil

### Documentación adicional
- [API Documentation](http://localhost:5000/api/v1/docs)
- [Frontend Components](./frontend/README.md)
- [Backend Architecture](./backend/README.md)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🎯 Roadmap Futuro

### Corto plazo (1-2 meses)
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat entre jugadores
- [ ] Calendario de entrenamientos
- [ ] Sistema de reservas

### Mediano plazo (3-6 meses)
- [ ] App móvil React Native
- [ ] Sistema de estadísticas avanzadas
- [ ] Integración con redes sociales
- [ ] Sistema de pagos

### Largo plazo (6+ meses)
- [ ] IA para análisis de rendimiento
- [ ] Streaming de partidos
- [ ] E-commerce de merchandise
- [ ] Programa de afiliados

---

**¡Gracias por usar Basketball Team! 🏀**
