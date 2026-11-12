# Estrategia de Seguridad

**Version:** 1.0  
**Estado:** Documento de referencia — No implementar sin aprobacion previa  
**Ultima actualizacion:** Julio 2026

---

## 1. Estado Actual de Seguridad

> Estado al cierre del Sprint 1.4 (ver `.agents/IMPLEMENTATION_PLAN.md`). Las capacidades marcadas como *Pendiente* son mejoras objetivo.

| Capacidad | Estado |
|---|---|
| JWT de acceso (vida corta: 15 min) | Implementado |
| Blacklist de tokens via Redis | Implementado |
| Logout seguro | Implementado (invalida token en Redis) |
| RBAC basico (admin/user) | Implementado |
| Rate limiting global | Implementado (express-rate-limit) |
| Rate limiting por endpoint de auth | Pendiente (ver auditoría A-06) |
| Helmet (headers HTTP seguros) | Implementado |
| Hashing de contrasenas (bcrypt) | Implementado |
| CORS configurado | Implementado |
| Auditoria persistente (`audit_logs`) | Implementado (Sprint 1.3) |
| Refresh token rotation | Implementado (Sprint 1.4) |
| Cookies HttpOnly | Implementado (backend); consumo en frontend pendiente |
| Recuperacion de contrasena con codigo de verificacion | Implementado (Sprint 1.4, ver seccion 2b) |
| OTP | Pendiente |
| ABAC | Pendiente (over-fetching detectado) |
| IP blacklist | Pendiente |
| Idempotency keys | Pendiente |

---

## 2. Estrategia de Autenticacion (Evolucion)

### Estado actual

El sistema usa JWT con expiracion de 1 hora. El token se envia en el header `Authorization: Bearer`. Redis almacena tokens invalidos hasta su expiracion natural.

### Estado objetivo

```
1. Login:
   - Validar credenciales
   - Generar Access Token (vida corta: 15 min)
   - Generar Refresh Token (vida larga: 7-30 dias)
   - Guardar Refresh Token hasheado en DB (no en Redis)
   - Retornar Access Token en cookie HttpOnly + Secure + SameSite=Strict
   - Retornar Refresh Token en cookie HttpOnly separada

2. Request autenticado:
   - Leer Access Token desde cookie HttpOnly
   - Verificar firma y expiracion
   - Verificar que no este en blacklist

3. Renovacion automatica:
   - Access Token expirado → usar Refresh Token
   - Verificar Refresh Token en DB
   - Invalidar Refresh Token usado (rotation)
   - Emitir nuevo par de tokens
   - Registrar rotacion en AuthAuditLog

4. Logout:
   - Invalidar Access Token en blacklist (hasta expiracion)
   - Invalidar Refresh Token en DB
   - Limpiar cookies
   - Registrar en AuthAuditLog
```

### Justificacion del cambio

| Decision | Razon |
|---|---|
| Cookies HttpOnly en lugar de localStorage | Previene ataques XSS que roban tokens |
| Access Token de vida corta | Limita la ventana de exposicion si es comprometido |
| Refresh Token rotation | Un token robado solo puede usarse una vez |
| Refresh Token en DB hasheado | Permite invalidacion real y auditoria |

---

## 2b. Recuperacion de Contrasena con Codigo de Verificacion

### Flujo completo

```
1. POST /auth/forgot-password  { email }
   - Verificar que el email existe en el sistema
   - Si no existe: responder identico al caso exitoso (evitar enumeracion de usuarios)
   - Si existe:
     - Generar codigo de verificacion numerico de 6 digitos (criptograficamente aleatorio)
     - Hashear el codigo con bcrypt antes de persistirlo
     - Guardar en coleccion password_reset_tokens:
         { userId, codeHash, expiresAt (15 min), usedAt: null, createdAt }
     - Invalidar tokens de reset anteriores del mismo usuario
     - Enviar email al usuario con el codigo en texto plano
     - Registrar en AuthAuditLog: { action: 'PASSWORD_RESET_REQUESTED', userId, ip }

2. POST /auth/verify-reset-code  { email, code }
   - Buscar token activo para el email (no expirado, no usado)
   - Verificar el codigo contra el hash almacenado (bcrypt.compare)
   - Si falla:
     - Incrementar contador de intentos fallidos
     - Bloquear despues de 5 intentos fallidos (mismo token se invalida)
   - Si pasa:
     - Marcar el token como verificado (no borrar aun)
     - Emitir un reset_session_token de un solo uso (UUID v4, vida: 10 min)
     - Registrar en AuthAuditLog: { action: 'PASSWORD_RESET_CODE_VERIFIED', userId, ip }

3. POST /auth/reset-password  { resetSessionToken, newPassword }
   - Verificar que el resetSessionToken existe y no ha expirado
   - Verificar que no fue ya utilizado
   - Validar la nueva contrasena contra las reglas de seguridad:
     - Minimo 8 caracteres
     - Al menos una mayuscula, una minuscula, un numero
     - No puede ser igual a la contrasena actual
   - Hashear la nueva contrasena con bcrypt (cost factor >= 12)
   - Actualizar contrasena del usuario
   - Marcar el resetSessionToken como usado (no borrar: permite auditoria)
   - Invalidar todos los Refresh Tokens activos del usuario (forzar re-login)
   - Invalidar Access Tokens activos en blacklist
   - Registrar en AuthAuditLog: { action: 'PASSWORD_RESET_COMPLETED', userId, ip }
   - Enviar email de confirmacion de cambio de contrasena
```

