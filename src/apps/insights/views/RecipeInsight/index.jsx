import React from 'react'
import { StyledWrapper } from '../styled'
import Insight from '../../../../shared/components/Insight'
import { useQuery } from '@apollo/react-hooks'

import { INSIGHTS } from '../../graphql'
import { Flex } from '@dailykit/ui'

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
               <Flex
                  key={insight.identifier}
                  width="calc(100% - 64px)"
                  margin="0 auto"
               >
                  <Insight
                     identifier={insight.identifier}
                     includeChart
                     // where={{ amountPaid: { _lte: 2 } }}
                     // limit={2}
                     // order={{ amountPaid: 'desc' }}
                     variables={{ amountVar: 90 }}
                  />
               </Flex>
            )
         })}
      </StyledWrapper>
   )
}

export default ReferralPlansListing
