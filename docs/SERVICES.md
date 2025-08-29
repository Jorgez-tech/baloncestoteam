# 🌐 Servicios y APIs - Basketball Team Project

> **Documentación completa** de todos los servicios, APIs y arquitectura de comunicación del sistema de gestión de equipos de baloncesto.

---

## 🏗️ **Arquitectura de Servicios**

### 📊 **Diagrama de Arquitectura**

```
┌─────────────────┐    HTTP/HTTPS     ┌─────────────────┐
│   React SPA     │◄──────────────────┤  Express API    │
│   (Frontend)    │                   │   (Backend)     │
└─────────────────┘                   └─────────────────┘
        │                                      │
        │ axios/fetch                          │ mongoose
        │ JWT tokens                           │
        │                              ┌─────────────────┐
        └─────────────────────────────►│   MongoDB       │
          Almacenamiento local          │   (Database)    │
                                       └─────────────────┘
                                              │
                                       ┌─────────────────┐
                                       │   Redis         │
                                       │   (Cache)       │
                                       └─────────────────┘
```

### 🎯 **Stack Tecnológico**

| Capa | Tecnología | Versión | Propósito |
|------|------------|---------|-----------|
| **Frontend** | React | 17.x | SPA con componentes reutilizables |
| **Router** | React Router | 6.x | Navegación client-side |
| **State** | Context API | - | Estado global de autenticación |
| **HTTP Client** | Axios | 1.x | Cliente HTTP con interceptores |
| **UI Framework** | CSS Modules | - | Estilos aislados por componente |
| **Backend** | Express.js | 4.x | API REST con middleware |
| **Authentication** | JWT | - | Tokens stateless para auth |
| **Database** | MongoDB | 6.x | Base de datos NoSQL |
| **ODM** | Mongoose | 7.x | Modelado de datos y validación |
| **Cache** | Redis | 7.x | Cache de sesiones y rate limiting |
| **File Storage** | Local/Cloud | - | Almacenamiento de imágenes |

---

## 🌐 **Configuración de API**

### 📡 **Base Configuration**

```javascript
// Frontend: src/api/client.js
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // JWT en headers, no cookies
};

// Instancia de Axios configurada
const apiClient = axios.create(API_CONFIG);
```

### 🔐 **Interceptores de Autenticación**

```javascript
// Request interceptor - Agregar JWT automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('basketball_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Manejo de errores y refresh tokens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Token expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('basketball_refresh_token');
        const response = await axios.post('/auth/refresh', { refreshToken });
        
        const { token } = response.data.data;
        localStorage.setItem('basketball_token', token);
        
        // Reintentar request original
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh falló, logout automático
        localStorage.removeItem('basketball_token');
        localStorage.removeItem('basketball_refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
```

---

## 🔐 **Servicio de Autenticación**

### 🎯 **AuthService**

```javascript
// src/services/authService.js
class AuthService {
  constructor() {
    this.baseURL = '/auth';
    this.tokenKey = 'basketball_token';
    this.refreshTokenKey = 'basketball_refresh_token';
  }
  
  // Registro de usuario
  async register(userData) {
    try {
      const response = await apiClient.post(`${this.baseURL}/register`, userData);
      
      const { user, token, refreshToken } = response.data.data;
      this.setTokens(token, refreshToken);
      
      return { user, token };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Login de usuario
  async login(credentials) {
    try {
      const response = await apiClient.post(`${this.baseURL}/login`, credentials);
      
      const { user, token, refreshToken } = response.data.data;
      this.setTokens(token, refreshToken);
      
      return { user, token };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Logout
  async logout() {
    try {
      await apiClient.post(`${this.baseURL}/logout`);
    } catch (error) {
      // Logout local aunque falle el servidor
      console.warn('Server logout failed:', error.message);
    } finally {
      this.clearTokens();
    }
  }
  
  // Obtener perfil del usuario actual
  async getCurrentUser() {
    try {
      const response = await apiClient.get(`${this.baseURL}/me`);
      return response.data.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Actualizar perfil
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put(`${this.baseURL}/me`, profileData);
      return response.data.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Cambiar contraseña
  async changePassword(passwordData) {
    try {
      const response = await apiClient.put(`${this.baseURL}/change-password`, passwordData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Utilidades
  setTokens(token, refreshToken) {
    localStorage.setItem(this.tokenKey, token);
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }
  
  clearTokens() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
  
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
  
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
  
  handleError(error) {
    const message = error.response?.data?.message || error.message || 'Unknown error';
    const code = error.response?.status || 500;
    
    return {
      message,
      code,
      details: error.response?.data?.error?.details || []
    };
  }
}

export default new AuthService();
```

