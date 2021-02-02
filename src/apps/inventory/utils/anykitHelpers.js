const BASE_URL = 'https://dailykit-recipe-hub.herokuapp.com/v1/graphql'
const headers = {
   'x-hasura-admin-secret': process.env.REACT_APP_ANYKIT_SECRET,
   'content-type': 'application/json',
}

async function getSupplierItemMatches(supplierItemId, controller) {
   let ingredientMatches = []
   let sachetMatches = []
   let err = null
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
                     isApproved
                     ingredient {
                        id
                        name
                        processings {
                           sachets {
                              id
                              rawingredient_sachets {
                                 rawIngredient {
                                    id
                                    data
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
         err = resp.errors[0]?.message || 'Unexpected error occured'
      } else {
         ingredientMatches =
            resp?.data?.matches_ingredientSupplierItemMatch || []
      }

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
                     isApproved
                     sachet {
                        processing {
                           id
                           name
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
            `,
            variables: { supplierItemId },
         }),
      }).then(r => r.json())

      if (sachetSupplierItemMatches?.errors?.length) {
         err =
            sachetSupplierItemMatches.errors[0].message ||
            'Unexpected error occured'
      } else {
         sachetMatches =
            sachetSupplierItemMatches?.data?.matches_sachetSupplierItemMatch ||
            []
      }

      return [sachetMatches, ingredientMatches, err]
   } catch (e) {
      return [null, null, e.message || 'Unexpected error occured']
   }
}

async function getSachetItemMatches(sachetId, controller) {
   let sachetItemMatches = []
   let err = null
   const sachetSachetItemMatches = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
         query: `
            query GetSachetSachetItemMatches($sachetId: Int) {
               matches_sachetSachetItemMatch(
                  where: { organizationSachetItemId: { _eq: $sachetId } }
               ) {
                  id
                  sachet {
                     processing {
                        id
                        name
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
         `,
         variables: { sachetId },
      }),
   }).then(r => r.json())

   if (sachetSachetItemMatches?.errors?.length)
      err =
         sachetSachetItemMatches.errors[0].message || 'Unexpected error occured'

   sachetItemMatches = [
      ...(sachetSachetItemMatches?.data?.matches_sachetSachetItemMatch || []),
   ]

   return [sachetItemMatches, err]
}

async function getIngredientSachetItemMatches(sachetId, controller) {
   let matches = []
   let err = null
   const ingredientSachetItemMatches = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
         query: `
            query GetIngredientSachetItemMatches($sachetId: Int) {
               matches_ingredientSachetItemMatch(
                  where: { organizationSachetItemId: { _eq: $sachetId } }
               ) {
                  id
                  isApproved
                  ingredient {
                     id
                     name
                     processings {
                        sachets {
                           id
                           rawingredient_sachets {
                              rawIngredient {
                                 id
                                 data
                              }
                           }
                        }
                     }
                  }
               }
            }
         `,
         variables: { sachetId },
      }),
   }).then(r => r.json())

   if (ingredientSachetItemMatches?.errors?.length)
      err =
         ingredientSachetItemMatches.errors[0].message ||
         'Unexpected error occured'

   matches = [
      ...(ingredientSachetItemMatches?.data
         ?.matches_ingredientSachetItemMatch || []),
   ]

   return [matches, err]
}

async function getIngredientSachetMatches(sachetId, controller) {
   let matches = []
   let err = null
   const ingredientSachetMatches = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
         query: `
            query GetSachetIngredientSachetMatches($sachetId: Int) {
               matches_sachetIngredientSachetMatch(
                  where: { organizationIngredientSachetId: { _eq: $sachetId } }
               ) {
                  id
                  isApproved
                  sachet {
                     processing {
                        id
                        name
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
         `,
         variables: { sachetId },
      }),
   }).then(r => r.json())

   if (ingredientSachetMatches?.errors?.length)
      err =
         ingredientSachetMatches.errors[0].message || 'Unexpected error occured'

   matches = [
      ...(ingredientSachetMatches?.data?.matches_sachetIngredientSachetMatch ||
         []),
   ]

   return [matches, err]
}

async function updateIngredientSupplierItemMatch(variables) {
   const query = `
      mutation UpdateSupplierItemMatch(
         $where: matches_ingredientSupplierItemMatch_bool_exp!
         $set: matches_ingredientSupplierItemMatch_set_input
      ) {
         update_matches_ingredientSupplierItemMatch(where: $where, _set: $set) {
            affected_rows
            returning {
               id
               isApproved
               ingredient {
                  id
                  name
                  processings {
                     sachets {
                        id
                        rawingredient_sachets {
                           rawIngredient {
                              id
                              data
                           }
                        }
                     }
                  }
               }
            }
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
      return response?.data?.update_matches_ingredientSupplierItemMatch
         ?.returning[0]

   console.error(
      'error updating ingredientSupplierItemMatches',
      response?.errors
   )

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
            returning {
               id
               isApproved
               sachet {
                  processing {
                     id
                     name
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
      return response?.data?.update_matches_sachetSachetItemMatch?.returning[0]

   console.error('error updating sachetSachetItemMatches', response?.errors)

   return 'Cannot update this match'
}

async function updateSachetSupplierItemMatch(variables) {
   const query = `
      mutation UpdateSachetSuplierItemMatch(
         $where: matches_sachetSupplierItemMatch_bool_exp!
         $set: matches_sachetSupplierItemMatch_set_input
      ) {
         update_matches_sachetSupplierItemMatch(where: $where, _set: $set) {
            affected_rows
            returning {
               id
               isApproved
               sachet {
                  processing {
                     id
                     name
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
   `
   const response = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
         query,
         variables,
      }),
   }).then(r => r.json())

   if (response?.data?.update_matches_sachetSupplierItemMatch?.affected_rows)
      return response?.data?.update_matches_sachetSupplierItemMatch
         ?.returning[0]

   console.error('error updating sachetSupplierItemMatches', response?.errors)

   return 'Cannot update this match'
}

async function updateSachetIngredientSachet(variables) {
   const query = `
      mutation UpdateSachetIngredientSachetMatch(
         $where: matches_sachetIngredientSachetMatch_bool_exp!
         $set: matches_sachetIngredientSachetMatch_set_input
      ) {
         update_matches_sachetIngredientSachetMatch(where: $where, _set: $set) {
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

   console.error('error updating sachetIngredientSachetMatch', response?.errors)

   return 'Cannot update this match'
}

async function updateIngredientSachetItemMatch(variables) {
   const query = `
      mutation UpdateIngredientSachetItemMatch(
         $where: matches_ingredientSachetItemMatch_bool_exp!
         $set: matches_ingredientSachetItemMatch_set_input
      ) {
         update_matches_ingredientSachetItemMatch(where: $where, _set: $set) {
            affected_rows
            returning {
               id
               isApproved
               ingredient {
                  id
                  name
                  processings {
                     sachets {
                        id
                        rawingredient_sachets {
                           rawIngredient {
                              id
                              data
                           }
                        }
                     }
                  }
               }
            }
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

   if (response?.data?.update_matches_ingredientSachetItemMatch?.affected_rows)
      return response?.data?.update_matches_ingredientSachetItemMatch
         ?.returning[0]

   console.error('error updating ingredienSachetItemMatch', response?.errors)

   return 'Cannot update this match'
}

async function getRecipeRawIngredient(variables) {
   const query = `
      query GetRecipeRawIngredient($where: recipes_recipe_ingredient_bool_exp) {
         recipes_recipe_ingredient(where: $where) {
            recipe {
               id
               name
               url
            }
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

   if (response?.data?.recipes_recipe_ingredient?.length)
      return response.data.recipes_recipe_ingredient

   console.error(response?.errors)
}

export default {
   getSachetItemMatches,
   getSupplierItemMatches,
   updateIngredientSupplierItemMatch,
   updateIngredientSachetItemMatch,
   updateSachetSachetItem,
   updateSachetIngredientSachet,
   updateSachetSupplierItemMatch,
   getRecipeRawIngredient,
   getIngredientSachetItemMatches,
   getIngredientSachetMatches,
}
