import React from 'react'
import { Flex, Form, Spacer } from '@dailykit/ui'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { UpdatingSpinner } from '../../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'
import { logger } from '../../../../../../../shared/utils'
import { toast } from 'react-toastify'

const CookingTime = ({ state, updated, setUpdated }) => {
   const [updateCookingTime, { loading: updatingCookingTime }] = useMutation(
      UPDATE_RECIPE,
      {
         onCompleted: () => {
            setUpdated('cooking-time')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )
   const [cookingTime, setCookingTime] = React.useState(
      Number(state.cookingTime)
   )

   return (
      <Flex container alignItems="center">
         <Flex width="100%">
            <Form.Group>
               <Form.Stepper
                  id="cookingTime"
                  name="cookingTime"
                  unitText="min"
                  width="100px"
                  fieldName="Cooking time:"
                  value={cookingTime}
                  placeholder="0"
                  onChange={value => {
                     setCookingTime(value)
                  }}
                  onBlur={() => {
                     const isValid = cookingTime && cookingTime > 0
                     updateCookingTime({
                        variables: {
                           id: state.id,
                           set: {
                              cookingTime: isValid
                                 ? cookingTime.toString()
                                 : null,
                           },
                        },
                     })
                  }}
               />
            </Form.Group>
         </Flex>
         <Spacer xAxis size="16px" />
         <UpdatingSpinner
            updated={updated}
            setUpdated={setUpdated}
            updatedField="cooking-time"
            loading={updatingCookingTime}
         />
      </Flex>
   )
}

export default CookingTime
