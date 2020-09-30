import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import ReactRRule from '../../../../../../../shared/components/ReactRRule'
import { toast } from 'react-toastify'
import { TextButton } from '@dailykit/ui'

import { UPDATE_COLLECTION } from '../../../../../graphql'

import { StyledWrapper } from './styled'

const Availability = ({ state }) => {
   const [isSaving, setIsSaving] = React.useState(false)
   const [rrule, setRrule] = React.useState(state.rrule)
   const [startTime, setStartTime] = React.useState(null)
   const [endTime, setEndTime] = React.useState(null)

   const save = () => {
      try {
         if (isSaving) return
         setIsSaving(true)
         console.log(rrule)
         updateCollection({
            variables: {
               id: state.id,
               set: {
                  rrule,
                  startTime,
                  endTime,
               },
            },
         })
      } catch (err) {
         console.log(err)
      } finally {
         setIsSaving(false)
      }
   }

   const [updateCollection] = useMutation(UPDATE_COLLECTION, {
      onCompleted: () => {
         toast.success('Availability updated!')
      },
      onError: error => {
         console.log(error)
      },
   })

   return (
      <StyledWrapper>
         <ReactRRule value={rrule} onChange={val => setRrule(val.psqlObject)} />
         <TextButton type="solid" onClick={save}>
            Save
         </TextButton>
      </StyledWrapper>
   )
}

export default Availability
