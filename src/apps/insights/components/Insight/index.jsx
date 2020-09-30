import { ReactTabulator } from '@dailykit/react-tabulator'
import React from 'react'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import 'react-tabulator/lib/styles.css'
import styled from 'styled-components'
import { Box } from '../'
import '../../../../shared/styled/tableStyles.css'
import { useInsights } from '../../hooks/useInsights'
import { Counter } from '../Counter'
import Chart from './Chart'
import Option from './Option'
import { tableConfig } from './tableConfig'

/**
 *
 * @param {{ includeChart?: boolean, includeTable?: boolean, alignment?: 'column' | 'row', tablePosition?: 'bottom' | 'top' | 'right' | 'left', statsPosition: 'table' | 'chart', title: string, nodeKey: string, chartOptions: {height: string, width: string}  }} props
 */
export default function Insight({
   includeTable = true,
   includeChart = false,
   alignment = 'column',
   tablePosition = 'bottom',
   title = '',
   chartOptions = {},
   statsPosition,
}) {
   const {
      tableData,
      options,
      optionVariables,
      updateOptions,
      aggregates,
      allowedCharts,
   } = useInsights(title, {
      includeTableData: includeTable,
      includeChartData: includeChart,
   })

   // const chartTitle = metrices.length ? metrices.reduce((acc, curr, i) => i !== 0 ? acc + ' & ' + curr.title : acc + curr.title,'') : chartType.title

   return (
      <>
         <StyledContainer alignment={alignment} position={tablePosition}>
            {includeChart ? (
               <Box
                  style={{
                     width: '100%',
                     overflowX: 'auto',
                     margin: '0 auto',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     height: '100%',
                     flex: 1,
                  }}
               >
                  {statsPosition === 'chart' || statsPosition !== 'table' ? (
                     <CounterBar aggregates={aggregates} />
                  ) : null}
                  {allowedCharts?.map(chart => (
                     <Chart
                        key={chart.id}
                        aggregates={aggregates}
                        chartOptions={chartOptions}
                        statsPosition={statsPosition}
                        rawData={tableData}
                        options={options}
                        includeTableData={includeTable}
                        updateOptions={updateOptions}
                        optionVariables={optionVariables}
                        chart={chart}
                     />
                  ))}
               </Box>
            ) : null}

            {includeTable ? (
               <>
                  {alignment === 'column' ? (
                     <>
                        <br />
                        <br />
                     </>
                  ) : (
                     <span style={{ width: '20px' }} />
                  )}
                  {statsPosition === 'table' ? (
                     <CounterBar aggregates={aggregates} />
                  ) : null}
                  <Box
                     style={{
                        flex: 1,
                        width: alignment === 'column' ? '100%' : null,
                     }}
                  >
                     {includeTable ? (
                        <Option
                           options={options}
                           state={optionVariables}
                           updateOptions={updateOptions}
                        />
                     ) : null}
                     <ReactTabulator
                        columns={[]}
                        options={tableConfig}
                        data={tableData}
                     />
                  </Box>
               </>
            ) : null}
         </StyledContainer>
      </>
   )
}

function CounterBar({ aggregates }) {
   const keys = (aggregates && Object.keys(aggregates)) || []

   if (keys.length) return <Counter aggregates={aggregates} keys={keys} />
   return null
}

const StyledContainer = styled.div`
   position: relative;
   width: 100%;
   height: 100%;
   padding: 1rem 2rem;
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
export { CounterBar }
