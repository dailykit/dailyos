/* eslint-disable no-undef */
/* eslint-disable spaced-comment */
/// <reference types="cypress" />

context('General tests for inventory app', () => {
   it('should login and visit inventory app', () => {
      cy.gotoApp('inventory').get('h1').should('be.visible')
   })
})