---

## 👥 **Servicio de Jugadores**

### ⚽ **PlayersService**

```javascript
// src/services/playersService.js
class PlayersService {
  constructor() {
    this.baseURL = '/players';
  }
  
  // Obtener lista de jugadores con filtros
  async getPlayers(params = {}) {
    try {
      const response = await apiClient.get(this.baseURL, { params });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Obtener jugador por ID
  async getPlayerById(id) {
    try {
      const response = await apiClient.get(`${this.baseURL}/${id}`);
      return response.data.data.player;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Crear nuevo jugador (solo admin)
  async createPlayer(playerData) {
    try {
      const response = await apiClient.post(this.baseURL, playerData);
      return response.data.data.player;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Actualizar jugador (solo admin)
  async updatePlayer(id, playerData) {
    try {
      const response = await apiClient.put(`${this.baseURL}/${id}`, playerData);
      return response.data.data.player;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Eliminar jugador (solo admin)
  async deletePlayer(id) {
    try {
      const response = await apiClient.delete(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Subir foto del jugador
  async uploadPlayerPhoto(id, photoFile) {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      
      const response = await apiClient.post(
        `${this.baseURL}/${id}/photo`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Eliminar foto del jugador
  async deletePlayerPhoto(id) {
    try {
      const response = await apiClient.delete(`${this.baseURL}/${id}/photo`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Buscar jugadores
  async searchPlayers(query) {
    try {
      const response = await apiClient.get(`${this.baseURL}/search`, {
        params: { q: query }
      });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  handleError(error) {
    const message = error.response?.data?.message || error.message;
    const code = error.response?.status || 500;
    
    return { message, code };
  }
}

export default new PlayersService();
```

---

## 👤 **Servicio de Usuarios**

### 🛡️ **UsersService** (Solo Admin)

```javascript
// src/services/usersService.js
class UsersService {
  constructor() {
    this.baseURL = '/users';
  }
  
  // Obtener lista de usuarios
  async getUsers(params = {}) {
    try {
      const response = await apiClient.get(this.baseURL, { params });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Obtener usuario por ID
  async getUserById(id) {
    try {
      const response = await apiClient.get(`${this.baseURL}/${id}`);
      return response.data.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Cambiar rol de usuario
  async updateUserRole(id, role) {
    try {
      const response = await apiClient.put(`${this.baseURL}/${id}/role`, { role });
      return response.data.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Eliminar usuario
  async deleteUser(id) {
    try {
      const response = await apiClient.delete(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Obtener actividad del usuario
  async getUserActivity(id) {
    try {
      const response = await apiClient.get(`${this.baseURL}/${id}/activity`);
      return response.data.data.activity;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Estadísticas de usuarios
  async getUserStats() {
    try {
      const response = await apiClient.get(`${this.baseURL}/stats`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  handleError(error) {
    const message = error.response?.data?.message || error.message;
    return { message, code: error.response?.status || 500 };
  }
}

export default new UsersService();
```

---

## 🖼️ **Servicio de Imágenes**

### 📸 **ImagesService**

```javascript
// src/services/imagesService.js
class ImagesService {
  constructor() {
    this.baseURL = '/images';
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  }
  
  // Obtener lista de imágenes
  async getImages(params = {}) {
    try {
      const response = await apiClient.get(this.baseURL, { params });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Subir imagen
  async uploadImage(imageFile, category = 'gallery') {
    try {
      // Validaciones client-side
      this.validateImageFile(imageFile);
      
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('category', category);
      
      const response = await apiClient.post(
        `${this.baseURL}/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // Emit progress event o callback
            console.log(`Upload progress: ${progress}%`);
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Eliminar imagen
  async deleteImage(id) {
    try {
      const response = await apiClient.delete(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Obtener URL de imagen
  getImageUrl(filename) {
    if (!filename) return null;
    
    const baseUrl = process.env.REACT_APP_API_URL.replace('/api/v1', '');
    return `${baseUrl}/uploads/${filename}`;
  }
  
  // Redimensionar imagen (client-side)
  async resizeImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
  
  // Validar archivo de imagen
  validateImageFile(file) {
    if (!file) {
      throw new Error('No file provided');
    }
    
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed. Allowed: ${this.allowedTypes.join(', ')}`);
    }
    
    if (file.size > this.maxFileSize) {
      throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds limit of ${this.maxFileSize / 1024 / 1024}MB`);
    }
  }
  
  handleError(error) {
    const message = error.response?.data?.message || error.message;
    return { message, code: error.response?.status || 500 };
  }
}

export default new ImagesService();
```

---

## 🔧 **Hooks Personalizados**

### 🎯 **useApi Hook**

```javascript
// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';

