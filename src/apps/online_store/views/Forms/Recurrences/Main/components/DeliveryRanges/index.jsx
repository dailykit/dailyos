import React from 'react'
import { ButtonTile, Toggle } from '@dailykit/ui'

import { TableRecord } from './styled'

import { DeliveryCharges } from '../'
import { RecurrenceContext } from '../../../../../../context/recurrence'
import { Flex } from '../../../styled'
import { DeleteIcon } from '../../../../../../assets/icons'

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
               <Flex direction="row" style={{ padding: '16px' }}>
                  <Toggle
                     checked={mileRange.isActive}
                     setChecked={val => console.log(val)}
                  />
                  <span className="action">
                     <DeleteIcon color=" #FF5A52" />
                  </span>
               </Flex>
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