### Estructura de la coleccion `password_reset_tokens`

```js
{
  userId:              ObjectId,   // referencia al usuario
  codeHash:            String,     // bcrypt hash del codigo de 6 digitos
  resetSessionToken:   String,     // UUID v4 emitido tras verificacion exitosa (null hasta paso 2)
  failedAttempts:      Number,     // contador de intentos fallidos en paso 2
  expiresAt:           Date,       // expiracion del codigo (15 min desde emision)
  sessionExpiresAt:    Date,       // expiracion del resetSessionToken (10 min desde verificacion)
  usedAt:              Date,       // fecha de uso (null si no fue utilizado)
  createdAt:           Date,
  ip:                  String,     // IP desde la que se solicito el reset
}
```

### Invariantes de seguridad del flujo

| Invariante | Razon |
|---|---|
| Respuesta identica para email existente y no existente | Previene enumeracion de usuarios |
| Codigo generado con `crypto.randomInt(100000, 999999)` | Garantiza aleatoriedad criptografica |
| Codigo hasheado antes de persistir | Si la DB es comprometida, los codigos no son utiles |
| Maximo 5 intentos de verificacion | Previene fuerza bruta sobre el codigo de 6 digitos |
| resetSessionToken de un solo uso | Previene reuso si es interceptado |
| Invalida todos los tokens de sesion al completar el reset | Expulsa sesiones comprometidas |
| No borrar tokens usados | Permite auditoria forense |

### Ejemplo de email (contenido en español)

```
Asunto: Codigo de verificacion para restablecer tu contrasena

Hola [nombre],

Recibimos una solicitud para restablecer la contrasena de tu cuenta.

Tu codigo de verificacion es: 847 293

Este codigo expira en 15 minutos.

Si no solicitaste este cambio, ignora este mensaje. Tu contrasena no sera modificada.

Equipo [Club]
```

---

## 3. Estrategia de Autorizacion

### RBAC (Role-Based Access Control)

Verifica el rol del usuario antes de llegar a los casos de uso.

Roles actuales: `admin`, `user`

Roles objetivo (futuros):

| Rol | Descripcion |
|---|---|
| `super_admin` | Administrador de plataforma (futuro multi-club) |
| `club_admin` | Administrador del club |
| `coach` | Entrenador con acceso a su equipo |
| `player` | Jugador con acceso a su propio perfil |
| `socio` | Miembro con acceso a su cuenta |
| `user` | Usuario registrado sin perfil deportivo |

RBAC se evalua en el **middleware de presentacion**: bloquea acceso si el rol no esta permitido para ese endpoint.

### ABAC (Attribute-Based Access Control)

Verifica atributos contextuales dentro de los casos de uso.

Ejemplos de reglas ABAC:

- Un entrenador solo puede ver los jugadores de su equipo activo
- Un socio solo puede ver sus propias obligaciones de pago
- Un admin de club no puede ver datos de otro club (futuro multi-club)
- Un jugador no puede modificar su propio perfil deportivo

ABAC se evalua en los **casos de uso** porque requiere datos del dominio para resolverse.

### Por que RBAC no es suficiente

RBAC dice "los entrenadores pueden leer jugadores". ABAC dice "este entrenador puede leer estos jugadores especificos". El segundo requiere conocer la relacion entrenador-equipo-jugador, lo que solo esta disponible en el contexto del caso de uso.

---

## 4. Prevencion de Ataques Comunes

### Fuerza bruta y enumeracion

- Rate limiting por IP en endpoints de autenticacion (mas estricto que el global)
- Rate limiting por usuario en intentos de login fallidos
- Respuestas de error genericas en login ("credenciales invalidas", nunca "usuario no existe")
- IP blacklist para IPs con comportamiento anomalo (futuro)

### Inyeccion

- **Mongoose NO sanitiza automaticamente consultas**: un objeto `{ $gt: "" }` pasado directamente como filtro es un vector de NoSQL injection valido
- Whitelistear siempre los campos permitidos en filtros antes de pasarlos a Mongoose (e.g. `{ email: req.body.email }` en lugar de `{ ...req.body }`)
- Usar `express-mongo-sanitize` para eliminar claves que empiezan por `$` o contienen `.` en el cuerpo, params y query de cada request
- No usar `eval()` ni construccion dinamica de queries sin sanitizacion
- Validar y sanitizar toda entrada en la capa de presentacion con una libreria de esquemas (Joi / Zod)

### XSS

