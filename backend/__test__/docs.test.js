const path = require('path');
const request = require('supertest');
const YAML = require('yamljs');
const app = require('../server');

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

// Normaliza una ruta para poder compararla entre Express y OpenAPI:
// - elimina la barra final (salvo la raíz)
// - convierte los parámetros de Express (:id) al formato OpenAPI ({id})
const normalizePath = (routePath) => {
    const withoutTrailingSlash = routePath.length > 1 ? routePath.replace(/\/$/, '') : routePath;
    return withoutTrailingSlash.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
};

// Recorre el stack del router de Express y devuelve el conjunto de rutas reales
// como "METHOD /ruta/completa", resolviendo el prefijo de cada router montado.
const collectAppRoutes = (expressApp) => {
    const routes = new Set();

    const walk = (stack, prefix) => {
        stack.forEach((layer) => {
            if (layer.route) {
                const fullPath = normalizePath(`${prefix}${layer.route.path}`);
                Object.keys(layer.route.methods).forEach((method) => {
                    routes.add(`${method.toUpperCase()} ${fullPath}`);
                });
                return;
            }

            if (layer.name === 'router' && layer.handle && layer.handle.stack) {
                const mountPath = layer.regexp.source
                    .replace('^\\/', '/')
                    .replace('\\/?(?=\\/|$)', '')
                    .replace(/\\\//g, '/');

                walk(layer.handle.stack, `${prefix}${mountPath === '/' ? '' : mountPath}`);
            }
        });
    };

    walk(expressApp._router.stack, '');
    return routes;
};

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

// M-07 / H3.2: el contrato de openapi.yaml no debe documentar endpoints inexistentes.
describe('OpenAPI contract vs registered routes (M-07 / H3.2)', () => {
    const openapi = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));
    const realRoutes = collectAppRoutes(app);

    const documentedRoutes = [];
    Object.entries(openapi.paths || {}).forEach(([docPath, operations]) => {
        HTTP_METHODS.forEach((method) => {
            if (operations[method]) {
                documentedRoutes.push({ method: method.toUpperCase(), docPath });
            }
        });
    });

    it('exposes the app route table', () => {
        // Anclas que garantizan que la enumeración resuelve los prefijos de los routers.
        expect(realRoutes.size).toBeGreaterThan(0);
        expect(realRoutes.has('GET /api/v1/players')).toBe(true);
        expect(realRoutes.has('POST /api/v1/contact')).toBe(true);
    });

    it('documents at least one path/method', () => {
        expect(documentedRoutes.length).toBeGreaterThan(0);
    });

    it('every documented path/method is registered in the app', () => {
        const missing = documentedRoutes.filter(({ method, docPath }) => {
            const normalized = normalizePath(docPath);
            // Los endpoints documentados viven bajo el prefijo /api/v1, salvo los
            // que, como /health, están montados en la raíz de la aplicación.
            return !(
                realRoutes.has(`${method} /api/v1${normalized}`) ||
                realRoutes.has(`${method} ${normalized}`)
            );
        });

        expect(missing).toEqual([]);
    });
});