import React from 'react'
import { ButtonTile } from '@dailykit/ui'

import { TableHeader, TableRecord } from './styled'

import { DeliveryRanges } from '../'

const TimeSlots = ({ timeSlots, openTunnel }) => {
   return (
      <>
         {Boolean(timeSlots.length) && (
            <>
               <TableHeader>
                  <span>Time Slots</span>
                  <span>Delivery Range</span>
                  <span>Lead Time</span>
                  <span>Order Value</span>
                  <span>Charges</span>
               </TableHeader>
               {timeSlots.map(timeSlot => (
                  <TableRecord key={timeSlot.id}>
                     <div>
                        {timeSlot.from} - {timeSlot.to}
                     </div>
                     <div>
                        <DeliveryRanges
                           mileRanges={timeSlot.mileRanges}
                           openTunnel={openTunnel}
                        />
                     </div>
                  </TableRecord>
               ))}
            </>
         )}
         <ButtonTile
            type="secondary"
            text="Add Time Slot"
            onClick={e => console.log('Tile clicked')}
         />
      </>
   )
}

export default TimeSlots
