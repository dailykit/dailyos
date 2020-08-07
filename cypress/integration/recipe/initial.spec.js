/// <reference types="cypress" />

context('Actions', () => {
   beforeEach(() => {
      cy.visit('/apps')
   })

   it('click on recipe', () => {
      cy.findByText(/recipe/i)
         .click()
         .location('pathname')
         .should('include', 'recipe')
   })
})
