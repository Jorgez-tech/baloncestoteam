# 🛣️ Documentación Completa de Rutas - Basketball Team

> **Sistema de rutas** completo para la aplicación de gestión de equipos de baloncesto, incluyendo frontend React SPA y backend API REST con autenticación JWT.

---

## ⚛️ **Frontend Routes (React SPA)**

### 🌐 **Arquitectura de Routing**
- **React Router v6** - Navegación SPA moderna
- **Lazy Loading** - Carga diferida de componentes
- **Protected Routes** - Rutas protegidas por autenticación
- **Role-based Access** - Control de acceso por roles
- **404 Handling** - Páginas no encontradas

### 📍 **Mapa de Rutas Frontend**

| Ruta | Componente | Tipo | Descripción | Protección | Lazy |
|------|------------|------|-------------|------------|------|
| `/` | `HomePage` | Pública | Página principal del proyecto | ❌ | ✅ |
| `/gallery` | `Gallery` | Pública | Galería de imágenes del equipo | ❌ | ✅ |
| `/players` | `PlayerListPage` | Pública | Lista completa de jugadores | ❌ | ✅ |
| `/players/:id` | `PlayerProfilePage` | Pública | Perfil detallado de jugador | ❌ | ✅ |
| `/login` | `Login` | Solo no autenticados | Formulario de autenticación | 🔒 | ✅ |
| `/signup` | `Signup` | Solo no autenticados | Registro de nuevos usuarios | 🔒 | ✅ |
| `/profile` | `Profile` | Autenticado | Perfil del usuario logueado | 🔐 | ✅ |
| `/admin` | `AdminDashboard` | Solo Admin | Panel administrativo completo | 👑 | ✅ |
| `*` | `NotFound` | Pública | Página 404 - No encontrada | ❌ | ❌ |

### 🔐 **Sistema de Protección de Rutas**

#### **ProtectedRoute** - Autenticación Requerida
```jsx
// Componente para rutas que requieren autenticación
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } 
/>

// Lógica de protección
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
```

#### **PublicOnlyRoute** - Solo no autenticados
```jsx
// Rutas solo para usuarios no logueados
<Route 
  path="/login" 
  element={
    <PublicOnlyRoute>
      <Login />
    </PublicOnlyRoute>
  } 
/>

// Redirige a home si ya está autenticado
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};
```

#### **AdminRoute** - Solo administradores
```jsx
// Acceso exclusivo para admins
<Route 
  path="/admin" 
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  } 
/>

// Triple verificación de seguridad
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isAdmin } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin || user.role !== 'admin') return <Navigate to="/" />;
  
  return children;
};
```

### ⚡ **Lazy Loading Implementation**

```jsx
// Implementación de lazy loading para optimización
import { lazy, Suspense } from 'react';

// Lazy imports
const HomePage = lazy(() => import('./pages/HomePage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PlayerListPage = lazy(() => import('./pages/PlayerListPage'));

// Router con Suspense
function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          {/* Más rutas... */}
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### 🧭 **Navegación y Links**

```jsx
// Navegación programática
import { useNavigate, useLocation } from 'react-router-dom';

const navigate = useNavigate();
const location = useLocation();

// Navegar con estado
navigate('/players/123', { 
  state: { from: 'gallery' },
  replace: false 
});

// Navegar con redirección después de login
const from = location.state?.from?.pathname || '/';
navigate(from, { replace: true });
```

---

## 🖥️ **Backend API Routes (Node.js + Express)**

### 🏗️ **Arquitectura API**
- **RESTful API** - Estándar REST con recursos y verbos HTTP
- **Express Router** - Modularización por recursos
- **JWT Authentication** - Autenticación stateless
- **Role-based Authorization** - Control granular de permisos
- **OpenAPI Documentation** - Documentación automática

### 📡 **Estructura Base de la API**

```
API Base URL: /api/v1

Autenticación: Bearer Token (JWT)
Content-Type: application/json
```

### 🗂️ **Endpoints por Recurso**

#### 🔐 **Authentication Routes** (`/api/v1/auth`)

| Método | Endpoint | Descripción | Auth | Parámetros | Respuesta |
|--------|----------|-------------|------|------------|-----------|
| `POST` | `/register` | Registro de nuevo usuario | ❌ | `{ firstName, lastName, email, password }` | `{ user, token }` |
| `POST` | `/login` | Autenticación de usuario | ❌ | `{ email, password }` | `{ user, token }` |
| `POST` | `/logout` | Cerrar sesión (blacklist token) | ✅ | - | `{ message }` |
| `GET` | `/me` | Obtener perfil del usuario actual | ✅ | - | `{ user }` |
| `PUT` | `/me` | Actualizar perfil del usuario | ✅ | `{ firstName, lastName, ... }` | `{ user }` |
| `POST` | `/refresh` | Renovar token JWT | ✅ | `{ refreshToken }` | `{ token }` |
| `POST` | `/forgot-password` | Solicitar reset de contraseña | ❌ | `{ email }` | `{ message }` |
| `POST` | `/reset-password` | Resetear contraseña | ❌ | `{ token, newPassword }` | `{ message }` |

**Ejemplo de Registro:**
```javascript
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "password123"
}

