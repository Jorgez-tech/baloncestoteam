# 🏀 Basketball Team - Proyecto Completo

> **Estado del Proyecto**: ✅ **Completado** - Panel de administración con seguridad avanzada implementado  
> **Última actualización**: 17 Agosto 2025  
> **Versión**: 2.0.0

## 📖 Descripción del Proyecto

Este es un proyecto completo para la gestión de un equipo de baloncesto que incluye:

- **Landing Page** (HTML/CSS/JS): Sitio web público con información del equipo
- **Frontend React**: Aplicación web interactiva para gestión de jugadores
- **Backend API**: API REST con Node.js, Express y MongoDB
- **Panel de Administración**: Sistema seguro para gestión completa
- **Base de datos**: MongoDB para almacenar información de usuarios y jugadores
- **Autenticación**: Sistema JWT con middleware de seguridad avanzada
- **Testing**: Cobertura completa con tests automatizados

## � Nuevas Características (Agosto 2025)

### 🔒 **Panel de Administración Seguro**
- **Control de acceso triple capa**: Autenticación + Roles + Validación
- **CRUD completo**: Gestión de jugadores y usuarios
- **Auditoría avanzada**: Logging automático de todas las acciones admin
- **Validación robusta**: Client-side y server-side
- **Confirmaciones de seguridad**: Para todas las acciones destructivas

### 🧪 **Testing Automatizado**
- **12 tests de seguridad**: Validación completa del admin panel
- **Cobertura backend**: Jest + Supertest + MongoDB Memory Server
- **Frontend testing**: React Testing Library + MSW
- **CI/CD**: GitHub Actions con testing automático

### 📋 **Documentación de Seguridad**
- **ADMIN_SECURITY_REPORT.md**: Auditoría completa (calificación 10/10)
- **CHANGELOG.md**: Historial detallado de cambios
- **Guías actualizadas**: Desarrollo y contribución

---

## �🏗️ Arquitectura del Sistema

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

#### Autenticación y Seguridad
- ✅ Registro de usuarios con validación robusta (express-validator)
- ✅ Login con JWT tokens y expiración configurable
- ✅ Middleware de autenticación y autorización
- ✅ Validación de contraseñas seguras (mayúsculas, minúsculas, números, símbolos)
- ✅ Roles de usuario (admin/user)
- ✅ Endpoints de perfil y logout

#### Gestión de Jugadores
- ✅ CRUD completo de jugadores con validaciones
- ✅ Filtros por posición, altura, peso y búsqueda por nombre
- ✅ Paginación eficiente
- ✅ Validación de números únicos por equipo
- ✅ Estadísticas calculadas automáticamente

#### Subida de Archivos
- ✅ Upload de imágenes con validación de tipo
- ✅ Límites de tamaño configurables
- ✅ Metadatos de imágenes (título, descripción, categoría)
- ✅ Servicio de archivos estáticos

#### Seguridad y Calidad
- ✅ CORS configurado para múltiples orígenes
- ✅ Helmet para headers de seguridad HTTP
- ✅ Rate limiting por IP
- ✅ Validación robusta con express-validator
- ✅ Sanitización de datos de entrada
- ✅ Manejo de errores centralizado
- ✅ Tests completos con Jest y Supertest

### Frontend React

#### Arquitectura y Rendimiento
- ✅ React 17 con hooks y componentes funcionales
- ✅ Lazy loading con React.lazy y Suspense para optimización
- ✅ Code splitting automático por rutas
- ✅ Componente LoadingSpinner para estados de carga

#### Sistema de Autenticación
- ✅ Context API para estado de autenticación global
- ✅ ProtectedRoute para rutas que requieren autenticación
- ✅ Tokens JWT persistidos en localStorage
- ✅ Logout automático en token expirado

#### Navegación y Rutas
- ✅ React Router v6 con rutas anidadas
- ✅ Navegación programática
- ✅ Páginas de error 404 personalizadas
- ✅ Estructura organizada: /pages para vistas, /components para reutilizables

