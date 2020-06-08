import React from 'react'
import { ButtonTile } from '@dailykit/ui'

import { TableRecord } from './styled'
import { RecurrenceContext } from '../../../../../../context/recurrence'
import { Flex } from '../../../styled'
import { DeleteIcon, EditIcon } from '../../../../../../assets/icons'

const DeliveryCharges = ({ mileRangeId, charges, openTunnel }) => {
   const { recurrenceDispatch } = React.useContext(RecurrenceContext)

   const addCharge = () => {
      recurrenceDispatch({
         type: 'CHARGE',
         payload: undefined,
      })
      recurrenceDispatch({
         type: 'MILE_RANGE',
         payload: mileRangeId,
      })
      openTunnel(4)
   }

   const updateCharge = charge => {
      recurrenceDispatch({
         type: 'CHARGE',
         payload: charge,
      })
      openTunnel(4)
   }

   return (
      <>
         {charges.map(charge => (
            <TableRecord key={charge.id}>
               <div style={{ padding: '8px' }}>
                  ${charge.orderValueFrom} - ${charge.orderValueUpto}
               </div>
               <div style={{ padding: '8px' }}>${charge.charge}</div>
               <Flex
                  direction="row"
                  justify="flex-start"
                  className="action"
                  style={{ padding: '8px' }}
               >
                  <span>
                     <EditIcon color="#00A7E1" />
                  </span>
                  <span>
                     <DeleteIcon color="#FF5A52" />
                  </span>
               </Flex>
            </TableRecord>
         ))}
         <ButtonTile
            noIcon
            type="secondary"
            text="Add Delivery Charge"
            onClick={addCharge}
         />
      </>
   )
}

export default DeliveryCharges
