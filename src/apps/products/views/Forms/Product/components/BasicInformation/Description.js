import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Flex, Form, HelperText, Spacer } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { PRODUCT } from '../../../../../graphql'
import { logger } from '../../../../../../../shared/utils'
import validator from '../../validators'
import { UpdatingSpinner } from '../../../../../../../shared/components'

const Description = ({ state }) => {
   const [updated, setUpdated] = React.useState(null)

   const [tags, setTags] = React.useState({
      value: state.tags ? state.tags.join(', ') : '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   })
   const [description, setDescription] = React.useState({
      value: state.description || '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   })
   const getMutationOptions = (set, updatedField) => {
      return {
         variables: {
            id: state.id,
            _set: set,
         },
         onCompleted: () => {
            setUpdated(updatedField)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   }
   // Mutations
   const [updateTags, { loading: updatingTags }] = useMutation(
      PRODUCT.UPDATE,
      getMutationOptions(
         {
            tags: tags.value.trim().length
               ? tags.value.split(',').map(tag => tag.trim())
               : [],
         },
         'tags'
      )
   )

   const [updateDescription, { loading: updatingDescription }] = useMutation(
      PRODUCT.UPDATE,
      getMutationOptions({ description: description.value }, 'description')
   )

   // Handlers
   const handleUpdateTags = () => {
      const { isValid, errors } = validator.csv(tags.value)
      setTags({
         ...tags,
         meta: {
            isTouched: true,
            isValid,
            errors,
         },
      })
      if (updatingTags) return
      if (tags.meta.isValid) {
         updateTags()
      } else {
         toast.error('Invalid values!')
      }
   }

   return (
      <>
         <Flex container alignItems="center" margin="32px 0px 0px 0px">
            <Form.Group>
               <Form.Text
                  id="tags"
                  variant="revamp-sm"
                  name="tags"
                  onBlur={() => {
                     handleUpdateTags()
                  }}
                  onChange={e => setTags({ ...tags, value: e.target.value })}
                  value={tags.value}
                  placeholder="enter tags"
                  hasError={tags.meta.isTouched && !tags.meta.isValid}
               />
               {tags.meta.isTouched &&
                  !tags.meta.isValid &&
                  tags.meta.errors.map((error, index) => (
                     <Form.Error key={index}>{error}</Form.Error>
                  ))}
            </Form.Group>
            <Spacer xAxis size="16px" />
            <UpdatingSpinner
               loading={updatingTags}
               updatedField="tags"
               updated={updated}
               setUpdated={setUpdated}
            />
         </Flex>
         <HelperText
            type="hint"
            message="Enter comma separated values, for example: New, Hot, Spicy"
         />
         <Spacer size="48px" />
         <Flex container alignItems="center">
            <Flex width="100%">
               <Form.Group>
                  <Form.Text
                     variant="revamp-sm"
                     id="description"
                     name="description"
                     onChange={e => {
                        setDescription({
                           ...description,
                           value: e.target.value,
                        })
                     }}
                     value={description.value}
                     onBlur={updateDescription}
                     placeholder="Add product description in 120 words. "
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
