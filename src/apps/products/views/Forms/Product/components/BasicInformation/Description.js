import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Flex, Form, HelperText, Spacer } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { PRODUCT } from '../../../../../graphql'
import { logger } from '../../../../../../../shared/utils'
import validator from '../../validators'
import { UpdatingSpinner } from '../../../../../../../shared/components'
import { isArray } from 'lodash'

const Description = ({ state }) => {
   const [updated, setUpdated] = React.useState(null)
   const [description, setDescription] = React.useState(state.description)
   const [tags, setTags] = React.useState(state.tags)
   const [errors, setErrors] = React.useState([])

   const [updateDescription, { loading: updatingDescription }] = useMutation(
      PRODUCT.UPDATE,
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

   const [updateTags, { loading: updatingTags }] = useMutation(PRODUCT.UPDATE, {
      onCompleted: () => {
         setUpdated('tags')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   React.useEffect(() => {
      setTags(state.tags)
      setDescription(state.description)
   }, [state.description])
   return (
      <>
         <Flex container alignItems="center">
            <Form.Group>
               <Form.Text
                  variant="revamp-sm"
                  id="tags"
                  name="tags"
                  onChange={e => setTags(e.target.value)}
                  onBlur={() => {
                     const { isValid, errors } = validator.csv(
                        isArray(tags) ? tags.join(',') : tags
                     )
                     setErrors(errors)
                     if (isValid) {
                        updateTags({
                           variables: {
                              id: state.id,
                              _set: {
                                 tags: tags
                                    ? isArray(tags)
                                       ? tags
                                       : tags.split(',').map(tag => tag.trim())
                                    : [],
                              },
                           },
                        })
                     }
                  }}
                  value={isArray(tags) ? tags.join(',') : tags}
                  placeholder="enter tags"
                  hasError={Boolean(errors.length)}
               />
               {errors.map((error, index) => (
                  <Form.Error key={index}>{error}</Form.Error>
               ))}
            </Form.Group>
            <Spacer xAxis size="16px" />
            <UpdatingSpinner
               updated={updated}
               setUpdated={setUpdated}
               updatedField="tags"
               loading={updatingTags}
            />
         </Flex>
         <HelperText
            type="hint"
            message="enter comma separated values, for example: No-gluten, sugarless"
         />
         <Spacer yAxis size="48px" />
         <Flex container alignItems="center">
            <Flex width="100%">
               <Form.Group>
                  <Form.Text
                     variant="revamp-sm"
                     id="description"
                     name="description"
                     onChange={e => setDescription(e.target.value)}
                     onBlur={() =>
                        updateDescription({
                           variables: {
                              id: state.id,
                              _set: {
                                 description: description.length
                                    ? description
                                    : null,
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
               loading={updatingDescription}
               updatedField="description"
               updated={updated}
               setUpdated={setUpdated}
            />
         </Flex>
      </>
   )
}

export default Description
