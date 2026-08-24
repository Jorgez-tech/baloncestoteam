# Arquitectura Limpia y Modular

**Version:** 1.0  
**Estado:** Documento de referencia — No implementar sin aprobacion previa  
**Ultima actualizacion:** Julio 2026

---

## 1. Fundamento: Por que Arquitectura Limpia

El objetivo es que el negocio deportivo (sus reglas, sus entidades, sus invariantes) permanezca **estable e independiente** de:

- MongoDB
- Express
- Mongoose
- JWT
- Redis
- APIs externas
- Cualquier libreria de terceros

Esto permite:
- Testear el dominio sin base de datos ni servidor
- Cambiar el stack tecnico sin reescribir el negocio
- Agregar nuevos canales (REST, GraphQL, mobile) sin duplicar logica
- Evolucionar la infraestructura por partes, sin detener el sistema

---

## 2. Las Cuatro Capas

La regla de oro: **las dependencias solo apuntan hacia adentro**. Las capas internas no saben que las externas existen.

```
┌─────────────────────────────────────────────────────┐
│  PRESENTACION / DELIVERY                            │
│  (Express routers, controllers, middleware HTTP)    │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  INFRAESTRUCTURA                              │  │
│  │  (MongoDB, Mongoose, Redis, JWT, Email)        │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐ │  │
│  │  │  APLICACION (Casos de uso)              │ │  │
│  │  │  (orquestacion, DTOs, interfaces)       │ │  │
│  │  │                                         │ │  │
│  │  │  ┌───────────────────────────────────┐  │ │  │
│  │  │  │  DOMINIO                          │  │ │  │
│  │  │  │  (entidades, value objects,       │  │ │  │
│  │  │  │   reglas, invariantes)            │  │ │  │
│  │  │  └───────────────────────────────────┘  │ │  │
│  │  └─────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 3. Capa de Dominio

### Proposito

Expresar las reglas del negocio del club deportivo. Es el nucleo del sistema. No depende de ninguna tecnologia.

### Que vive aqui

- **Entidades:** `Player`, `Team`, `Club`, `Category`, `Socio`, `User`, `TeamPlayer`
- **Value Objects:** `Email`, `JerseyNumber`, `PlayerPosition`, `Season`, `MemberStatus`
- **Reglas de negocio** expresadas como comportamiento de las entidades
- **Invariantes:** garantizan consistencia del estado del agregado
- **Interfaces de repositorios:** `PlayerRepository`, `TeamRepository` — contratos, no implementaciones
- **Eventos de dominio** (conceptualmente): `PlayerAssignedToTeam`, `MemberRegistered`

### Que NO puede vivir aqui

| Prohibido | Razon |
|---|---|
| Mongoose / MongoDB | El dominio define que datos necesita, no como se persisten |
| Express / Fastify | El dominio no sabe si lo invocan via HTTP, CLI o tests |
| JWT / Sessions | La identidad llega ya validada al dominio |
| Nodemailer / SendGrid | El envio de email es una consecuencia, no una regla |
| Redis | La blacklist de tokens es un detalle de infraestructura |
| Joi / Zod | Validan formato de entrada HTTP; el dominio valida coherencia de negocio |
| Variables de entorno | La configuracion no pertenece al negocio |

### Ejemplo conceptual de regla de dominio

La regla "un jugador no puede estar activo en dos equipos de la misma categoria en la misma temporada" es una regla del dominio. Debe vivir en la entidad `TeamPlayer` o en el servicio de dominio correspondiente, **no en un router Express ni en un repositorio Mongoose**.

---

## 4. Capa de Aplicacion (Casos de Uso)

### Proposito

Orquestar el dominio para cumplir objetivos de negocio concretos. Define lo que el sistema puede hacer, sin conocer como lo hace a nivel tecnico.

### Que vive aqui

- **Casos de uso:** `RegisterPlayerUseCase`, `AssignPlayerToTeamUseCase`, `LoginUseCase`
- **DTOs de entrada y salida:** contratos tipados entre capas
- **Interfaces de servicios externos:** `ITokenService`, `IEmailService`, `IPaymentGateway`
- **Politicas de autorizacion de negocio** (ABAC): logica contextual que necesita datos del dominio

### Que NO puede vivir aqui

- Objetos HTTP (Request, Response, headers, cookies)
- Implementaciones de repositorios con Mongoose
- Detalles de JWT (solo la interfaz `ITokenService`)
- Detalles de email (solo la interfaz `IEmailService`)
- Middleware de Express
- Schemas de validacion HTTP de librerias externas

### Estructura de un caso de uso

1. Recibir un DTO de entrada (ya validado formalmente)
2. Consultar entidades necesarias via interfaces de repositorio
3. Invocar comportamiento del dominio
4. Persistir cambios via interfaces de repositorio
5. Emitir eventos si corresponde
6. Retornar un DTO de salida

---

## 5. Capa de Infraestructura

### Proposito

Implementar todos los contratos definidos por el dominio y la aplicacion usando tecnologias concretas. Es el lugar de los "detalles tecnicos".

### Que vive aqui

- Repositorios Mongoose: `MongoPlayerRepository implements PlayerRepository`
- Servicios de autenticacion: `JwtTokenService implements ITokenService`
- Servicios de email: `NodemailerEmailService implements IEmailService`
- Adaptadores de pasarelas de pago: `MercadoPagoAdapter implements IPaymentGateway`
- Conexion a MongoDB, Redis, servicios de terceros
- Schemas Mongoose (solo como mappers de persistencia)
- Implementacion persistente del modulo de auditoria

### Por que estos son "detalles tecnicos"

Un detalle tecnico es algo que puede cambiar sin que cambien las reglas del negocio. Ejemplos:

| Elemento | Puede cambiar por | Sin afectar |
|---|---|---|
| MongoDB | PostgreSQL | Reglas de eligibilidad de jugadores |
| Mongoose | Prisma | Invariantes del dominio |
| JWT | PASETO / sesiones | Logica de login del negocio |
| Nodemailer | SendGrid | Regla "notificar al tutor cuando..." |
| MercadoPago | Transbank | Regla de cobro mensual |
| Redis | DynamoDB | Invalidacion de tokens |

### Principio de Inversion de Dependencias (DIP)

El dominio define **puertos** (interfaces).  
La infraestructura provee **adaptadores** (implementaciones).

Esto es el patron **Ports and Adapters** (Arquitectura Hexagonal):

```
Puerto (Dominio): PlayerRepository
        |
        | implementado por
        ↓
