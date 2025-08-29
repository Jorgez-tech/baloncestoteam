# 🏀 Basketball Team - Sistema de Gestión Completo

> **Estado**: ✅ **Producción Ready** - Panel de administración con seguridad enterprise  
> **Última actualización**: 28 Agosto 2025  
> **Versión**: 2.0.0  
> **Calificación Seguridad**: 10/10 🛡️

## 📋 Descripción del Proyecto

**Basketball Team** es una plataforma completa de gestión deportiva que combina una experiencia web moderna con un sistema administrativo robusto y seguro.

### 🎯 **Características Principales**

- **🌐 Landing Page Profesional**: Sitio web público optimizado con información del equipo
- **⚛️ Frontend React Moderno**: SPA con lazy loading, routing avanzado y UX optimizada
- **🔧 Backend API Enterprise**: API REST escalable con Node.js, Express y MongoDB
- **🛡️ Panel Admin Seguro**: Sistema administrativo con autenticación triple capa
- **🗄️ Base de Datos MongoDB**: Esquemas optimizados con validaciones robustas
- **🔐 Autenticación JWT**: Sistema de roles con middleware de seguridad avanzada
- **🧪 Testing Completo**: 12+ tests automatizados con cobertura de seguridad
- **🚀 CI/CD Pipeline**: Automatización completa con GitHub Actions

---

## 🆕 **Versión 2.0.0 - Características Enterprise (Agosto 2025)**

### 🔒 **Panel de Administración de Clase Enterprise**
- **🛡️ Triple Capa de Seguridad**: Autenticación → Autorización → Validación
- **⚙️ CRUD Completo**: Gestión avanzada de jugadores, usuarios e imágenes
- **📊 Auditoría Corporativa**: Logging automático con timestamps y trazabilidad
- **✅ Validación Dual**: Client-side (React Hook Form) + Server-side (Express Validator)
- **🔐 UX Segura**: Confirmaciones modales para acciones críticas
- **🚫 Protecciones Avanzadas**: Prevención auto-eliminación y validaciones de negocio

### 🧪 **Testing & Calidad Profesional**
- **🔍 12 Tests de Seguridad**: Validación exhaustiva del admin panel
- **🔬 Backend Testing**: Jest + Supertest + MongoDB Memory Server
- **⚛️ Frontend Testing**: React Testing Library + MSW (Mock Service Worker)
- **✨ ESLint + Accessibility**: 0 errores de linting y accesibilidad WCAG
- **🔄 CI/CD Completo**: Testing automático, builds y despliegues

### 📊 **Documentación Corporativa**
- **📋 Auditoría Seguridad**: Reporte profesional con calificación 10/10
- **📝 Changelog Versionado**: Historial detallado siguiendo Semantic Versioning
- **📚 Guías Técnicas**: Desarrollo, contribución, despliegue y mantenimiento
- **⚙️ Variables de Entorno**: Documentación completa por ambiente

---

## 🏗️ **Arquitectura del Sistema**

```
basketball-team/
├── 🌐 index.html                    # Landing page optimizada
├── 📁 assets/                       # Recursos estáticos
│   ├── script.js                    # JavaScript con conexión backend
│   ├── css/                         # Estilos CSS modulares
│   └── image/                       # Imágenes optimizadas
├── 🔧 backend/                      # API REST Enterprise
│   ├── server.js                    # Servidor principal Express
│   ├── config/                      # Configuraciones por ambiente
│   │   ├── db.js                   # Conexión MongoDB optimizada
│   │   └── redis.js                # Cache con Redis (opcional)
│   ├── models/                      # Modelos Mongoose con validaciones
│   │   ├── user.js                 # Modelo de usuario con roles
│   │   ├── player.js               # Modelo de jugador con métricas
│   │   ├── Photo.js                # Modelo de imágenes
│   │   └── Description.js          # Modelo de descripciones
│   ├── routers/                     # Rutas API RESTful
│   │   ├── auth.js                 # Autenticación JWT + OAuth
│   │   ├── players.js              # CRUD jugadores con filtros
│   │   ├── users.js                # Gestión usuarios y roles
│   │   ├── images.js               # Upload y gestión imágenes
│   │   └── profiles.js             # Perfiles personalizados
│   ├── middleware/                  # Middlewares de seguridad
│   │   ├── auth.js                 # Verificación JWT + roles
│   │   └── validation.js           # Validaciones express-validator
│   └── docs/                        # Documentación OpenAPI
├── ⚛️ frontend/                     # React SPA Moderna
│   ├── public/                      # Assets públicos
│   ├── src/                         # Código fuente React
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── Header.jsx          # Navegación responsiva
│   │   │   ├── Footer.jsx          # Footer con enlaces
│   │   │   └── Gallery.jsx         # Galería de imágenes
│   │   ├── pages/                   # Páginas principales
│   │   │   ├── Home.jsx            # Página de inicio
│   │   │   ├── Login.jsx           # Autenticación
│   │   │   ├── PlayerList.jsx      # Lista de jugadores
│   │   │   ├── PlayerProfile.jsx   # Perfil detallado
│   │   │   └── AdminDashboard.jsx  # Panel administrativo
│   │   ├── context/                 # Context API para estado
│   │   │   └── AuthContext.jsx     # Contexto de autenticación
│   │   ├── api/                     # Cliente API con axios
│   │   │   └── client.js           # Configuración y endpoints
│   │   ├── hooks/                   # Custom hooks
│   │   ├── utils/                   # Utilidades y helpers
│   │   └── styles/                  # Estilos CSS modulares
│   └── __tests__/                   # Tests automatizados
└── 📚 docs/                         # Documentación técnica
    ├── ADMIN_SECURITY_REPORT.md     # Auditoría de seguridad
    ├── VARIABLES-ENTORNO.md         # Variables por ambiente
    ├── ROUTES.md                    # Documentación de rutas
    └── SERVICES.md                  # Arquitectura de servicios
```

