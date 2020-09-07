import React, { useState } from 'react'
import { Chart } from 'react-google-charts'
// import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
// import 'react-tabulator/lib/styles.css'

// import '../../../../shared/styled/tableStyles.css'
import { useInsights } from '../../hooks/useInsights'
import { colors } from '../../utils/colors'
import { StyledHeader, StyledWrapper } from '../styled'

const ReferralPlansListing = () => {
   const { chartData, allowedCharts } = useInsights(
      'e9b59cd3-7a22-426b-bd63-37ff70e76a45',
      {
         chart: {
            x: 'Product Name',
            xKey: 'name',
            y: 'Total Sales',
            title: 'Total Inventory Product Sale',
         },
      }
   )

   const [chartType, setChartType] = useState(allowedCharts[0] || 'BAR')

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>Reicpe Insights</h1>
         </StyledHeader>

         <select
            name="charts"
            id="charts"
            defaultValue={chartType}
            onChange={e => {
               setChartType(e.target.value)
            }}
         >
            {allowedCharts.map(type => (
               <option value={type} key={type}>
                  {type.toLowerCase()}
               </option>
            ))}
         </select>

         {/* <RenderChart chartType={chartType} chartData={chartData} /> */}

         <br />
         <br />

         <Chart
            chartType={chartType === 'BAR' ? 'Bar' : 'Line'}
            data={chartData}
            options={{
               height: 500,
               is3D: false,
               title: 'Product Sales',
               colors,
            }}
         />
      </StyledWrapper>
   )
}

// function RenderChart({ chartType, chartData }) {
//    if (chartType === 'BAR') {
//       return (
//          <Bar
//             data={chartData}
//             options={{
//                elements: {
//                   rectangle: { backgroundColor: colors },
//                   arc: { backgroundColor: colors },
//                },
//                legend: { display: false },
//                title: {
//                   display: true,
//                   text: 'Total inventory product sales',
//                   fontSize: 25,
//                },
//             }}
//          />
//       )
//    }

//    return (
//       <Pie
//          data={chartData}
//          options={{
//             elements: {
//                rectangle: { backgroundColor: colors },
//                arc: { backgroundColor: colors },
//             },
//             legend: { display: false },
//             title: {
//                display: true,
//                text: 'Total inventory product sales',
//                fontSize: 25,
//             },
//          }}
//       />
//    )
// }

export default ReferralPlansListing
