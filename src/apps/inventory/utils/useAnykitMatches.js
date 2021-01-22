import { useEffect, useState } from 'react'

import helpers from './anykitHelpers'

export const useAnykitMatches = ({
   supplierItemId,
   sachetId,
   showSachetItemMatches = false,
   showSupplierItemMatches = true,
   showIngredientSachetMatches = false,
}) => {
   const [error, setError] = useState(null)
   const [supplierItemMatches, setSupplierItemMatches] = useState([])
   const [sachetItemMatches, setSatchetItemMatches] = useState([])
   const [loading, setLoading] = useState(false)

   const controller = new window.AbortController()

   const resolveData = async () => {
      setLoading(true)

      if (showSupplierItemMatches) {
         const [matches, err] = await helpers.getSupplierItemMatches(
            supplierItemId,
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
      return () => {
         controller.abort()
      }
   }

   useEffect(resolveData, [supplierItemId, sachetId, showSachetItemMatches])

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
            message = helpers.updateSachetSachetItem(vars)
         } else {
            message = helpers.updateIngredientSachetItemMatch(vars)
         }

         return message
      }
   }

   return {
      sachetItemMatches,
      supplierItemMatches,
      error,
      loading,
      setApproved,
   }
}
