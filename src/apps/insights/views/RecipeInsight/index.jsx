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
                  key={insight.title}
                  title={insight.title}
                  alignment="column"
                  includeChart
                  statsPosition="chart"
                  tablePosition="left"
               />
            )
         })}
      </StyledWrapper>
   )
}

export default ReferralPlansListing
