import { useEffect, useState } from 'react'

import helpers from './anykitHelpers'

export const useAnykitMatches = ({
   supplierItemId,
   sachetId,
   showSachetItemMatches = false,
   showSupplierItemMatches = false,
   showIngredientSachetMatches = false,
}) => {
   const [error, setError] = useState(null)
   const [
      ingredientSupplierItemMatches,
      setIngredientSupplierItemMatches,
   ] = useState([])
   const [sachetSupplierItemMatches, setSachetSupplierItemMatches] = useState(
      []
   )
   const [sachetItemMatches, setSatchetItemMatches] = useState([])
   const [loading, setLoading] = useState(false)

   const controller = new window.AbortController()

   useEffect(() => {
      const resolveData = async () => {
         setLoading(true)

         if (showSupplierItemMatches) {
            const [
               sachetMatches,
               ingredientMatches,
               err,
            ] = await helpers.getSupplierItemMatches(supplierItemId, controller)

            setLoading(false)
            if (err) {
               setError(err)
               return
            }
            setSachetSupplierItemMatches(sachetMatches)
            setIngredientSupplierItemMatches(ingredientMatches)
            return
         }

         if (showSachetItemMatches) {
            const [matches, err] = await helpers.getSachetItemMatches(
               sachetId,
               supplierItemId,
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

         setLoading(false)
      }

      resolveData()

      return () => {
         controller.abort()
      }
   }, [supplierItemId, sachetId, showSachetItemMatches])

   const setApproved = async (matchId, isApproved, meta) => {
      const vars = {
         where: { id: { _eq: matchId } },
         set: { isApproved },
      }
      let response = ''

      if (showSupplierItemMatches) {
         // update the match in anykit
         if (meta.isSachetMatch) {
            response = await helpers.updateSachetSupplierItemMatch(vars)
         } else {
            // response is the returned match that got updated
            response = await helpers.updateIngredientSupplierItemMatch(vars)

            // !string is the response from the fired mutation.
            if (typeof response !== 'string') {
               const oldMatches = ingredientSupplierItemMatches.filter(
                  m => m.id !== response.id
               )

               setIngredientSupplierItemMatches([...oldMatches, response])

               response = 'Match updated successfully!'
            }
         }

         return response || 'Unexpected error occured!'
      }

      if (showSachetItemMatches) {
         if (meta.isSachetMatch) {
            response = await helpers.updateSachetSachetItem(vars)
         } else {
            response = await helpers.updateIngredientSachetItemMatch(vars)
         }

         return response
      }
   }

   const getRecipeByRawIngredient = async rawIngredientId => {
      try {
         const data = await helpers.getRecipeRawIngredient({
            where: { ingredientId: { _eq: rawIngredientId } },
         })

         return data
      } catch (e) {
         console.log('failed to get recipes from anykit')
         console.error(e)
      }
   }

   return {
      ingredientSupplierItemMatches,
      sachetSupplierItemMatches,
      sachetItemMatches,
      error,
      loading,
      setApproved,
      getRecipeByRawIngredient,
   }
}
