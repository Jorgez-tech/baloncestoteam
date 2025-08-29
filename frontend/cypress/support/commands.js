// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom commands for authentication
Cypress.Commands.add('login', (email = 'admin@test.com', password = 'password123') => {
    cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
            email,
            password
        }
    }).then((response) => {
        window.localStorage.setItem('token', response.body.token);
        window.localStorage.setItem('user', JSON.stringify(response.body.user));
    });
});

Cypress.Commands.add('logout', () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
});

// Custom commands for API testing
Cypress.Commands.add('apiRequest', (method, url, body = null, headers = {}) => {
    const token = window.localStorage.getItem('token');

    return cy.request({
        method,
        url: `${Cypress.env('apiUrl')}${url}`,
        body,
        headers: {
            ...headers,
            ...(token && { Authorization: `Bearer ${token}` })
        },
        failOnStatusCode: false
    });
});

// Custom commands for common UI interactions
Cypress.Commands.add('fillForm', (formData) => {
    Object.keys(formData).forEach(key => {
        cy.get(`[data-testid="${key}"], [name="${key}"], #${key}`)
            .clear()
            .type(formData[key]);
    });
});

Cypress.Commands.add('clickSubmit', () => {
    cy.get('[type="submit"], [data-testid="submit"], button[type="submit"]').click();
});

// Custom command to wait for page load
Cypress.Commands.add('waitForPageLoad', () => {
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should('not.exist');
});

// Custom command to check accessibility
Cypress.Commands.add('checkA11y', () => {
    cy.injectAxe();
    cy.checkA11y();
});
