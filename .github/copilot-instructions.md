# Basketball Team - Instrucciones para GitHub Copilot

## Basketball Team – Instrucciones para Agentes de IA

### 🏗️ Resumen de la Arquitectura POST-TEMPLATE
- **Monorepo con dos componentes principales:**
   - `backend/` – API Node.js/Express (MongoDB, Redis) - FUNCIONAL ✅
   - `frontend/` – Aplicación React con Template Sportpar adaptado - NUEVO ✅
- **Límites de servicio:**
   - Frontend basado en template HTML adaptado a React
   - Backend API REST funcional en `/api/v1/*`
   - Autenticación JWT + Redis blacklist operativa

### ⚡ Flujos de Trabajo Actualizados
- **Inicialización:**
   - Backend: `cd backend && npm install && cp .env.example .env`
   - Frontend: `cd frontend && npm install` (estructura template limpia)
- **Ejecución local:**
   - Backend: `npm run dev` (puerto 5000) - ESTABLE
   - Frontend: `npm start` (puerto 3000) - TEMPLATE FUNCIONAL
- **Testing:**
   - Backend: npm test (cobertura limitada pero estable)
   - Frontend: Basado en template, testing básico funcional

### 🧩 Estructura POST-LIMPIEZA
- **Backend:** MANTENER estructura completa (funciona correctamente)
- **Frontend:** Estructura simplificada basada en template:
   - `src/App.js` - Componente principal del template adaptado
   - `src/components/` - Componentes extraídos del template (Header, Hero, etc.)
   - `src/styles/` - CSS del template personalizado
   - NO MÁS: context problemático, hooks rotos, páginas no funcionales

### 🚫 ARCHIVOS/CARPETAS ELIMINADOS - NO REFERENCIAR:
- `frontend/src/context/AuthContext.js` (problemático)
- `frontend/src/pages/AdminDashboard.jsx` (753 líneas rotas)
- `frontend/src/hooks/` (hooks problemáticos)
- `assets/` (carpeta externa eliminada)
- Ramas: backup/antes-recuperacion, feature/phase-2-auth-premium

### 🎯 ENFOQUE ACTUAL:
- **Backend:** Sistema completo funcional - NO TOCAR
- **Frontend:** Template Sportpar adaptado a Basketball Team Management
- **Integración:** Conectar formularios template con endpoints backend existentes
- **NO desarrollar:** Componentes custom complejos, usar template base