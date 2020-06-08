import React from 'react'
import { ButtonTile } from '@dailykit/ui'

import { TableRecord } from './styled'

import { DeliveryCharges } from '../'

const DeliveryRanges = ({ mileRanges, openTunnel }) => {
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
            onClick={e => console.log('Tile clicked')}
         />
      </>
   )
}

export default DeliveryRanges
