import { Checkbox, Input, TextButton, Flex, Tag } from '@dailykit/ui'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { LeftIcon } from '../../assets/icons'
import '../../styled/datepicker.css'
import { isObject } from '../../utils/isObject'
import { checkDateField } from '../../utils/checkDateField'
import { optionsMap } from '../../utils/optionsMap'
import { fromMixed } from '../../utils/textTransform'
import { buildOptionVariables } from '../../utils/insight_utils'
import { dateFmt } from '../../utils/dateFmt'
import { Dropdown, DropdownItem } from './DropdownMenu'
import Filters from './Filters/Filters'

/**
 *
 * @param {{options: {}, state: {}, updateOptions: () => {}}} props
 */
export default function Option({
   options,
   state,
   updateOptions,
   shiftLeft,
   filters,
   switches,
   updateSwitches,
   showColumnToggle,
   isDiff,
}) {
   const [submenu, setSubmenu] = useState('main')
   const [optionsState, setOptionsState] = useState(state)
   const [newOptionsState, setNewOptionsState] = useState({})
   const [currentOptions, setCurrentOptions] = useState({})
   const [currentNewOptions, setCurrentNewOptions] = useState({})
   const [filterable, setFilterable] = useState(false)
   const [show, setShow] = useState(false)

   /**
    *
    * @param {string} optionName
    */
   const setDropdownView = optionName => {
      if (!optionName.startsWith('_')) setSubmenu(optionName)
   }

   const handleClick = isNewOption => {
      const newOptions = isNewOption
         ? buildOptionVariables(newOptionsState)
         : buildOptionVariables(optionsState)
      updateOptions(isNewOption)(newOptions)
      setShow(false)

      if (isNewOption) {
         setCurrentNewOptions(newOptionsState)
      } else {
         setCurrentOptions(optionsState)
      }
   }

   const handleReset = isNewOption => {
      updateOptions(isNewOption)({})
      if (isNewOption) {
         setNewOptionsState({})
         setCurrentNewOptions({})
      } else {
         setOptionsState({})
         setCurrentOptions({})
      }
      setShow(false)
   }

   const renderApplyButton = () => {
      return (
         <Flex container margin="12px 0 0 12px">
            {isDiff ? (
               <>
                  <TextButton type="solid" onClick={() => handleClick(true)}>
                     Apply New
                  </TextButton>
                  <span style={{ width: '12px' }} />

                  <TextButton type="solid" onClick={() => handleReset(true)}>
                     Reset New
                  </TextButton>
                  <span style={{ width: '12px' }} />
               </>
            ) : null}
            <TextButton type="solid" onClick={() => handleClick(false)}>
               Apply
            </TextButton>
            <span style={{ width: '12px' }} />

            <TextButton type="solid" onClick={() => handleReset(false)}>
               Reset
            </TextButton>
         </Flex>
      )
   }

   const renderOption = option => {
      /**
       *
       * @param {string} option
       * @param {string} parent
       */
      const renderOptionName = (option, parent) => {
         if (checkDateField(parent)) {
            return optionsMap['created_at'][option]
         }

         return optionsMap[option] || option
      }

      const handleChange = (value, field, isNewOption) => {
         if (isNewOption) {
            setNewOptionsState({
               ...optionsState,
               [submenu]: {
                  ...newOptionsState[submenu],
                  [field]: value || null,
               },
            })
         } else {
            setOptionsState({
               ...optionsState,
               [submenu]: {
                  ...optionsState[submenu],
                  [field]: value || null,
               },
            })
         }
      }

      if (option.startsWith('_')) {
         return (
            <Flex
               container
               alignItems="flex-end"
               justifyContent="space-between"
            >
               {checkDateField(submenu) ? (
                  <>
                     {isDiff ? (
                        <>
                           <DatePicker
                              selected={
                                 newOptionsState[submenu]?.[option] || ''
                              }
                              onSelect={date => {
                                 setFilterable(true)
                                 handleChange(date, option, true)
                              }}
                           />
                           <span style={{ width: '10px' }} />
                        </>
                     ) : null}
                     <DatePicker
                        selected={optionsState[submenu]?.[option] || ''}
                        onSelect={date => {
                           setFilterable(true)
                           handleChange(date, option, false)
                        }}
                     />
                  </>
               ) : (
                  <>
                     {isDiff ? (
                        <>
                           <Input
                              label={renderOptionName(option, submenu)}
                              type="text"
                              value={newOptionsState[submenu]?.[option] || ''}
                              onChange={e => {
                                 setFilterable(true)
                                 handleChange(e.target.value, option, true)
                              }}
                              name={option}
                           />
                           <span style={{ width: '10px' }} />
                        </>
                     ) : null}
                     <Input
                        label={renderOptionName(option, submenu)}
                        type="text"
                        value={optionsState[submenu]?.[option] || ''}
                        onChange={e => {
                           setFilterable(true)
                           handleChange(e.target.value, option, false)
                        }}
                        name={option}
                     />
                  </>
               )}
            </Flex>
         )
      }
   }

   if (submenu === 'main')
      return (
         <>
            <Flex container>
               <Filters
                  filters={filters}
                  optionsState={optionsState}
                  setOptionsState={setOptionsState}
                  newOptionsState={newOptionsState}
                  setNewOptionsState={setNewOptionsState}
                  handleApply={handleClick}
                  handleReset={handleReset}
                  isDiff={isDiff}
               />
               <span style={{ width: '1rem' }} />
               <Dropdown
                  title="More Filters"
                  withIcon
                  show={show}
                  setShow={setShow}
                  shiftLeft={shiftLeft}
               >
                  {Object.keys(options).map(option => {
                     return (
                        <DropdownItem
                           width={isDiff ? '400px' : null}
                           onClick={() => setDropdownView(option)}
                           key={option}
                        >
                           {fromMixed(option)}
                        </DropdownItem>
                     )
                  })}

                  {filterable && renderApplyButton()}
               </Dropdown>
               {showColumnToggle ? (
                  <>
                     <span style={{ width: '1rem' }} />
                     <Switches
                        switches={switches}
                        updateSwitches={updateSwitches}
                     />
                  </>
               ) : null}
            </Flex>
            <AppliedFilters
               currentNewOptions={currentNewOptions}
               currentOptions={currentOptions}
            />
         </>
      )

   return (
      <>
         <Flex container>
            <Filters
               filters={filters}
               optionsState={optionsState}
               setOptionsState={setOptionsState}
               newOptionsState={newOptionsState}
               setNewOptionsState={setNewOptionsState}
               handleApply={handleClick}
               handleReset={handleReset}
               isDiff={isDiff}
            />
            <span style={{ width: '1rem' }} />
            <Dropdown
               title="More Filters"
               withIcon
               setShow={setShow}
               show={show}
               shiftLeft={shiftLeft}
            >
               <DropdownItem
                  onClick={() => setDropdownView('main')}
                  leftIcon={<LeftIcon color="#888d9d" />}
                  width={isDiff ? '400px' : null}
               />
               {isObject(options[submenu]) &&
                  Object.keys(options[submenu]).map(option => {
                     return (
                        <DropdownItem
                           key={option}
                           width={isDiff ? '400px' : null}
                        >
                           {renderOption(option)}
                        </DropdownItem>
                     )
                  })}

               {filterable && renderApplyButton()}
            </Dropdown>
            {showColumnToggle ? (
               <>
                  <span style={{ width: '1rem' }} />
                  <Switches
                     switches={switches}
                     updateSwitches={updateSwitches}
                  />
               </>
            ) : null}
         </Flex>
         <AppliedFilters
            currentNewOptions={currentNewOptions}
            currentOptions={currentOptions}
         />
      </>
   )
}

