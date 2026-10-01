# Guia de Ingenieria

**Version:** 1.0  
**Estado:** Documento de referencia para todo el equipo de desarrollo  
**Ultima actualizacion:** Julio 2026

---

## 1. Principios de Ingenieria

Estos principios gobiernan todas las decisiones de implementacion:

1. **El dominio no depende de nada.** Las entidades de negocio no importan Mongoose, JWT, Express, ni ninguna libreria.
2. **Los casos de uso orquestan; no deciden.** La logica de negocio vive en el dominio; los casos de uso solo coordinan.
3. **La infraestructura implementa contratos.** Nunca al reves.
4. **Tests primero para logica de negocio.** Las reglas de dominio deben testearse sin base de datos ni servidor HTTP.
5. **Cambios incrementales.** Cada PR debe ser el minimo cambio necesario para avanzar.
6. **La API publica no se rompe sin deprecacion previa.** Cualquier cambio incompatible requiere version o periodo de migracion.

---

## 1b. Reglas de Codigo Obligatorias

Estas reglas se aplican a **todo archivo de codigo del proyecto** sin excepciones.

### Idioma del codigo

- **Todo el codigo debe escribirse en ingles**: nombres de variables, funciones, clases, metodos, comentarios de codigo, constantes, enums, mensajes de error internos, nombres de archivos.
- Los mensajes destinados al usuario final (respuestas de API, emails, notificaciones) se escriben en **español**.

```js
// CORRECTO
const MAX_LOGIN_ATTEMPTS = 5;
function validatePlayerAge(age) { ... }
throw new DomainError('PLAYER_NOT_FOUND');   // codigo interno en ingles

// INCORRECTO
const MAX_INTENTOS_LOGIN = 5;
function validarEdadJugador(edad) { ... }
```

### Prohibicion de bypass

No se permite ningun mecanismo que evite las validaciones, autorizaciones o invariantes del sistema:

```js
// PROHIBIDO
if (process.env.NODE_ENV === 'test') return true;  // bypass de autorizacion
if (user.role === 'admin') skipValidation();        // bypass de invariante
```

Los tests no deben modificar el comportamiento de produccion. Usar mocks de puertos en su lugar.

### Prohibicion de hardcoding

Ningun valor de configuracion, credencial, URL, secreto o parametro de negocio variable puede estar escrito directamente en el codigo:

```js
// PROHIBIDO
const token = jwt.sign(payload, 'my-secret-key');          // secreto hardcodeado
const dbUrl = 'mongodb://localhost:27017/basketball_team';  // URL hardcodeada
const maxPlayers = 15;                                      // parametro de negocio hardcodeado

// CORRECTO
const token = jwt.sign(payload, process.env.JWT_SECRET);
const dbUrl = process.env.MONGO_URI;
const maxPlayers = config.sports.maxPlayersPerTeam;
```

Toda variable de entorno debe estar documentada en `.env.example` con un valor ficticio y un comentario descriptivo.

### Prohibicion de `any` implicito

En codigo JavaScript, no usar patrones que anulen el contrato de tipos implicito del sistema:

- No pasar `req.body` directamente a una funcion de dominio o repositorio sin validacion y mapeo previo a DTO
- No usar `Object.assign(entity, req.body)` ni `{ ...req.body }` sin whitelisting explicito de campos
- Los DTOs deben declarar explicitamente cada campo aceptado

```js
// PROHIBIDO: spread de req.body sin filtrar
await createPlayerUseCase.execute({ ...req.body });

// CORRECTO: DTO con campos explicitamente declarados
const dto = {
  name: req.body.name,
  position: req.body.position,
  jerseyNumber: req.body.jerseyNumber,
};
await createPlayerUseCase.execute(dto);
```

---

## 2. Estructura de Modulos

Cada modulo del sistema sigue la misma estructura interna:

```
{modulo}/
  domain/
    entities/          <- entidades y value objects
    interfaces/        <- contratos de repositorios y servicios externos
    events/            <- eventos de dominio (si aplica)
  application/
    use-cases/         <- un archivo por caso de uso
    dtos/              <- contratos de entrada y salida
  infrastructure/
    repositories/      <- implementaciones Mongoose
    services/          <- JWT, email, pagos, etc.
    schemas/           <- Mongoose schemas (no son entidades)
  presentation/
    routers/
    controllers/
    middleware/
```

Esta estructura no es arbitraria: refleja la separacion de capas de la arquitectura limpia y facilita la navegacion del codigo.

---

## 3. Convenciones de Nombres

### Archivos

