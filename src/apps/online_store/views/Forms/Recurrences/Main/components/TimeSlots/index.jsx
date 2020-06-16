import React from 'react'
import { ButtonTile, Toggle } from '@dailykit/ui'

import { TableRecord } from './styled'

import { DeliveryRanges } from '../'
import { RecurrenceContext } from '../../../../../../context/recurrence'
import { Flex } from '../../../styled'
import { DeleteIcon } from '../../../../../../assets/icons'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_TIME_SLOT, DELETE_TIME_SLOT } from '../../../../../../graphql'
import { toast } from 'react-toastify'
import { Context } from '../../../../../../context'

const TimeSlots = ({ recurrenceId, timeSlots, openTunnel }) => {
   const { recurrenceDispatch } = React.useContext(RecurrenceContext)
   const {
      state: { current },
   } = React.useContext(Context)

   // Mutations
   const [updateTimeSlot] = useMutation(UPDATE_TIME_SLOT, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   const [deleteTimeSlot] = useMutation(DELETE_TIME_SLOT, {
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
         deleteTimeSlot({
            variables: {
               id,
            },
         })
      }
   }

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
                     {current.fulfillment.includes('PICKUP') && (
                        <div style={{ padding: '16px' }}>
                           {current.fulfillment.includes('ONDEMAND')
                              ? timeSlot.pickUpPrepTime
                              : timeSlot.pickUpLeadTime}{' '}
                           mins.
                        </div>
                     )}
                     <Flex direction="row" style={{ padding: '16px' }}>
                        <Toggle
                           checked={timeSlot.isActive}
                           setChecked={val =>
                              updateTimeSlot({
                                 variables: {
                                    id: timeSlot.id,
                                    set: {
                                       isActive: val,
                                    },
                                 },
                              })
                           }
                        />
                        <span
                           className="action"
                           onClick={() => deleteHandler(timeSlot.id)}
                        >
                           <DeleteIcon color=" #FF5A52" />
                        </span>
                     </Flex>
                     {current.fulfillment.includes('DELIVERY') && (
                        <div>
                           <DeliveryRanges
                              timeSlotId={timeSlot.id}
                              mileRanges={timeSlot.mileRanges}
                              openTunnel={openTunnel}
                           />
                        </div>
                     )}
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
