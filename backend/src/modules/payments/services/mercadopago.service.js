const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// Configurar con el Access Token del entorno
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-dummy-token',
    options: { timeout: 5000, idempotencyKey: true }
});

class MercadoPagoService {
    /**
     * Crea una preferencia de pago (Checkout Pro) para una obligación.
     */
    async createCheckoutPreference(obligation, member, userEmail) {
        const preference = new Preference(client);

        const body = {
            items: [
                {
                    id: obligation._id.toString(),
                    title: obligation.title,
                    description: `Pago de ${obligation.type} - Club Deportivo`,
                    quantity: 1,
                    unit_price: obligation.amount,
                    currency_id: 'CLP', // Pesos Chilenos
                }
            ],
            payer: {
                email: userEmail,
                name: member.memberNumber
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/payments/success`,
                failure: `${process.env.FRONTEND_URL}/payments/failure`,
                pending: `${process.env.FRONTEND_URL}/payments/pending`
            },
            auto_return: 'approved',
            // El external_reference es clave para conciliar el pago con nuestra Base de Datos
            external_reference: obligation._id.toString(),
            notification_url: `${process.env.BACKEND_URL || 'https://api.midominio.com'}/api/v1/obligations/webhook/mercadopago`,
            statement_descriptor: 'CLUB DEPORTIVO'
        };

        try {
            const response = await preference.create({ body });
            return {
                id: response.id,
                init_point: response.init_point, // URL para redirigir al usuario en prod
                sandbox_init_point: response.sandbox_init_point // URL para testing
            };
        } catch (error) {
            throw new Error(`Error al generar link de pago: ${error.message}`);
        }
    }

    /**
     * Consulta el estado de un pago directamente a Mercado Pago.
     * Útil para validar webhooks y evitar fraudes (spoofing).
     */
    async getPaymentDetails(paymentId) {
        const payment = new Payment(client);
        try {
            const data = await payment.get({ id: paymentId });
            return data;
        } catch (error) {
            throw new Error(`Error consultando pago en MP: ${error.message}`);
        }
    }
}

module.exports = new MercadoPagoService();
