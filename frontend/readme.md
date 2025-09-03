# 🏀 Basketball Team - Frontend React

Frontend de la aplicación Basketball Team construido con React, React Router, y React Query.

## 📁 Estructura del Proyecto

```
frontend/src/
├── components/           # Componentes React
│   ├── ui/              # Componentes de UI reutilizables
│   ├── auth/            # Componentes de autenticación
│   ├── players/         # Componentes relacionados con jugadores
│   └── common/          # Componentes comunes (Header, Footer)
├── pages/               # Páginas/Vistas principales
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── PlayerList.jsx

- `/` - Página de inicio
- `/gallery` - Galería de imágenes
- `/players` - Lista de jugadores
- `/players/:id` - Perfil de jugador
- `/login` - Iniciar sesión
- `/signup` - Registro de usuario
- `/admin` - Panel de administración (solo admin)

### Comportamiento de Rutas
- **ProtectedRoute**: Redirige a `/login` si no hay usuario autenticado
- **AdminRoute**: Redirige a `/` si el usuario no es admin

## 🔐 Autenticación

La autenticación se maneja mediante:

2. **JWT Tokens**: Almacenados en localStorage
3. **API Client**: Interceptors de axios para agregar el token automáticamente

1. Usuario se registra/inicia sesión
2. Backend devuelve JWT token
3. Token se almacena en localStorage y AuthContext
5. Logout elimina el token

## 🧪 Testing
### Estructura de Tests
- `__tests__/test-utils.js` - Utilidades para testing (customRender)
- `__tests__/` - Tests de componentes y rutas

### Ejecutar Tests
```bash
npm test                    # Ejecutar todos los tests
npm test -- --coverage     # Coverage report
npm test -- --watchAll     # Watch mode
```

### Tests Implementados
- ✅ Login component
- ✅ Admin route protection
- ✅ PlayerList component
- ✅ Route navigation
- 📋 Pendiente: Más tests de componentes y hooks

## 🎨 Estilos y UI

- **CSS Modules**: Estilos por componente
- **Responsive Design**: Mobile-first approach
- **CSS Variables**: Para temas y colores consistentes
```bash
npm run build
```
npm install -g vercel
vercel --prod
```

### Deploy a Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Variables de Entorno en Producción
Asegúrate de configurar:
- `REACT_APP_API_URL` - URL de tu API en producción

## 🔮 Próximas Mejoras

- [ ] Implementar lazy loading con React.lazy y Suspense
- [ ] Agregar más tests de cobertura (objetivo: ≥70%)
- [ ] Optimizar bundle size
- [ ] Implementar PWA features
- [ ] Agregar error boundaries
- [ ] Implementar internacionalización (i18n)

## 🐛 Problemas Conocidos

- Warnings de React Router future flags (no afectan funcionalidad)
- Algunos tests requieren ajustes en configuración de routing

## 📚 Recursos

- [React Documentation](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query/latest)
- [Create React App](https://create-react-app.dev/)