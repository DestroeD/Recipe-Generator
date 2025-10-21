describe('Home Page', () => {
  it('loads successfully', () => {
    cy.visit('/');
    cy.visit('/', { timeout: 10000 });
    cy.contains('Vite + React').should('be.visible');
  });
});
