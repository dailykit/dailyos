import { useEffect, useState } from 'react'

const BASE_URL = 'https://dailykit-recipe-hub.herokuapp.com/v1/graphql'

export const useAnykitMatches = ({
   supplierItemId,
   sachetId,
   showSachetMatches = false,
}) => {
   const [error, setError] = useState(null)
   const [supplierItemMatches, setSupplierItemMatches] = useState([])
   const [sachetItemMatches, setSatchetItemMatches] = useState([])

   const controller = new window.AbortController()

   useEffect(() => {
      const headers = {
         'x-hasura-admin-secret': process.env.REACT_APP_ANYKIT_SECRET,
         'content-type': 'application/json',
      }

      if (!showSachetMatches) {
         // get matches from ingredientSupllierItemMatch table
         fetch(BASE_URL, {
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
                           name
                           processings {
                              name
                           }
                        }
                     }
                  }
               `,
               variables: { supplierItemId },
            }),
         })
            .then(r => r.json())
            .then(resp => {
               if (resp?.errors) {
                  // errors is always an array with atleast one item
                  setError(resp.errors[0])
               } else {
                  setSupplierItemMatches(
                     resp?.data?.matches_ingredientSupplierItemMatch || []
                  )
               }
            })
      } else {
         // get matches from sachetSachetItem and sachetSupplierItemMatches table
         fetch(BASE_URL, {
            method: 'POST',
            headers,
            signal: controller.signal,
            body: JSON.stringify({
               query: `
                  query GetSachetSupplierItemMatches($sachetId: Int!) {
                     matches_sachetSachetItemMatch(
                        where: { organizationSachetItemId: { _eq: $sachetId } }
                     ) {
                        id
                        sachet {
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
         })
            .then(r => r.json())
            .then(resp => {
               if (resp?.errors?.length) {
                  setError(resp.errors[0])
               } else {
                  setSatchetItemMatches([
                     ...(resp?.data?.matches_sachetSachetItemMatch || []),
                     ...sachetItemMatches,
                  ])
               }
            })

         fetch(BASE_URL, {
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
         })
            .then(r => r.json())
            .then(resp => {
               if (resp?.errors?.length) {
                  setError(resp.errors[0])
               } else {
                  setSatchetItemMatches([
                     ...sachetItemMatches,
                     ...(resp?.data?.matches_sachetSupplierItemMatch || []),
                  ])
               }
            })
            .catch(err => {
               console.log(err)
            })
      }

      return () => {
         controller.abort()
      }
   }, [supplierItemId, sachetId, showSachetMatches])

   return {
      sachetItemMatches,
      supplierItemMatches,
      error,
   }
}
