import React from 'react'
import { ButtonTile } from '@dailykit/ui'

import { TableHeader, TableRecord } from './styled'

import { DeliveryRanges } from '../'

const TimeSlots = ({ timeSlots, openTunnel }) => {
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
            onClick={e => console.log('Tile clicked')}
         />
      </>
   )
}

export default TimeSlots
