# 🤝 Guía de Contribución - Basketball Team

¡Gracias por tu interés en contribuir al proyecto Basketball Team! Esta guía te ayudará a participar de manera efectiva.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estándares de Código](#estándares-de-código)
- [Mensajes de Commit](#mensajes-de-commit)
- [Testing](#testing)
- [Documentación](#documentación)

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código.

- Sé respetuoso y constructivo
- Acepta críticas constructivas
- Ayuda a crear un ambiente acogedor para todos

## 🚀 Cómo Contribuir

### Reportar Bugs

1. Verifica que el bug no haya sido reportado anteriormente
2. Abre un issue con la plantilla de bug
3. Incluye información detallada:
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Información del ambiente (OS, navegador, versión de Node.js)

### Solicitar Features

1. Abre un issue con la plantilla de feature request
2. Describe el problema que resuelve
3. Propone una solución
4. Espera feedback antes de comenzar a desarrollar

### Enviar Cambios

1. Fork el repositorio
2. Crea una rama feature
3. Desarrolla los cambios
4. Ejecuta tests y linting
5. Crea un Pull Request

## 🔄 Flujo de Trabajo

### 1. Configuración Inicial

```bash
# Fork y clonar el repositorio
git clone https://github.com/TU_USUARIO/baloncestoteam.git
cd baloncestoteam

# Configurar upstream
git remote add upstream https://github.com/Jorgez-tech/baloncestoteam.git

# Instalar dependencias
cd backend && npm install
cd ../frontend && npm install
```

### 2. Crear Rama Feature

```bash
# Actualizar main
git checkout main
git pull upstream main

# Crear nueva rama
git checkout -b feature/nombre-descriptivo
```

### 3. Desarrollar

- Mantén los cambios pequeños y enfocados
- Haz commits frecuentes con mensajes descriptivos
- Ejecuta tests regularmente

### 4. Testing

```bash
# Backend
cd backend
npm test
npm run lint

# Frontend  
cd frontend
npm test
npm run lint
```

### 5. Preparar PR

```bash
# Sincronizar con upstream
git fetch upstream
git rebase upstream/main

# Push a tu fork
git push origin feature/nombre-descriptivo
```

### 6. Crear Pull Request

- Usa la plantilla de PR
- Enlaza issues relacionados
- Incluye screenshots si hay cambios de UI
- Asegúrate que pasen todos los checks

## 📝 Estándares de Código

### JavaScript/JSX

- **ESLint**: Seguimos la configuración establecida
- **Prettier**: Formateo automático
- **ES6+**: Usa sintaxis moderna de JavaScript

```bash
# Ejecutar linting
npm run lint

# Formatear código
npm run format

# Fix automático de problemas de lint
npm run lint:fix
```

### Estructura de Archivos

#### Backend
```
backend/
├── models/          # Modelos de datos (Mongoose)
├── routers/         # Rutas de la API
├── middleware/      # Middleware personalizado
├── config/          # Configuración de DB, Redis, etc.
├── docs/            # Documentación OpenAPI
└── __test__/        # Tests
```

#### Frontend
```
frontend/src/
├── components/      # Componentes React
├── pages/           # Páginas/Vistas
├── context/         # Context API
├── api/             # Cliente API
├── styles/          # Estilos CSS
├── utils/           # Utilidades
└── __tests__/       # Tests
```

### Naming Conventions

- **Archivos**: camelCase para JS, PascalCase para componentes React
- **Variables**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Componentes**: PascalCase
- **CSS Classes**: kebab-case

## 📨 Mensajes de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(scope): descripción corta

[cuerpo opcional]

[footer opcional]
```

### Tipos
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (sin cambios de código)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Cambios en build, dependencias, etc.

### Ejemplos
```bash
feat(auth): agregar autenticación con JWT
fix(players): corregir validación de datos
docs(readme): actualizar instrucciones de instalación
test(players): agregar tests para CRUD operations
refactor(api): mejorar estructura de rutas
style(header): ajustar espaciado en componente
```

### Scope Sugeridos
- `auth`: Autenticación
- `players`: Funcionalidad de jugadores
- `api`: Backend API
- `ui`: Interfaz de usuario
- `tests`: Testing
- `docs`: Documentación
- `config`: Configuración

## 🧪 Testing

### Requisitos de Testing

- **Nuevas features**: Deben incluir tests
- **Bug fixes**: Deben incluir test que reproduzca el bug
- **Coverage**: Mantener ≥70% de cobertura

### Backend Testing

```bash
cd backend
npm test                    # Ejecutar todos los tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

**Incluir tests para**:
- Rutas de API (GET, POST, PUT, DELETE)
- Middleware de autenticación
- Validaciones de datos
- Casos edge

### Frontend Testing

```bash
cd frontend
npm test                   # Ejecutar todos los tests
npm test -- --coverage    # Coverage report
```

**Incluir tests para**:
- Renderizado de componentes
- Interacciones de usuario
- Rutas y navegación
- Hooks personalizados
- Integración con API

## 📚 Documentación

### README Updates

- Mantén el README actualizado con nuevas features
- Incluye ejemplos de uso
- Actualiza instrucciones de instalación si es necesario

### Código

- Comenta código complejo
- Usa JSDoc para funciones importantes
- Mantén comentarios concisos y útiles

### API Documentation

- Actualiza `docs/openapi.yaml` para nuevos endpoints
- Incluye ejemplos de request/response
- Documenta códigos de error

## 🔍 Code Review

### Como Autor
- Haz self-review antes de solicitar review
- Responde a comentarios de manera constructiva
- Mantén el PR enfocado y pequeño

### Como Reviewer
- Sé constructivo y específico
- Enfócate en el código, no en la persona
- Aprueba solo si estás satisfecho con la calidad

## 🏷️ Issues y Labels

### Labels de Issues
- `bug`: Reporte de bug
- `enhancement`: Nueva funcionalidad
- `documentation`: Mejoras en documentación
- `good first issue`: Bueno para nuevos contribuyentes
- `help wanted`: Se busca ayuda de la comunidad

### Templates
Usa las plantillas de issues para reportes consistentes.

## ❓ Preguntas

Si tienes preguntas:

1. Revisa la documentación existente
2. Busca en issues existentes
3. Abre un issue con la etiqueta `question`

## 🎉 Reconocimiento

Todos los contribuyentes serán reconocidos en:
- README.md
- Release notes
- Hall of fame (futuro)

---

**¡Gracias por contribuir al proyecto Basketball Team! 🏀**

Para más información, consulta:
- [DESARROLLO-GUIA.md](./DESARROLLO-GUIA.md) - Estado y checklist del proyecto
- [README.md](./README.md) - Información general del proyecto