| Tipo | Convencion | Ejemplo |
|---|---|---|
| Entidad | `{nombre}.entity.js` | `player.entity.js` |
| Value Object | `{nombre}.vo.js` | `jersey-number.vo.js` |
| Caso de uso | `{accion}-{recurso}.use-case.js` | `assign-player-to-team.use-case.js` |
| Repositorio (interfaz) | `{recurso}.repository.js` | `player.repository.js` |
| Repositorio (implementacion) | `mongo-{recurso}.repository.js` | `mongo-player.repository.js` |
| Controller | `{recurso}.controller.js` | `player.controller.js` |
| Router | `{recurso}.router.js` | `player.router.js` |
| DTO | `{accion}-{recurso}.dto.js` | `create-player.dto.js` |
| Schema Mongoose | `{recurso}.schema.js` | `player.schema.js` |

### Variables y funciones

- `camelCase` para variables y funciones
- `PascalCase` para clases y constructores
- `UPPER_SNAKE_CASE` para constantes globales
- Nombres descriptivos, sin abreviaciones arbitrarias

### Endpoints REST

| Accion | Metodo | Patron |
|---|---|---|
| Listar | GET | `/api/v1/{recurso}` |
| Obtener uno | GET | `/api/v1/{recurso}/:id` |
| Crear | POST | `/api/v1/{recurso}` |
| Reemplazar | PUT | `/api/v1/{recurso}/:id` |
| Actualizar parcial | PATCH | `/api/v1/{recurso}/:id` |
| Eliminar | DELETE | `/api/v1/{recurso}/:id` |
| Acciones especiales | POST | `/api/v1/{recurso}/:id/{accion}` |

---

## 4. Convenciones de Commits

El proyecto usa **Conventional Commits**. Todo commit debe seguir este formato:

```
<tipo>(<scope>): <descripcion>

[cuerpo opcional]

[pie opcional]
```

### Tipos permitidos

| Tipo | Cuando usar |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Correccion de bug |
| `refactor` | Cambio de estructura sin cambiar comportamiento |
| `docs` | Solo documentacion |
| `test` | Solo tests |
| `chore` | Tareas de mantenimiento, dependencias, CI |
| `style` | Formato, espacios, punto y coma (sin cambio logico) |
| `perf` | Mejora de rendimiento |

### Scope

El scope es el modulo o capa afectada: `auth`, `players`, `teams`, `members`, `audit`, `infra`, `docs`.

### Ejemplos

```
feat(players): add player-to-team assignment use case
fix(auth): resolve refresh token not being invalidated on logout
refactor(players): extract player domain entity from mongoose model
test(teams): add invariant tests for team player assignment
docs(architecture): add clean architecture layer diagram
chore(deps): update express to 4.19.2
```

---

## 5. Flujo de Trabajo Git

### Ramas

| Tipo | Patron | Base | Ejemplo |
|---|---|---|---|
| Feature | `feat/{descripcion}` | `main` | `feat/team-management` |
| Fix | `fix/{descripcion}` | `main` | `fix/token-expiry` |
| Refactor | `refactor/{descripcion}` | `main` | `refactor/player-domain-layer` |
| Documentacion | `docs/{descripcion}` | `main` | `docs/architecture-guide` |
| Release | `release/{version}` | `main` | `release/2.0.0` |

### Proceso de merge

1. Crear rama desde `main` actualizado
2. Commits con formato Conventional Commits
3. Abrir Pull Request con descripcion completa usando la plantilla
4. CI debe estar en verde antes del merge
5. Al menos una revision antes del merge a `main`
6. Merge sin squash: preservar historia de commits

### Que nunca hacer en `main`

- Push directo
- Force push
- Merges sin revision

---

## 6. Convenciones de Respuesta API

### Respuesta exitosa

```
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 20,
    "pages": 2
  }
}
```

### Respuesta de error

```
{
  "success": false,
  "code": "PLAYER_NOT_FOUND",
  "message": "Jugador no encontrado",
  "details": []
}
```

### Codigos de error de dominio

Los errores del dominio tienen codigos semanticos, no codigos HTTP. El mapeo a HTTP ocurre en la capa de presentacion:

| Codigo de dominio | HTTP resultante | Situacion |
|---|---|---|
| `PLAYER_NOT_FOUND` | 404 | Entidad no existe |
| `EMAIL_ALREADY_REGISTERED` | 409 | Conflicto de unicidad |
| `INVALID_TEAM_ASSIGNMENT` | 422 | Invariante de negocio violada |
| `INVALID_CREDENTIALS` | 401 | Autenticacion fallida |
| `INSUFFICIENT_PERMISSIONS` | 403 | Autorizacion denegada |
| `VALIDATION_ERROR` | 400 | Datos de entrada invalidos |

---

