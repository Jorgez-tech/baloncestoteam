const request = require('supertest');
const app = require('../server');

describe('API Documentation Endpoints', () => {
    describe('GET /api/v1/docs', () => {
        it('should redirect to Swagger UI', async () => {
            const response = await request(app)
                .get('/api/v1/docs')
                .expect(301);

            // Swagger UI middleware might redirect to add trailing slash
            expect(response.headers['location']).toContain('/api/v1/docs');
        });

        it('should serve Swagger UI with trailing slash', async () => {
            const response = await request(app)
                .get('/api/v1/docs/')
                .expect(200);

            // Verificar que es una página HTML con Swagger UI
            expect(response.headers['content-type']).toContain('text/html');
            expect(response.text).toContain('swagger-ui');
        });
    });

    describe('GET /api-docs', () => {
        it('should redirect to /api/v1/docs', async () => {
            const response = await request(app)
                .get('/api-docs')
                .expect(302);

            // Verificar que redirige al endpoint correcto
            expect(response.headers['location']).toBe('/api/v1/docs');
        });

        it('should eventually serve Swagger UI after redirects', async () => {
            // Seguir las redirecciones automáticamente
            const response = await request(app)
                .get('/api-docs')
                .redirects(5) // Permitir hasta 5 redirecciones
                .expect(200);

            // Verificar que es una página HTML con Swagger UI
            expect(response.headers['content-type']).toContain('text/html');
            expect(response.text).toContain('swagger-ui');
        });
    });

    describe('Documentation Content Validation', () => {
        it('should serve Swagger UI properly', async () => {
            const response = await request(app)
                .get('/api/v1/docs/')
                .expect(200);

            const htmlContent = response.text;
            
            // Verificar que se incluye Swagger UI
            expect(htmlContent).toContain('swagger-ui');
            
            // Verificar que la página no está vacía y contiene elementos de Swagger UI
            expect(htmlContent.length).toBeGreaterThan(1000);
        });
    });

    describe('Health Check', () => {
        it('should return OK status', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'OK');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
        });
    });
});