export function useApi(apiFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      setData(result);
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);
  
  return { data, loading, error, execute };
}

// Uso del hook
function PlayersList() {
  const { data: players, loading, error, execute: fetchPlayers } = useApi(
    playersService.getPlayers
  );
  
  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {players?.players?.map(player => (
        <PlayerCard key={player._id} player={player} />
      ))}
    </div>
  );
}
```

### 🔄 **useAsyncOperation Hook**

```javascript
// src/hooks/useAsyncOperation.js
import { useState } from 'react';
import { toast } from 'react-toastify';

export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  
  const execute = async (operation, options = {}) => {
    const {
      loadingMessage = 'Cargando...',
      successMessage = 'Operación exitosa',
      errorMessage = 'Error en la operación',
      showToast = true
    } = options;
    
    try {
      setLoading(true);
      
      if (showToast) {
        toast.info(loadingMessage);
      }
      
      const result = await operation();
      
      if (showToast) {
        toast.success(successMessage);
      }
      
      return result;
    } catch (error) {
      const message = error.message || errorMessage;
      
      if (showToast) {
        toast.error(message);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, execute };
}

// Uso del hook
function CreatePlayerForm() {
  const { loading, execute } = useAsyncOperation();
  
  const handleSubmit = async (formData) => {
    await execute(
      () => playersService.createPlayer(formData),
      {
        loadingMessage: 'Creando jugador...',
        successMessage: 'Jugador creado exitosamente',
        errorMessage: 'Error al crear jugador'
      }
    );
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Jugador'}
      </button>
    </form>
  );
}
```

---

## 📊 **Manejo de Estado Global**

### 🎯 **React Query Configuration**

```javascript
// src/config/queryClient.js
import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
        // Global error handling
      }
    }
  }
});

export default queryClient;
```

### ⚡ **Queries Predefinidas**

```javascript
// src/queries/playersQueries.js
import { useQuery, useMutation, useQueryClient } from 'react-query';
import playersService from '../services/playersService';

// Query para obtener jugadores
export function usePlayersQuery(params) {
  return useQuery(
    ['players', params],
    () => playersService.getPlayers(params),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000
    }
  );
}

// Query para obtener jugador específico
export function usePlayerQuery(id) {
  return useQuery(
    ['player', id],
    () => playersService.getPlayerById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000
    }
  );
}

// Mutation para crear jugador
export function useCreatePlayerMutation() {
  const queryClient = useQueryClient();
  
  return useMutation(playersService.createPlayer, {
    onSuccess: (newPlayer) => {
      // Invalidar cache de jugadores
      queryClient.invalidateQueries(['players']);
      
      // Agregar el nuevo jugador al cache
      queryClient.setQueryData(['player', newPlayer._id], newPlayer);
    }
  });
}

// Mutation para actualizar jugador
export function useUpdatePlayerMutation() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }) => playersService.updatePlayer(id, data),
    {
      onSuccess: (updatedPlayer) => {
        // Actualizar cache específico
        queryClient.setQueryData(['player', updatedPlayer._id], updatedPlayer);
        
        // Invalidar lista de jugadores
        queryClient.invalidateQueries(['players']);
      }
    }
  );
}
```

---

## 🔒 **Seguridad de Servicios**

### 🛡️ **Sanitización de Entrada**

```javascript
// src/utils/sanitizer.js
import DOMPurify from 'dompurify';

class DataSanitizer {
  // Sanitizar strings para prevenir XSS
  static sanitizeString(input) {
    if (typeof input !== 'string') return input;
    
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  }
  
  // Sanitizar objeto completo
  static sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  // Validar email
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validar password
  static isValidPassword(password) {
    // Mínimo 8 caracteres, al menos una letra y un número
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  }
}

export default DataSanitizer;
```

### 🔐 **Rate Limiting Client-side**

```javascript
// src/utils/rateLimiter.js
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }
  
  // Verificar si se puede hacer request
  canMakeRequest(key, maxRequests = 5, windowMs = 60000) {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Filtrar requests dentro de la ventana
    const validRequests = requests.filter(timestamp => 
      now - timestamp < windowMs
    );
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    // Agregar nuevo request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
  
  // Obtener tiempo restante para próximo request
  getTimeUntilNextRequest(key, maxRequests = 5, windowMs = 60000) {
    const requests = this.requests.get(key) || [];
    if (requests.length < maxRequests) return 0;
    
    const oldestRequest = Math.min(...requests);
    const timeUntilExpiry = windowMs - (Date.now() - oldestRequest);
    
    return Math.max(0, timeUntilExpiry);
  }
}

