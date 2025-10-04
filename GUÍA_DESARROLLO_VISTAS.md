# Guía de Personalización e Integración de Vistas - Basketball Team

## 1. Checklist de Vistas Principales

- [x] Home (convertida a JSX funcional, integrada en App.js)
- [x] Jugadores (convertida a JSX funcional, integrada en App.js)
- [x] Contacto (convertida a JSX funcional, integrada en App.js)
- [x] Nosotros (convertida a JSX funcional, integrada en App.js)
- [x] Login (creado con integración backend, AuthContext, manejo de errores)
- [x] Registro (creado con validaciones, integración authAPI)
- [x] Panel de gestión (AdminDashboard - restaurado con rutas protegidas)

---

## 2. Personalización Visual
Por cada vista:
- [ ] Cambiar imágenes por las del equipo de baloncesto (`frontend/public/images/`)
- [ ] Renombrar botones y textos para reflejar la temática
- [ ] Ajustar colores y estilos en los archivos CSS (`frontend/public/css/`)

---

## 3. Integración de Lógica

Por cada vista:

- [x] Identificar componentes interactivos (formularios, botones, listas) en Home, Jugadores y Contacto
- [x] Conectar Login y Registro con backend (authAPI)
- [x] Implementar AuthContext para manejo de sesión
- [x] Implementar ProtectedRoute para rutas protegidas por autenticación
- [x] Conectar AdminDashboard con backend (playersAPI, usersAPI)
- [ ] Conectar formularios de contacto al backend
- [ ] Validar la recepción y envío de datos correctamente en todas las vistas

---

## 4. Pruebas y Validación
Por cada vista:
- [x] Validación con linter (`npm run lint`) sin errores críticos
- [ ] Probar la vista en diferentes dispositivos y navegadores
- [ ] Verificar que las funcionalidades conectadas funcionen correctamente
- [ ] Corregir errores visuales y funcionales detectados

---

## 5. Documentación
Por cada avance:
- [x] Documentar los cambios realizados en esta guía y README
- [ ] Registrar endpoints y flujos principales usados en cada vista

---

## Comandos de Desarrollo
- Backend:  
  ```bash
  cd backend && npm run dev
  ```
- Frontend:  
  ```bash
  cd frontend && npm start
  ```

---

## Referencias Clave
- Arquitectura: `.github/copilot-instructions.md`
- CSS: `frontend/public/css/`
- Imágenes: `frontend/public/images/`
- Componente principal: `frontend/src/App.js`
- Backend API: Puerto 5000

---

**Recomendación:** Avanza punto a punto, personalizando y conectando la lógica de cada vista antes de pasar a la siguiente. Actualiza la documentación conforme completes cada etapa.
