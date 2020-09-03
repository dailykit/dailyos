import React from 'react'
import {
   HorizontalBar,
   Bar,
   Pie,
   Doughnut,
   Line,
   Radar,
   Polar,
} from 'react-chartjs-2'
import { ReactTabulator } from 'react-tabulator'

import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import 'react-tabulator/lib/styles.css'
import '../../../../shared/styled/tableStyles.css'

import { colors } from '../../utils/colors'
import { StyledHeader, StyledWrapper } from '../styled'
import { useInsights } from '../../hooks/useInsights'

const ReferralPlansListing = () => {
   const { chartData, tableData } = useInsights(
      'e9b59cd3-7a22-426b-bd63-37ff70e76a45',
      {
         chart: {
            type: 'labeled',
            x: 'name',
            name: 'Total Inventory Product Sale',
         },
      }
   )

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>Reicpe Insights</h1>
         </StyledHeader>

         <Radar
            data={chartData}
            options={{
               elements: {
                  rectangle: { backgroundColor: colors },
                  arc: { backgroundColor: colors },
               },
               legend: { display: false },
               title: {
                  display: true,
                  text: 'Total inventory product sales',
                  fontSize: 25,
               },
            }}
         />

         <br />
         <br />
         <hr />
         <br />
         <br />

         <ReactTabulator
            columns={[]}
            options={{ autoColumns: true }}
            data={tableData}
         />
      </StyledWrapper>
   )
}

export default ReferralPlansListing