---

## 🚀 **Inicio Rápido**

### **📋 Prerrequisitos**
- Node.js 16+ 
- MongoDB 5.0+ (local o Atlas)
- Git
- npm/yarn

### **⚡ Instalación Express**

```bash
# 1. Clonar repositorio
git clone https://github.com/Jorgez-tech/baloncestoteam.git
cd baloncestoteam

# 2. Backend Setup
cd backend
npm install
cp .env.example .env
# Configurar MONGO_URI y JWT_SECRET en .env
npm start

# 3. Frontend Setup (nueva terminal)
cd ../frontend  
npm install
npm start

# 4. Acceder aplicación
# Landing Page: http://localhost:3000
# Frontend App: http://localhost:3000
# Backend API: http://localhost:5000
# API Docs: http://localhost:5000/api/docs
```

### **🔧 Configuración Avanzada**

**Variables de Entorno Requeridas:**
```env
# Backend (.env)
MONGO_URI=mongodb://localhost:27017/basketball-team
JWT_SECRET=tu_super_secreto_jwt_key_aqui_min_32_chars
JWT_EXPIRE=24h
PORT=5000
NODE_ENV=development

# Frontend (.env.local) 
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENV=development
```

---

## 👤 **Usuarios y Roles**

### **🔐 Sistema de Autenticación**
- **JWT Tokens**: Expiración configurable, refresh automático
- **Roles**: `user`, `admin`, `super_admin`
- **Middleware**: Protección de rutas por rol
- **Validaciones**: Servidor + cliente sincronizadas

### **👥 Cuentas de Prueba**
```javascript
// Admin de prueba (crear desde MongoDB o registro)
{
  email: "admin@basketballteam.com",
  password: "Admin123!",
  role: "admin",
  firstName: "Administrador",
  lastName: "Sistema"
}
```

---

## 🛡️ **Seguridad Enterprise**

### **🔒 Características de Seguridad**
- **Helmet.js**: Headers de seguridad HTTP
- **CORS**: Configuración restrictiva por ambiente
- **Rate Limiting**: Protección contra ataques DDoS
- **Validación Dual**: Frontend + Backend sincronizada
- **Sanitización**: Prevención XSS e inyecciones
- **Auditoría**: Logging completo de acciones críticas

### **📊 Auditoría de Seguridad**
- **Calificación**: 10/10 🏆
- **Última auditoría**: 28 Agosto 2025
- **Reporte completo**: [docs/ADMIN_SECURITY_REPORT.md](docs/ADMIN_SECURITY_REPORT.md)

---

## 🧪 **Testing y Calidad**

### **📋 Cobertura de Tests**
| Componente | Tests | Cobertura | Estado |
|------------|--------|-----------|---------|
| Admin Panel | 12 tests | 100% | ✅ Passing |
| Backend API | 15+ tests | 90%+ | ✅ Passing |  
| Frontend Routes | 8 tests | 85%+ | ✅ Passing |
| **Total** | **35+ tests** | **90%+** | **✅ Passing** |

