const BASE_URL = 'https://dailykit-recipe-hub.herokuapp.com/v1/graphql'
const headers = {
   'x-hasura-admin-secret': process.env.REACT_APP_ANYKIT_SECRET,
   'content-type': 'application/json',
}

async function getSupplierItemMatches(supplierItemId, controller) {
   try {
      const resp = await fetch(BASE_URL, {
         method: 'POST',
         headers,
         signal: controller.signal,
         body: JSON.stringify({
            query: `
                  query GetIngredientSupplierItemMatches($supplierItemId: Int) {
                     matches_ingredientSupplierItemMatch(
                        where: {
                           organizationSupplierItemId: { _eq: $supplierItemId }
                        }
                     ) {
                        id
                        ingredient {
                           processings_aggregate {
                              aggregate {
                                 count
                              }
                              nodes {
                                 name
                                 sachets {
                                    processing {
                                       ingredient {
                                          id
                                          name
                                       }
                                    }
                                    id
                                    minQuantity
                                    maxQuantity
                                    unit
                                    rawingredient_sachets {
                                       rawIngredient {
                                          id
                                          data
                                          recipe_ingredients {
                                             recipe {
                                                name
                                                url
                                             }
                                          }
                                       }
                                    }
                                 }
                              }
                           }
                        }
                     }
                  }
               `,
            variables: { supplierItemId },
         }),
      }).then(r => r.json())

      if (resp?.errors?.length) {
         return [null, resp.errors[0]?.message || 'Unexpected error occured']
      }

      return [resp?.data?.matches_ingredientSupplierItemMatch || [], null]
   } catch (e) {
      return [null, e.message || 'Unexpected error occured']
   }
}

async function getSachetItemMatches(sachetId, supplierItemId, controller) {
   let sachetItemMatches = []
   let err = null
   const sachetSachetItemMatches = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
         query: `
                  query GetSachetSupplierItemMatches($sachetId: Int) {
                     matches_sachetSachetItemMatch(
                        where: { organizationSachetItemId: { _eq: $sachetId } }
                     ) {
                        id
                        sachet {
                           minQuantity
                           maxQuantity
                           rawingredient_sachets {
                              rawIngredient {
                                 id
                                 data
                              }
                           }
                           processing {
                              name
                              ingredient {
                                 name
                              }
                           }
                        }
                     }
                  }
               `,
         variables: { sachetId },
      }),
   }).then(r => r.json())

   if (sachetSachetItemMatches?.errors?.length)
      err =
         sachetSachetItemMatches.errors[0].message || 'Unexpected error occured'

   sachetItemMatches = [
      ...(sachetSachetItemMatches?.data?.matches_sachetSachetItemMatch || []),
      ...sachetItemMatches,
   ]

   const sachetSupplierItemMatches = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
         query: `
                  query GetSachetSupplierItemMatches($supplierItemId: Int) {
                     matches_sachetSupplierItemMatch(
                        where: {
                           organizationSupplierItemId: { _eq: $supplierItemId }
                        }
                     ) {
                        id
                        sachet {
                           minQuantity
                           maxQuantity
                           rawingredient_sachets {
                              rawIngredient {
                                 id
                                 data
                              }
                           }
                           processing {
                              name
                              ingredient {
                                 name
                              }
                           }
                        }
                     }
                  }
               `,
         variables: { supplierItemId },
      }),
   }).then(r => r.json())

   if (sachetSupplierItemMatches?.errors?.length) {
      err =
         sachetSupplierItemMatches.errors[0].message ||
         'Unexpected error occured'
   } else {
      sachetItemMatches = [
         ...sachetItemMatches,
         ...(sachetSupplierItemMatches?.data?.matches_sachetSupplierItemMatch ||
            []),
      ]
   }

   return [sachetItemMatches, err]
}

async function updateSupplierItemMatch(variables) {
   const query = `
      mutation UpdateSupplierItemMatch(
         $where: matches_ingredientSupplierItemMatch_bool_exp!
         $set: matches_ingredientSupplierItemMatch_set_input
      ) {
         update_matches_ingredientSupplierItemMatch(where: $where, _set: $set) {
            affected_rows
         }
      }
   `
   const response = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
         query,
         variables,
      }),
   }).then(r => r.json())

   if (
      response?.data?.update_matches_ingredientSupplierItemMatch?.affected_rows
   )
      return 'Updated!'

   console.log(response?.errors)

   return 'Cannot update this match'
}

async function updateSachetSachetItem(variables) {
   const query = `
      mutation UpdateSachetItemMatch(
         $where: matches_sachetSachetItemMatch_bool_exp!
         $set: matches_sachetSachetItemMatch_set_input
      ) {
         update_matches_sachetSachetItemMatch(where: $where, _set: $set) {
            affected_rows
         }
      }
   `
   const response = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
         query,
         variables,
      }),
   }).then(r => r.json())

   if (response?.data?.update_matches_sachetSachetItemMatch?.affected_rows)
      return 'Updated!'

   console.log(response?.errors)

   return 'Cannot update this match'
}

export default {
   getSachetItemMatches,
   getSupplierItemMatches,
   updateSupplierItemMatch,
   updateSachetSachetItem,
}
