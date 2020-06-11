import React from 'react'
import { ButtonTile } from '@dailykit/ui'

import { TableRecord } from './styled'
import { RecurrenceContext } from '../../../../../../context/recurrence'
import { Flex } from '../../../styled'
import { DeleteIcon, EditIcon } from '../../../../../../assets/icons'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { DELETE_CHARGE } from '../../../../../../graphql'

const DeliveryCharges = ({ mileRangeId, charges, openTunnel }) => {
   const { recurrenceDispatch } = React.useContext(RecurrenceContext)

   // Mutations
   const [deleteCharge] = useMutation(DELETE_CHARGE, {
      onCompleted: () => {
         toast.success('Deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Handlers
   const deleteHandler = id => {
      if (window.confirm('Are you sure you want to delete?')) {
         deleteCharge({
            variables: {
               id,
            },
         })
      }
   }

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
                  <span onClick={() => updateCharge(charge)}>
                     <EditIcon color="#00A7E1" />
                  </span>
                  <span onClick={() => deleteHandler(charge.id)}>
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
