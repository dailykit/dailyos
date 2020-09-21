import React from 'react'
import { StyledWrapper } from '../styled'
import Insight from '../../components/Insight'
import { useQuery } from '@apollo/react-hooks'

import { INSIGHTS } from '../../graphql'

const ReferralPlansListing = () => {
   const { data = {}, loading } = useQuery(INSIGHTS)

   if (loading) return <p>Loading...</p>

   return (
      <StyledWrapper>
         {data.insights_insights.map(insight => (
            <Insight
               key={insight.id}
               id={insight.id}
               alignment="column"
               includeChart
               statsPosition="chart"
               tablePosition="left"
            />
         ))}
      </StyledWrapper>
   )
}

export default ReferralPlansListing
