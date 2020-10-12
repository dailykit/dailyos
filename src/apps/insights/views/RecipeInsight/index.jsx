import React from 'react'
import { StyledWrapper } from '../styled'
import Insight from '../../components/Insight'
import { useQuery } from '@apollo/react-hooks'

import { INSIGHTS } from '../../graphql'

const ReferralPlansListing = () => {
   const {
      data: { insights_insights: insights = [] } = {},
      loading,
   } = useQuery(INSIGHTS, {
      onError: error => {
         console.log(error)
      },
   })

   if (loading) return <p>Loading...</p>

   return (
      <StyledWrapper>
         {insights.map(insight => {
            return (
               <Insight
                  key={insight.identifier}
                  identifier={insight.identifier}
                  includeChart
                  // where={{ amountPaid: { _lte: 2 } }}
                  // limit={2}
                  // order={{ amountPaid: 'desc' }}
               />
            )
         })}
      </StyledWrapper>
   )
}

export default ReferralPlansListing
