# Plan de Desarrollo por Fases

**Version:** 1.0  
**Estado:** Hoja de ruta aprobada — No implementar sin confirmacion de inicio de fase  
**Ultima actualizacion:** Julio 2026

---

## Principios del Roadmap

- Cada fase entrega valor funcional completo antes de iniciar la siguiente
- Ninguna fase requiere reescritura de lo anterior
- La infraestructura evoluciona a la par de las necesidades, no por anticipacion
- Cada cambio se protege con tests antes de ser mergeado

---

## Resumen de Fases

| Fase | Nombre | Alcance principal |
|---|---|---|
| Fase 1 | Consolidacion del nucleo | Reorganizacion interna, deuda tecnica, base solida |
| Fase 2 | Dominio deportivo completo | Club, Categories, Teams, TeamPlayers, Staff |
| Fase 3 | Socios y base de pagos | Socios, tutores, menores, obligaciones de cobro |
| Fase 4 | Capacidades satelite | Store, Notifications, Support, Mobile API, SaaS-ready |

---

## Fase 1: Consolidacion del Nucleo

### Objetivo

Convertir el monolito actual en un **monolito modular**: misma base de codigo, pero con separacion clara de responsabilidades por capa y modulo. Sin cambios en la API publica. Sin migracion de datos.

### Entregables

**1.1 Reorganizacion estructural interna**

- Separar el codigo en capas: dominio, aplicacion, infraestructura, presentacion
- Mover logica de negocio que hoy vive en routers hacia casos de uso y servicios de dominio
- Crear interfaces de repositorio para `Player` y `User`
- Implementar `MongoPlayerRepository` e `MongoUserRepository` como adaptadores

**1.2 Normalizacion de modelos**

- Renombrar `backend/models/Photo.js` → `backend/models/game.model.js`
- Renombrar `backend/models/Description.js` → `backend/models/practice.model.js`
- Verificar que los datos existentes en produccion no sean afectados (el nombre del modelo Mongoose es lo que importa, no el nombre del archivo)

**1.3 Contrato de errores homogeneo**

- Definir catalogo de errores de dominio (tipados, sin mensajes HTTP)
- Mapeo de errores de dominio a codigos HTTP en la capa de presentacion
- Eliminar respuestas de error inconsistentes entre routers

**1.4 DTOs por caso de uso**

- Definir DTOs de entrada y salida para `RegisterPlayer`, `GetPlayer`, `ListPlayers`
- Definir DTOs de entrada y salida para `Login`, `Register`

**1.5 Auditoria basica persistente**

- Crear coleccion `audit_logs` en MongoDB
- Migrar los `console.log('[AUDIT]')` actuales a escritura en esa coleccion
- Estructura estandar: `{ actorId, action, targetEntity, targetId, metadata, timestamp, ip }`

**1.6 Logs estructurados**

- Adoptar formato JSON estructurado para todos los logs del servidor
- Incluir `requestId` y `userId` en cada log de request
- No logs de datos sensibles (contrasenas, tokens completos)

**1.7 Seguridad: refresh tokens y cookies HttpOnly**

- Implementar refresh token rotation
- Migrar de `localStorage` a cookies HttpOnly en el frontend
- Agregar endpoint `POST /auth/refresh`
- Agregar endpoint `POST /auth/forgot-password` + `POST /auth/verify-reset-code` + `POST /auth/reset-password` (flujo completo con codigo de verificacion de 6 digitos — ver `SECURITY_STRATEGY.md` seccion 2b)

**1.8 Tests de regresion**

- Verificar que todos los tests existentes continuan pasando
- Agregar tests de integracion para los nuevos casos de uso refactorizados

### Criterio de completitud de Fase 1

- La API publica funciona exactamente igual que antes
- Los datos de produccion estan intactos
- La estructura interna esta organizada por capas
- Los tests pasan al 100%
- La auditoria escribe en MongoDB, no solo en consola

---

## Fase 2: Dominio Deportivo Completo

### Objetivo

Incorporar las entidades de dominio deportivo faltantes: Club, Category, Team, TeamPlayer, Staff y Coach. El sistema pasa de gestionar "jugadores sueltos" a gestionar una estructura deportiva completa.

### Entregables

**2.1 Entidad Club**

- Modelo de dominio: `Club` con datos institucionales
- Repositorio e implementacion Mongoose
- CRUD basico via API admin
- Introduccion de `clubId` como campo de particion en todas las nuevas entidades

**2.2 Entidades Category y Team**

- `Category`: nombre, descripcion, rama (masculina/femenina), rango etario
- `Team`: nombre, categoria, temporada, estado activo/inactivo
- Relacion `Club → Category → Team`
- API REST con CRUD para admin

**2.3 Entidad TeamPlayer (asignacion historica)**

- Registra la asignacion de un jugador a un equipo con temporada y estado
- Invariante: un jugador no puede estar activo en dos equipos de la misma categoria en la misma temporada
- El historial es inmutable: cambios crean nuevos registros
- Caso de uso: `AssignPlayerToTeamUseCase` con validacion de invariante

**2.4 Staff y Entrenadores**

- Entidades `Coach` y `Staff` con vinculacion a equipos
- Rol `coach` en el sistema de autenticacion
- Acceso restringido ABAC: un entrenador solo ve jugadores de su equipo