Adaptador (Infraestructura): MongoPlayerRepository
```

---

## 6. Capa de Presentacion (Delivery)

### Proposito

Exponer los casos de uso al mundo exterior. Puede ser HTTP/REST, GraphQL, CLI, WebSocket, o una app movil.

### Que vive aqui

- Routers Express
- Controllers: reciben HTTP, invocan casos de uso, formatean respuesta
- Middleware: autenticacion, rate limiting, validacion de formato, manejo de errores HTTP
- Mapeo de errores de dominio a codigos HTTP
- Configuracion de Swagger/OpenAPI
- DTOs de presentacion si difieren de los de aplicacion

### Que NO puede vivir aqui

- Logica de negocio
- Consultas directas a MongoDB
- Reglas de autorizacion complejas (deben vivir en casos de uso)

---

## 7. Direccion de Dependencias

### Permitidas

```
Presentacion → Aplicacion
Aplicacion → Dominio (interfaces)
Infraestructura → Dominio (implementa contratos)
Infraestructura → Aplicacion (provee implementaciones via inyeccion)
Presentacion → Infraestructura (solo en Composition Root)
```

### Prohibidas (absolutas)

```
Dominio → cualquier otra capa
Aplicacion → Infraestructura
Aplicacion → Presentacion
Dominio → Mongoose / JWT / Redis / Express / APIs externas
```

### Diagrama de dependencias

```
PRESENTACION
     |
     | depende de
     ↓
APLICACION (Casos de uso)
     |
     | depende de interfaces definidas en
     ↓
DOMINIO
     ↑
     | implementa contratos del dominio
     |
INFRAESTRUCTURA
     ↑
     | configura e inyecta
     |
PRESENTACION (solo en Composition Root)
```

---

## 8. El Composition Root

El unico lugar donde todas las capas se conocen es el **punto de arranque del servidor** (`server.js` o equivalente).

Ahi se:
1. Instancian repositorios concretos (infraestructura)
2. Se inyectan en los casos de uso (aplicacion)
3. Los casos de uso se registran en los controllers (presentacion)

Fuera del Composition Root, cada capa solo habla con interfaces.

---

## 9. Autorizacion por Capas

La autorizacion debe aplicarse en dos niveles complementarios:

| Nivel | Tipo | Donde vive | Ejemplo |
|---|---|---|---|
| Grueso | RBAC (roles) | Middleware de presentacion | "Solo admins pueden acceder a /admin" |
| Fino | ABAC (atributos) | Casos de uso | "Un entrenador solo ve los jugadores de su equipo" |

La logica ABAC requiere datos del dominio para evaluarse. Por eso no puede resolverse solo con un rol en el middleware; necesita contexto del caso de uso.

---

## 10. Estructura Conceptual por Modulo

Cada modulo del sistema (Auth, Sports, Members, etc.) replica internamente esta estructura de capas:

```
module/
  domain/
    entities/
    value-objects/
    interfaces/       <- repository and service contracts
  application/
    use-cases/
    dtos/
  infrastructure/
    repositories/     <- Mongoose implementations
    services/         <- JWT, email, payments
  presentation/
    routers/
    controllers/
    middleware/
```

Esta estructura permite que cada modulo sea cohesionado internamente y con bajo acoplamiento externo.

---

**Referencia:** Ver `VISION_AND_DOMAIN.md` para el modelo de dominio completo.  
**Referencia:** Ver `MODULES.md` para los limites de cada modulo.  
**Referencia:** Ver `SECURITY_STRATEGY.md` para la estrategia de seguridad por capas.
