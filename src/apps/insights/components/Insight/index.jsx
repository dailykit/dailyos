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
 * @param {{ includeChart?: boolean, includeTable?: boolean, title: string, nodeKey: string}} props
 */
export default function Insight({
   includeTable = true,
   includeChart = false,
   title = '',
}) {
   const {
      tableData,
      options,
      optionVariables,
      updateOptions,
      aggregates,
      allowedCharts,
      filters,
      switches,
      updateSwitches,
   } = useInsights(title, {
      includeTableData: includeTable,
      includeChartData: includeChart,
   })

   return (
      <>
         <StyledContainer>
            {includeChart ? (
               <HeroCharts
                  allowedCharts={allowedCharts}
                  aggregates={aggregates}
                  includeTable={includeTable}
                  optionVariables={optionVariables}
                  options={options}
                  tableData={tableData}
                  updateOptions={updateOptions}
                  filters={filters}
                  switches={switches}
                  updateSwitches={updateSwitches}
               />
            ) : null}
            <br />

            <FlexViewWrapper>
               {includeChart ? (
                  <FlexCharts
                     allowedCharts={allowedCharts}
                     tableData={tableData}
                  />
               ) : null}

               {includeTable ? (
                  <>
                     <Box
                        style={{
                           width: '100%',
                        }}
                     >
                        {!includeChart ? (
                           <CounterBar aggregates={aggregates} />
                        ) : null}
                        {!includeChart ||
                        !allowedCharts?.filter(
                           chart => chart.layoutType === 'HERO'
                        ).length ? (
                           <Option
                              options={options}
                              state={optionVariables}
                              updateOptions={updateOptions}
                              filters={filters}
                              switches={switches}
                              updateSwitches={updateSwitches}
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
            </FlexViewWrapper>
         </StyledContainer>
      </>
   )
}

function HeroCharts({
   allowedCharts,
   aggregates,
   tableData,
   options,
   optionVariables,
   updateOptions,
   filters,
   switches,
   updateSwitches,
}) {
   if (!allowedCharts?.length) return null

   return allowedCharts
      ?.filter(chart => chart.layoutType === 'HERO')
      .map(chart => (
         <Box
            key={chart.id}
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
            <CounterBar aggregates={aggregates} />
            <Chart
               rawData={tableData}
               chart={chart}
               optionVariables={optionVariables}
               options={options}
               updateOptions={updateOptions}
               showOptions
               filters={filters}
               switches={switches}
               updateSwitches={updateSwitches}
            />
         </Box>
      ))
}

function FlexCharts({ allowedCharts, tableData }) {
   if (!allowedCharts?.length) return null

   return allowedCharts
      ?.filter(chart => chart.layoutType === 'FLEX')
      .map(chart => {
         return (
            <Box
               key={chart.id}
               style={{
                  width: '100%',
                  overflowX: 'auto',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
               }}
            >
               <Chart rawData={tableData} chart={chart} showOptions={false} />
            </Box>
         )
      })
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
`
const FlexViewWrapper = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 1rem;
`
export { CounterBar }
