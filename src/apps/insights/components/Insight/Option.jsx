import { Checkbox, Input, TextButton, Flex } from '@dailykit/ui'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { LeftIcon } from '../../../../shared/assets/icons'
import '../../../../shared/styled/datepicker.css'
import { isObject } from '../../../../shared/utils/isObject'
import { checkDateField } from '../../utils/checkDateField'
import { optionsMap } from '../../utils/optionsMap'
import { fromMixed } from '../../utils/textTransform'
import { buildOptionVariables } from '../../utils/transformer'
import { Dropdown, DropdownItem } from '../DropdownMenu'
import Filters from '../Filters/Filters'

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
   }

   const handleReset = isNewOption => {
      updateOptions(isNewOption)({})
      if (isNewOption) {
         setNewOptionsState({})
      } else {
         setOptionsState({})
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
      )

   return (
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
                     <DropdownItem key={option} width={isDiff ? '400px' : null}>
                        {renderOption(option)}
                     </DropdownItem>
                  )
               })}

            {filterable && renderApplyButton()}
         </Dropdown>
         {showColumnToggle ? (
            <>
               <span style={{ width: '1rem' }} />
               <Switches switches={switches} updateSwitches={updateSwitches} />
            </>
         ) : null}
      </Flex>
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
