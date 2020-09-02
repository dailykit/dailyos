import React from 'react'
import { Pie, Bar } from 'react-chartjs-2'
import { useSubscription, useQuery } from '@apollo/react-hooks'
import { Loader } from '@dailykit/ui'
import G2C from 'graphql2chartjs'

import { StyledHeader, StyledWrapper } from '../styled'
import { RECIPE_SALE_COUNT } from '../../graphql'

const ReferralPlansListing = () => {
   const { data, loading } = useQuery(RECIPE_SALE_COUNT, {
      onError: error => {
         console.log(error)
      },
   })

   if (loading) return <Loader />
   console.log(data)
   const g2c = new G2C(data, (name, data) => {
      if (name === 'RecipeSalesInMealKits') {
         return {
            ...data,
            chartType: 'bar',
            backgroundColor: '#B592FF',
            label: data.label.name,
         }
      }

      return {
         ...data,
         chartType: 'bar',
         backgroundColor: '#6CCFD1',
         label: data.label.name,
      }
   })

   console.log(g2c.data)

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>Reicpe Insights</h1>
         </StyledHeader>

         <Bar
            data={g2c.data}
            options={{
               scales: {
                  xAxes: [{ stacked: true }],
                  yAxes: [{ stacked: true }],
               },
               title: {
                  display: true,
                  fontSize: 24,
                  text: 'Total Recipe Sales',
               },
               legend: { position: 'bottom' },
            }}
         />
      </StyledWrapper>
   )
}

export default ReferralPlansListing