## 7. Persistencia MongoDB: Guia de Decisiones

### Cuando usar referencias (ObjectId)

- La relacion cruza agregados de dominio
- El documento referenciado tiene crecimiento independiente
- Se necesita historial independiente de la relacion
- El dato es compartido por multiples documentos

Ejemplo: `TeamPlayer` referencia a `Player` y a `Team`. No embebe.

### Cuando usar documentos embebidos

- El dato tiene ciclo de vida conjunto con el padre
- Siempre se lee junto al documento padre
- El sub-documento no necesita existencia independiente
- El tamano del documento resultante no crece indefinidamente

Ejemplo: `stats` de un jugador por partido se embebe en el evento de partido.

### Indices obligatorios para nuevas colecciones

- Campos usados en filtros frecuentes (`position`, `isActive`)
- Campos de referencia (`user_id`, `team_id`, `club_id`)
- Campos de ordenamiento por defecto (`createdAt`)
- `clubId` en todas las nuevas colecciones (particion futura)

### Nombramiento de colecciones

- Plural, snake_case: `team_players`, `audit_logs`, `payment_obligations`
- Evitar nombres que colisionen con palabras reservadas de MongoDB

---

## 8. Anti-patrones Prohibidos

Estos patrones no deben introducirse en el codigo bajo ninguna circunstancia:

### Logica de negocio en routers

```
// PROHIBIDO
router.post('/players', async (req, res) => {
  if (player.age < 16) throw Error('...');  // regla de negocio en router
  await Player.create(req.body);            // acceso directo al modelo
});
```

### Modelo Mongoose como entidad de dominio

```
// PROHIBIDO: importar el modelo de infra en el dominio
const PlayerModel = require('../models/player');

class PlayerAssignmentService {
  async assign(playerId) {
    const player = await PlayerModel.findById(playerId); // acoplamiento a Mongoose
  }
}
```

### Fat Controller

Un controller que hace validacion, logica de negocio, persistencia y formateo en el mismo archivo. Cada responsabilidad tiene su capa.

### Importar infraestructura en el dominio

Cualquier `require('mongoose')`, `require('jsonwebtoken')`, `require('nodemailer')` dentro de entidades o servicios de dominio es un anti-patron critico.

### Audit log como `console.log`

```js
// PROHIBIDO en produccion
console.log(`[AUDIT] User deleted: ${userId}`);

// CORRECTO: evento de auditoria persistido
await auditService.log({ action: 'USER_DELETED', actorId, targetId: userId });
```

### Hardcoding de configuracion o secretos

Ver seccion 1b. Todo valor que pueda cambiar entre ambientes o que sea sensible debe venir de variables de entorno o configuracion externa. Nunca escrito directamente en el codigo.

### Bypass de validaciones con flags de ambiente

Ver seccion 1b. `if (process.env.NODE_ENV === 'test') { skipAuth(); }` es un anti-patron critico que introduce codigo de produccion con comportamiento diferente en tests.

### Dependencias circulares entre modulos

Si el modulo A importa del modulo B y el modulo B importa del modulo A, hay un problema de diseno. Resolverlo con interfaces o eventos de dominio.

---

## 9. Manejo de Variables de Entorno

### Ambientes

| Archivo | Proposito |
|---|---|
| `.env.example` | Plantilla documentada con valores ficticios. Se commitea. |
| `.env` | Valores locales de desarrollo. En `.gitignore`. |
| `.env.docker` | Base para Docker Compose. Variables sin valores sensibles. |
| Variables de entorno del servidor | Produccion. Nunca en archivos. |

### Variables requeridas

Todas las variables criticas deben validarse al inicio del servidor. Si faltan, el servidor no debe arrancar.

Ejemplo actual:
```
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not defined!');
  process.exit(1);
}
```

Este patron debe extenderse a todas las variables criticas: `MONGO_URI`, claves de servicios de pago, etc.

---

## 10. Documentacion de API

### OpenAPI / Swagger

- Toda nueva ruta debe documentarse en `backend/docs/openapi.yaml`
- Documentar: parametros, body, respuestas exitosas, respuestas de error
- La documentacion se sirve en `/api/v1/docs`

### Casos de uso

Cada caso de uso debe tener un comentario de bloque con:
- Precondiciones
- Postcondiciones
- Invariantes que verifica
- Errores que puede lanzar

---

**Referencia:** Ver `../architecture/CLEAN_ARCHITECTURE.md` para el modelo de capas que estas convenciones implementan.  
**Referencia:** Ver `../qa/QA_STRATEGY.md` para las convenciones de tests.  
**Referencia:** Ver `DEVELOPMENT_PHASES.md` para el orden de implementacion.
