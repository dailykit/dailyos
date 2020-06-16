import React from 'react'
import { ButtonTile, Toggle } from '@dailykit/ui'

import { TableRecord } from './styled'

import { DeliveryCharges } from '../'
import { RecurrenceContext } from '../../../../../../context/recurrence'
import { Flex } from '../../../styled'
import { DeleteIcon } from '../../../../../../assets/icons'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { DELETE_MILE_RANGE, UPDATE_MILE_RANGE } from '../../../../../../graphql'

const DeliveryRanges = ({ timeSlotId, mileRanges, openTunnel }) => {
   const { recurrenceDispatch } = React.useContext(RecurrenceContext)

   // Mutations
   const [updateMileRange] = useMutation(UPDATE_MILE_RANGE, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   const [deleteMileRange] = useMutation(DELETE_MILE_RANGE, {
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
         deleteMileRange({
            variables: {
               id,
            },
         })
      }
   }

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
                  {mileRange.leadTime || mileRange.prepTime} mins.
               </div>
               <Flex direction="row" style={{ padding: '16px' }}>
                  <Toggle
                     checked={mileRange.isActive}
                     setChecked={val =>
                        updateMileRange({
                           variables: {
                              id: mileRange.id,
                              set: {
                                 isActive: val,
                              },
                           },
                        })
                     }
                  />
                  <span
                     className="action"
                     onClick={() => deleteHandler(mileRange.id)}
                  >
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
