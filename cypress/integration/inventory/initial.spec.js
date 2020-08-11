/* eslint-disable no-undef */
/* eslint-disable spaced-comment */
/// <reference types="cypress" />

context('Actions', () => {
   beforeEach(() => {
      cy.logout()
      cy.login('test@test.com', 'test', 'inventory')
   })

   afterEach(() => {
      cy.logout()
   })

   it('should visit inventory', () => {
      cy.visit('/apps/inventory').get('h1')
   })
})