// Respuesta:
{
  "success": true,
  "data": {
    "user": {
      "_id": "64abc123...",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "role": "user",
      "createdAt": "2025-08-28T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 👥 **Players Routes** (`/api/v1/players`)

| Método | Endpoint | Descripción | Auth | Rol | Parámetros |
|--------|----------|-------------|------|-----|------------|
| `GET` | `/` | Listar todos los jugadores | ❌ | - | `?page=1&limit=10&search=name` |
| `GET` | `/:id` | Obtener jugador por ID | ❌ | - | - |
| `POST` | `/` | Crear nuevo jugador | ✅ | Admin | `{ name, position, number, ... }` |
| `PUT` | `/:id` | Actualizar jugador | ✅ | Admin | `{ name, position, number, ... }` |
| `DELETE` | `/:id` | Eliminar jugador | ✅ | Admin | - |
| `POST` | `/:id/photo` | Subir foto del jugador | ✅ | Admin | `FormData: { photo }` |
| `DELETE` | `/:id/photo` | Eliminar foto del jugador | ✅ | Admin | - |

**Ejemplo de Creación de Jugador:**
```javascript
POST /api/v1/players
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "Michael Jordan",
  "position": "Shooting Guard",
  "number": 23,
  "height": "6'6\"",
  "weight": "218 lbs",
  "birthDate": "1963-02-17",
  "biography": "Legendary basketball player..."
}

// Respuesta:
{
  "success": true,
  "data": {
    "player": {
      "_id": "64abc456...",
      "name": "Michael Jordan",
      "position": "Shooting Guard",
      "number": 23,
      "height": "6'6\"",
      "weight": "218 lbs",
      "createdAt": "2025-08-28T..."
    }
  }
}
```

#### 👤 **Users Routes** (`/api/v1/users`) - Solo Admin

| Método | Endpoint | Descripción | Auth | Rol | Parámetros |
|--------|----------|-------------|------|-----|------------|
| `GET` | `/` | Listar todos los usuarios | ✅ | Admin | `?page=1&limit=10&role=user` |
| `GET` | `/:id` | Obtener usuario por ID | ✅ | Admin | - |
| `PUT` | `/:id/role` | Cambiar rol de usuario | ✅ | Admin | `{ role: 'admin' \| 'user' }` |
| `DELETE` | `/:id` | Eliminar usuario | ✅ | Admin | - |
| `GET` | `/:id/activity` | Obtener actividad del usuario | ✅ | Admin | - |

#### 🖼️ **Images Routes** (`/api/v1/images`)

| Método | Endpoint | Descripción | Auth | Rol | Parámetros |
|--------|----------|-------------|------|-----|------------|
| `GET` | `/` | Listar todas las imágenes | ❌ | - | `?category=gallery&page=1` |
| `POST` | `/upload` | Subir nueva imagen | ✅ | Admin | `FormData: { image, category? }` |
| `DELETE` | `/:id` | Eliminar imagen | ✅ | Admin | - |
| `GET` | `/:filename` | Servir archivo de imagen | ❌ | - | - |

#### 👤 **Profiles Routes** (`/api/v1/profiles`)

| Método | Endpoint | Descripción | Auth | Rol | Parámetros |
|--------|----------|-------------|------|-----|------------|
| `GET` | `/me` | Obtener perfil propio | ✅ | User | - |
| `PUT` | `/me` | Actualizar perfil propio | ✅ | User | `{ firstName, lastName, ... }` |
| `POST` | `/me/avatar` | Subir avatar | ✅ | User | `FormData: { avatar }` |
| `DELETE` | `/me/avatar` | Eliminar avatar | ✅ | User | - |

### 🛡️ **Middleware de Autenticación**

```javascript
// middleware/auth.js
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Middleware para solo admins
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};
```

### 📊 **Respuestas Estándar**

#### ✅ **Respuesta Exitosa**
```javascript
{
  "success": true,
  "data": {
    // Datos solicitados
  },
  "message": "Optional success message",
  "pagination": { // Si aplica
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### ❌ **Respuesta de Error**
```javascript
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### 🔍 **Códigos de Estado HTTP**

| Código | Significado | Cuándo usar |
|--------|-------------|-------------|
| `200` | OK | Operación exitosa |
| `201` | Created | Recurso creado exitosamente |
| `400` | Bad Request | Error en datos de entrada |
| `401` | Unauthorized | Token faltante o inválido |
| `403` | Forbidden | Sin permisos suficientes |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Conflicto (ej: email duplicado) |
| `422` | Unprocessable Entity | Error de validación |
| `429` | Too Many Requests | Rate limit excedido |
| `500` | Internal Server Error | Error del servidor |

---

## 🔄 **Rate Limiting**

### ⚡ **Configuración de Límites**

```javascript
// config/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Límite general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Límite estricto para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  }
});

// Límite para uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 uploads por hora
  message: {
    success: false,
    message: 'Upload limit reached, please try again later.'
  }
});
```

---

## 🧪 **Testing de Rutas**

### 🔧 **Tests de Frontend**

```javascript
// __tests__/routes/ProtectedRoute.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import AppRouter from '../../AppRouter';

describe('Protected Routes', () => {
  test('redirects to login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { name: /iniciar sesión/i }))
      .toBeInTheDocument();
  });
  
  test('renders admin dashboard for admin users', () => {
    const mockUser = { role: 'admin', firstName: 'Admin' };
    
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider value={{ isAuthenticated: true, user: mockUser }}>
          <AppRouter />
        </AuthProvider>
      </MemoryRouter>
    );
    
    expect(screen.getByText(/panel de administración/i))
      .toBeInTheDocument();
  });
});
```

### 🧪 **Tests de Backend**

```javascript
// __tests__/routes/auth.test.js
const request = require('supertest');
const app = require('../../server');

describe('Auth Routes', () => {
  test('POST /auth/register - should create new user', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
    expect(response.body.data.token).toBeDefined();
  });
  
  test('POST /auth/login - should authenticate user', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(credentials)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});

describe('Protected Routes', () => {
  let authToken;
  
  beforeEach(async () => {
    // Setup: Login and get token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    
    authToken = loginResponse.body.data.token;
  });
  
  test('GET /users - should require admin role', async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.users)).toBe(true);
  });
});
```

---

## 🌐 **CORS Configuration**

```javascript
// config/cors.js
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];
    
    // Permitir requests sin origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;
```

---

## 📝 **OpenAPI Documentation**

La documentación completa de la API está disponible en `docs/openapi.yaml` y se puede visualizar en:

- **Desarrollo**: `http://localhost:5000/api-docs`
- **Producción**: `https://api.basketballteam.com/api-docs`

### 📋 **Swagger UI Features**
- **Interactive Testing** - Probar endpoints directamente
- **Authentication** - Login y uso de JWT tokens
- **Schema Documentation** - Modelos de datos detallados
- **Example Responses** - Ejemplos de respuestas reales

---

## 📞 **Troubleshooting**

### ❌ **Problemas Comunes**

**1. CORS Error:**
```bash
Access to fetch at 'http://localhost:5000' blocked by CORS
```
**Solución:**
- Verificar `FRONTEND_URL` en variables de entorno del backend
- Verificar `ALLOWED_ORIGINS` incluye la URL del frontend
- Verificar que el backend esté ejecutándose

**2. 401 Unauthorized:**
```bash
Error: Request failed with status code 401
```
**Solución:**
- Verificar que el token JWT esté incluido en headers
- Verificar que el token no haya expirado
- Verificar formato: `Authorization: Bearer <token>`

**3. Route Not Found:**
```bash
Cannot GET /api/v1/nonexistent
```
**Solución:**
- Verificar que la ruta esté definida en el router correspondiente
- Verificar que el router esté registrado en la aplicación principal
- Verificar el método HTTP (GET, POST, PUT, DELETE)

**4. Role Access Denied:**
```bash
Error: Access denied. Admin role required.
```
**Solución:**
- Verificar que el usuario tenga el rol correcto
- Verificar que el middleware de autorización esté funcionando
- Verificar que el token contenga la información de rol correcta

### 🔧 **Debug Commands**

```bash
# Verificar rutas disponibles (desarrollo)
npm run routes

# Test específico de rutas
npm run test:routes

# Debug de autenticación
node scripts/debug-auth.js

# Verificar CORS
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:5000/api/v1/players
```

---

<div align="center">

**🛣️ Basketball Team - Complete Routes Documentation**

[![Frontend Routes](https://img.shields.io/badge/Frontend-9%20Routes-blue)](src/App.jsx)
[![Backend Endpoints](https://img.shields.io/badge/API-35%2B%20Endpoints-green)](docs/openapi.yaml)
[![Auth Protection](https://img.shields.io/badge/Auth-JWT%20Protected-red)](middleware/auth.js)
[![OpenAPI](https://img.shields.io/badge/Docs-Swagger%20UI-orange)](docs/openapi.yaml)

**Última actualización**: 28 Agosto 2025  
**Responsable**: Jorge Zuta  
**Versión**: 2.0.0

</div>