- Cookies HttpOnly previenen acceso JS a tokens
- Helmet configura headers seguros
- Content Security Policy en Nginx (frontend)

### CSRF

- Cookies con `SameSite=Strict` mitigan CSRF
- Tokens de idempotencia en operaciones criticas

### JWT

- Verificar firma antes de usar cualquier claim
- No aceptar algoritmo `none`
- Verificar expiracion siempre

---

## 5. Idempotencia

Las operaciones con efectos secundarios irreversibles deben ser idempotentes.

Casos que requieren idempotencia:

- Cobros y transacciones de pago
- Registro de socios
- Asignacion definitiva de jugadores
- Cambios de estado criticos (baja de socio, suspension)

Mecanismo: `Idempotency-Key` en el header. El servidor registra la clave y el resultado; si recibe la misma clave, retorna el resultado previo sin ejecutar nuevamente.

---

## 6. Auditoria de Seguridad

### AuthAuditLog

Registra todos los eventos de autenticacion y autorizacion:

| Evento | Datos a registrar |
|---|---|
| Login exitoso | userId, ip, userAgent, timestamp |
| Login fallido | email intentado, ip, userAgent, timestamp |
| Logout | userId, ip, timestamp |
| Refresh token rotation | userId, ip, timestamp |
| Token invalido o expirado | ip, userAgent, token parcial, timestamp |
| Recuperacion de contrasena | email, ip, timestamp |
| Cambio de contrasena | userId, ip, timestamp |
| Acceso denegado (403) | userId, recurso intentado, rol actual, timestamp |

### BusinessAuditLog

Registra eventos de negocio con impacto critico:

| Evento | Datos a registrar |
|---|---|
| Creacion de jugador | actorId, jugadorId, timestamp |
| Asignacion a equipo | actorId, jugadorId, equipoId, temporadaId, timestamp |
| Alta de socio | actorId, socioId, tipo, timestamp |
| Activacion/suspension de usuario | actorId, targetUserId, accion, timestamp |
| Eliminacion de usuario | actorId, targetUserId, timestamp |
| Cobro procesado (futuro) | actorId, socioId, monto, resultado, timestamp |

### Principios del sistema de auditoria

- Los logs de auditoria son **inmutables**: no se editan ni borran
- Se persisten en coleccion MongoDB dedicada, separada de los datos operativos
- Son **consultables** por actores autorizados via API
- La auditoria no bloquea la operacion del sistema (no es un paso obligatorio en la transaccion)

---

## 7. Gestion de Secretos y Configuracion

| Variable | Nivel de sensibilidad | Gestion |
|---|---|---|
| `JWT_SECRET` | Critico | Solo en variables de entorno del servidor, nunca en codigo |
| `MONGO_URI` | Alto | Variable de entorno, diferente por ambiente |
| `REDIS_PASS` | Alto | Variable de entorno |
| Claves de pasarela de pago | Critico | Variable de entorno, rotacion periodica |
| Claves de email (API keys) | Alto | Variable de entorno |

Reglas:

- Nunca hacer commit de archivos `.env` con valores reales
- Usar `.env.example` con valores ficticios para compartir la estructura
- Rotar secretos comprometidos inmediatamente
- Auditar acceso a secretos en produccion

---

## 8. Seguridad en la Capa de Transporte

| Mecanismo | Estado | Descripcion |
|---|---|---|
| HTTPS / TLS | Requerido en produccion | Reverse proxy (Nginx) con certificado |
| HSTS | Configurar via Nginx | Fuerza HTTPS en el navegador |
| Certificados SSL | Let's Encrypt | Renovacion automatica con Certbot |
| Headers seguros | Implementado (Helmet) | X-Content-Type-Options, X-Frame-Options, etc. |

---

## 9. Principios de Diseno Seguro

1. **Defense in depth:** multiples capas de control; si una falla, las demas contienen el dano.
2. **Principio de minimo privilegio:** cada actor accede solo a lo que necesita para su funcion.
3. **Fail secure:** en caso de error o duda, denegar acceso.
4. **Auditoria obligatoria:** toda accion con efecto critico debe quedar registrada.
5. **Separacion de secretos:** los datos de autenticacion no viajan junto a los datos de negocio.
6. **Validacion en la frontera:** toda entrada externa se valida antes de ser procesada.

---

> **Documentación subordinada al Centro de Operaciones.** Las decisiones de seguridad vigentes son los ADR de `.agents/DECISIONS.md` (ADR-004 cookies HttpOnly, ADR-005 reset de contraseña). Este documento aporta el detalle de defensa en profundidad que complementa esa fuente única de verdad.

**Referencia:** Ver `.agents/DECISIONS.md` (ADR-004/005) para las decisiones de autenticación aceptadas.  
**Referencia:** Ver `.agents/SPEC.md` y `.agents/SYSTEMS_MAP.md` para el módulo `auth` y sus contratos.  
**Referencia:** Ver `.agents/IMPLEMENTATION_PLAN.md` para el orden de implementación de capacidades de seguridad.
