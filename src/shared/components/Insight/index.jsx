import React, { useState } from 'react'
import { ReactTabulator } from '@dailykit/react-tabulator'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import 'react-tabulator/lib/styles.css'
import styled from 'styled-components'
import { Flex, Toggle } from '@dailykit/ui'

import '../../styled/tableStyles.css'
import { useInsights } from '../../hooks/useInsights'
import { Counter } from './Counter'
import Chart from './Chart'
import Option from './Option'
import { tableConfig } from './tableConfig'

/**
 *
 * @param {{includeTable: boolean, includeChart: boolean, identifier: string, where: {}, limit: number, order: {}}} props
 */
export default function Insight({
   includeTable = true,
   includeChart = false,
   identifier = '',
   where = {},
   limit,
   order,
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
   } = useInsights(identifier, {
      includeTableData: includeTable,
      includeChartData: includeChart,
      where,
      limit,
      order,
   })

   return (
      <>
         <StyledContainer>
            <div
               style={{
                  display: 'grid',
                  gridTemplateColumns: '8rem 1fr',
                  marginBottom: '1rem',
               }}
            >
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
            </div>
            <div
               style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  columnGap: '2rem',
               }}
            >
               {isDiff ? <CounterBar aggregates={newAggregates} /> : null}
               <CounterBar aggregates={oldAggregates} />
            </div>
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

               {includeTable && (
                  <ReactTabulator
                     columns={[]}
                     options={tableConfig}
                     data={oldTableData}
                  />
               )}
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
`
const StyledGrid = styled.div`
   display: grid;
   grid-template-columns: ${({ isDiff }) => (isDiff ? '1fr' : '1fr 1fr')};
   gap: 1rem;
`

export { CounterBar }