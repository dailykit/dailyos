import React, { useState } from 'react'
import styled from 'styled-components'
import { Chart as GoogleChart } from 'react-google-charts'
import '../../../../shared/styled/tableStyles.css'
import Modal from '../Modal'
import { TextButton, Text, Checkbox, RadioGroup } from '@dailykit/ui'
import { DropdownItem, Dropdown } from '../DropdownMenu'

import Option from './Option'
import { useChart } from '../../hooks/useChart'

export default function Chart({
   chartOptions,
   chart,
   rawData,
   options,
   includeTableData,
   updateOptions,
   optionVariables,
}) {
   const [showModal, setShowModal] = useState(false)
   const [chartType, setChartType] = useState({ ...chart.config[0], index: 0 })
   const [xColumn, setXColumn] = useState('')
   const [yColumns, setYColumns] = useState([])
   const [slice, setSlice] = useState('')
   const [metrices, setMetrices] = useState([])

   const { data } = useChart(chart, rawData, {
      chartType,
      xColumn,
      yColumns,
      slice,
      metrices,
   })

   console.log('type', chartType)

   return (
      <>
         <ChartConfig
            showModal={showModal}
            setShowModal={setShowModal}
            setXColumn={setXColumn}
            allowedCharts={chart.config}
            yColumns={yColumns}
            setYColumns={setYColumns}
            chartType={chartType}
            setSlice={setSlice}
            setMetrices={setMetrices}
            options={options}
            includeTable={includeTableData}
            updateOptions={updateOptions}
            setChartType={setChartType}
            optionVariables={optionVariables}
         />
         <GoogleChart
            data={data}
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
            }}
         />

         <ChartConfigContainer>
            <TextButton onClick={() => setShowModal(true)} type="solid">
               Config
            </TextButton>
         </ChartConfigContainer>
      </>
   )
}
function ChartConfig({
   showModal,
   setShowModal,
   setXColumn,
   allowedCharts,
   yColumns,
   setYColumns,
   chartType,
   setSlice,
   setMetrices,
   options,
   includeTable,
   updateOptions,
   optionVariables,
   setChartType,
}) {
   return (
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
   )
   // return null
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

         case 'Calendar':
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

         case 'Calendar':
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
                        onClick={() => handleXOrMetrices(label)}
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

const ChartConfigContainer = styled.div`
   display: flex;
   margin-top: 16px;
   width: 100%;
   border-top: 1px solid #eef0f7;
   padding-top: 8px;
`
