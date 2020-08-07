/// <reference types="cypress" />

context('Actions', () => {
   beforeEach(() => {
      cy.visit('/apps')
   })

   it('click on recipe', () => {
      cy.findByText(/recipe/i)
         .click()
         .wait(1000)
         .get('h1')
   })
})
