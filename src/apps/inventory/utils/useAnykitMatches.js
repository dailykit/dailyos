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
      let message = ''

      if (showSupplierItemMatches) {
         // update the match in anykit
         if (meta.isSachetMatch) {
            message = await helpers.updateIngredientSupplierItemMatch(vars)
         } else {
            message = await helpers.updateSachetSupplierItemMatch(vars)
         }

         return message || 'Unexpected error occured!'
      }

      if (showSachetItemMatches) {
         if (meta.isSachetMatch) {
            message = await helpers.updateSachetSachetItem(vars)
         } else {
            message = await helpers.updateIngredientSachetItemMatch(vars)
         }

         return message
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
