import React, { useState } from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

import { checkDateField } from '../../../utils/checkDateField'
import { optionsMap } from '../../../utils/optionsMap'
import { Flex, Input, TextButton } from '@dailykit/ui'
import { Dropdown, DropdownItem } from '../DropdownMenu'
import { isObject } from '../../../utils/isObject'

import '../../../styled/datepicker.css'
import { fromMixed } from '../../../utils/textTransform'

export default function Filters({
   filters,
   optionsState,
   setOptionsState,
   newOptionsState,
   setNewOptionsState,
   handleApply,
   handleReset,
   isDiff,
}) {
   return Object.keys(filters).map(filter => (
      <Filter
         key={filter}
         filter={filter}
         filters={filters}
         optionsState={optionsState}
         setOptionsState={setOptionsState}
         newOptionsState={newOptionsState}
         setNewOptionsState={setNewOptionsState}
         handleApply={handleApply}
         handleReset={handleReset}
         isDiff={isDiff}
      />
   ))
}

function Filter({
   filter,
   filters,
   optionsState,
   setOptionsState,
   newOptionsState,
   setNewOptionsState,
   handleApply,
   handleReset,
   isDiff,
}) {
   const [show, setShow] = useState(false)
   const [filterable, setFilterable] = useState(false)

   const handleFilterApply = isNewOption => {
      setShow(false)
      handleApply(isNewOption)
   }

   const handleFilterReset = isNewOption => {
      setShow(false)
      setFilterable(false)
      handleReset(isNewOption)
   }

   const renderApplyButton = () => {
      return (
         <Flex container margin="12px 0 0 12px">
            {isDiff ? (
               <>
                  <TextButton
                     type="solid"
                     onClick={() => handleFilterApply(true)}
                  >
                     Apply New
                  </TextButton>
                  <span style={{ width: '12px' }} />

                  <TextButton
                     type="solid"
                     onClick={() => handleFilterReset(true)}
                  >
                     Reset New
                  </TextButton>
                  <span style={{ width: '12px' }} />
               </>
            ) : null}
            <TextButton type="solid" onClick={() => handleFilterApply(false)}>
               Apply
            </TextButton>
            <span style={{ width: '12px' }} />

            <TextButton type="solid" onClick={() => handleFilterReset(false)}>
               Reset
            </TextButton>
         </Flex>
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

      const handleChange = (value, field, isNewOption) => {
         if (isNewOption) {
            setNewOptionsState({
               ...optionsState,
               [parent]: {
                  ...newOptionsState[parent],
                  [field]: value || null,
               },
            })
         } else {
            setOptionsState({
               ...optionsState,
               [parent]: {
                  ...optionsState[parent],
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
               {checkDateField(parent) ? (
                  <>
                     {isDiff ? (
                        <>
                           <DatePicker
                              selected={newOptionsState[parent]?.[option] || ''}
                              onSelect={date => {
                                 setFilterable(true)
                                 handleChange(date, option, true)
                              }}
                           />
                           <span style={{ width: '10px' }} />
                        </>
                     ) : null}
                     <DatePicker
                        selected={optionsState[parent]?.[option] || ''}
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
                              label={renderOptionName(option, parent)}
                              type="text"
                              value={newOptionsState[parent]?.[option] || ''}
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
                        label={renderOptionName(option, parent)}
                        type="text"
                        value={optionsState[parent]?.[option] || ''}
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
                  <DropdownItem
                     key={filterName}
                     width={isDiff ? '400px' : null}
                  >
                     {renderOption(filterName, filter)}
                  </DropdownItem>
               ))}

            {filterable && renderApplyButton()}
         </Dropdown>
      </>
   )
}
