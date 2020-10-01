import React, { useState } from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

import { checkDateField } from '../../utils/checkDateField'
import { optionsMap } from '../../utils/optionsMap'
import { Input, TextButton } from '@dailykit/ui'
import { Dropdown, DropdownItem } from '../DropdownMenu'
import { isObject } from '../../../../shared/utils/isObject'

import '../../../../shared/styled/datepicker.css'
import { fromMixed } from '../../utils/textTransform'

export default function Filters({
   filters,
   optionsState,
   setOptionsState,
   handleApply,
   handleReset,
}) {
   return Object.keys(filters).map(filter => (
      <Filter
         key={filter}
         filter={filter}
         filters={filters}
         optionsState={optionsState}
         setOptionsState={setOptionsState}
         handleApply={handleApply}
         handleReset={handleReset}
      />
   ))
}

function Filter({
   filter,
   filters,
   optionsState,
   setOptionsState,
   handleApply,
   handleReset,
}) {
   const [show, setShow] = useState(false)
   const [filterable, setFilterable] = useState(false)

   const handleFilterApply = () => {
      setShow(false)
      handleApply()
   }

   const handleFilterReset = () => {
      setShow(false)
      setFilterable(false)
      handleReset()
   }

   const renderApplyButton = () => {
      return (
         <div
            style={{ marginLeft: '12px', marginTop: '12px', display: 'flex' }}
         >
            <TextButton type="solid" onClick={handleFilterApply}>
               Apply
            </TextButton>
            <span style={{ width: '12px' }} />

            <TextButton type="solid" onClick={handleFilterReset}>
               Reset
            </TextButton>
         </div>
      )
   }

   const renderOption = (option, parent) => {
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
            [parent]: {
               ...optionsState[parent],
               [field]: value || null,
            },
         })
      }

      if (option.startsWith('_')) {
         return (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
               {renderOptionName(option, parent)}

               <span style={{ width: '10px' }} />

               {checkDateField(parent) ? (
                  <DatePicker
                     selected={optionsState[parent]?.[option] || ''}
                     onSelect={date => {
                        setFilterable(true)
                        handleChange(date, option)
                     }}
                  />
               ) : (
                  <Input
                     type="text"
                     value={optionsState[parent]?.[option] || ''}
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
   return (
      <>
         <span style={{ width: '1rem' }} />
         <Dropdown
            title={fromMixed(filter)}
            withIcon
            show={show}
            setShow={setShow}
         >
            {isObject(filters[filter]) &&
               Object.keys(filters[filter]).map(filterName => (
                  <DropdownItem key={filterName}>
                     {renderOption(filterName, filter)}
                  </DropdownItem>
               ))}

            {filterable && renderApplyButton()}
         </Dropdown>
      </>
   )
}
