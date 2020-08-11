/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */

import '@testing-library/cypress/add-commands'

Cypress.Commands.add('login', (username, password, client) => {
   const kcRoot = 'http://auth.dailykit.org'
   const kcRealm = 'dailyos-test'
   const kcRedirectUri = `http://localhost:3000/apps/${client}`
   const loginPageRequest = {
      url: `${kcRoot}/auth/realms/${kcRealm}/protocol/openid-connect/auth`,
      qs: {
         client_id: client,
         redirect_uri: kcRedirectUri,
         scope: 'openid',

         state: createUUID(),
         nonce: createUUID(),
         response_mode: 'fragment',
         response_type: 'code',
      },
   }
   // Open the KC login page, fill in the form with username and password and submit.
   return cy.request(loginPageRequest).then(submitLoginForm)
   ////////////
   function submitLoginForm(response) {
      const _el = document.createElement('html')
      _el.innerHTML = response.body
      const loginForm = _el.getElementsByTagName('form')
      const isAlreadyLoggedIn = !loginForm.length
      if (isAlreadyLoggedIn) {
         return
      }
      return cy.request({
         form: true,
         method: 'POST',
         url: loginForm[0].action,
         followRedirect: true,
         body: {
            username,
            password,
         },
      })
   }
   // Copy-pasted code from KC javascript client.
   function createUUID() {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
         s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
      s[8] = s[13] = s[18] = s[23] = '-'
      var uuid = s.join('')
      return uuid
   }
})

Cypress.Commands.add('logout', () => {
   const kcRoot = 'http://auth.dailykit.org'
   const kcRealm = 'dailyos-test'
   const kcRedirectUri = 'http://localhost:3000/apps/inventory'

   return cy.request({
      url: `${kcRoot}/auth/realms/${kcRealm}/protocol/openid-connect/logout`,
      followRedirect: false,
      qs: {
         redirect_uri: kcRedirectUri,
      },
   })
})

Cypress.on('uncaught:exception', (err, runnable) => {
   // returning false here prevents Cypress from
   // failing the test
   cy.log(err)
   return true
})
