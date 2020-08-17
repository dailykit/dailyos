/* eslint-disable no-undef */
/* eslint-disable spaced-comment */
/// <reference types="cypress" />

context('suppliers module | inventory app', () => {
   beforeEach(() => {
      cy.gotoApp('inventory')
   })

   it('should load suppliers listings view', () => {
      cy.get('h2')
         .contains('Suppliers')
         .click()
         .wait(1000)
         .get('.tabulator-header')
         .should('be.visible')
   })

   it('should create a supplier on valid form submission', () => {
      cy.get('h2')
         .contains('Suppliers')
         .click()
         .wait(1000)
         .get('[data-testid="addSupplier"]')
         .click()
         .get('input[name="Supplier Name"]')
         .should('contain', 'supplier')
   })
})
