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
   })

   React.useEffect(() => {
      if (allowedCharts.length) setChartType({ ...allowedCharts[0], index: 0 })
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
                        setChartType({
                           index: e.target.value,
                           type: allowedCharts[e.target.value].type,
                        })
                     }}
                  >
                     {allowedCharts.map((chart, i) => (
                        <option value={i} key={chart.type}>
                           {chart.type}
                        </option>
                     ))}
                  </select>

                  <select
                     style={{ marginBottom: '12px' }}
                     name="x-options"
                     id="x-options"
                     onChange={e => {
                        setXColumn(e.target.value)
                     }}
                  >
                     {allowedCharts.length &&
                        allowedCharts[chartType.index].x.map(column => {
                           return (
                              <option value={column.key} key={column.key}>
                                 {column.label}
                              </option>
                           )
                        })}
                  </select>

                  <Dropdown title="sources" withIcon>
                     {allowedCharts.length &&
                        allowedCharts[chartType.index].y.map(column => {
                           return (
                              <ChartColumn
                                 key={column.key}
                                 column={column}
                                 setYColumns={setYColumns}
                                 yColumns={yColumns}
                                 multiple={chartType.multiple}
                              />
                           )
                        })}
                  </Dropdown>

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

function ChartColumn({ column, setYColumns, yColumns, multiple }) {
   const [checked, setChecked] = useState(false)

   React.useEffect(() => {
      if (checked) {
         setYColumns(cols => [...cols, column])
      } else {
         const newColumns = yColumns.filter(col => col.key !== column.key)
         setYColumns(newColumns)
      }
   }, [checked])

   const selectColumn = () => {
      if (!multiple) {
         setYColumns([column])
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
