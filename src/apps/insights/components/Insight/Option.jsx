import { Checkbox, Input, TextButton } from '@dailykit/ui'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { LeftIcon } from '../../../../shared/assets/icons'
import { Flex } from '../../../../shared/components/Flex'
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
   isNewOption,
}) {
   const [submenu, setSubmenu] = useState('main')
   const [optionsState, setOptionsState] = useState(state)
   const [filterable, setFilterable] = useState(false)
   const [show, setShow] = useState(false)

   /**
    *
    * @param {string} optionName
    */
   const setDropdownView = optionName => {
      if (!optionName.startsWith('_')) setSubmenu(optionName)
   }

   const handleClick = () => {
      const newOptions = buildOptionVariables(optionsState)
      updateOptions(isNewOption)(newOptions)
      setShow(false)
   }

   const handleReset = () => {
      updateOptions({})
      setOptionsState({})
      setShow(false)
   }

   const renderApplyButton = () => {
      return (
         <div
            style={{ marginLeft: '12px', marginTop: '12px', display: 'flex' }}
         >
            <TextButton type="solid" onClick={handleClick}>
               Apply
            </TextButton>
            <span style={{ width: '12px' }} />

            <TextButton type="solid" onClick={handleReset}>
               Reset
            </TextButton>
         </div>
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

      const handleChange = (value, field) => {
         setOptionsState({
            ...optionsState,
            [submenu]: {
               ...optionsState[submenu],
               [field]: value || null,
            },
         })
      }

      if (option.startsWith('_')) {
         return (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
               {renderOptionName(option, submenu)}

               <span style={{ width: '10px' }} />

               {checkDateField(submenu) ? (
                  <DatePicker
                     selected={optionsState[submenu]?.[option] || ''}
                     onSelect={date => {
                        setFilterable(true)
                        handleChange(date, option)
                     }}
                  />
               ) : (
                  <Input
                     type="text"
                     value={optionsState[submenu]?.[option] || ''}
                     onChange={e => {
                        setFilterable(true)
                        handleChange(e.target.value, option)
                     }}
                     name={option}
                  />
               )}
            </div>
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
               handleApply={handleClick}
               handleReset={handleReset}
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
            handleApply={handleClick}
            handleReset={handleReset}
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
