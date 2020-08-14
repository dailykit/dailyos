/* eslint-disable no-undef */
/* eslint-disable spaced-comment */
/// <reference types="cypress" />

context('suppliers module | inventory app', () => {
   it('should load suppliers listings view', () => {
      cy.gotoApp('inventory')
         .get('h2')
         .contains('Suppliers')
         .click()
         .wait(1000)
         .get('.tabulator-header')
         .should('be.visible')
   })
})