**2.5 Estadisticas mejoradas**

- Estadisticas por partido (en `Game`)
- Calculo de estadisticas acumuladas por jugador y por temporada
- Historial deportivo consultable

**2.6 API de temporadas**

- Crear, activar y cerrar temporadas
- Relacion de todos los recursos historicos con la temporada correspondiente

### Criterio de completitud de Fase 2

- El sistema representa correctamente la estructura: Club → Category → Team → Player
- El historial deportivo es trazable por temporada
- Los tests de invariantes del dominio pasan
- La API de Sports Management esta documentada en OpenAPI

---

## Fase 3: Socios y Base de Pagos

### Objetivo

Incorporar el universo de socios del club, la relacion tutor-menor y las obligaciones de cobro. Los pagos no se ejecutan aun, pero el dominio queda preparado.

### Entregables

**3.1 Entidad Socio**

- Tipos: adulto independiente, tutor/apoderado
- Estado: activo, suspendido, baja
- Vinculacion opcional a un `User` del sistema

**3.2 Relacion DependentLink (tutor-menor)**

- Un socio tutor puede vincularse a uno o mas jugadores menores
- Un menor debe tener al menos un tutor vinculado (invariante)
- Un mismo menor puede tener multiples tutores (copagadores)

**3.3 Nucleo familiar**

- Agrupacion logica de socios y sus dependientes
- Facilita calculo de cuotas familiares en fases futuras

**3.4 Obligaciones de cobro (sin ejecucion)**

- Entidad `PaymentObligation`: tipo de cobro, monto, periodo, estado (pendiente/pagado/vencido)
- Generacion periodica de obligaciones (sin pasarela aun)
- Consulta de estado de cuenta por socio

**3.5 Panel de socios en admin**

- Listado de socios con estado
- Vista de obligaciones pendientes
- Vinculacion de socios a jugadores menores

**3.6 Idempotencia en operaciones de membresia**

- Altas de socios idempotentes
- Cambios de estado criticos idempotentes

### Criterio de completitud de Fase 3

- El sistema representa el universo completo de socios del club
- Las relaciones tutor-menor estan modeladas y validadas
- Las obligaciones de cobro son visibles sin ejecutar pagos reales
- Los tests de invariantes de Members pasan

---

## Fase 4: Capacidades Satelite y Escala

### Objetivo

Activar capacidades que amplian el alcance del sistema: tienda, notificaciones, soporte, app movil, y preparacion para multi-club.

### Entregables

**4.1 Billing / Payments**

- Integracion con MercadoPago y/o Transbank
- Ejecucion de cobros de mensualidades
- Registro de transacciones
- Conciliacion y reintentos
- Idempotencia completa en operaciones de cobro

**4.2 Store / Commerce**

- Catalogo de productos (uniformes, articulos)
- Gestion de stock
- Pedidos vinculados a socios

**4.3 Notifications**

- Notificaciones transaccionales: confirmacion de pago, alta de socio, asignacion a equipo
- Canales: email (minimo), push y SMS como extensiones futuras
- Historial de notificaciones enviadas

**4.4 Support / Ticketing**

- Apertura de tickets por socios y jugadores
- Seguimiento de estado
- SLA basico

**4.5 API orientada a mobile**

- Endpoints optimizados para consumo movil
- Autenticacion compatible con app nativa
- Sin reescribir la logica de negocio existente

**4.6 Auditoria avanzada**

- AuthAuditLog completo y consultable
- BusinessAuditLog por modulo
- Dashboard de auditoria para admin
- Alertas de patrones anomalos (intentos de login masivos, etc.)

**4.7 Preparacion multi-club**

- Activar aislamiento por `clubId` en queries
- Roles de `super_admin` y `club_admin`
- Configuracion por instancia de club
- Evaluacion de separacion en instancias independientes si el volumen lo requiere

### Criterio de completitud de Fase 4

- El sistema opera en produccion con pagos reales
- Las notificaciones transaccionales estan activas
- La API movil esta documentada y testeada
- El sistema esta preparado para soportar multiples clubes

---

## Deuda Tecnica a Resolver (sin fase asignada)

Estas tareas no bloquean funcionalidad pero deben resolverse oportunamente:

| Deuda | Descripcion | Riesgo si no se resuelve |
|---|---|---|
| Naming de archivos de modelos | `Photo.js` = Game, `Description.js` = Practice | Confusion permanente en nuevos desarrolladores |
| AuthContext en localStorage | Tokens en localStorage son vulnerables a XSS | Bajo en uso actual, alto si se agrega contenido de terceros |
| Logs de auditoria en consola | `console.log('[AUDIT]')` no es consultable ni persistente | Perdida de trazabilidad en incidentes |
| Validacion de entrada inconsistente | Algunos endpoints no validan todos los campos | Posibles errores de datos en produccion |

---

**Referencia:** Ver `VISION_AND_DOMAIN.md` para el modelo de dominio que sustenta este plan.  
**Referencia:** Ver `MODULES.md` para los limites de cada modulo a implementar.  
**Referencia:** Ver `../qa/QA_STRATEGY.md` para la estrategia de tests por fase.
