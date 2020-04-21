import React from 'react'

import {
   Input,
   TextButton,
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'

// Tunnels
import {
   SuppliersTunnel,
   InfoTunnel,
   ProcessingTunnel,
   ConfigTunnel,
   AllergensTunnel,
} from './tunnels'

// Styled
import { StyledWrapper } from '../styled'
import {
   StyledHeader,
   StyledGrid,
   StyledMain,
   StyledInfo,
   StyledSupplier,
} from './styled'

import {
   ItemContext,
   state as initialState,
   reducer,
} from '../../../context/item'
import { ItemIcon, CaseIcon, TruckIcon, ClockIcon } from '../../../assets/icons'

export default function ItemForm() {
   const [state, dispatch] = React.useReducer(reducer, initialState)
   const [suppliers, setSuppliers] = React.useState([
      {
         id: 1,
         supplier: { title: 'Swiggy', img: '' },
         contact: { title: 'Ajay Singh', img: '' },
      },
      {
         id: 2,
         supplier: { title: 'Zomato', img: '' },
         contact: { title: 'Praveen Bisht', img: '' },
      },
      {
         id: 3,
         supplier: { title: 'Food Panda', img: '' },
         contact: { title: 'Sanjay Sharma', img: '' },
      },
      {
         id: 4,
         supplier: { title: 'Uber Eats', img: '' },
         contact: { title: 'Arjun Negi', img: '' },
      },
   ])
   const [processings, setProcessings] = React.useState([
      {
         id: 1,
         title: 'Chopped',
      },
      {
         id: 2,
         title: 'Mashed',
      },
      {
         id: 3,
         title: 'Raw',
      },
   ])
   const [allergens, setAllergens] = React.useState([
      {
         id: 1,
         title: 'ALG 1',
      },
      {
         id: 2,
         title: 'ALG 2',
      },
      {
         id: 3,
         title: 'ALG 3',
      },
   ])
   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)

   return (
      <ItemContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <SuppliersTunnel
                  close={() => closeTunnel(1)}
                  next={() => openTunnel(2)}
                  suppliers={suppliers}
               />
            </Tunnel>
            <Tunnel layer={2}>
               <InfoTunnel
                  close={() => closeTunnel(2)}
                  next={() => openTunnel(3)}
               />
            </Tunnel>
            <Tunnel layer={3}>
               <ProcessingTunnel
                  close={() => closeTunnel(3)}
                  next={() => openTunnel(4)}
                  processings={processings}
               />
            </Tunnel>
            <Tunnel layer={4} size="lg">
               <ConfigTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={5}>
               <AllergensTunnel
                  close={() => closeTunnel(5)}
                  allergens={allergens}
               />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               {state.title && (
                  <React.Fragment>
                     <StyledInfo>
                        <h1> {state.title} </h1>
                        <span> {state.sku} </span>
                     </StyledInfo>
                     <StyledSupplier>
                        <span>{state.supplier.supplier.title} </span>
                        <span>{state.supplier.contact.title} </span>
                     </StyledSupplier>
                  </React.Fragment>
               )}
            </StyledHeader>
         </StyledWrapper>
         <StyledMain>
            {!state.title ? (
               <StyledWrapper>
                  <ButtonTile
                     type="primary"
                     size="lg"
                     text="Add Item Information"
                     onClick={() => openTunnel(1)}
                  />
               </StyledWrapper>
            ) : (
               <React.Fragment>
                  <StyledGrid>
                     <div>
                        <div>
                           <ItemIcon />
                        </div>
                        <div>
                           <span>Unit qty</span>
                           <div>
                              <span>
                                 {state.unit_quantity.value +
                                    state.unit_quantity.unit}
                              </span>
                              <span>$12</span>
                           </div>
                        </div>
                     </div>
                     <div>
                        <div>
                           <CaseIcon />
                        </div>
                        <div>
                           <span>Case qty</span>
                           <div>
                              <span>
                                 {state.case_quantity.value +
                                    state.case_quantity.unit}
                              </span>
                              <span>$12</span>
                           </div>
                        </div>
                     </div>
                     <div>
                        <div>
                           <TruckIcon />
                        </div>
                        <div>
                           <span>Min order value</span>
                           <div>
                              <span>
                                 {state.min_order_value.value +
                                    state.min_order_value.unit}
                              </span>
                              <span>$12</span>
                           </div>
                        </div>
                     </div>
                     <div>
                        <div>
                           <ClockIcon />
                        </div>
                        <div>
                           <span>Lead time</span>
                           <div>
                              <span>
                                 {state.lead_time.value + state.lead_time.unit}
                              </span>
                           </div>
                        </div>
                     </div>
                     <div></div>
                  </StyledGrid>
               </React.Fragment>
            )}
         </StyledMain>
      </ItemContext.Provider>
   )
}
