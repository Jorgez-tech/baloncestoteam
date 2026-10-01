# Modulos del Sistema

**Version:** 1.0  
**Estado:** Documento de referencia — No implementar sin aprobacion previa  
**Ultima actualizacion:** Julio 2026

---

## Principio de Organizacion

Cada modulo es un **bounded context** con autonomia semantica. Los modulos:

- Tienen sus propias entidades de dominio
- No comparten modelos internos con otros modulos
- Se comunican via **contratos explicitos** o **eventos de dominio**
- Pueden evolucionar independientemente

---

## Modulo 1: Auth (Identity and Access)

### Proposito

Gestionar identidad tecnica, acceso al sistema y ciclo de vida de sesiones.

### Responsabilidades

- Registro de usuarios
- Login / logout
- Generacion y validacion de tokens
- Refresh token rotation
- Recuperacion de contrasena
- OTP (futura capacidad)
- Invalidacion de tokens (blacklist)
- Prevencion de reutilizacion de contrasenas

### Limites

- No gestiona roles de negocio complejos: emite claims basicos en el token (id, email, rol)
- No decide si un usuario puede acceder a un recurso especifico (eso es ABAC en los casos de uso)
- No gestiona jugadores, socios ni equipos

### Dependencias

- Modulo `Audit` (escribe eventos de autenticacion)
- Redis (cache de blacklist)
- Servicio de email (para recuperacion de contrasena)

### Estado actual

- Implementado parcialmente: login, logout basico, JWT con blacklist Redis
- Pendiente: refresh token rotation, recuperacion de contrasena, OTP, prevencion de reutilizacion

---

## Modulo 2: Club

### Proposito

Representar la entidad organizacional raiz del sistema.

### Responsabilidades

- Datos institucionales del club (nombre, sede, contacto)
- Gestion de temporadas
- Configuracion global del club
- Base de datos de categorias disponibles

### Limites

- No gestiona personas (jugadores, socios, staff)
- No gestiona eventos deportivos directamente
- Provee el contexto organizacional al que todos los demas modulos se anclan

### Dependencias

- Ninguna dependencia directa de otros modulos de negocio
- Modulo `Audit` (escribe cambios de configuracion)

### Estado actual

- No implementado. Entidad `Club` ausente.

---

## Modulo 3: Sports Management

### Proposito

Gestionar toda la operacion deportiva del club.

### Responsabilidades

- **Categorias:** definicion, configuracion, extension
- **Equipos:** creacion, composicion por temporada
- **Jugadores:** registro, perfil, historial
- **TeamPlayer:** asignacion historica jugador-equipo
- **Staff y Entrenadores:** registro y vinculacion a equipos
- **Partidos:** resultado, estadisticas por partido
- **Entrenamientos:** registro, asistencia, notas
- **Estadisticas:** acumuladas y por evento

### Limites

- No gestiona identidad tecnica de usuarios (eso es Auth)
- No gestiona socios ni pagos
- Recibe notificacion de nuevos usuarios via evento para permitir creacion de perfil de jugador

### Dependencias

- Modulo `Club` (contexto organizacional)
- Modulo `Auth` (identidad del actor)
- Modulo `Audit` (eventos deportivos relevantes)

### Estado actual

- Implementado parcialmente: `Player`, `Game`, `Practice`
- Pendiente: `Club`, `Category`, `Team`, `TeamPlayer`, `Staff`, `Coach`

---

## Modulo 4: Members (Socios y Membresias)

### Proposito

Gestionar el universo de socios del club y sus relaciones familiares.

### Responsabilidades

- Registro de socios adultos
- Registro de tutores/apoderados
- Vinculacion tutor — jugador menor (DependentLink)
- Estado de membresia (activo, suspendido, baja)
- Generacion de obligaciones de cobro (sin ejecutar el pago)

### Limites

- No ejecuta pagos (solo registra la obligacion)
- No gestiona la operacion deportiva de los jugadores menores vinculados
- Depende de que el jugador ya exista en Sports Management

### Dependencias

- Modulo `Sports Management` (validacion de jugadores menores)
- Modulo `Billing` (emisor de obligaciones de cobro)
- Modulo `Audit`

### Estado actual

- No implementado. Entidades `Socio` y `DependentLink` ausentes.

---

## Modulo 5: Billing / Payments (Futuro)

### Proposito

Procesar transacciones economicas del club.

### Responsabilidades

- Ejecucion de cobros via pasarelas externas (MercadoPago, Transbank)
- Registro de transacciones
- Conciliacion de pagos
- Idempotencia en operaciones de cobro
- Manejo de fallos y reintentos

### Limites

- No decide que cobrar (eso viene de Members o Store)
- Solo ejecuta la instruccion de cobro y registra el resultado

### Dependencias

