import React, { useReducer, useState } from 'react'
import {
   TextButton,
   Text,
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   Input,
} from '@dailykit/ui/'

import {
   PurchaseOrderContext,
   state as initialState,
   reducers,
} from '../../../context/purchaseOrder'

import SelectSupplierItemTunnel from './Tunnels/SelectSupplierItemTunnel'
import FormHeading from '../../../components/FormHeading'
import { ItemCard, Spacer } from '../../../components'
import { FormActions, StyledWrapper, StyledForm } from '../styled'

export default function PurchaseOrderForm() {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [purchaseOrderState, purchaseOrderDispatch] = useReducer(
      reducers,
      initialState
   )
   const [orderQuantity, setOrderQuantity] = useState('')
   const [unit, setUnit] = useState('gm')

   return (
      <>
         <PurchaseOrderContext.Provider
            value={{ purchaseOrderState, purchaseOrderDispatch }}
         >
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1}>
                  <SelectSupplierItemTunnel close={closeTunnel} />
               </Tunnel>
            </Tunnels>
            <StyledWrapper>
               <FormHeading>
                  <div
                     style={{
                        width: '30%',
                     }}
                  >
                     <Text as="h1">Purchase Order</Text>
                  </div>

                  <FormActions>
                     <TextButton onClick={() => {}} type="solid">
                        Submit
                     </TextButton>
                  </FormActions>
               </FormHeading>

               <StyledForm style={{ padding: '0px 60px' }}>
                  <Text as="title">Supplier Item</Text>
                  {purchaseOrderState.supplierItem?.title ? (
                     <>
                        <ItemCard
                           title={purchaseOrderState.supplierItem.title}
                           edit={() => openTunnel(1)}
                        />
                        <Spacer />

                        <div
                           style={{
                              width: '20%',
                              display: 'flex',
                              alignItems: 'flex-end',
                           }}
                        >
                           <Input
                              type="text"
                              placeholder="Enter Order Quantity"
                              value={orderQuantity}
                              onChange={e => {
                                 const value = parseInt(e.target.value)
                                 if (e.target.value.length === 0)
                                    setOrderQuantity('')
                                 if (value) setOrderQuantity(value)
                              }}
                           />

                           <select
                              onChange={e => setUnit(e.target.value)}
                              style={{ marginLeft: '5px' }}
                           >
                              <option value="gm">gm</option>
                              <option value="kg">kg</option>
                           </select>
                        </div>
                     </>
                  ) : (
                     <ButtonTile
                        noIcon
                        type="secondary"
                        text="Select Sub Title"
                        onClick={e => openTunnel(1)}
                        style={{ margin: '20px 0' }}
                     />
                  )}
               </StyledForm>
            </StyledWrapper>
         </PurchaseOrderContext.Provider>
      </>
   )
}
