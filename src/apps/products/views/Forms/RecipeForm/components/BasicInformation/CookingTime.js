import React from 'react'
import { Flex, Form, Spacer } from '@dailykit/ui'
import { UPDATE_RECIPE } from '../../../../../graphql'
import {
   Tooltip,
   UpdatingSpinner,
} from '../../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'
import validator from '../../validators'

const CookingTime = ({
   _state,
   _dispatch,
   getMutationOptions,
   updated,
   setUpdated,
}) => {
   const [updateCookingTime, { loading: updatingCookingTime }] = useMutation(
      UPDATE_RECIPE,
      getMutationOptions(
         { cookingTime: _state.cookingTime.value || null },
         'cooking-time'
      )
   )

   return (
      <Flex container alignItems="center">
         <Flex width="100%">
            <Form.Group>
               <Form.Label htmlFor="cookingTime" title="cookingTime">
                  <Flex container alignItems="center">
                     Cooking Time(mins)
                     <Tooltip identifier="recipe_cooking_time" />
                  </Flex>
               </Form.Label>
               <Form.Number
                  id="cookingTime"
                  name="cookingTime"
                  value={_state.cookingTime.value}
                  placeholder="Enter cooking time"
                  onChange={e =>
                     _dispatch({
                        type: 'SET_VALUE',
                        payload: {
                           field: 'cookingTime',
                           value: e.target.value,
                        },
                     })
                  }
                  onBlur={() => {
                     const { isValid, errors } = validator.cookingTime(
                        _state.cookingTime.value
                     )
                     _dispatch({
                        type: 'SET_ERRORS',
                        payload: {
                           field: 'cookingTime',
                           meta: {
                              isTouched: true,
                              isValid,
                              errors,
                           },
                        },
                     })
                     if (isValid) {
                        updateCookingTime()
                     }
                  }}
                  hasError={
                     _state.cookingTime.meta.isTouched &&
                     !_state.cookingTime.meta.isValid
                  }
               />
               {_state.cookingTime.meta.isTouched &&
                  !_state.cookingTime.meta.isValid &&
                  _state.cookingTime.meta.errors.map((error, index) => (
                     <Form.Error key={index}>{error}</Form.Error>
                  ))}
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
