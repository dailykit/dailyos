import { useEffect, useState } from 'react'

import helpers from './anykitHelpers'

const BASE_URL = 'https://dailykit-recipe-hub.herokuapp.com/v1/graphql'

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
         const [matches, err] = await helpers.getSupplierItemMatches(
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
         const [matches, err] = await helpers.getSachetItemMatches(
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

   const setAvailability = (matchId, isAvailable) => {
      if (showSupplierItemMatches) {
         // update the match in anykit (useFetch)
         // update the supplierItemMatches state
         updateSupplierItemMatch()
      }

      if (showSachetMatches) {
         // update the match in anykit (useFetch)
         // update the sachetItemMatches state

         updateSachetItemMatch()
      }
   }

   return {
      sachetItemMatches,
      supplierItemMatches,
      error,
      loading,
   }
}
