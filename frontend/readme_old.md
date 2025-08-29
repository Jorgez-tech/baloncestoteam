# 🏀 Basketball Team Frontend

Este directorio contiene el frontend de la aplicación Basketball Team, desarrollado con React.

## 📋 Estructura del proyecto

```
frontend/
├── public/             # Archivos públicos estáticos
│   ├── index.html      # HTML base
│   ├── favicon.ico     # Icono de la página
│   └── ...
├── src/                # Código fuente
│   ├── components/     # Componentes React reutilizables
│   │   ├── App.jsx     # Componente principal con rutas y lazy loading
│   │   ├── Header.jsx  # Barra de navegación
│   │   ├── Footer.jsx  # Pie de página
│   │   └── Gallery.jsx # Componente de galería
│   ├── pages/          # Páginas de la aplicación (lazy loaded)
│   │   ├── HomePage.jsx     # Página principal
│   │   ├── Login.jsx        # Página de inicio de sesión
│   │   ├── Signup.jsx       # Página de registro
│   │   ├── PlayerListPage.jsx    # Lista de jugadores
│   │   ├── PlayerProfilePage.jsx # Perfil de jugador
│   │   ├── AdminDashboard.jsx    # Dashboard administrativo
│   │   └── Profile.jsx      # Perfil de usuario
│   ├── context/        # Contextos de React
│   │   └── AuthContext.js  # Contexto de autenticación
│   ├── api/            # Cliente API y servicios
│   │   └── client.js   # Cliente axios configurado
│   ├── utils/          # Utilidades y helpers
│   │   └── test-utils.jsx  # Utilidades para testing
│   ├── __tests__/      # Tests unitarios y de integración
│   │   ├── components/ # Tests de componentes
│   │   └── routes.test.jsx # Tests de rutas
│   ├── styles/         # Hojas de estilo CSS
│   └── index.js        # Punto de entrada
└── package.json        # Dependencias y scripts
```

## 🚀 Inicio rápido

### Prerrequisitos
- Node.js (versión 14+)
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📝 Scripts disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Crea la versión de producción
- `npm test` - Ejecuta los tests en modo interactivo
- `npm run test:coverage` - Ejecuta tests con reporte de cobertura
- `npm run lint` - Ejecuta el linter (ESLint)
- `npm run lint:fix` - Corrige automáticamente problemas de linting
- `npm run format` - Formatea el código con Prettier

## 🧪 Testing

El proyecto utiliza Jest y React Testing Library para pruebas. Para ejecutar los tests:

```bash
npm test
```

### Estructura de tests

- `__tests__/routes.test.jsx` - Tests de rutas públicas y protegidas
- `__tests__/components/Header.test.jsx` - Tests del componente Header
- `utils/test-utils.jsx` - Utilidades para testing con providers

### Utilidades para testing

Para simplificar la escritura de tests, se recomienda crear un archivo de utilidades que incluya los providers necesarios:

```javascript
// src/utils/test-utils.js
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { AuthProvider } from '../context/AuthContext';

const AllTheProviders = ({ children }) => {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
```

## 📚 Guías y convenciones

### Estructura de componentes

- Componentes funcionales con hooks
- Cada componente en su propio archivo
- Nombres de archivos en PascalCase para componentes (ej. `Header.jsx`)
- Utilidades y helpers en camelCase (ej. `authUtils.js`)

### Estilo de código

- ESLint y Prettier para formateo y linting
- Indentación con 2 espacios
- Punto y coma al final de cada línea
- Preferir desestructuración de props

### Manejo de estado

- Context API para estado global (autenticación)
- React Query para datos del servidor
- useState y useReducer para estado local

## 🔒 Seguridad

- Tokens JWT almacenados en localStorage
- Rutas protegidas con componente `ProtectedRoute`
- No exposición de credenciales en código fuente

## 🔄 CI/CD

- GitHub Actions para integración continua
- Netlify/Vercel para despliegue automático (pendiente)

## 📈 Características implementadas

### ✅ Funcionalidades actuales

- **Lazy Loading**: Páginas cargadas dinámicamente con React.lazy y Suspense
- **Autenticación**: Sistema completo con JWT y Context API
- **Rutas protegidas**: Componente ProtectedRoute para control de acceso
- **Testing**: Tests con React Testing Library y utilidades personalizadas
- **Linting**: ESLint y Prettier configurados con pre-commit hooks
- **Responsive Design**: Interfaz adaptable a dispositivos móviles

### 📋 Próximos pasos

- Implementar tests para componentes individuales
- Agregar internacionalización (i18n)
- Optimizar carga de imágenes con lazy loading
- Mejorar gestión de errores global
- Implementar Progressive Web App (PWA)

---

**Última actualización:** Agosto 2025
