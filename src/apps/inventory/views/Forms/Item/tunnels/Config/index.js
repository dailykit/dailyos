import React from 'react'

import { TextButton, Input, ButtonTile, Tag, TagGroup } from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

import { ItemContext } from '../../../../../context/item'

import {
   TunnelHeader,
   TunnelBody,
   StyledRow,
   StyledInputGroup,
   Highlight,
   InputWrapper,
   StyledSelect,
   StyledLabel,
} from '../styled'

export default function ConfigTunnel({ close, open }) {
   const { state, dispatch } = React.useContext(ItemContext)

   return (
      <>
         <TunnelHeader>
            <div>
               <span onClick={() => close(4)}>
                  <CloseIcon size={24} />
               </span>
               <span>Configure Processing: {state.processing.name.title}</span>
            </div>
            <div>
               <TextButton
                  onClick={() => {
                     close(4)
                  }}
                  type="solid"
               >
                  Save
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <StyledRow>
               <StyledInputGroup>
                  <InputWrapper>
                     <Input
                        type="text"
                        label="Set par level"
                        name="par_level"
                        value={state.processing.par_level.value}
                        onChange={e =>
                           dispatch({
                              type: 'PAR_LEVEL',
                              payload: { name: 'value', value: e.target.value },
                           })
                        }
                     />
                     <StyledSelect
                        name="unit"
                        defaultValue={state.processing.par_level.unit}
                        onChange={e =>
                           dispatch({
                              type: 'PAR_LEVEL',
                              payload: {
                                 name: 'unit',
                                 value: e.target.value,
                              },
                           })
                        }
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
                        value={state.processing.max_inventory_level.value}
                        onChange={e =>
                           dispatch({
                              type: 'MAX_INVENTORY_LEVEL',
                              payload: { name: 'value', value: e.target.value },
                           })
                        }
                     />
                     <StyledSelect
                        name="unit"
                        defaultValue={state.processing.max_inventory_level.unit}
                        onChange={e =>
                           dispatch({
                              type: 'MAX_INVENTORY_LEVEL',
                              payload: {
                                 name: 'unit',
                                 value: e.target.value,
                              },
                           })
                        }
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
                  {!state.form_meta.shipped && (
                     <InputWrapper>
                        <Input
                           type="text"
                           label="Labor time per 100gm"
                           name="labor_time"
                           value={state.processing.labor_time.value}
                           onChange={e =>
                              dispatch({
                                 type: 'LABOR_TIME',
                                 payload: {
                                    name: 'value',
                                    value: e.target.value,
                                 },
                              })
                           }
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={state.processing.labor_time.unit}
                           onChange={e =>
                              dispatch({
                                 type: 'LABOR_TIME',
                                 payload: {
                                    name: 'unit',
                                    value: e.target.value,
                                 },
                              })
                           }
                        >
                           <option value="hours">hours</option>
                           <option value="minutes">minutes</option>
                        </StyledSelect>
                     </InputWrapper>
                  )}
                  <InputWrapper>
                     <Input
                        type="text"
                        label="Percentage of yield"
                        name="yield"
                        value={state.processing.yield}
                        onChange={e =>
                           dispatch({
                              type: 'YIELD',
                              payload: { value: e.target.value },
                           })
                        }
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
                        value={state.processing.shelf_life.value}
                        onChange={e =>
                           dispatch({
                              type: 'SHELF_LIFE',
                              payload: { name: 'value', value: e.target.value },
                           })
                        }
                     />
                     <StyledSelect
                        name="unit"
                        defaultValue={state.processing.shelf_life.unit}
                        onChange={e =>
                           dispatch({
                              type: 'SHELF_LIFE',
                              payload: {
                                 name: 'unit',
                                 value: e.target.value,
                              },
                           })
                        }
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
                        value={state.processing.bulk_density}
                        onChange={e =>
                           dispatch({
                              type: 'BULK_DENSITY',
                              payload: { value: e.target.value },
                           })
                        }
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
            </StyledRow>
            {!state.form_meta.shipped && (
               <>
                  <StyledRow>
                     <StyledLabel>
                        Operating procedure for processing
                     </StyledLabel>
                  </StyledRow>
                  <StyledRow>
                     <StyledLabel>Standard operating procedure</StyledLabel>
                     <Highlight></Highlight>
                  </StyledRow>
                  <StyledRow>
                     <StyledLabel>Equipments needed</StyledLabel>
                     <Highlight></Highlight>
                  </StyledRow>
               </>
            )}
         </TunnelBody>
      </>
   )
}
