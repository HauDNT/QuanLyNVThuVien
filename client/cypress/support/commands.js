// Login function
Cypress.Commands.add('login', (username, password) => {
    cy.visit('http://localhost:3000/login')

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
})