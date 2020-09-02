import React from 'react'
import { ReactTabulator } from 'react-tabulator'
import { useQuery } from '@apollo/react-hooks'
import { Loader } from '@dailykit/ui'

import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import 'react-tabulator/lib/styles.css'
import '../../../../shared/styled/tableStyles.css'

import { StyledHeader, StyledWrapper } from '../styled'
import { SAMPLE_QUERY } from '../../graphql/subscriptions/recipe'
import { transformer } from '../../utils/transformer'

const ReferralPlansListing = () => {
   const { loading, data } = useQuery(SAMPLE_QUERY, {
      variables: {
         includeSimpleRecipeProductName: true,
         includeDefaultCartItem: true,
         options: null,
      },
   })

   if (loading) return <Loader />

   const tableData = transformer(data, 'orderMealKitProductsAggregate')
   console.log(tableData)
   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>Reicpe Insights</h1>
         </StyledHeader>
         <ReactTabulator
            data={tableData || []}
            options={{ autoColumns: true, layout: 'fitColumns' }}
            columns={[]}
         />
      </StyledWrapper>
   )
}

export default ReferralPlansListing
