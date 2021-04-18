import React from 'react'
import { Flex, Form, HelperText, Spacer } from '@dailykit/ui'
import { UPDATE_RECIPE } from '../../../../../graphql'
import {
   Tooltip,
   UpdatingSpinner,
} from '../../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'
import validator from '../../validators'

const Utensils = ({
   _state,
   _dispatch,
   getMutationOptions,
   updated,
   setUpdated,
}) => {
   const [updateUtensils, { loading: updatingUtensils }] = useMutation(
      UPDATE_RECIPE,
      getMutationOptions(
         {
            utensils: _state.utensils.value
               ? _state.utensils.value.split(',').map(tag => tag.trim())
               : [],
         },
         'utensils'
      )
   )
   return (
      <>
         <Flex container alignItems="center">
            <Form.Group>
               <Form.Label htmlFor="utensils" title="utensils">
                  <Tooltip identifier="recipe_utensils" />
               </Form.Label>
               <Form.Text
                  variant="revamp-sm"
                  id="utensils"
                  name="utensils"
                  onChange={e =>
                     _dispatch({
                        type: 'SET_VALUE',
                        payload: {
                           field: 'utensils',
                           value: e.target.value,
                        },
                     })
                  }
                  onBlur={() => {
                     const { isValid, errors } = validator.csv(
                        _state.utensils.value
                     )
                     _dispatch({
                        type: 'SET_ERRORS',
                        payload: {
                           field: 'utensils',
                           meta: {
                              isTouched: true,
                              isValid,
                              errors,
                           },
                        },
                     })
                     if (isValid) {
                        console.log(isValid)
                        updateUtensils()
                     }
                  }}
                  value={_state.utensils.value}
                  placeholder="enter utensils"
                  hasError={
                     _state.utensils.meta.isTouched &&
                     !_state.utensils.meta.isValid
                  }
               />
               {_state.utensils.meta.isTouched &&
                  !_state.utensils.meta.isValid &&
                  _state.utensils.meta.errors.map((error, index) => (
                     <Form.Error key={index}>{error}</Form.Error>
                  ))}
            </Form.Group>
            <Spacer xAxis size="16px" />
            <UpdatingSpinner
               updated={updated}
               setUpdated={setUpdated}
               updatedField="utensils"
               loading={updatingUtensils}
            />
         </Flex>

         <HelperText
            type="hint"
            message="Enter comma separated values, for example: Pan, Spoon, Bowl"
         />
      </>
   )
}

export default Utensils
