const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

class MailerService {
    constructor() {
        // En desarrollo/testing podemos usar variables falsas si no hay SMTP
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        
        this.from = process.env.SMTP_FROM || '"Club de Baloncesto" <no-reply@baloncesto.com>';
        this.templatesPath = path.join(__dirname, '../templates');
    }

    /**
     * Renderiza un archivo .ejs con la data inyectada.
     */
    async renderTemplate(templateName, data) {
        return ejs.renderFile(path.join(this.templatesPath, `${templateName}.ejs`), data);
    }

    /**
     * Envía el correo usando el transporter.
     */
    async sendMail(to, subject, html) {
        try {
            const info = await this.transporter.sendMail({
                from: this.from,
                to,
                subject,
                html
            });
            console.log(`[MAILER] Correo enviado a ${to}. MessageId: ${info.messageId}`);
            
            // Si usamos Ethereal (pruebas locas), NodeMailer nos da una URL para ver el correo
            if (info.messageId && process.env.SMTP_HOST?.includes('ethereal')) {
                console.log(`[MAILER] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            }
            return info;
        } catch (error) {
            console.error(`[MAILER ERROR] Fallo envío a ${to}:`, error.message);
            throw error;
        }
    }

    // --- EVENTOS ESPECÍFICOS SEGÚN ROLES ---

    /**
     * Para cualquier Usuario: Recuperación de contraseña.
     */
    async sendPasswordReset(email, code) {
        const html = await this.renderTemplate('password-reset', { code });
        // No esperamos (await) para no bloquear el hilo de respuesta al cliente
        this.sendMail(email, 'Código de Recuperación de Contraseña', html).catch(() => {});
    }

    /**
     * Para Staff/Coaches: Asignación a un equipo.
     */
    async sendRoleAssignedAlert(email, name, role, teamName) {
        const roleNames = {
            'head_coach': 'Entrenador Principal',
            'asst_coach': 'Entrenador Asistente',
            'staff': 'Staff Administrativo',
            'scorekeeper': 'Anotador Oficial'
        };
        const prettyRole = roleNames[role] || role;
        
        const html = await this.renderTemplate('role-assigned', { name, role: prettyRole, teamName });
        this.sendMail(email, `¡Bienvenido al equipo ${teamName}!`, html).catch(() => {});
    }

    /**
     * Para formularios públicos de contacto: notifica al buzón del club.
     */
    async sendContactMessage({ nombre, email, telefono, mensaje }) {
        const recipient = process.env.CONTACT_RECIPIENT_EMAIL || 'contacto@baloncestoteam.com';
        const html = await this.renderTemplate('contact-message', { nombre, email, telefono, mensaje });
        // El envío es el propósito del endpoint: un fallo debe propagarse al cliente.
        return this.sendMail(recipient, `Nuevo mensaje de contacto: ${nombre}`, html);
    }

    /**
     * Para Socios/Apoderados: Cuota Generada (Mensualidad, matrícula, etc).
     */
    async sendObligationGeneratedAlert(email, memberName, title, amount, dueDate, link) {
        const html = await this.renderTemplate('payment-generated', { 
            name: memberName, 
            title, 
            amount: amount.toLocaleString('es-CL'), 
            dueDate: new Date(dueDate).toLocaleDateString('es-CL'),
            link 
        });
        this.sendMail(email, `Nueva Cuota Disponible: ${title}`, html).catch(() => {});
    }
}

module.exports = new MailerService();