function Switches({ switches, updateSwitches }) {
   const [show, setShow] = useState(false)

   const renderOption = key => {
      const checked = switches[key]
      return (
         <Checkbox
            checked={checked}
            onChange={() => {
               updateSwitches(values => ({ ...values, [key]: !switches[key] }))
            }}
         >
            {fromMixed(key)}
         </Checkbox>
      )
   }

   return (
      <Dropdown
         show={show}
         setShow={setShow}
         title="show/hide columns"
         withIcon
         fromRight
      >
         {Object.keys(switches).map(key => (
            <DropdownItem key={key}>{renderOption(key)}</DropdownItem>
         ))}
      </Dropdown>
   )
}

const AppliedFilters = React.memo(({ currentNewOptions, currentOptions }) => {
   return (
      <div
         style={{
            marginTop: '0.6rem',
            gridColumn: '1 / 3',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: '2rem',
         }}
      >
         {Object.keys(currentNewOptions).length ? (
            <Flex>
               {Object.keys(currentNewOptions).map(option => {
                  if (!checkDateField(option))
                     return Object.keys(currentNewOptions[option]).map(
                        (key, i) => {
                           if (currentNewOptions[option][key])
                              return (
                                 <Tag color="primary" key={option + i}>
                                    {fromMixed(option)}: {optionsMap[key]}{' '}
                                    {currentNewOptions[option][key]}
                                 </Tag>
                              )
                        }
                     )

                  return Object.keys(currentNewOptions[option]).map(
                     (key, i) => {
                        if (currentNewOptions[option][key])
                           return (
                              <Tag color="primary" key={option + i}>
                                 {optionsMap[option][key]}{' '}
                                 {dateFmt.format(
                                    new Date(currentNewOptions[option][key])
                                 )}
                              </Tag>
                           )
                     }
                  )
               })}
            </Flex>
         ) : null}
         <Flex>
            {Object.keys(currentOptions).map(option => {
               if (!checkDateField(option))
                  return Object.keys(currentOptions[option]).map((key, i) => {
                     if (currentOptions[option][key])
                        return (
                           <Tag color="primary" key={option + i}>
                              {fromMixed(option)}: {optionsMap[key]}{' '}
                              {currentOptions[option][key]}
                           </Tag>
                        )
                  })

               return Object.keys(currentOptions[option]).map((key, i) => {
                  if (currentOptions[option][key])
                     return (
                        <Tag color="primary" key={option + i}>
                           {optionsMap[option][key]}{' '}
                           {dateFmt.format(
                              new Date(currentOptions[option][key])
                           )}
                        </Tag>
                     )
               })
            })}
         </Flex>
      </div>
   )
})
