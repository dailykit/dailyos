import React from 'react'
import { Text, Checkbox, Input } from '@dailykit/ui'

import { InventoryProductContext } from '../../../../../context/product/inventoryProduct'
import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'

export default function AvailabilityTunnel({ close }) {
   const { inventoryProductState, inventoryProductDispatch } = React.useContext(
      InventoryProductContext
   )
   const [isPreOrder, setIsPreOrder] = React.useState(
      inventoryProductState.preOrder.isActive
   )
   const [isRealtime, setIsRealtime] = React.useState(
      inventoryProductState.realtime
   )
   const [days, setDays] = React.useState(inventoryProductState.preOrder.days)

   return (
      <TunnelContainer>
         <TunnelHeader
            title="Edit Availability"
            close={() => {
               close(5)
            }}
            next={() => {
               inventoryProductDispatch({
                  type: 'SET_AVAILABILITY',
                  payload: {
                     isPreOrder,
                     isRealtime,
                     days: parseInt(days),
                  },
               })
               close(5)
            }}
            nextAction="Save"
         />
         <Spacer />

         <Text as="title">Available for</Text>

         <br />

         <Checkbox
            id="label"
            checked={isPreOrder}
            onChange={() => setIsPreOrder(!isPreOrder)}
         >
            Pre-Orders
         </Checkbox>

         {isPreOrder && (
            <div
               style={{ width: '30%', display: 'flex', alignItems: 'flex-end' }}
            >
               <Input
                  type="text"
                  placeholder="3"
                  name="days"
                  value={days}
                  onChange={e => setDays(e.target.value)}
               />
               Days
            </div>
         )}
         <br />
         <hr style={{ border: '1px solid rgb(243, 243, 243)' }} />
         <br />

         <Checkbox
            id="label"
            checked={isRealtime}
            onChange={() => setIsRealtime(!isRealtime)}
         >
            Realtime
         </Checkbox>
      </TunnelContainer>
   )
}
