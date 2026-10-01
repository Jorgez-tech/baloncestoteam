# Vision Arquitectonica y Modelo de Dominio

**Version:** 1.0  
**Estado:** Documento de referencia — No implementar sin aprobacion previa  
**Ultima actualizacion:** Julio 2026

---

## 1. Contexto del Proyecto

El sistema parte de un repositorio funcional Node.js + Express + MongoDB con arquitectura monolitica.

Estado actual verificado:

| Elemento | Estado |
|---|---|
| Backend | Node.js + Express (puerto 5000) |
| Frontend | React + Context API (puerto 3000) |
| Base de datos | MongoDB `basketball_team` |
| Despliegue | Docker Compose (4 servicios) |
| Autenticacion | JWT + Redis blacklist |
| Autorizacion | RBAC basico (admin/user) |

Modelos existentes en produccion:

- `User` — identidad tecnica, roles
- `Player` — jugador con estadisticas
- `Game` — evento competitivo (archivo: `Photo.js` — deuda tecnica de naming)
- `Practice` — entrenamiento (archivo: `Description.js` — deuda tecnica de naming)

---

## 2. Vision de Producto

La plataforma evoluciona desde la gestion de un unico club de baloncesto hacia una **plataforma integral de gestion deportiva** con capacidad de soportar multiples clubes en el futuro.

### Alcance inicial

- Un club
- Multiples categorias: Primer equipo masculino, rama femenina, series inferiores (Sub-14, Sub-16, Sub-18, Sub-20), senior
- Jugadores, staff tecnico, entrenadores
- Historial deportivo y estadisticas
- Gestion de socios y relacion tutor-menor

### Capacidades futuras reservadas

- Multi-club (SaaS)
- Tienda del club
- Membresías y pagos
- Aplicacion movil
- Notificaciones
- Ticketing y soporte

---

## 3. Mapa de Dominio (Bounded Contexts)

Cada bounded context es un area semanticamente autonoma del negocio. Los contextos no dependen entre si directamente; se comunican via contratos o eventos.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PLATAFORMA DEPORTIVA                         │
│                                                                     │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐   │
│  │ Identity &   │   │ Club Core    │   │ Sports Management    │   │
│  │ Access       │   │              │   │                      │   │
│  │ (Auth)       │   │ Club,        │   │ Category, Team,      │   │
│  │              │   │ Temporadas,  │   │ Player, TeamPlayer,  │   │
│  │ User,        │   │ Sede         │   │ Staff, Game,         │   │
│  │ Sesion,      │   │              │   │ Practice, Stats      │   │
│  │ Tokens       │   └──────────────┘   └──────────────────────┘   │
│  └──────────────┘                                                   │
│                                                                     │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐   │
│  │ Membership   │   │ Billing      │   │ Audit &              │   │
│  │              │   │ (futuro)     │   │ Compliance           │   │
│  │ Socio,       │   │              │   │                      │   │
│  │ Tutor,       │   │ Pagos,       │   │ AuthAuditLog,        │   │
│  │ Dependiente  │   │ Mensualidad, │   │ BusinessAuditLog     │   │
│  │              │   │ Cuota        │   │                      │   │
│  └──────────────┘   └──────────────┘   └──────────────────────┘   │
│                                                                     │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐   │
│  │ Commerce     │   │ Communica-   │   │ Support &            │   │
│  │ (futuro)     │   │ tions        │   │ Ticketing            │   │
│  │              │   │ (futuro)     │   │ (futuro)             │   │
│  │ Tienda,      │   │              │   │                      │   │
│  │ Catalogo,    │   │ Push, Email, │   │ Tickets,             │   │
│  │ Pedidos      │   │ SMS          │   │ SLA                  │   │
│  └──────────────┘   └──────────────┘   └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Modelo de Dominio

### 4.1 Entidades Nucleares

| Entidad | Descripcion | Invariante clave |
|---|---|---|
| `Club` | Raiz organizacional | Una configuracion activa por instancia |
| `Category` | Nivel competitivo (Sub-14, Senior, etc.) | Nombre unico por club; extensible sin hardcode |
| `Team` | Unidad competitiva por categoria/rama/temporada | Pertenece a exactamente una categoria |
| `Player` | Persona deportista | Historial de equipos obligatorio |
| `TeamPlayer` | Asignacion historica jugador-equipo | No puede estar activo en dos equipos de la misma categoria simultaneamente |
| `User` | Identidad tecnica de acceso | Email unico en el sistema |
| `Socio` | Miembro del club (adulto o tutor) | Tutor debe tener al menos un menor vinculado |
| `Game` | Evento competitivo | Requiere equipo, rival, fecha y resultado |
| `Practice` | Evento de entrenamiento | Requiere equipo, fecha y duracion |

