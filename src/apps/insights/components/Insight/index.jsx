import React, { useState } from 'react'
import { Input, TextButton } from '@dailykit/ui'
import styled from 'styled-components'
import { Chart } from 'react-google-charts'
import { ReactTabulator } from '@dailykit/react-tabulator'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import 'react-tabulator/lib/styles.css'

import { useInsights } from '../../hooks/useInsights'
import { tableConfig } from './tableConfig'
import { Dropdown, DropdownItem } from '../DropdownMenu'
import { isObject } from '../../../../shared/utils/isObject'
import { LeftIcon } from '../../../../shared/assets/icons'
import { buildOptionVariables } from '../../utils/transformer'
/**
 *
 * @param {{ includeChart?: boolean, includeTable?: boolean, alignment?: 'column' | 'row', tablePosition?: 'bottom' | 'top' | 'right' | 'left', chartOptions?: {xLabel: string, xKey: string, yLabel: string, type: 'Bar' | 'Line' | 'PieChart', width?: string, height?: string, showLegend?: boolean, availableChartTypes: Array<string>, }, id: string  }} props
 */
export default function Insight({
   includeTable = true,
   includeChart = false,
   alignment = 'column',
   tablePosition = 'bottom',
   chartOptions = {
      availableChartTypes: ['Bar'],
   },
   id = '',
}) {
   const {
      chartData,
      tableData,
      options,
      optionVariables,
      updateOptions,
   } = useInsights(id, {
      chart: chartOptions,
      includeTableData: includeChart ? chartOptions : {},
   })
   const [chartType, setChartType] = useState(
      chartOptions.availableChartTypes[0]
   )

   return (
      <StyledContainer alignment={alignment} position={tablePosition}>
         {includeChart ? (
            <div>
               <div style={{ display: 'flex' }}>
                  <select
                     style={{ marginBottom: '12px' }}
                     name="chartTypes"
                     id="chartTypes"
                     defaultValue={chartOptions.availableChartTypes[0]}
                     onChange={e => {
                        setChartType(e.target.value)
                     }}
                  >
                     {chartOptions.availableChartTypes.map(type => (
                        <option value={type} key={type}>
                           {type}
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
                  height={chartOptions.height || '400px'}
                  width={chartOptions.width || '600px'}
                  options={{ legend: chartOptions.showLegend ? {} : 'none' }}
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

function Option({ options, state, updateOptions }) {
   const [submenu, setSubmenu] = useState('main')
   const [optionsState, setOptionsState] = useState(state)
   const [filterable, setFilterable] = useState(false)

   /**
    *
    * @param {string} optionName
    */
   const setDropdownView = optionName => {
      if (!optionName.startsWith('_')) setSubmenu(optionName)
   }

   const renderApplyButton = () => {
      const handleClick = () => {
         const newOptions = buildOptionVariables(optionsState)
         updateOptions(newOptions)
      }

      return (
         <TextButton
            style={{ marginLeft: '12px', marginTop: '12px' }}
            type="solid"
            onClick={handleClick}
         >
            Apply
         </TextButton>
      )
   }

   const renderOption = option => {
      const handleChange = (value, field) => {
         setOptionsState({
            ...optionsState,
            [submenu]: {
               ...optionsState[submenu],
               [field]: value.length ? value : null,
            },
         })
      }

      if (option.startsWith('_')) {
         return (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
               {option}

               <span style={{ width: '10px' }} />

               <Input
                  type="text"
                  value={optionsState[submenu]?.[option] || ''}
                  onChange={e => handleChange(e.target.value, option)}
                  name={option}
                  onBlur={() => setFilterable(true)}
               />
            </div>
         )
      }
   }

   if (submenu === 'main')
      return (
         <Dropdown title="Filters">
            {Object.keys(options).map(option => {
               return (
                  <DropdownItem
                     onClick={() => setDropdownView(option)}
                     key={option}
                  >
                     {option}
                  </DropdownItem>
               )
            })}

            {filterable && renderApplyButton()}
         </Dropdown>
      )

   return (
      <Dropdown title="Filters">
         <DropdownItem
            onClick={() => setDropdownView('main')}
            leftIcon={<LeftIcon color="#888d9d" />}
         />

         {isObject(options[submenu]) &&
            Object.keys(options[submenu]).map(option => {
               return (
                  <DropdownItem
                     onClick={() => setDropdownView(option)}
                     key={option}
                  >
                     {renderOption(option)}
                  </DropdownItem>
               )
            })}

         {filterable && renderApplyButton()}
      </Dropdown>
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
