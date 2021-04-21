import React from 'react'
import { Form, Spacer, Text, Flex, IconButton } from '@dailykit/ui'
import {
   Tooltip,
   UpdatingSpinner,
} from '../../../../../../../shared/components'
import { ResponsiveFlex } from '../../styled'
import { useTabs } from '../../../../../../../shared/providers'
import { PRODUCT, PRODUCTS } from '../../../../../graphql'
import validator from '../../validators'
import { toast } from 'react-toastify'
import { logger, randomSuffix } from '../../../../../../../shared/utils'
import { useMutation } from '@apollo/react-hooks'
import {
   CloneIcon,
   CloseIcon,
   TickIcon,
} from '../../../../../../../shared/assets/icons'

const Statusbar = ({ state, title, setTitle }) => {
   const { addTab, setTabTitle } = useTabs()
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
   const [createProduct, { loading: cloning }] = useMutation(PRODUCTS.CREATE, {
      onCompleted: data => {
         toast.success('Product cloned!')
         addTab(
            data.createProduct.name,
            `/products/products/${data.createProduct.id}`
         )
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

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

   const clone = () => {
      const generatedProductOptions = state.productOptions.map(op => ({
         position: op.position,
         type: op.type,
         label: op.label,
         price: op.price,
         discount: op.discount,
         quantity: op.quantity,
         simpleRecipeYieldId: op.simpleRecipeYield?.id || null,
         supplierItemId: op.supplierItem?.id || null,
         sachetItemId: op.sachetItem?.id || null,
         modifierId: op.modifier?.id || null,
         operationConfigId: op.operationConfig?.id || null,
      }))
      const object = {
         type: state.type,
         name: `${state.name}-${randomSuffix()}`,
         assets: state.assets,
         tags: state.tags,
         additionalText: state.additionalText,
         description: state.description,
         price: state.price,
         discount: state.discount,
         isPopupAllowed: state.isPopupAllowed,
         isPublished: state.isPublished,
         productOptions: {
            data: generatedProductOptions,
         },
      }
      createProduct({
         variables: {
            object,
         },
      })
   }

   return (
      <>
         <ResponsiveFlex>
            <Flex container alignItems="center">
               <Form.Group>
                  <Form.Text
                     id="title"
                     name="title"
                     variant="revamp"
                     value={title.value}
                     placeholder="enter product name"
                     onChange={e =>
                        setTitle({ ...title, value: e.target.value })
                     }
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
                     iconWithText
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
               <Spacer xAxis size="16px" />
               <Flex container alignItems="center">
                  <Form.Toggle
                     name="published"
                     variant="green"
                     iconWithText
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
            {state.type === 'simple' && (
               <IconButton
                  type="ghost"
                  size="sm"
                  onClick={clone}
                  isLoading={cloning}
               >
                  <CloneIcon color="#00A7E1" />
               </IconButton>
            )}
         </ResponsiveFlex>

         <Flex container justifyContent="center" padding="16px 0px">
            {state.isValid?.status ? (
               <Flex container alignItems="center">
                  <TickIcon color="#00ff00" stroke={2} />
                  <Text as="p">All good!</Text>
               </Flex>
            ) : (
               <Flex container alignItems="center">
                  <CloseIcon color="#ff0000" />
                  <Text as="p">{state.isValid?.error}</Text>
               </Flex>
            )}
         </Flex>
      </>
   )
}

export default Statusbar
