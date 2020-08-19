/* eslint-disable spaced-comment */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="cypress" />

import '@testing-library/cypress/add-commands'

function genAuthUrl(client) {
   return `https://auth.dailykit.org/auth/realms/dailyos-test/protocol/openid-connect/auth?client_id=${client}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapps%2F${client}&state=1dd55206-0812-4f70-8b5f-d9c0ab26ff05&response_mode=fragment&response_type=code&scope=openid&nonce=2e591b52-31f5-4811-8cf5-31a3d005671c`
}

Cypress.Commands.add('gotoApp', name => {
   const url = genAuthUrl(name)

   cy.fixture('auth').then(authConfig => {
      cy.visit(url)
         .get('input#username')
         .type(authConfig.testUser)
         .get('input#password')
         .type(authConfig.testPassword)
         .get('.btn')
         .click()
         .wait(1000)
   })
})
