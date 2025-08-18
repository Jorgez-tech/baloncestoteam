# 🤝 Guía de Contribución - Basketball Team 🏀

¡Gracias por tu interés en contribuir al proyecto Basketball Team! Esta guía te ayudará a entender el flujo de trabajo, convenciones y mejores prácticas que seguimos.

## 📋 Tabla de contenido

- [Configuración inicial](#configuración-inicial)
- [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)
- [Estilo de código](#estilo-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Nomenclatura](#nomenclatura)
- [Testing](#testing)

## 🛠️ Configuración inicial

1. Crea un fork del repositorio en tu cuenta de GitHub.
2. Clona el repositorio en tu máquina local:
   ```bash
   git clone https://github.com/TU-USERNAME/baloncestoteam.git
   cd baloncestoteam
   ```
3. Configura el upstream para mantener tu fork actualizado:
   ```bash
   git remote add upstream https://github.com/Jorgez-tech/baloncestoteam.git
   ```
4. Instala las dependencias del frontend y backend:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

## 🌿 Flujo de trabajo con Git

### Ramas

Seguimos un modelo basado en tipos de cambios. Las ramas deben nombrarse según el siguiente patrón:

- `feature/nombre-descriptivo` - Para nuevas características
- `fix/nombre-descriptivo` - Para corrección de bugs
- `chore/nombre-descriptivo` - Para tareas de mantenimiento
- `docs/nombre-descriptivo` - Para cambios en documentación
- `test/nombre-descriptivo` - Para cambios en tests

### Commits

Usamos el estándar [Conventional Commits](https://www.conventionalcommits.org/) para los mensajes de commit:

```
tipo(ámbito): descripción breve

Cuerpo del commit con descripción detallada (opcional)

Footer con referencias a issues, breaking changes, etc. (opcional)
```

**Tipos de commit más comunes:**
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios que no afectan el significado del código (espacios, formato, etc.)
- `refactor`: Cambio de código que no corrige bug ni añade característica
- `test`: Añadir o corregir tests
- `chore`: Cambios en el proceso de build o herramientas auxiliares

**Ejemplos:**
```
feat(auth): implementar sistema de recuperación de contraseña
fix(player): corregir error en la carga de perfiles
docs(readme): actualizar instrucciones de instalación
```

### Mantener el fork actualizado

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## 🎨 Estilo de código

### JavaScript/React

- Usamos ESLint y Prettier para mantener un estilo consistente
- Preferimos componentes funcionales con hooks en React
- Usamos punto y coma al final de las declaraciones
- Preferimos desestructuración de objetos y arrays
- Usamos import/export de ES6 en lugar de require/module.exports

### CSS/Estilos

- Nombres de clases en kebab-case (ej. `header-container`)
- Preferimos CSS modular o componentes con estilos aislados
- Variables CSS para colores y valores reutilizables

## 📥 Proceso de Pull Request

1. Asegúrate de que tu rama esté actualizada con la última versión de `main`
2. Ejecuta los tests y linting para verificar que todo funciona correctamente
3. Crea un Pull Request con una descripción clara de los cambios:
   - Qué cambios realiza el PR
   - Por qué se necesitan estos cambios
   - Cómo se han probado
   - Capturas de pantalla (si aplica)
4. Enlaza cualquier issue relacionado usando palabras clave como `Fixes #123`
5. Espera la revisión de código y responde a cualquier comentario o sugerencia
6. Una vez aprobado, el PR será fusionado

## 📝 Nomenclatura

### Archivos y carpetas

- **Componentes React**: PascalCase (ej. `PlayerCard.jsx`)
- **Utilidades/Helpers**: camelCase (ej. `authUtils.js`)
- **Archivos de test**: Mismo nombre que el archivo testeado con sufijo `.test.js` o `.spec.js`
- **Carpetas**: kebab-case para carpetas con múltiples palabras (ej. `user-settings`)

### Variables y funciones

- **Variables/Funciones**: camelCase (ej. `getUserData`)
- **Componentes/Clases**: PascalCase (ej. `PlayerProfileComponent`)
- **Constantes**: UPPER_SNAKE_CASE para constantes globales (ej. `API_BASE_URL`)
- **Hooks personalizados**: Prefijo `use` (ej. `usePlayerData`)

## 🧪 Testing

### Frontend

- Usamos Jest + React Testing Library
- Al menos un test por componente que valide su renderizado
- Tests para lógica de negocio importante
- Para ejecutar los tests:
  ```bash
  cd frontend
  npm test
  ```

### Backend

- Jest + Supertest para API endpoints
- Tests unitarios para funciones de utilidad
- Para ejecutar los tests:
  ```bash
  cd backend
  npm test
  ```

## 🚀 Despliegue

El proyecto tiene CI/CD configurado con GitHub Actions. Cada push a `main` ejecutará automáticamente los tests y linting.

---

**¿Preguntas?** Abre un issue con la etiqueta `question` o contacta directamente a los mantenedores.

¡Gracias por contribuir a Basketball Team! 🏀
