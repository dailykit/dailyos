import React from 'react'
import { ButtonTile } from '@dailykit/ui'

import { TableRecord } from './styled'

import { DeliveryCharges } from '../'
import { RecurrenceContext } from '../../../../../../context/recurrence'

const DeliveryRanges = ({ timeSlotId, mileRanges, openTunnel }) => {
   const { recurrenceDispatch } = React.useContext(RecurrenceContext)

   const addMileRange = () => {
      recurrenceDispatch({
         type: 'TIME_SLOT',
         payload: timeSlotId,
      })
      openTunnel(3)
   }

   return (
      <>
         {mileRanges.map(mileRange => (
            <TableRecord key={mileRange.id}>
               <div style={{ padding: '8px' }}>
                  {mileRange.from} - {mileRange.to} miles
               </div>
               <div style={{ padding: '8px' }}>
                  {mileRange.leadTime || mileRange.prepTime} hours
               </div>
               <div>
                  <DeliveryCharges
                     mileRangeId={mileRange.id}
                     charges={mileRange.charges}
                     openTunnel={openTunnel}
                  />
               </div>
            </TableRecord>
         ))}
         <ButtonTile
            noIcon
            type="secondary"
            text="Add Mile Ranges"
            onClick={addMileRange}
         />
      </>
   )
}

export default DeliveryRanges
