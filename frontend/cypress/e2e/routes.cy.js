describe('Validación de rutas principales', () => {
    it('Carga Home en /', () => {
        cy.visit('/');
        cy.contains('Inicio');
    });

    it('Carga Galería en /gallery', () => {
        cy.visit('/gallery');
        cy.contains('Galería');
    });

    it('Carga Login en /login', () => {
        cy.visit('/login');
        cy.contains(/login|iniciar sesión/i);
    });

    it('Muestra 404 en ruta inexistente', () => {
        cy.visit('/noexiste', { failOnStatusCode: false });
        cy.contains('no encontrada');
    });
});
