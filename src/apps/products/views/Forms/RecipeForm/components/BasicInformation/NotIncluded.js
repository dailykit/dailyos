import React from 'react'
import { Flex, Form, HelperText, Spacer } from '@dailykit/ui'
import { UPDATE_RECIPE } from '../../../../../graphql'
import {
   Tooltip,
   UpdatingSpinner,
} from '../../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'
import validator from '../../validators'

const NotIncluded = ({
   _state,
   _dispatch,
   getMutationOptions,
   updated,
   setUpdated,
}) => {
   const [updateNotIncluded, { loading: updatingNotIncluded }] = useMutation(
      UPDATE_RECIPE,
      getMutationOptions(
         {
            notIncluded: _state.notIncluded.value
               ? _state.notIncluded.value.split(',').map(tag => tag.trim())
               : [],
         },
         'not-included'
      )
   )
   return (
      <>
         <Flex container alignItems="center">
            <Form.Group>
               <Tooltip identifier="recipe_not_included" />
               <Form.Text
                  variant="revamp-sm"
                  id="notIncluded"
                  name="notIncluded"
                  onChange={e =>
                     _dispatch({
                        type: 'SET_VALUE',
                        payload: {
                           field: 'notIncluded',
                           value: e.target.value,
                        },
                     })
                  }
                  onBlur={() => {
                     const { isValid, errors } = validator.csv(
                        _state.notIncluded.value
                     )
                     _dispatch({
                        type: 'SET_ERRORS',
                        payload: {
                           field: 'notIncluded',
                           meta: {
                              isTouched: true,
                              isValid,
                              errors,
                           },
                        },
                     })
                     if (isValid) {
                        updateNotIncluded()
                     }
                  }}
                  value={_state.notIncluded.value}
                  placeholder="enter what's not included"
                  hasError={
                     _state.notIncluded.meta.isTouched &&
                     !_state.notIncluded.meta.isValid
                  }
               />
               {_state.notIncluded.meta.isTouched &&
                  !_state.notIncluded.meta.isValid &&
                  _state.notIncluded.meta.errors.map((error, index) => (
                     <Form.Error key={index}>{error}</Form.Error>
                  ))}
            </Form.Group>
            <Spacer xAxis size="16px" />
            <UpdatingSpinner
               updated={updated}
               setUpdated={setUpdated}
               updatedField="not-included"
               loading={updatingNotIncluded}
            />
         </Flex>
         <HelperText
            type="hint"
            message="Enter comma separated values, for example: Salt, Oil, Pepper"
         />
      </>
   )
}

export default NotIncluded
