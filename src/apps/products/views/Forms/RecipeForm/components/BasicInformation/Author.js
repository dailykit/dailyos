import React from 'react'
import { Flex, Form, Spacer } from '@dailykit/ui'
import { UPDATE_RECIPE } from '../../../../../graphql'
import {
   Tooltip,
   UpdatingSpinner,
} from '../../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'

const Author = ({
   _state,
   _dispatch,
   getMutationOptions,
   updated,
   setUpdated,
}) => {
   const [updateAuthor, { loading: updatingAuthor }] = useMutation(
      UPDATE_RECIPE,
      getMutationOptions({ author: _state.author.value }, 'author')
   )

   return (
      <Flex container alignItems="center">
         <Form.Group>
            <Tooltip identifier="recipe_author" />
            <Form.Text
               id="author"
               name="author"
               variant="revamp-sm"
               onChange={e =>
                  _dispatch({
                     type: 'SET_VALUE',
                     payload: {
                        field: 'author',
                        value: e.target.value,
                     },
                  })
               }
               onBlur={updateAuthor}
               value={_state.author.value}
               placeholder="enter author name"
               hasError={
                  _state.author.meta.isTouched && !_state.author.meta.isValid
               }
            />
            {_state.author.meta.isTouched &&
               !_state.author.meta.isValid &&
               _state.author.meta.errors.map((error, index) => (
                  <Form.Error key={index}>{error}</Form.Error>
               ))}
         </Form.Group>
         <Spacer xAxis size="16px" />
         <UpdatingSpinner
            updated={updated}
            setUpdated={setUpdated}
            updatedField="author"
            loading={updatingAuthor}
         />
      </Flex>
   )
}

export default Author
