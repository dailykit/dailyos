import React, { useState, useContext } from 'react'
import { Input } from '@dailykit/ui'

import { ItemContext } from '../../../../../context/item'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'
import { FlexContainer } from '../../../styled'

export default function ConfigureSachetTunnel({ open, close }) {
   const { state, dispatch } = useContext(ItemContext)

   const [quantity, setQuantity] = useState('')
   const [par, setPar] = useState('')
   const [maxInventoryLevel, setMaxInventoryLevel] = useState('')

   return (
      <TunnelContainer>
         <TunnelHeader
            title="Add Sachet"
            next={() => {
               dispatch({
                  type: 'CONFIGURE_NEW_SACHET',
                  payload: {
                     quantity,
                     par,
                     maxInventoryLevel,
                  },
               })
               close(9)
            }}
            close={() => close(9)}
            nextAction="Save"
         />

         <Spacer />

         <br />

         <div style={{ width: '30%' }}>
            <Input
               type="text"
               name="quantity"
               value={quantity}
               placeholder={`Sachet Qty (in ${state.unit_quantity.unit})`}
               onChange={e => {
                  const value = parseInt(e.target.value)
                  if (e.target.value.length === 0) setQuantity('')
                  if (value) setQuantity(value)
               }}
            />
         </div>

         <br />

         <FlexContainer
            style={{
               justifyContent: 'space-between',
            }}
         >
            <FlexContainer style={{ alignItems: 'flex-end', width: '45%' }}>
               <Input
                  type="text"
                  name="par"
                  value={par}
                  placeholder="Set Par Level"
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (e.target.value.length === 0) setPar('')
                     if (value) setPar(value)
                  }}
               />
               <span style={{ marginLeft: '5px' }}>Pkt</span>
            </FlexContainer>

            <FlexContainer style={{ alignItems: 'flex-end', width: '45%' }}>
               <Input
                  type="text"
                  name="inventory level"
                  value={maxInventoryLevel}
                  placeholder="Max inventory level"
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (e.target.value.length === 0) setMaxInventoryLevel('')
                     if (value) setMaxInventoryLevel(value)
                  }}
               />
               <span style={{ marginLeft: '5px' }}>Pkt</span>
            </FlexContainer>
         </FlexContainer>
      </TunnelContainer>
   )
}