export default new RateLimiter();
```

---

## 📊 **Monitoreo y Analytics**

### 📈 **Service Analytics**

```javascript
// src/utils/analytics.js
class ServiceAnalytics {
  constructor() {
    this.metrics = {
      apiCalls: new Map(),
      errors: new Map(),
      performance: new Map()
    };
  }
  
  // Registrar llamada API
  trackApiCall(endpoint, method, responseTime, statusCode) {
    const key = `${method} ${endpoint}`;
    const current = this.metrics.apiCalls.get(key) || {
      count: 0,
      totalTime: 0,
      errors: 0
    };
    
    current.count++;
    current.totalTime += responseTime;
    
    if (statusCode >= 400) {
      current.errors++;
    }
    
    this.metrics.apiCalls.set(key, current);
  }
  
  // Obtener estadísticas
  getStats() {
    const stats = {};
    
    for (const [endpoint, data] of this.metrics.apiCalls) {
      stats[endpoint] = {
        calls: data.count,
        averageTime: data.totalTime / data.count,
        errorRate: (data.errors / data.count) * 100
      };
    }
    
    return stats;
  }
  
  // Enviar métricas al servidor (opcional)
  async sendMetrics() {
    try {
      const stats = this.getStats();
      await apiClient.post('/analytics/metrics', { stats });
    } catch (error) {
      console.warn('Failed to send metrics:', error);
    }
  }
}

export default new ServiceAnalytics();
```

---

## 🔧 **Configuración de Desarrollo**

### 🧪 **Mock Services**

```javascript
// src/services/__mocks__/playersService.js
const mockPlayers = [
  {
    _id: '1',
    name: 'Michael Jordan',
    position: 'Shooting Guard',
    number: 23,
    height: "6'6\"",
    weight: '218 lbs'
  },
  // Más jugadores mock...
];

const PlayersServiceMock = {
  async getPlayers() {
    return { players: mockPlayers, total: mockPlayers.length };
  },
  
  async getPlayerById(id) {
    return mockPlayers.find(p => p._id === id);
  },
  
  async createPlayer(playerData) {
    const newPlayer = { ...playerData, _id: Date.now().toString() };
    mockPlayers.push(newPlayer);
    return newPlayer;
  }
};

export default PlayersServiceMock;
```

### ⚙️ **Environment Switching**

```javascript
// src/services/index.js
import playersService from './playersService';
import playersServiceMock from './__mocks__/playersService';

// Alternar entre servicios reales y mock
const services = {
  players: process.env.REACT_APP_MOCK_API === 'true' 
    ? playersServiceMock 
    : playersService
};

export default services;
```

---

## 📞 **Troubleshooting**

### ❌ **Errores Comunes**

**1. Network Error:**
```javascript
// Error: Network Error
// Solución: Verificar URL de API y conectividad
console.log('API URL:', process.env.REACT_APP_API_URL);
console.log('Backend running?');
```

**2. CORS Policy Error:**
```javascript
// Error: Access to fetch blocked by CORS policy
// Solución: Verificar configuración CORS en backend
// Verificar FRONTEND_URL en variables de entorno del backend
```

**3. 401 Unauthorized:**
```javascript
// Error: Request failed with status code 401
// Solución: Verificar token JWT válido
const token = localStorage.getItem('basketball_token');
console.log('Token:', token ? 'Present' : 'Missing');
```

**4. Token Expired:**
```javascript
// Implementar refresh automático
// Ver interceptores de axios arriba
```

### 🔧 **Debug Tools**

```javascript
// src/utils/debugTools.js
class DebugTools {
  static logApiCall(config, response) {
    if (process.env.REACT_APP_DEBUG === 'true') {
      console.group('🌐 API Call');
      console.log('URL:', config.url);
      console.log('Method:', config.method);
      console.log('Headers:', config.headers);
      console.log('Response:', response.data);
      console.groupEnd();
    }
  }
  
  static logError(error, context = '') {
    console.group('❌ Error' + (context ? ` - ${context}` : ''));
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', error);
    console.groupEnd();
  }
}

export default DebugTools;
```

---

<div align="center">

**🌐 Basketball Team - Services & APIs Documentation**

[![API Endpoints](https://img.shields.io/badge/API-35%2B%20Endpoints-blue)](docs/openapi.yaml)
[![Services](https://img.shields.io/badge/Services-5%20Core-green)](src/services/)
[![Authentication](https://img.shields.io/badge/Auth-JWT%20Secure-red)](src/services/authService.js)
[![React Query](https://img.shields.io/badge/Cache-React%20Query-purple)](src/queries/)

**Última actualización**: 28 Agosto 2025  
**Responsable**: Jorge Zuta  
**Versión**: 2.0.0

</div>