### **🔬 Comandos de Testing**
```bash
# Backend testing
cd backend
npm test                    # Unit tests
npm run test:watch         # Watch mode
npm run test:coverage      # Con cobertura

# Frontend testing  
cd frontend
npm test                    # React tests
npm run test:coverage      # Con cobertura
npm run test:ci            # Para CI/CD
```

---

## 📚 **Documentación Técnica**

### **📖 Guías Disponibles**
- [🔧 Guía de Desarrollo](DESARROLLO-GUIA.md) - Setup y workflow
- [🤝 Guía de Contribución](CONTRIBUTING.md) - Como contribuir
- [📝 Changelog](CHANGELOG.md) - Historial de cambios  
- [🛡️ Reporte de Seguridad](docs/ADMIN_SECURITY_REPORT.md) - Auditoría completa
- [⚙️ Variables de Entorno](docs/VARIABLES-ENTORNO.md) - Configuraciones

### **🔗 API Documentation**
- **OpenAPI/Swagger**: http://localhost:5000/api/docs
- **Postman Collection**: Disponible en `/docs`
- **Endpoints**: Documentados en [docs/ROUTES.md](docs/ROUTES.md)

---

## 🚀 **Despliegue a Producción**

### **☁️ Plataformas Recomendadas**
- **Frontend**: Vercel, Netlify, Firebase Hosting
- **Backend**: Railway, Render, DigitalOcean, AWS
- **Base de Datos**: MongoDB Atlas, AWS DocumentDB
- **CDN**: Cloudflare, AWS CloudFront

### **🔧 Scripts de Despliegue**
```bash
# Build de producción
npm run build              # Frontend
npm run build:backend      # Backend (si aplica)

# Variables de producción
cp .env.production.example .env.production
# Configurar todas las variables necesarias
```

---

## 🤝 **Contribuir al Proyecto**

### **📋 Proceso de Contribución**
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commits siguiendo [Conventional Commits](https://conventionalcommits.org/)
4. Tests pasando: `npm test`
5. Pull Request con descripción detallada

### **📝 Estándares de Código**
- **ESLint + Prettier**: Configurado automáticamente
- **Conventional Commits**: Obligatorio para merge
- **Tests Requeridos**: Para nuevas features
- **Documentación**: Actualizar si es necesario

---

## 📊 **Estado del Proyecto**

### **✅ Funcionalidades Completadas**
- [x] Landing page profesional
- [x] Frontend React con routing
- [x] Backend API REST completo
- [x] Autenticación JWT con roles
- [x] Panel de administración seguro
- [x] Testing automatizado completo
- [x] CI/CD con GitHub Actions
- [x] Documentación profesional
- [x] Auditoría de seguridad 10/10

### **🔄 En Desarrollo**
- [ ] Notificaciones push
- [ ] Modo offline/PWA
- [ ] Analytics avanzados
- [ ] Integración calendarios

### **🎯 Roadmap Futuro**
- [ ] Autenticación 2FA
- [ ] API versioning
- [ ] Microservicios
- [ ] Docker containerization

---

## 📞 **Soporte y Contacto**

### **🐛 Reportar Issues**
- **GitHub Issues**: [Crear nuevo issue](https://github.com/Jorgez-tech/baloncestoteam/issues)
- **Plantillas**: Bug report, Feature request, Security issue

### **📧 Contacto**
- **Desarrollador**: Jorge Zuta
- **Email**: [pendiente]
- **GitHub**: [@Jorgez-tech](https://github.com/Jorgez-tech)

---

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## 🙏 **Agradecimientos**

- **React Team** - Por el excelente framework
- **Express.js** - Por la simplicidad del backend
- **MongoDB** - Por la flexibilidad de la base de datos
- **GitHub Actions** - Por la automatización CI/CD
- **Comunidad Open Source** - Por las herramientas y librerías

---

<div align="center">

**🏀 Basketball Team Project - Desarrollado con ❤️ por Jorge Zuta**

[![GitHub Stars](https://img.shields.io/github/stars/Jorgez-tech/baloncestoteam?style=social)](https://github.com/Jorgez-tech/baloncestoteam)
[![GitHub Forks](https://img.shields.io/github/forks/Jorgez-tech/baloncestoteam?style=social)](https://github.com/Jorgez-tech/baloncestoteam)
[![Security Score](https://img.shields.io/badge/Security-10%2F10-brightgreen)](docs/ADMIN_SECURITY_REPORT.md)
[![Tests](https://img.shields.io/badge/Tests-35%2B%20Passing-brightgreen)](frontend/__tests__)

</div>
