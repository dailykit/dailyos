import React from 'react'
import { Pie, Bar } from 'react-chartjs-2'
import { useSubscription } from '@apollo/react-hooks'
import { Loader } from '@dailykit/ui'
import G2C from 'graphql2chartjs'

import { StyledHeader, StyledWrapper } from '../styled'
import { RECIPE_SALE_COUNT } from '../../graphql'

const ReferralPlansListing = () => {
   const { data, loading } = useSubscription(RECIPE_SALE_COUNT, {
      onError: error => {
         console.log(error)
      },
   })

   if (loading) return <Loader />

   const g2c = new G2C(data, (_, data) => {
      return {
         chartType: 'bar',
         label: data.label.name,
      }
   })

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>Reicpe Insights</h1>
         </StyledHeader>

         <Bar
            data={g2c.data}
            options={{
               title: {
                  display: true,
                  fontSize: 24,
                  text: 'Recipe sale in MealKit products',
               },
               legend: { display: false },
               maintainAspectRatio: false,
               elements: {
                  rectangle: {
                     backgroundColor: ['#E9DAFF', '#D9EBFB'],
                     borderWidth: 2,
                  },
               },
            }}
         />
      </StyledWrapper>
   )
}

export default ReferralPlansListing