#### Gestión de Estado y API
- ✅ Context API para autenticación
- ✅ Cliente Axios configurado con interceptors
- ✅ Manejo de errores HTTP centralizado
- ✅ Loading states y error boundaries

#### Calidad y Testing
- ✅ ESLint y Prettier configurados
- ✅ Husky pre-commit hooks
- ✅ Tests con React Testing Library y Jest
- ✅ Mock Service Worker (MSW) para tests de API
- ✅ Test utilities personalizadas con providers
- ✅ Cobertura de tests configurada

#### Interfaz de Usuario
- ✅ Responsive design para móviles y desktop
- ✅ Formularios con validación client-side
- ✅ Estados de loading y error consistentes
- ✅ Navegación intuitiva con header y footer

## 🔧 DevOps y Automatización

### Control de Calidad
- ✅ **ESLint**: Linting configurado para frontend y backend
- ✅ **Prettier**: Formateo automático de código
- ✅ **Husky**: Pre-commit hooks para verificar calidad
- ✅ **Commitlint**: Validación de mensajes de commit convencionales

### Testing y Cobertura
- ✅ **Frontend**: Jest + React Testing Library + MSW
- ✅ **Backend**: Jest + Supertest + MongoDB Memory Server
- ✅ **Configuración de cobertura**: Scripts para medir coverage
- ✅ **Test utilities**: Helpers personalizados para testing

### CI/CD Pipeline
- ✅ **GitHub Actions**: Workflow automatizado
- ✅ **Build Matrix**: Testing en múltiples versiones de Node.js
- ✅ **Automated Testing**: Tests ejecutados en cada push/PR
- ✅ **Linting**: Verificación automática de código

### Configuración de Entornos
- ✅ **Variables de entorno**: Configuración para dev/test/prod
- ✅ **Archivos .env.example**: Templates para configuración
- ✅ **Documentación de variables**: Guía completa en VARIABLES-ENTORNO.md

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

## �️ Tecnologías Utilizadas

### Frontend
- **React 17**: Biblioteca de JavaScript para interfaces de usuario
- **React Router v6**: Enrutamiento declarativo para React
- **React.lazy + Suspense**: Code splitting y lazy loading
- **Axios**: Cliente HTTP para peticiones a la API
- **CSS3**: Estilos responsive con Flexbox y Grid

### Backend
- **Node.js**: Entorno de ejecución de JavaScript
- **Express.js**: Framework web minimalista y flexible
- **MongoDB + Mongoose**: Base de datos NoSQL con ODM
- **JSON Web Tokens (JWT)**: Autenticación stateless
- **Express-validator**: Validación robusta de datos
- **Bcrypt**: Hash seguro de contraseñas
- **Multer**: Manejo de uploads de archivos

### Seguridad
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso cross-origin
- **Express Rate Limit**: Limitación de peticiones
- **Validator**: Sanitización y validación de entrada

### Testing
- **Jest**: Framework de testing para JavaScript
- **React Testing Library**: Testing de componentes React
- **Supertest**: Testing de APIs HTTP
- **MSW (Mock Service Worker)**: Mocking de APIs
- **MongoDB Memory Server**: Base de datos en memoria para tests

### DevOps y Calidad
- **ESLint**: Linter para JavaScript/React
- **Prettier**: Formateador de código
- **Husky**: Git hooks para calidad de código
- **Commitlint**: Validación de mensajes de commit
- **GitHub Actions**: CI/CD pipeline

### Herramientas de Desarrollo
- **Nodemon**: Recarga automática en desarrollo
- **Concurrently**: Ejecución paralela de scripts
- **Dotenv**: Gestión de variables de entorno
- **OpenAPI/Swagger**: Documentación de API

## �🗄️ Modelos de Datos

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
- **Email**: jzuta309@gmail.com
- **GitHub**: Jorgez-tech
- **LinkedIn**: Jorge Zuta

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
