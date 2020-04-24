import React, { useState, useContext } from 'react'
import { Input, ButtonTile, TagGroup, Tag } from '@dailykit/ui'

import { ItemContext } from '../../../../../context/item'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'

import {
   StyledRow,
   StyledInputGroup,
   Highlight,
   InputWrapper,
   StyledSelect,
   StyledLabel,
} from '../styled'

export default function ConfigureDerivedProcessingTunnel({ close, open }) {
   const {
      state: { configurable },
      dispatch,
   } = useContext(ItemContext)

   const [par, setPar] = useState('')
   const [parUnit, setParUnit] = useState('gms')
   const [maxInventoryLevel, setMaxInventoryLevel] = useState('')
   const [maxInventoryUnit, setMaxInventoryUnit] = useState('gms')
   const [laborTime, setLaborTime] = useState('')
   const [laborUnit, setLaborUnit] = useState('hours')
   const [yieldPercentage, setYieldPercentage] = useState('')
   const [shelfLife, setShelfLife] = useState('')
   const [shelfLifeUnit, setShelfLifeUnit] = useState('hours')
   const [bulkDensity, setBulkDensity] = useState('')

   return (
      <TunnelContainer>
         <TunnelHeader
            title="Configure Processing"
            next={() => {
               dispatch({
                  type: 'CONFIGURE_DERIVED_PROCESSING',
                  payload: {
                     par,
                     parUnit,
                     maxInventoryLevel,
                     maxInventoryUnit,
                     laborTime,
                     laborUnit,
                     yieldPercentage,
                     shelfLife,
                     shelfLifeUnit,
                     bulkDensity,
                  },
               })
               close(7)
            }}
            close={() => close(7)}
            nextAction="Save"
         />

         <Spacer />

         <StyledRow>
            <StyledInputGroup>
               <InputWrapper>
                  <Input
                     type="text"
                     label="Set par level"
                     name="par_level"
                     value={par}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0) setPar('')
                        if (value) setPar(value)
                     }}
                  />
                  <StyledSelect
                     name="unit"
                     defaultValue={parUnit}
                     onChange={e => setParUnit(e.target.value)}
                  >
                     <option value="gms">gms</option>
                     <option value="kgs">kgs</option>
                  </StyledSelect>
               </InputWrapper>
               <InputWrapper>
                  <Input
                     type="text"
                     label="Max inventory level"
                     name="max_inventory_level"
                     value={maxInventoryLevel}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0)
                           setMaxInventoryLevel('')
                        if (value) setMaxInventoryLevel(value)
                     }}
                  />
                  <StyledSelect
                     name="unit"
                     defaultValue={maxInventoryUnit}
                     onChange={e => setMaxInventoryUnit(e.target.value)}
                  >
                     <option value="gms">gms</option>
                     <option value="kgs">kgs</option>
                  </StyledSelect>
               </InputWrapper>
            </StyledInputGroup>
         </StyledRow>
         <StyledRow>
            <StyledLabel>Processing information</StyledLabel>
         </StyledRow>
         <StyledRow>
            <ButtonTile
               type="primary"
               size="sm"
               text="Add Photo to your processing"
               helper="upto 1MB - only JPG, PNG, PDF allowed"
               onClick={e => console.log('Tile clicked')}
            />
         </StyledRow>
         <StyledRow>
            <StyledInputGroup>
               <InputWrapper>
                  <Input
                     type="text"
                     label="Labor time per 100gm"
                     name="labor_time"
                     value={laborTime}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0) setLaborTime('')
                        if (value) setLaborTime(value)
                     }}
                  />
                  <StyledSelect
                     name="unit"
                     defaultValue={laborUnit}
                     onChange={e => setLaborUnit(e.target.value)}
                  >
                     <option value="hours">hours</option>
                     <option value="minutes">minutes</option>
                  </StyledSelect>
               </InputWrapper>

               <InputWrapper>
                  <Input
                     type="text"
                     label="Percentage of yield"
                     name="yield"
                     value={yieldPercentage}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0) setYieldPercentage('')
                        if (value) setYieldPercentage(value)
                     }}
                  />
                  <span>%</span>
               </InputWrapper>
            </StyledInputGroup>
         </StyledRow>
         <StyledRow>
            <StyledInputGroup>
               <InputWrapper>
                  <Input
                     type="text"
                     label="Shelf life"
                     name="shelf_life"
                     value={shelfLife}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0) setShelfLife('')
                        if (value) setShelfLife(value)
                     }}
                  />
                  <StyledSelect
                     name="unit"
                     defaultValue={shelfLifeUnit}
                     onChange={e => setShelfLifeUnit(e.target.value)}
                  >
                     <option value="hours">hours</option>
                     <option value="days">days</option>
                  </StyledSelect>
               </InputWrapper>
               <InputWrapper>
                  <Input
                     type="text"
                     label="Bulk density"
                     name="bulk_density"
                     value={bulkDensity}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (e.target.value.length === 0) setBulkDensity('')
                        if (value) setBulkDensity(value)
                     }}
                  />
               </InputWrapper>
            </StyledInputGroup>
         </StyledRow>
         <StyledRow>
            <StyledLabel>Nutritions per 100gm</StyledLabel>
            <ButtonTile
               type="secondary"
               text="Add Nutritions"
               onClick={e => console.log('Tile clicked')}
            />
         </StyledRow>
         <StyledRow>
            <StyledLabel>Allergens</StyledLabel>
            {configurable.allergens?.length ? (
               <Highlight pointer onClick={() => open(8)}>
                  <TagGroup>
                     {configurable.allergens.map(el => (
                        <Tag key={el.id}> {el.title} </Tag>
                     ))}
                  </TagGroup>
               </Highlight>
            ) : (
               <ButtonTile
                  type="secondary"
                  text="Add Allergens"
                  onClick={() => open(8)}
               />
            )}
         </StyledRow>
      </TunnelContainer>
   )
}
