import React, { useState } from 'react'
import { ReactTabulator } from '@dailykit/react-tabulator'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import 'react-tabulator/lib/styles.css'
import styled from 'styled-components'
import { Flex, Toggle } from '@dailykit/ui'

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
   const [isDiff, setIsDiff] = useState(false)

   const {
      newTableData,
      oldTableData,
      options,
      optionVariables,
      updateOptions,
      allowedCharts,
      filters,
      switches,
      updateSwitches,
      oldData,
      newData,
      oldAggregates,
      newAggregates,
   } = useInsights(title, {
      includeTableData: includeTable,
      includeChartData: includeChart,
   })

   return (
      <>
         <StyledContainer>
            <Flex container alignItems="center" margin="0 0 1rem 0">
               <Toggle
                  checked={isDiff}
                  setChecked={setIsDiff}
                  label="Compare"
               />

               <Option
                  options={options}
                  state={optionVariables}
                  updateOptions={updateOptions}
                  filters={filters}
                  switches={switches}
                  updateSwitches={updateSwitches}
                  showColumnToggle
                  isDiff={isDiff}
               />
            </Flex>
            <Flex container justifyContent="space-between">
               {isDiff ? <CounterBar aggregates={newAggregates} /> : null}
               <CounterBar aggregates={oldAggregates} />
            </Flex>
            {includeChart ? (
               <HeroCharts
                  allowedCharts={allowedCharts}
                  oldData={oldData}
                  newData={newData}
                  isDiff={isDiff}
               />
            ) : null}

            <StyledGrid isDiff={isDiff}>
               {includeChart ? (
                  <FlexCharts
                     allowedCharts={allowedCharts}
                     oldData={oldData}
                     newData={newData}
                     isDiff={isDiff}
                  />
               ) : null}
            </StyledGrid>
            <Flex container>
               {isDiff ? (
                  <ReactTabulator
                     columns={[]}
                     options={tableConfig}
                     data={newTableData.length ? newTableData : oldTableData}
                  />
               ) : null}
               <ReactTabulator
                  columns={[]}
                  options={tableConfig}
                  data={oldTableData}
               />
            </Flex>
         </StyledContainer>
      </>
   )
}

function HeroCharts({ allowedCharts, oldData, newData, isDiff }) {
   if (!allowedCharts?.length) return null

   return allowedCharts
      ?.filter(chart => chart.layoutType === 'HERO')
      .map(chart => (
         <Chart
            key={chart.id}
            oldData={oldData}
            newData={newData}
            chart={chart}
            isDiff={isDiff}
         />
      ))
}

function FlexCharts({ allowedCharts, oldData, newData, isDiff }) {
   if (!allowedCharts?.length) return null

   return allowedCharts
      ?.filter(chart => chart.layoutType === 'FLEX')
      .map(chart => {
         return (
            <Chart
               oldData={oldData}
               newData={newData}
               chart={chart}
               isDiff={isDiff}
               key={chart.id}
            />
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
   width: 95vw;
   margin: 1rem auto;
   padding: 1rem 2rem;
   background: #ffffff;
   border-radius: 10px;
   overflow-x: auto;
`
const StyledGrid = styled.div`
   display: grid;
   grid-template-columns: ${({ isDiff }) => (isDiff ? '1fr' : '1fr 1fr')};
   gap: 1rem;
`
export { CounterBar }
