import { ReactTabulator } from '@dailykit/react-tabulator'
import React, { useState } from 'react'
import { Chart } from 'react-google-charts'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import 'react-tabulator/lib/styles.css'
import styled from 'styled-components'
import { Checkbox } from '@dailykit/ui'

import { useInsights } from '../../hooks/useInsights'
import { tableConfig } from './tableConfig'
import Option from './Option'
import { Dropdown, DropdownItem } from '../DropdownMenu'

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
   const [chartType, setChartType] = useState({ index: 0 })
   const [xColumn, setXColumn] = useState('')
   const [yColumns, setYColumns] = useState([])
   const [slice, setSlice] = useState('')
   const [metrices, setMetrices] = useState([])

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
      xColumn,
      yColumns,
      chartType,
      slice,
      metrices,
   })

   React.useEffect(() => {
      if (allowedCharts.length && !chartType.type)
         setChartType({ ...allowedCharts[0], index: 0 })
   }, [allowedCharts.length])

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
                        setYColumns([])
                        setXColumn('')
                        setSlice('')
                        setMetrices([])
                        setChartType({
                           index: e.target.value,
                           ...allowedCharts[e.target.value],
                        })
                     }}
                  >
                     {allowedCharts.map((chart, i) => (
                        <option value={i} key={chart.type}>
                           {chart.type}
                        </option>
                     ))}
                  </select>

                  <ChartOptions
                     setXColumn={setXColumn}
                     allowedCharts={allowedCharts}
                     yColumns={yColumns}
                     setYColumns={setYColumns}
                     chartType={chartType}
                     setSlice={setSlice}
                     setMetrices={setMetrices}
                  />

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
                  chartType={chartType.type}
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

function ChartColumn({ column, updateFunc, yColumns, multiple }) {
   const [checked, setChecked] = useState(false)

   React.useEffect(() => {
      if (checked) {
         updateFunc(cols => [...cols, column])
      } else {
         const newColumns = yColumns.filter(col => col.key !== column.key)
         updateFunc(newColumns)
      }
   }, [checked])

   const selectColumn = () => {
      if (!multiple) {
         updateFunc([column])
      }
   }

   return (
      <DropdownItem onClick={selectColumn}>
         {multiple ? (
            <Checkbox
               checked={checked}
               onChange={() => {
                  setChecked(!checked)
               }}
            >
               {column.label}
            </Checkbox>
         ) : (
            <>{column.label}</>
         )}
      </DropdownItem>
   )
}

function ChartOptions({
   allowedCharts,
   setXColumn,
   chartType,
   yColumns,
   setYColumns,
   setSlice,
   setMetrices,
}) {
   let xOrSlice = []
   let yOrMetrices = []

   switch (chartType.type) {
      case 'Bar':
         if (allowedCharts.length) {
            xOrSlice = allowedCharts[chartType.index].x
            yOrMetrices = allowedCharts[chartType.index].y
         }
         break

      case 'PieChart':
         if (allowedCharts.length) {
            xOrSlice = allowedCharts[chartType.index].slices
            yOrMetrices = allowedCharts[chartType.index].metrices
         }
         break
      default:
         if (allowedCharts.length) {
            xOrSlice = allowedCharts[chartType.index].x
            yOrMetrices = allowedCharts[chartType.index].y
         }
         break
   }

   const handleYOrMetrices = () => {
      switch (chartType.type) {
         case 'Bar':
            return setYColumns

         case 'PieChart':
            return setMetrices
         default:
            return setYColumns
      }
   }

   const handleXOrMetrices = e => {
      switch (chartType.type) {
         case 'Bar':
            return setXColumn(e.target.value)

         case 'PieChart':
            return setSlice(e.target.value)
         default:
            return setXColumn(e.target.value)
      }
   }

   return (
      <>
         <select
            style={{ marginBottom: '12px' }}
            name="x-options"
            id="x-options"
            onChange={handleXOrMetrices}
         >
            {allowedCharts.length &&
               xOrSlice.map(column => {
                  return (
                     <option value={column.key} key={column.key}>
                        {column.label}
                     </option>
                  )
               })}
         </select>

         <Dropdown title="sources" withIcon>
            {allowedCharts.length &&
               yOrMetrices.map(column => {
                  return (
                     <ChartColumn
                        key={column.key}
                        column={column}
                        updateFunc={handleYOrMetrices()}
                        yColumns={yColumns}
                        multiple={chartType.multiple}
                     />
                  )
               })}
         </Dropdown>
      </>
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
