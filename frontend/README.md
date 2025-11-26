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

## Autenticación

La autenticación se maneja mediante JWT Tokens almacenados en localStorage y gestionados por `AuthContext`.

## Documentación

Para detalles de desarrollo y vistas, ver `../docs/guides/FRONTEND_VIEWS.md`.

## Estilos

- **CSS Modules**: Estilos por componente
- **Global CSS**: `public/css/style.css`

## Próximas Mejoras

- [ ] Implementar lazy loading
- [ ] Agregar más tests de cobertura
- [ ] Optimizar bundle size
