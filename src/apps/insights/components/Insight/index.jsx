import { ReactTabulator } from '@dailykit/react-tabulator'
import React, { useState } from 'react'
import { Chart } from 'react-google-charts'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import 'react-tabulator/lib/styles.css'
import '../../../../shared/styled/tableStyles.css'
import styled from 'styled-components'
import { Checkbox, TextButton, RadioGroup, Text } from '@dailykit/ui'

import { useInsights } from '../../hooks/useInsights'
import { tableConfig } from './tableConfig'
import Option from './Option'
import { Dropdown, DropdownItem } from '../DropdownMenu'
import Modal from '../Modal'
import { Box } from '../'
import { Counter } from '../Counter'

/**
 *
 * @param {{ includeChart?: boolean, includeTable?: boolean, alignment?: 'column' | 'row', tablePosition?: 'bottom' | 'top' | 'right' | 'left', statsPosition: 'table' | 'chart', id: string, nodeKey: string, chartOptions: {height: string, width: string}  }} props
 */
export default function Insight({
   includeTable = true,
   includeChart = false,
   alignment = 'column',
   tablePosition = 'bottom',
   id = '',
   chartOptions = {},
   statsPosition,
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
      aggregates,
   } = useInsights(id, {
      includeTableData: true,
      includeChart,
      xColumn,
      yColumns,
      chartType,
      slice,
      metrices,
   })

   const [showModal, setShowModal] = useState(false)

   React.useEffect(() => {
      if (allowedCharts.length && !chartType.type)
         setChartType({ ...allowedCharts[0], index: 0 })
   }, [allowedCharts.length])

   return (
      <>
         <Modal show={showModal} close={setShowModal} width="40%">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
               <Text as="h1">Chart Types</Text>
               <RadioGroup
                  options={allowedCharts.map((chart, index) => ({
                     ...chart,
                     index,
                     id: index,
                     title: chart.type,
                     chartTitle: chart.title,
                  }))}
                  active={chartType.index}
                  onChange={option =>
                     setChartType({ ...option, title: option.chartTitle })
                  }
               />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
         </Modal>
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
                  <Chart
                     data={chartData}
                     chartType={chartType.type}
                     loader={<div>loading...</div>}
                     style={{ flex: '1' }}
                     options={{
                        legend:
                           chartType.type === 'PieChart'
                              ? 'none'
                              : { position: 'right' },
                        hAxis: { slantedText: false },
                        height: chartOptions.height || '454px',
                        width: chartOptions.width || '100%',
                        ...chartOptions,
                        title: chartType.title,
                     }}
                  />
                  <ChartConfigContainer>
                     <TextButton
                        onClick={() => setShowModal(true)}
                        type="solid"
                     >
                        Config
                     </TextButton>
                  </ChartConfigContainer>
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

function ChartColumn({
   column,
   updateFunc,
   multiple,
   setShow,
   yChecked,
   setYChecked,
   isChecked,
}) {
   const [checked, setChecked] = useState(isChecked)

   React.useEffect(() => {
      const isExist = yChecked.findIndex(col => col.key === column.key)
      if (checked) {
         if (isExist < 0) setYChecked([...yChecked, column])
      } else {
         const newCols = yChecked.filter(col => col.key !== column.key)
         if (isExist >= 0) setYChecked(newCols)
      }
   }, [checked])

   const selectColumn = () => {
      if (!multiple) {
         updateFunc([column])
         setShow(false)
      }
   }

   return (
      <DropdownItem onClick={selectColumn}>
         {multiple ? (
            <Checkbox
               checked={checked}
               onChange={() => {
                  setChecked(bool => !bool)
               }}
            >
               {column.key}
            </Checkbox>
         ) : (
            <>{column.key}</>
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
   const [showX, setShowX] = useState(false)
   const [showY, setShowY] = useState(false)

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
      case 'Calendar':
         if (allowedCharts.length) {
            xOrSlice = allowedCharts[chartType.index].dateKeys
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
   const [yOrSlices, setYOrSlices] = useState([yOrMetrices[0]])

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

   const handleXOrMetrices = key => {
      switch (chartType.type) {
         case 'Bar':
            setXColumn(key)
            return setShowX(false)
         case 'PieChart':
            setSlice(key)
            return setShowX(false)
         default:
            setXColumn(key)
            return setShowX(false)
      }
   }

   return (
      <>
         <Dropdown title="Label" withIcon show={showX} setShow={setShowX}>
            {allowedCharts.length &&
               xOrSlice.map(column => {
                  const label = typeof column === 'string' ? column : column.key
                  return (
                     <DropdownItem
                        key={label}
                        onClick={() => handleXOrMetrices(column.key)}
                     >
                        {label}
                     </DropdownItem>
                  )
               })}
         </Dropdown>

         <Dropdown title="sources" withIcon show={showY} setShow={setShowY}>
            {allowedCharts.length && (
               <>
                  {yOrMetrices.map(column => {
                     return (
                        <ChartColumn
                           key={column.key}
                           column={column}
                           updateFunc={handleYOrMetrices()}
                           yColumns={yColumns}
                           multiple={chartType.multiple}
                           setShow={setShowY}
                           yChecked={yOrSlices}
                           setYChecked={setYOrSlices}
                           isChecked={
                              yOrSlices.findIndex(
                                 col => col.key === column.key
                              ) >= 0
                           }
                        />
                     )
                  })}
                  {chartType.multiple && (
                     <DropdownItem>
                        <TextButton
                           type="solid"
                           onClick={() => {
                              handleYOrMetrices()(yOrSlices)
                              setShowY(false)
                           }}
                        >
                           Apply
                        </TextButton>
                     </DropdownItem>
                  )}
               </>
            )}
         </Dropdown>
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
const ChartConfigContainer = styled.div`
   display: flex;
   margin-top: 16px;
   width: 100%;
   border-top: 1px solid #eef0f7;
   padding-top: 8px;
`
