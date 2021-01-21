import { useEffect, useState } from 'react'

const BASE_URL = 'https://dailykit-recipe-hub.herokuapp.com/v1/graphql'

async function getSupplierItemMatches(
   url,
   supplierItemId,
   headers,
   controller
) {
   try {
      const resp = await fetch(url, {
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

async function getSachetItemMatches(
   url,
   sachetId,
   supplierItemId,
   headers,
   controller
) {
   let sachetItemMatches = []
   let err = null
   const sachetSachetItemMatches = await fetch(url, {
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

   const sachetSupplierItemMatches = await fetch(url, {
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

export const useAnykitMatches = ({
   supplierItemId,
   sachetId,
   showSachetMatches = false,
   showSupplierItemMatches = true,
   showIngredientSachetMatches = false,
}) => {
   const [error, setError] = useState(null)
   const [supplierItemMatches, setSupplierItemMatches] = useState([])
   const [sachetItemMatches, setSatchetItemMatches] = useState([])
   const [loading, setLoading] = useState(false)

   const controller = new window.AbortController()

   const resolveData = async () => {
      const headers = {
         'x-hasura-admin-secret': process.env.REACT_APP_ANYKIT_SECRET,
         'content-type': 'application/json',
      }

      setLoading(true)

      if (showSupplierItemMatches) {
         const [matches, err] = await getSupplierItemMatches(
            BASE_URL,
            supplierItemId,
            headers,
            controller
         )

         setLoading(false)
         if (err) {
            setError(err)
            return
         }
         setSupplierItemMatches(matches)
         return
      }

      if (showSachetMatches) {
         const [matches, err] = await getSachetItemMatches(
            BASE_URL,
            sachetId,
            supplierItemId,
            headers,
            controller
         )

         setLoading(false)
         if (err) {
            setError(err)
            return
         }
         setSatchetItemMatches(matches)
         return
      }
      return () => {
         controller.abort()
      }
   }

   useEffect(resolveData, [supplierItemId, sachetId, showSachetMatches])

   return {
      sachetItemMatches,
      supplierItemMatches,
      error,
      loading,
   }
}