### 4.2 Value Objects

| Value Object | Descripcion | Validacion propia |
|---|---|---|
| `Email` | Direccion de correo | Formato RFC valido, lowercase |
| `JerseyNumber` | Numero de camiseta | Rango 1-99, unico en equipo activo |
| `PlayerPosition` | Posicion en cancha | Enum cerrado por tipo de deporte |
| `Season` | Periodo temporal | Año/ciclo valido, determina vigencia de asignaciones |
| `MemberStatus` | Estado del socio | Activo, suspendido, baja |
| `PhoneNumber` | Numero de telefono | Formato internacional |

### 4.3 Relaciones del Dominio

```
Club (1) ──── (N) Category
Club (1) ──── (N) Team
Category (1) ── (N) Team
Team (N) ──── (N) Player   [via TeamPlayer]
Team (1) ──── (N) Game
Team (1) ──── (N) Practice
Socio (1) ─── (N) Player   [menores, via DependentLink]
User (1) ──── (0..1) Player
User (1) ──── (0..1) Socio
```

### 4.4 Reglas de Negocio Base

1. Un jugador no puede estar activo en dos equipos de la misma categoria en la misma temporada.
2. Un jugador menor debe tener al menos un tutor/socio vinculado.
3. Las categorias son configurables; no deben estar hardcodeadas en logica.
4. El historial de TeamPlayer es inmutable: los cambios de equipo crean nuevos registros, no sobreescriben.
5. Un socio puede ser adulto independiente o tutor de uno o mas menores.
6. El numero de camiseta debe ser unico dentro de un equipo activo.

---

## 5. Gap Documentado

Entidades faltantes que deben incorporarse en la evolucion:

| Entidad | Estado | Prioridad |
|---|---|---|
| `Club` | Ausente | Alta (Fase 2) |
| `Category` | Ausente | Alta (Fase 2) |
| `Team` | Ausente | Alta (Fase 2) |
| `TeamPlayer` | Ausente | Alta (Fase 2) |
| `Socio` | Ausente | Media (Fase 3) |
| `DependentLink` | Ausente | Media (Fase 3) |
| `PaymentObligation` | Futuro | Baja (Fase 4) |
| `PaymentTransaction` | Futuro | Baja (Fase 4) |

Deuda tecnica existente:

- `Game` vive en `backend/models/Photo.js` — archivo con nombre semanticamente incorrecto
- `Practice` vive en `backend/models/Description.js` — archivo con nombre semanticamente incorrecto
- Estos archivos deben renombrarse en la primera oportunidad de refactor sin riesgo de datos

---

## 6. Preparacion Multi-Club (Futura)

La arquitectura debe quedar **tenant-ready by design** sin activar multi-tenancy ahora.

Criterio de preparacion:

- Introducir `clubId` como campo de particion logica en todas las nuevas entidades
- No activar aislamiento de datos por tenant hasta que sea un requisito real
- No aumentar la complejidad operativa actual por este requisito futuro

Cuando la necesidad multi-club sea real, el campo `clubId` ya existente permite activar la separacion sin migraciones masivas.

---

## 7. Principios Arquitectonicos

1. **Evolucion incremental** — Cambios que no rompan lo que ya funciona.
2. **Simplicidad antes que complejidad** — Agregar complejidad solo cuando el problema lo justifique.
3. **Dominio independiente** — Las reglas del negocio no deben conocer MongoDB, Express ni JWT.
4. **Datos primero** — Proteger la integridad de los datos reales en produccion.
5. **Seguridad y auditoria by design** — No como agregado posterior.
6. **Observabilidad como parte del producto** — Logs, trazas y auditorias son funcionalidad, no decoracion.

---

**Referencia:** Ver `CLEAN_ARCHITECTURE.md` para el diseño de capas tecnicas que implementa esta vision.  
**Referencia:** Ver `MODULES.md` para los limites y responsabilidades de cada modulo.  
**Referencia:** Ver `../engineering/DEVELOPMENT_PHASES.md` para el roadmap de implementacion.
