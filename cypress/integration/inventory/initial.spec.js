/// <reference types="cypress" />

context('Actions', () => {
   beforeEach(() => {
      cy.visit('/apps')
   })

   it('click on inventory', () => {
      cy.findByText(/inventory/i)
         .click()
         .wait(1000)
         .get('h1')
   })
})
