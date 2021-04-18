import React from 'react'
import { Form, Spacer, Text, Flex } from '@dailykit/ui'
import {
   Tooltip,
   UpdatingSpinner,
} from '../../../../../../../shared/components'
import { ResponsiveFlex } from '../../styled'
import { useTabs } from '../../../../../../../shared/providers'
import { PRODUCT } from '../../../../../graphql'
import validator from '../../validators'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils'
import { useMutation } from '@apollo/react-hooks'

const Statusbar = ({ state, title, setTitle }) => {
   const { setTabTitle } = useTabs()
   const [updated, setUpdated] = React.useState(null)

   // Mutation
   const [updateName, { loading: updatingName }] = useMutation(PRODUCT.UPDATE, {
      variables: {
         id: state.id,
         _set: {
            name: title.value,
         },
      },
      onCompleted: () => {
         setUpdated('name')
         setTabTitle(title.value)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const [updatePublished, { loading: updatingPublished }] = useMutation(
      PRODUCT.UPDATE,
      {
         variables: {
            id: state.id,
            _set: {
               isPublished: !state.isPublished,
            },
         },
         onCompleted: () => {
            setUpdated('publish')
            setTabTitle(title.value)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )
   const [updateIsPopupAllowed, { loading: updatingPopups }] = useMutation(
      PRODUCT.UPDATE,
      {
         variables: {
            id: state.id,
            _set: {
               isPopupAllowed: !state.isPopupAllowed,
            },
         },
         onCompleted: () => {
            setUpdated('pop-up')
            setTabTitle(title.value)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   //Handlers
   const handleUpdateName = () => {
      const { isValid, errors } = validator.name(title.value)
      setTitle({
         ...title,
         meta: {
            isTouched: true,
            errors,
            isValid,
         },
      })
      if (isValid) {
         updateName()
      }
   }

   const togglePublish = () => {
      const val = !state.isPublished
      if (val && !state.isValid.status) {
         return toast.error('Product should be valid!')
      }
      updatePublished()
   }

   React.useEffect(() => {
      const timeId = setTimeout(() => {
         setUpdated(null)
      }, 1800)
      return () => {
         clearTimeout(timeId)
      }
   }, [updated])

   return (
      <ResponsiveFlex>
         <Flex container alignItems="center">
            <Form.Group>
               <Form.Text
                  id="title"
                  name="title"
                  variant="revamp"
                  value={title.value}
                  placeholder="enter product name"
                  onChange={e => setTitle({ ...title, value: e.target.value })}
                  onBlur={handleUpdateName}
                  hasError={!title.meta.isValid && title.meta.isTouched}
               />
               {title.meta.isTouched &&
                  !title.meta.isValid &&
                  title.meta.errors.map((error, index) => (
                     <Form.Error justifyContent="center" key={index}>
                        {error}
                     </Form.Error>
                  ))}
            </Form.Group>
            <Spacer xAxis size="16px" />
            <UpdatingSpinner
               loading={updatingName}
               setUpdated={setUpdated}
               updated={updated}
               updatedField="name"
            />
         </Flex>
         <Flex container alignItems="center">
            <Flex container alignItems="center">
               <Form.Toggle
                  name="popup"
                  variant="green"
                  size={40}
                  value={state.isPopupAllowed}
                  onChange={updateIsPopupAllowed}
               >
                  <Flex container alignItems="center">
                     <Text as="text2">Allow Pop-ups</Text>
                     <Tooltip identifier="simple_recipe_product_popup_checkbox" />
                  </Flex>
               </Form.Toggle>
               <Spacer xAxis size="16px" />
               <UpdatingSpinner
                  loading={updatingPopups}
                  setUpdated={setUpdated}
                  updated={updated}
                  updatedField="pop-up"
               />
            </Flex>
            <Spacer xAxis size="48px" />
            <Flex container alignItems="center">
               <Form.Toggle
                  name="published"
                  variant="green"
                  size={40}
                  value={state.isPublished}
                  onChange={togglePublish}
               >
                  <Flex container alignItems="center">
                     <Text as="text2">Published</Text>
                     <Tooltip identifier="simple_recipe_product_publish" />
                  </Flex>
               </Form.Toggle>
               <Spacer xAxis size="16px" />
               <UpdatingSpinner
                  loading={updatingPublished}
                  setUpdated={setUpdated}
                  updated={updated}
                  updatedField="publish"
               />
            </Flex>
         </Flex>
      </ResponsiveFlex>
   )
}

export default Statusbar
