import { ReactTabulator } from '@dailykit/react-tabulator'
import React, { useState } from 'react'
import { Chart } from 'react-google-charts'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import 'react-tabulator/lib/styles.css'
import styled from 'styled-components'

import { useInsights } from '../../hooks/useInsights'
import { tableConfig } from './tableConfig'
import Option from './Option'

/**
 *
 * @param {{ includeChart?: boolean, includeTable?: boolean, alignment?: 'column' | 'row', tablePosition?: 'bottom' | 'top' | 'right' | 'left', id: string, nodeKey: string  }} props
 */
export default function Insight({
   includeTable = true,
   includeChart = false,
   alignment = 'column',
   tablePosition = 'bottom',
   id = '',
   nodeKey = 'nodes',
}) {
   const {
      chartData,
      tableData,
      options,
      optionVariables,
      allowedCharts,
      updateOptions,
   } = useInsights(id, nodeKey, {
      includeTableData: true,
      includeChart,
   })
   const [chartType, setChartType] = useState(allowedCharts[0]?.type)

   React.useEffect(() => {
      setChartType(allowedCharts[0]?.type)
   }, [allowedCharts])

   return (
      <StyledContainer alignment={alignment} position={tablePosition}>
         {includeChart ? (
            <div>
               <div style={{ display: 'flex' }}>
                  <select
                     style={{ marginBottom: '12px' }}
                     name="chartTypes"
                     id="chartTypes"
                     defaultValue={chartType || ''}
                     onChange={e => {
                        setChartType(e.target.value)
                     }}
                  >
                     {allowedCharts.map((chart, i) => (
                        <option value={i} key={chart.type}>
                           {chart.type}
                        </option>
                     ))}
                  </select>

                  {!includeTable ? (
                     <>
                        <span style={{ width: '20px' }} />
                        <Option
                           options={options}
                           state={optionVariables}
                           updateOptions={updateOptions}
                        />
                     </>
                  ) : null}
               </div>
               <Chart
                  data={chartData}
                  chartType={chartType}
                  loader={<div>loading...</div>}
                  style={{ flex: '1' }}
                  height="400px"
                  width="600px"
                  options={{ legend: 'none' }}
               />
            </div>
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
