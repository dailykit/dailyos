import React, { useState } from 'react'

import { LeftIcon } from '../../../../shared/assets/icons'
import { buildOptionVariables } from '../../utils/transformer'
import { Input, TextButton } from '@dailykit/ui'
import { Dropdown, DropdownItem } from '../DropdownMenu'
import { isObject } from '../../../../shared/utils/isObject'

export default function Option({ options, state, updateOptions }) {
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
