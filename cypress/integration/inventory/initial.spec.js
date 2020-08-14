/* eslint-disable no-undef */
/* eslint-disable spaced-comment */
/// <reference types="cypress" />

context('Actions', () => {
   it('should login and visit inventory desktop app', () => {
      cy.gotoApp('inventory').get('h1').should('be.visible')
   })
})
