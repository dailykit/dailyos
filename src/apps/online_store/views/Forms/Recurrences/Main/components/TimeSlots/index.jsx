import React from 'react'
import { ButtonTile } from '@dailykit/ui'

import { TableRecord } from './styled'

import { DeliveryRanges } from '../'
import { RecurrenceContext } from '../../../../../../context/recurrence'

const TimeSlots = ({ recurrenceId, timeSlots, openTunnel }) => {
   const { recurrenceDispatch } = React.useContext(RecurrenceContext)

   const addTimeSlot = () => {
      recurrenceDispatch({
         type: 'RECURRENCE',
         payload: recurrenceId,
      })
      openTunnel(2)
   }

   return (
      <>
         {Boolean(timeSlots.length) && (
            <>
               {timeSlots.map(timeSlot => (
                  <TableRecord key={timeSlot.id}>
                     <div style={{ padding: '16px' }}>
                        {timeSlot.from} - {timeSlot.to}
                     </div>
                     <div>
                        <DeliveryRanges
                           timeSlotId={timeSlot.id}
                           mileRanges={timeSlot.mileRanges}
                           openTunnel={openTunnel}
                        />
                     </div>
                  </TableRecord>
               ))}
            </>
         )}
         <ButtonTile
            noIcon
            type="secondary"
            text="Add Time Slot"
            onClick={addTimeSlot}
         />
      </>
   )
}

export default TimeSlots
