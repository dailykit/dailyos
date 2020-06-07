import React from 'react'
import { ButtonTile } from '@dailykit/ui'

import { TableRecord } from './styled'

const DeliveryCharges = ({ charges, openTunnel }) => {
   return (
      <>
         {charges.map(charge => (
            <TableRecord key={charge.id}>
               <div>
                  ${charge.orderValueFrom} - ${charge.orderValueUpto}
               </div>
               <div>${charge.charge}</div>
            </TableRecord>
         ))}
         <ButtonTile
            type="secondary"
            text="Add Delivery Charge"
            onClick={e => console.log('Tile clicked')}
         />
      </>
   )
}

export default DeliveryCharges
