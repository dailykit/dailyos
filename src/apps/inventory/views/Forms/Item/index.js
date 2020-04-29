import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { ButtonTile, Tunnels, Tunnel, useTunnel, Loader } from '@dailykit/ui'

import { AVAILABLE_SUPPLIERS, MASTER_PROCESSINGS } from '../../../graphql'

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

   const { loading: supplierLoading, data: supplierData } = useQuery(
      AVAILABLE_SUPPLIERS
   )

   const { loading: processingsLoading, data: processingData } = useQuery(
      MASTER_PROCESSINGS
   )

   if (supplierLoading || processingsLoading) return <Loader />
   return (
      <ItemContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <SuppliersTunnel
                  close={closeTunnel}
                  open={openTunnel}
                  suppliers={supplierData?.suppliers?.map(supplier => ({
                     id: supplier.id,
                     title: supplier.name,
                     description: `${supplier.contactPerson?.firstName} ${supplier.contactPerson?.lastName} (${supplier.contactPerson?.countryCode} ${supplier.contactPerson?.phoneNumber})`,
                  }))}
                  rawSuppliers={supplierData.suppliers}
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
                  close={closeTunnel}
                  open={openTunnel}
                  processings={processingData?.masterProcessings?.map(
                     processing => ({
                        id: processing.id,
                        title: processing.name,
                     })
                  )}
                  rawProcessings={processingData?.masterProcessings}
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
                  <>
                     <StyledInfo>
                        <h1> {state.title} </h1>
                        <span> {state.sku} </span>
                     </StyledInfo>
                     <StyledSupplier>
                        <span>{state.supplier.title} </span>
                        <span>{state.supplier.description} </span>
                     </StyledSupplier>
                  </>
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
               <>
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
               </>
            )}
         </StyledMain>
      </ItemContext.Provider>
   )
}
