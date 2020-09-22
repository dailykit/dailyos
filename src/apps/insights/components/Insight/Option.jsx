import React, { useState } from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

import { LeftIcon } from '../../../../shared/assets/icons'
import { buildOptionVariables } from '../../utils/transformer'
import { checkDateField } from '../../utils/checkDateField'
import { optionsMap } from '../../utils/optionsMap'
import { Input, TextButton } from '@dailykit/ui'
import { Dropdown, DropdownItem } from '../DropdownMenu'
import { isObject } from '../../../../shared/utils/isObject'

import '../../../../shared/styled/datepicker.css'
import { fromMixed } from '../../utils/textTransform'

/**
 *
 * @param {{options: {}, state: {}, updateOptions: () => {}}} props
 */
export default function Option({ options, state, updateOptions }) {
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

   const renderApplyButton = () => {
      const handleClick = () => {
         const newOptions = buildOptionVariables(optionsState)
         updateOptions(newOptions)
         setShow(false)
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
         <Dropdown title="Filters" withIcon show={show} setShow={setShow}>
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
      )

   return (
      <Dropdown title="Filters" withIcon setShow={setShow} show={show}>
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
