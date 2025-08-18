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
│   ├── components/     # Componentes React
│   │   ├── App.jsx     # Componente principal con rutas
│   │   ├── Header.jsx  # Barra de navegación
│   │   ├── Login.jsx   # Formulario de inicio de sesión
│   │   └── ...
│   ├── context/        # Contextos de React
│   │   ├── AuthContext.js  # Contexto de autenticación
│   │   └── ...
│   ├── api/            # Cliente API y servicios
│   │   └── client.js   # Cliente axios configurado
│   ├── styles/         # Hojas de estilo CSS
│   ├── utils/          # Utilidades y helpers
│   ├── __tests__/      # Tests unitarios y de integración
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
- `npm test` - Ejecuta los tests
- `npm run lint` - Ejecuta el linter (ESLint)

## 🧪 Testing

El proyecto utiliza Jest y React Testing Library para pruebas. Para ejecutar los tests:

```bash
npm test
```

### Estructura de tests

- `__tests__/routes.test.jsx` - Tests de rutas públicas y protegidas
- (Otros tests por implementar)

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

## 📈 Próximos pasos

- Implementar tests para componentes individuales
- Agregar React.lazy para código splitting
- Optimizar carga de imágenes
- Mejorar gestión de errores global

---

**Última actualización:** Agosto 2025
