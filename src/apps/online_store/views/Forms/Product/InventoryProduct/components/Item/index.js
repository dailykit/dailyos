import React from 'react'
import { ButtonTile, ComboButton, Input } from '@dailykit/ui'

import { AddIcon, MinusIcon } from '../../../../../../assets/icons'

import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'

// styles
import {
   StyledWrapper,
   StyledLayout,
   StyledListing,
   StyledPanel,
   StyledListingTile,
   StyledTabs,
   StyledTab,
   StyledTabView,
   StyledTable,
   StyledAction,
   StyledDefault,
   StyledInputWrapper,
} from './styled'

import { Accompaniments } from '../'

export default function Item({ openTunnel }) {
   const { state, dispatch } = React.useContext(InventoryProductContext)

   const [_state, _setState] = React.useState({
      view: 'pricing',
   })

   return (
      <StyledWrapper>
         {state.item ? (
            <StyledLayout>
               <StyledListing>
                  <StyledListingTile active>
                     <h3>{state.item.title}</h3>
                  </StyledListingTile>
               </StyledListing>
               <StyledPanel>
                  <h2>{state.item.title}</h2>
                  <h5>Unit Size: {state.item.unitSize}</h5>
                  <StyledTabs>
                     <StyledTab
                        onClick={() =>
                           _setState({ ..._state, view: 'pricing' })
                        }
                        active={_state.view === 'pricing'}
                     >
                        Pricing
                     </StyledTab>
                     <StyledTab
                        onClick={() =>
                           _setState({ ..._state, view: 'accompaniments' })
                        }
                        active={_state.view === 'accompaniments'}
                     >
                        Accompaniments
                     </StyledTab>
                  </StyledTabs>
                  <StyledTabView>
                     {_state.view === 'pricing' ? (
                        <React.Fragment>
                           <StyledTable>
                              <thead>
                                 <tr>
                                    <th>Options</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Discount</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {state.options.map(option => (
                                    <tr key={option.id}>
                                       <td>
                                          <Input
                                             type="text"
                                             name={`title-${option.id}`}
                                             value={option.title}
                                             onChange={e =>
                                                dispatch({
                                                   type: 'UPDATE_OPTION',
                                                   payload: {
                                                      id: option.id,
                                                      name: 'title',
                                                      value: e.target.value,
                                                   },
                                                })
                                             }
                                          />
                                       </td>
                                       <td>
                                          <StyledInputWrapper width="60">
                                             <span
                                                onClick={() =>
                                                   dispatch({
                                                      type: 'UPDATE_OPTION',
                                                      payload: {
                                                         id: option.id,
                                                         name: 'quantity',
                                                         value:
                                                            option.quantity -
                                                               1 ===
                                                            0
                                                               ? option.quantity
                                                               : option.quantity -
                                                                 1,
                                                      },
                                                   })
                                                }
                                             >
                                                <MinusIcon color="#00A7E1" />
                                             </span>
                                             <Input
                                                type="text"
                                                name={`quantity-${option.id}`}
                                                value={option.quantity}
                                                readOnly
                                             />
                                             <span
                                                onClick={() =>
                                                   dispatch({
                                                      type: 'UPDATE_OPTION',
                                                      payload: {
                                                         id: option.id,
                                                         name: 'quantity',
                                                         value:
                                                            option.quantity + 1,
                                                      },
                                                   })
                                                }
                                             >
                                                <AddIcon color="#00A7E1" />
                                             </span>
                                          </StyledInputWrapper>
                                       </td>
                                       <td>
                                          <StyledInputWrapper width="60">
                                             $
                                             <Input
                                                type="text"
                                                name={`price-${option.id}`}
                                                value={option.price[0].value}
                                                onChange={e =>
                                                   dispatch({
                                                      type: 'UPDATE_OPTION',
                                                      payload: {
                                                         id: option.id,
                                                         name: 'price',
                                                         value: [
                                                            {
                                                               rule:
                                                                  option
                                                                     .price[0]
                                                                     .rule,
                                                               value:
                                                                  e.target
                                                                     .value,
                                                               discount:
                                                                  option
                                                                     .price[0]
                                                                     .discount,
                                                            },
                                                         ],
                                                      },
                                                   })
                                                }
                                             />
                                          </StyledInputWrapper>
                                       </td>
                                       <td>
                                          <StyledInputWrapper width="60">
                                             <Input
                                                type="text"
                                                name={`discount-${option.id}`}
                                                value={option.price[0].discount}
                                                onChange={e =>
                                                   dispatch({
                                                      type: 'UPDATE_OPTION',
                                                      payload: {
                                                         id: option.id,
                                                         name: 'price',
                                                         value: [
                                                            {
                                                               rule:
                                                                  option
                                                                     .price[0]
                                                                     .rule,
                                                               value:
                                                                  option
                                                                     .price[0]
                                                                     .value,
                                                               discount:
                                                                  e.target
                                                                     .value,
                                                            },
                                                         ],
                                                      },
                                                   })
                                                }
                                             />
                                             %
                                          </StyledInputWrapper>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </StyledTable>
                           <ComboButton
                              type="ghost"
                              onClick={() =>
                                 dispatch({
                                    type: 'ADD_OPTION',
                                 })
                              }
                           >
                              <AddIcon />
                              Add Option
                           </ComboButton>
                        </React.Fragment>
                     ) : (
                        <Accompaniments openTunnel={openTunnel} />
                     )}
                  </StyledTabView>
               </StyledPanel>
            </StyledLayout>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text="Add Item"
               onClick={() => openTunnel(2)}
            />
         )}
      </StyledWrapper>
   )
}
