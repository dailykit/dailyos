import React, { useState, useContext } from 'react'
import { Input, ButtonTile } from '@dailykit/ui'

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

export default function ConfigureDerivedProcessingTunnel({ close, next }) {
   const {
      state: { configurable },
      dispatch,
   } = useContext(ItemContext)

   return (
      <TunnelContainer>
         <TunnelHeader
            title="Select Processing"
            next={() => {
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
                     value={''}
                     onChange={e => {}}
                  />
                  <StyledSelect
                     name="unit"
                     defaultValue={''}
                     onChange={e => {}}
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
                     value={''}
                     onChange={e => {}}
                  />
                  <StyledSelect
                     name="unit"
                     defaultValue={''}
                     onChange={e => {}}
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
                     value={''}
                     onChange={e => {}}
                  />
                  <StyledSelect
                     name="unit"
                     defaultValue={''}
                     onChange={e => {}}
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
                     value={''}
                     onChange={e => {}}
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
                     value={''}
                     onChange={e => {}}
                  />
                  <StyledSelect
                     name="unit"
                     defaultValue={''}
                     onChange={e => {}}
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
                     value={''}
                     onChange={e => {}}
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
         {/* <StyledRow>
            <StyledLabel>Allergens</StyledLabel>
            {state.processing.allergens.length ? (
               <Highlight pointer onClick={() => open(5)}>
                  <TagGroup>
                     {state.processing.allergens.map(el => (
                        <Tag key={el.id}> {el.title} </Tag>
                     ))}
                  </TagGroup>
               </Highlight>
            ) : (
               <ButtonTile
                  type="secondary"
                  text="Add Allergens"
                  onClick={() => open(5)}
               />
            )}
         </StyledRow> */}
      </TunnelContainer>
   )
}
