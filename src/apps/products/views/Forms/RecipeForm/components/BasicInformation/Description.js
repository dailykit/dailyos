import React from 'react'
import { Flex, Form, Spacer } from '@dailykit/ui'
import { UPDATE_RECIPE } from '../../../../../graphql'
import {
   Tooltip,
   UpdatingSpinner,
} from '../../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'
import validator from '../../validators'

const Descriptions = ({
   _state,
   _dispatch,
   getMutationOptions,
   updated,
   setUpdated,
}) => {
   const [updateDescription, { loading: updatingDescription }] = useMutation(
      UPDATE_RECIPE,
      getMutationOptions(
         { description: _state.description.value },
         'description'
      )
   )

   return (
      <Flex container alignItems="center">
         <Flex width="100%">
            <Form.Group>
               <Tooltip identifier="recipe_description" />
               <Form.Text
                  variant="revamp-sm"
                  id="description"
                  name="description"
                  onChange={e =>
                     _dispatch({
                        type: 'SET_VALUE',
                        payload: {
                           field: 'description',
                           value: e.target.value,
                        },
                     })
                  }
                  onBlur={updateDescription}
                  value={_state.description.value}
                  placeholder="Add recipe description within 120 words"
               />
            </Form.Group>
         </Flex>
         <Spacer xAxis size="16px" />
         <UpdatingSpinner
            updated={updated}
            setUpdated={setUpdated}
            updatedField="description"
            loading={updatingDescription}
         />
      </Flex>
   )
}

export default Descriptions
