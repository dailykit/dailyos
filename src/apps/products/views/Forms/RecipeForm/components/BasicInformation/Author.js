import React from 'react'
import { Flex, Form, Spacer } from '@dailykit/ui'
import { UPDATE_RECIPE } from '../../../../../graphql'
import {
   Tooltip,
   UpdatingSpinner,
} from '../../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'
import { logger } from '../../../../../../../shared/utils'
import { toast } from 'react-toastify'

const Author = ({ state, updated, setUpdated }) => {
   const [author, setAuthor] = React.useState(state.author)
   const [updateAuthor, { loading: updatingAuthor }] = useMutation(
      UPDATE_RECIPE,
      {
         onCompleted: () => {
            setUpdated('author')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   return (
      <Flex container alignItems="center">
         <Form.Group>
            <Tooltip identifier="recipe_author" />
            <Form.Text
               id="author"
               name="author"
               variant="revamp-sm"
               onChange={e => setAuthor(e.target.value)}
               onBlur={() =>
                  updateAuthor({
                     variables: {
                        id: state.id,
                        set: { author: author ? author : null },
                     },
                  })
               }
               value={author}
               placeholder="enter author name"
            />
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
