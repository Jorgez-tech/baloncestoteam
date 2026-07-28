# Estrategia de QA y Testing

**Version:** 1.0  
**Estado:** Documento de referencia — No implementar sin aprobacion previa  
**Ultima actualizacion:** Julio 2026

---

## 1. Filosofia de Testing

El sistema tiene cuatro capas arquitectonicas. Cada capa tiene un tipo de test natural y un proposito distinto:

| Capa | Tipo de test prioritario | Dependencias externas |
|---|---|---|
| Dominio | Tests unitarios puros | Ninguna (sin DB, sin HTTP) |
| Aplicacion (Casos de uso) | Tests unitarios con mocks | Repositorios e interfaces mockeados |
| Infraestructura | Tests de integracion | MongoDB de test, Redis de test |
| Presentacion | Tests de integracion HTTP | Supertest con app Express |
| Sistema completo | Tests end-to-end | Entorno completo levantado |

La piramide de testing recomendada:

```
         /\
        /E2E\         <- pocos, lentos, costosos
       /──────\
      / Integr. \     <- moderados, mas lentos
     /────────────\
    /  Unit (dominio  <- muchos, rapidos, sin dependencias
   /  y casos de uso) \
  /────────────────────\
```

---

## 2. Tests Unitarios de Dominio

### Que deben testear

- Invariantes de las entidades
- Comportamiento de value objects
- Reglas de negocio

### Caracteristicas obligatorias

- **Sin base de datos**
- **Sin HTTP**
- **Sin archivos de entorno** (`.env`)
- **Sin imports de Mongoose, JWT, Express**
- Deben correr en milisegundos
- Deben ser deterministas (mismo input, mismo output siempre)

### Ejemplos de casos a testear

**Entidad TeamPlayer**
- Un jugador asignado a un equipo no puede asignarse al mismo tiempo a otro equipo de la misma categoria
- Una asignacion con temporada invalida debe rechazarse
- El historial es inmutable: reasignar crea nuevo registro

**Value Object JerseyNumber**
- Un numero fuera del rango 1-99 debe ser rechazado
- Un numero duplicado dentro del mismo equipo activo debe ser rechazado

**Entidad Socio**
- Un tutor sin ningun menor vinculado no puede activarse
- El estado de baja es irreversible desde el dominio

**Entidad Player**
- Un jugador menor de 16 anos no puede crearse
- Un jugador no puede tener stats negativas

### Herramienta recomendada

Jest (ya instalado en el proyecto).

---

## 3. Tests Unitarios de Casos de Uso

### Que deben testear

- Orquestacion correcta: que el caso de uso llame a los repositorios y servicios correctos
- Manejo de errores: que se retornen los errores correctos ante situaciones de fallo
- DTOs: que la transformacion de entrada/salida sea correcta

### Estrategia de mocking

Los repositorios e interfaces de servicios externos deben mockearse. El caso de uso no sabe si usa MongoDB o un array en memoria.

```
// Patron conceptual
const mockPlayerRepository = {
  findById: jest.fn(),
  save: jest.fn(),
};
const useCase = new AssignPlayerToTeamUseCase(mockPlayerRepository, mockTeamRepository);
```

### Ejemplos de casos a testear

**AssignPlayerToTeamUseCase**
- Si el jugador no existe, lanza `PLAYER_NOT_FOUND`
- Si el equipo no existe, lanza `TEAM_NOT_FOUND`
- Si el jugador ya esta activo en la categoria, lanza `INVALID_TEAM_ASSIGNMENT`
- En caso exitoso, llama a `teamPlayerRepository.save` con los datos correctos

**LoginUseCase**
- Si el usuario no existe, retorna error `INVALID_CREDENTIALS` (mismo mensaje que password incorrecto)
- Si la contrasena no coincide, retorna error `INVALID_CREDENTIALS`
- En caso exitoso, llama a `tokenService.generateAccessToken`
- En caso exitoso, llama a `tokenService.generateRefreshToken`
- En caso exitoso, llama a `auditService.log` con evento `USER_LOGGED_IN`

---

## 4. Tests de Integracion de Infraestructura

### Que deben testear

- Que los repositorios Mongoose persisten y recuperan datos correctamente
- Que los indices funcionan segun lo esperado
- Que las queries complejas retornan los resultados correctos

### Configuracion requerida

- Base de datos MongoDB dedicada para tests: `basketball_team_test`
- Limpieza de colecciones antes/despues de cada suite
- Variable de entorno `MONGODB_TEST_URI` (ya definida en `.env.example`)
- No usar la base de datos de desarrollo ni produccion para tests

### Ciclo de vida de test

```
Antes de todos los tests: conectar a DB de test
Antes de cada test: limpiar colecciones relevantes
Durante el test: insertar fixtures, ejecutar operacion, verificar resultado
Despues de cada test: no es necesario limpiar (ya se hace antes)
Despues de todos los tests: desconectar DB
```

### Ejemplos de casos a testear

**MongoPlayerRepository**
- `findById` retorna el jugador correcto por su ObjectId
- `findById` retorna null si no existe
- `save` persiste un nuevo jugador con los campos correctos
- `findByTeam` retorna solo los jugadores del equipo solicitado
- `findByPosition` aplica el filtro de posicion correctamente

**MongoTeamPlayerRepository**
- `findActiveByCategory` retorna solo asignaciones activas en la categoria indicada
- La unicidad de asignacion activa es forzada correctamente

---

