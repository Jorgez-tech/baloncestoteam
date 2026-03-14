# Propuesta de Despliegue (Conceptual)

## 1. Arquitectura de Despliegue Actual
Actualmente, el proyecto ya está dockerizado con 3 componentes principales:
- **Frontend (React)**: Empaquetado y servido a través de Nginx (`frontend/Dockerfile` y `frontend/nginx.conf`).
- **Backend (Node.js/Express)**: Aplicación API servida a través de Node (`backend/Dockerfile`).
- **Base de Datos (MongoDB)**: Definida en `docker-compose.yml` utilizando persistencia en volúmenes.

## 2. Opciones de Hosting (Cloud Providers)

### Opción A: Servidor Privado Virtual (VPS) - Recomendado para bajo coste y control total
*Proveedores: DigitalOcean, Linode, AWS EC2, Azure Virtual Machines.*
Dado que el proyecto ya se ejecuta con **Docker Compose**, esta es la transición más directa.
- **Ventajas:** Menor costo mensual, control absoluto sobre el servidor, fácil migración utilizando exactamente el mismo `docker-compose.yml`.
- **Despliegue:**
  1. Proveer una máquina virtual basada en Ubuntu.
  2. Instalar Docker y Docker Compose en la máquina.
  3. Clonar el repositorio.
  4. Levantar la aplicación con `docker-compose up -d`.

### Opción B: Plataforma como Servicio (PaaS) - Enfoque más gestionado
*Proveedores: Render, Heroku, Azure App Service.*
- **Ventajas:** Gestionan la configuración subyacente del sistema operativo, CI/CD integrado directamente con GitHub, y escalado fácil por componente.
- **Despliegue:**
  - Desplegar el repositorio directamente apuntando al `Dockerfile` del Frontend y del Backend como servicios independientes.
  - La base de datos se alojaría preferiblemente en un entorno gestionado como **MongoDB Atlas**.

## 3. Base de Datos (MongoDB)
Para la base de datos, aunque se puede correr en un contenedor de Docker en producción en un VPS (como está ahora), para una mayor garantía y seguridad de los datos:
- **Recomendación:** Considerar migrar los datos a **MongoDB Atlas** (el DBaaS gestionado por MongoDB).
- **Justificación:** Se encarga de la escalabilidad, la disponibilidad y especialmente las **copias de seguridad automáticas** (backups). Esto evitaría pérdidas de información del usuario (colecciones `players`, `users`, etc.).
- **Impacto:** Sólo se requiere actualizar la variable de entorno `MONGO_URI` apuntando a MongoDB Atlas en vez del contenedor local.

## 4. Gestión de Nombre de Dominio y SSL/HTTPS
- **Dominio:** Registrar un nombre (ej. `mibaloncestoteam.com`) apuntando al servidor mediante un registro A del DNS.
- **Certificado SSL:** Es vital para la seguridad web y para el correcto funcionamiento si existen características como login/registros.
- **Implementación:** Se puede usar **Certbot / Let's Encrypt** instalando un servicio de Reverse Proxy delante de nuestro Nginx (como un contenedor adicional en Docker Compose usando `jwilder/nginx-proxy` o `Traefik`).

## 5. Integración Continua y Despliegue Continuo (CI/CD)
Se recomienda establecer un pipeline automático básico utilizando **GitHub Actions**.
- **Acción (CI):** Ejecutar linting y pruebas. Asegurar que las imágenes Docker del backend y frontend construyan correctamente sin errores en la rama `main` o al hacer un Pull Request.
- **Acción (CD) (Opcional por ahora):** Conectar a través de SSH al entorno de producción, hacer un `git pull`, reconstruir las imágenes de los nuevos contenedores (`docker-compose build`), y reiniciarlos (`docker-compose up -d`).

## 6. Siguientes Pasos
1. **Decidir la infraestructura** considerando el presupuesto (VPS vs PaaS).
2. **Definir dominio y SSL**.
3. Replicar el volumen local de la base de datos a un servicio gestionado (MongoDB Atlas) o planear copias automatizadas (CRON jobs locales) en el VPS.
4. Implementar los `secrets` del entorno de producción (`.env.production`).
