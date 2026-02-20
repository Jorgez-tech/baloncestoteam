# Basketball Team - Frontend React

Frontend de la aplicación Basketball Team construido con React, React Router, y React Query.

## Estructura del Proyecto

```
frontend/src/
├── components/           # Componentes React
├── pages/               # Páginas/Vistas principales
├── context/             # Estado global (AuthContext)
└── api/                 # Cliente Axios
```

## Scripts

```bash
npm install     # Instalar dependencias
npm start       # Iniciar servidor de desarrollo (Puerto 3000)
npm run build   # Construir para producción
npm test        # Ejecutar tests
```

## Autenticacion

La autenticacion se maneja mediante JWT Tokens almacenados en localStorage y gestionados por `AuthContext` (`src/context/AuthContext.js`).

El cliente HTTP (`src/api/client.js`) anexa automaticamente el token JWT en cada peticion y redirige a `/login` ante respuestas 401.

## Documentacion

Para detalles de rutas y endpoints, ver [`../docs/ROUTES_AND_SERVICES.md`](../docs/ROUTES_AND_SERVICES.md).

## Estilos

- **CSS Modules**: Estilos por componente
- **Global CSS**: `public/css/style.css`

## Próximas Mejoras

- [ ] Implementar lazy loading
- [ ] Agregar más tests de cobertura
- [ ] Optimizar bundle size