## 5. Tests de Integracion HTTP (API)

### Que deben testear

- Que los endpoints respetan el contrato documentado en OpenAPI
- Que la autenticacion y autorizacion funcionan correctamente
- Que la validacion de entrada retorna errores correctos

### Herramienta

`supertest` con la instancia de la app Express (ya en uso en `backend/__test__/`).

### Configuracion

- Usar base de datos de test (no produccion, no desarrollo)
- Mockear servicios externos (email, pagos) para no depender de ellos en CI
- Crear fixtures de usuarios/datos antes de los tests que los requieren

### Categorias de tests HTTP

**Autenticacion**
- `POST /auth/login` con credenciales validas retorna 200 con token
- `POST /auth/login` con credenciales invalidas retorna 401 siempre (sin distinguir usuario/password)
- `POST /auth/register` con email duplicado retorna 400
- Endpoint protegido sin token retorna 401
- Endpoint protegido con token expirado retorna 401
- Endpoint de admin con rol `user` retorna 403

**Jugadores**
- `GET /players` retorna lista paginada
- `POST /players` sin autenticacion retorna 401
- `POST /players` con datos invalidos retorna 400
- `GET /players/:id` con id inexistente retorna 404
- `DELETE /players/:id` con rol `user` retorna 403

**Respuestas de error**
- Todos los errores siguen el contrato `{ success: false, code, message }`
- Los codigos de error son semanticos (no generico "error")

---

## 6. Tests End-to-End

### Proposito

Verificar flujos completos de usuario en un entorno realista.

### Cuando ejecutarlos

- Antes de cada release
- No en cada PR (son lentos)

### Herramienta

Cypress (ya configurado en el proyecto: `frontend/cypress/`).

### Flujos criticos a cubrir

1. **Login y acceso a dashboard admin**
   - Navegar a `/login`
   - Ingresar credenciales de admin
   - Verificar redireccion a `/admin`
   - Verificar que el listado de usuarios carga

2. **Crear y visualizar jugador**
   - Login como admin
   - Navegar a dashboard
   - Crear jugador con datos validos
   - Verificar que aparece en el listado publico de `/jugadores`

3. **Acceso denegado a ruta protegida**
   - Navegar a `/admin` sin sesion
   - Verificar redireccion a `/login`

4. **Logout**
   - Login como admin
   - Ejecutar logout
   - Verificar que no puede acceder a `/admin`

---

## 7. Cobertura de Tests

### Umbrales recomendados

| Capa | Cobertura objetivo | Prioridad |
|---|---|---|
| Dominio (entidades, value objects) | 95%+ | Critica |
| Casos de uso | 90%+ | Alta |
| Repositorios (integracion) | 80%+ | Alta |
| Controllers / Routers | 70%+ | Media |
| Total | 80%+ | Alta |

### Que NO medir

La cobertura de lineas no es el objetivo. Una linea cubierta no significa una regla de negocio testeada. Priorizar:
- Que cada invariante del dominio tenga al menos un test
- Que cada caso de error del caso de uso tenga un test
- Que los contratos HTTP esten verificados

---

## 8. Tests de Seguridad

### Que deben verificarse en cada PR que toca autenticacion o autorizacion

| Caso | Descripcion |
|---|---|
| Token ausente | Endpoint protegido sin Authorization retorna 401 |
| Token invalido | Token manipulado retorna 401 |
| Token expirado | Token con `exp` en el pasado retorna 401 |
| Token revocado | Token en blacklist retorna 401 |
| Rol insuficiente | Usuario `user` accediendo a endpoint de `admin` retorna 403 |
| ABAC violado | Entrenador accediendo a jugadores de otro equipo retorna 403 |
| Auto-eliminacion | Admin intentando eliminarse a si mismo retorna 400 |

Estos tests ya existen parcialmente en `frontend/src/__tests__/Admin.test.jsx`. Deben expandirse para el backend.

---

## 9. Pipeline CI

### Tests que deben correr en cada PR (rapidos)

1. Lint (`npm run lint`)
2. Tests unitarios de dominio y casos de uso (`npm test`)
3. Build (verificar que compila sin errores)

### Tests que corren en merge a main

1. Todo lo anterior
2. Tests de integracion HTTP (contra DB de test)
3. Smoke tests (`node scripts/smoke.js`)

### Tests pre-release

1. Todo lo anterior
2. Tests end-to-end (Cypress)
3. Revision manual del changelog

### Configuracion actual

`.github/workflows/ci.yml` ya existe. Debe expandirse para incluir los tests de integracion.

---

## 10. QA por Fase de Desarrollo

| Fase | Foco de QA |
|---|---|
| Fase 1 | Tests de regresion para API existente; tests de dominio para entidades refactorizadas |
| Fase 2 | Tests de invariantes de TeamPlayer; tests de integracion de Club/Category/Team |
| Fase 3 | Tests de reglas de Socio/tutor-menor; idempotencia en altas de socios |
| Fase 4 | Tests de integracion con pasarelas de pago (mocks y sandbox); tests E2E de flujos de pago |

---

**Referencia:** Ver `../engineering/ENGINEERING_GUIDELINES.md` para convenciones de nombrado de archivos de test.  
**Referencia:** Ver `../engineering/DEVELOPMENT_PHASES.md` para el criterio de completitud de cada fase.  
**Referencia:** Ver `../architecture/CLEAN_ARCHITECTURE.md` para entender por que cada capa tiene su tipo de test.
