import { useEffect, useState } from 'react'

import helpers from './anykitHelpers'

export const useAnykitMatches = ({
   supplierItemId,
   sachetId,
   showSachetItemMatches = false,
   showSupplierItemMatches = false,
   showIngredientSachetItemMatches = false,
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
   const [sachetItemMatches, setSachetItemMatches] = useState([])
   const [
      ingredientSachetItemMatches,
      setIngredientSachetItemMatches,
   ] = useState([])
   const [ingredientSachetMatches, setIngredientSachetMatches] = useState([])
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
               controller
            )

            setLoading(false)
            if (err) {
               setError(err)
               return
            }
            setSachetItemMatches(matches)
            return
         }

         if (showIngredientSachetItemMatches) {
            const [matches, err] = await helpers.getIngredientSachetItemMatches(
               sachetId,
               controller
            )

            setLoading(false)
            if (err) {
               setError(err)
               return
            }
            setIngredientSachetItemMatches(matches)
            return
         }

         if (showIngredientSachetMatches) {
            const [matches, err] = await helpers.getIngredientSachetMatches(
               sachetId,
               controller
            )

            setLoading(false)

            if (err) {
               setError(err)
               return
            }
            setIngredientSachetMatches(matches)
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
            // response is the returned match that got updated
            response = await helpers.updateSachetSupplierItemMatch(vars)

            // !string is the response from the fired mutation.
            if (typeof response !== 'string') {
               const oldMatches = sachetSupplierItemMatches.filter(
                  m => m.id !== response.id
               )

               setSachetSupplierItemMatches([...oldMatches, response])

               response = 'Match updated successfully!'
            }
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
            // response is the returned match that got updated
            response = await helpers.updateSachetSachetItem(vars)

            // !string is the response from the fired mutation.
            if (typeof response !== 'string') {
               const oldMatches = sachetItemMatches.filter(
                  m => m.id !== response.id
               )

               setSachetItemMatches([...oldMatches, response])

               response = 'Match updated successfully!'
            }
         } else {
            response = await helpers.updateIngredientSachetItemMatch(vars)
         }

         return response
      }

      if (showIngredientSachetItemMatches) {
         if (!meta.isSachetMatch) {
            // response is the returned match that got updated
            response = await helpers.updateIngredientSachetItemMatch(vars)

            // !string is the response from the fired mutation.
            if (typeof response !== 'string') {
               const oldMatches = ingredientSachetItemMatches.filter(
                  m => m.id !== response.id
               )

               setIngredientSachetItemMatches([...oldMatches, response])

               response = 'Match updated successfully!'
            }
         }

         return response || 'Unexpected error occured!'
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
      ingredientSachetItemMatches,
      error,
      loading,
      setApproved,
      getRecipeByRawIngredient,
      ingredientSachetItemMatches,
      ingredientSachetMatches,
   }
}
