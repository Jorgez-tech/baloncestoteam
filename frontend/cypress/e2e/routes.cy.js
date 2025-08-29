describe('Validación de rutas principales', () => {
    beforeEach(() => {
        // Ensure the app is running before each test
        cy.visit('/', { failOnStatusCode: false });
    });

    it('Carga Home en /', () => {
        cy.visit('/');
        // Wait for the page to load
        cy.get('body').should('be.visible');
        // Check for common home page elements
        cy.get('body').should('contain.text', 'Inicio').or('contain.text', 'Home').or('contain.text', 'Basketball');
    });

    it('Carga Galería en /gallery', () => {
        cy.visit('/gallery');
        cy.get('body').should('be.visible');
        // Check for gallery-related content
        cy.get('body').should('contain.text', 'Galería').or('contain.text', 'Gallery').or('contain.text', 'Fotos');
    });

    it('Carga Login en /login', () => {
        cy.visit('/login');
        cy.get('body').should('be.visible');
        // Check for login form elements
        cy.get('body').should('contain.text', 'Login').or('contain.text', 'Iniciar').or('contain.text', 'Acceder');
        // Check for login form inputs
        cy.get('input[type="email"], input[name="email"], input[placeholder*="email"]').should('exist');
        cy.get('input[type="password"], input[name="password"], input[placeholder*="password"]').should('exist');
    });

    it('Carga página de registro en /signup', () => {
        cy.visit('/signup', { failOnStatusCode: false });
        cy.get('body').should('be.visible');
        // Check for signup content
        cy.get('body').should('contain.text', 'Registro').or('contain.text', 'Sign').or('contain.text', 'Crear cuenta');
    });

    it('Muestra 404 en ruta inexistente', () => {
        cy.visit('/ruta-que-no-existe-123', { failOnStatusCode: false });
        cy.get('body').should('be.visible');
        // Check for 404 or error content
        cy.get('body').should(($body) => {
            const text = $body.text().toLowerCase();
            expect(text).to.satisfy((t) =>
                t.includes('404') ||
                t.includes('no encontrada') ||
                t.includes('not found') ||
                t.includes('página no existe')
            );
        });
    });
});

describe('Navegación básica', () => {
    it('Puede navegar entre páginas principales', () => {
        cy.visit('/');

        // Try to find and click navigation links
        cy.get('nav, header').within(() => {
            // Look for gallery link
            cy.get('a[href="/gallery"], a[href="#gallery"], a:contains("Galería"), a:contains("Gallery")')
                .first()
                .click({ force: true });
        });

        cy.url().should('include', 'gallery');

        // Navigate back to home
        cy.get('nav, header').within(() => {
            cy.get('a[href="/"], a[href="#home"], a:contains("Inicio"), a:contains("Home")')
                .first()
                .click({ force: true });
        });

        cy.url().should('match', /\/$|\/home$/);
    });
});
