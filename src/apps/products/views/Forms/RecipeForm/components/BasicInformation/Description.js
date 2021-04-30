import React from 'react'
import { Flex, Form, Spacer } from '@dailykit/ui'
import { UPDATE_RECIPE } from '../../../../../graphql'
import {
   Tooltip,
   UpdatingSpinner,
} from '../../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils'

const Descriptions = ({ state, updated, setUpdated }) => {
   const [description, setDescription] = React.useState(state.description)
   const [updateDescription, { loading: updatingDescription }] = useMutation(
      UPDATE_RECIPE,
      {
         onCompleted: () => {
            setUpdated('description')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
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
                  onChange={e => setDescription(e.target.value)}
                  onBlur={() =>
                     updateDescription({
                        variables: {
                           id: state.id,
                           set: {
                              description: description ? description : null,
                           },
                        },
                     })
                  }
                  value={description}
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