- Modulo `Members` (origen de obligaciones de membresia)
- Modulo `Store` (origen de obligaciones de compra)
- Modulo `Notifications` (confirmacion al socio)
- Modulo `Audit`

### Estado actual

- No implementado. Reservado arquitectonicamente.

---

## Modulo 6: Store / Commerce (Futuro)

### Proposito

Gestionar el comercio del club (uniformes, articulos deportivos, membresias).

### Responsabilidades

- Catalogo de productos
- Gestion de stock
- Pedidos
- Proceso de compra

### Limites

- No ejecuta pagos directamente (delega a Billing)
- No gestiona la operacion deportiva

### Dependencias

- Modulo `Billing` (ejecucion de cobros)
- Modulo `Members` (identificacion de compradores)
- Modulo `Notifications` (confirmacion de pedido)
- Modulo `Audit`

### Estado actual

- No implementado. Reservado arquitectonicamente.

---

## Modulo 7: Notifications (Futuro)

### Proposito

Gestionar toda la comunicacion transaccional e informativa hacia actores del sistema.

### Responsabilidades

- Producir y despachar notificaciones
- Gestion de canales: email, push, SMS
- Plantillas de mensajes
- Historial de notificaciones enviadas

### Limites

- No produce logica de negocio
- Es un consumidor de eventos emitidos por otros modulos
- No decide cuándo notificar; responde a eventos

### Dependencias

- Todos los modulos como productores de eventos
- Servicios externos: SendGrid, Firebase Cloud Messaging, proveedor SMS

### Estado actual

- No implementado. Reservado arquitectonicamente.

---

## Modulo 8: Audit

### Proposito

Proveer trazabilidad completa del sistema para seguridad, cumplimiento y debugging.

### Responsabilidades

- Persistir `AuthAuditLog`: eventos de autenticacion (login, logout, intentos fallidos, recuperacion)
- Persistir `BusinessAuditLog`: eventos de negocio (altas, bajas, cambios de estado, asignaciones)
- Exponer API de consulta auditada (solo admin)

### Limites

- Solo escribe y expone lectura
- No actua ni modifica el sistema en respuesta a eventos
- Ningun modulo depende funcionalmente de Audit para operar (es consumidor pasivo)

### Estado actual

- Implementado parcialmente: logs de consola con prefijo `[AUDIT]`
- Pendiente: coleccion dedicada en MongoDB, estructura estandar, API de consulta

---

## Modulo 9: Support / Ticketing (Futuro)

### Proposito

Gestionar incidencias y solicitudes de soporte interno y externo.

### Responsabilidades

- Apertura de tickets
- Seguimiento de estado
- Cierre y resolucion
- SLA basico

### Limites

- No resuelve directamente: es un canal de comunicacion estructurado
- Depende de Notifications para comunicar actualizaciones

### Estado actual

- No implementado. Reservado arquitectonicamente.

---

## Capacidades Transversales

Algunas capacidades cruzan multiples modulos. La decision de donde vivirán determina el grado de acoplamiento.

| Capacidad | Naturaleza | Ubicacion |
|---|---|---|
| Logging | Infraestructura | Libreria compartida, no en dominio |
| Auditoria | Modulo propio | Modulo `Audit`, consumidor pasivo de eventos |
| Autenticacion | Modulo `Auth` | Resuelto antes de llegar a casos de uso |
| Autorizacion RBAC | Middleware (presentacion) | Bloqueo temprano y generico |
| Autorizacion ABAC | Casos de uso (aplicacion) | Logica contextual con datos de dominio |
| Validacion de formato | Presentacion | Middleware o libreria de validacion HTTP |
| Validacion de negocio | Dominio | Invariantes en entidades |
| Manejo de errores | Por capas | Errores de dominio tipados; mapeo HTTP en presentacion |
| Observabilidad | Infraestructura | Correlacion de requests, metricas, trazas |

---

## Mapa de Dependencias entre Modulos

```
Auth ─────────────────────── Audit
Club ─────────────────────── Audit
Sports Management ────────── Club
Sports Management ────────── Auth
Sports Management ────────── Audit
Members ──────────────────── Sports Management (valida menores)
Members ──────────────────── Audit
Billing ──────────────────── Members
Billing ──────────────────── Notifications
Billing ──────────────────── Audit
Store ────────────────────── Billing
Store ────────────────────── Members
Store ────────────────────── Notifications
Store ────────────────────── Audit
Support ──────────────────── Notifications
Support ──────────────────── Audit
```

Regla: **no hay dependencias circulares entre modulos**. Los flujos van en una sola direccion logica.

---

**Referencia:** Ver `VISION_AND_DOMAIN.md` para el modelo de dominio.  
**Referencia:** Ver `CLEAN_ARCHITECTURE.md` para la estructura interna de cada modulo.  
**Referencia:** Ver `../engineering/DEVELOPMENT_PHASES.md` para el orden de implementacion.
