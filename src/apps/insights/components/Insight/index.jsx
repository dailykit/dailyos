import React from 'react'
import styled from 'styled-components'
import { Chart } from 'react-google-charts'
import { ReactTabulator } from 'react-tabulator'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import 'react-tabulator/lib/styles.css'

import { useInsights } from '../../hooks/useInsights'
import { tableConfig } from './tableConfig'
/**
 *
 * @param {{ includeChart?: boolean, includeTable?: boolean, alignment?: 'column' | 'row', availableChartTypes?: Array<string>, tablePosition?: 'bottom' | 'top' | 'right' | 'left', chartOptions?: {xLabel: string, xKey: string, yLabel: string, type: 'Bar' | 'Line' | 'PieChart', width?: string, height?: string, showLegend?: boolean}, id: string  }} props
 */
export default function Insight({
   includeTable = true,
   includeChart = false,
   alignment = 'column',
   availableChartTypes = ['Bar'],
   tablePosition = 'bottom',
   chartOptions = {},
   id = '',
}) {
   const { chartData, tableData } = useInsights(id, {
      chart: chartOptions,
      includeTableData: includeChart ? chartOptions : {},
   })

   return (
      <StyledContainer alignment={alignment} position={tablePosition}>
         {includeChart ? (
            <Chart
               data={chartData}
               chartType={chartOptions.type}
               loader={<div>loading...</div>}
               style={{ flex: '1' }}
               height={chartOptions.height || '400px'}
               width={chartOptions.width || '600px'}
               options={{ legend: chartOptions.showLegend ? {} : 'none' }}
            />
         ) : null}

         {includeTable ? (
            <>
               <span style={{ width: '1rem' }} />
               {alignment === 'column' ? <br /> : null}
               <div
                  style={{
                     flex: 1,
                     width: alignment === 'column' ? '100%' : null,
                  }}
               >
                  <ReactTabulator
                     columns={[]}
                     options={tableConfig}
                     data={tableData}
                  />
               </div>
            </>
         ) : null}
      </StyledContainer>
   )
}

const StyledContainer = styled.div`
   position: relative;
   width: 100%;
   padding: 1rem 2rem;
   background-color: #fff;
   display: flex;
   flex-direction: ${({ alignment, position }) => {
      if (alignment === 'column' && position === 'top')
         return `${alignment}-reverse`
      if (alignment === 'column' && position === 'bottom') return alignment
      if (alignment === 'row' && position === 'right') return alignment
      if (alignment === 'row' && position === 'left')
         return `${alignment}-reverse`

      return alignment
   }};
   align-items: center;
   justify-content: space-between;
`
