# Guía de Vistas Frontend - Basketball Team

## 1. Checklist de Vistas Principales

- [x] Home (Integrada en App.js)
- [x] Jugadores (Lista y Detalles)
- [x] Contacto (Formulario funcional)
- [x] Nosotros (Información del equipo)
- [x] Login (AuthContext integrado)
- [x] Registro (Validaciones completas)
- [x] Panel de gestión (AdminDashboard protegido)

## 2. Personalización Visual

Los estilos se manejan principalmente en `frontend/public/css/` y componentes CSS modules.
*   **Imágenes**: `frontend/public/images/`
*   **Tema**: Colores y tipografía definidos en CSS global.

## 3. Integración de Lógica

*   **AuthContext**: Maneja el estado global de sesión (`src/context/AuthContext.js`).
*   **API Client**: Axios configurado en `src/api/axios.js`.
*   **Rutas Protegidas**: Componente `ProtectedRoute` para bloquear acceso a no-admins.

## 4. Comandos de Desarrollo Frontend

```bash
cd frontend
npm start
```
El frontend corre en puerto **3000** y se comunica con el backend en puerto **5000**.
