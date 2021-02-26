import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Flex,
   Form,
   HorizontalTab,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   HorizontalTabs,
   Spacer,
   Text,
} from '@dailykit/ui'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
   ErrorState,
   InlineLoader,
   Tooltip,
} from '../../../../../shared/components'
import { useTabs } from '../../../../../shared/providers'
import { logger } from '../../../../../shared/utils'
import { CloseIcon, TickIcon } from '../../../assets/icons'
import { ProductProvider } from '../../../context/product'
import { ModifiersProvider } from '../../../context/product/modifiers'
import { PRODUCT } from '../../../graphql'
import { Assets, Description } from './components'
import CustomizableOptions from './CustomizableOptions'
import ProductOptions from './ProductOptions'
import { ResponsiveFlex, StyledFlex } from './styled'
import validator from './validators'

const Product = () => {
   const { id: productId } = useParams()

   const { setTabTitle, tab, addTab } = useTabs()

   const [title, setTitle] = React.useState({
      value: '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   })
   const [state, setState] = React.useState({})

   // Subscription
   const { loading, error } = useSubscription(PRODUCT.VIEW, {
      variables: {
         id: productId,
      },
      onSubscriptionData: data => {
         console.log(data.subscriptionData.data)
         setState(data.subscriptionData.data.product)
         setTitle({
            ...title,
            value: data.subscriptionData.data.product.name,
         })
      },
   })

   // Mutation
   const [updateProduct] = useMutation(PRODUCT.UPDATE, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   React.useEffect(() => {
      if (!tab && !loading && !isEmpty(title.value)) {
         addTab(title.value, `/products/products/${productId}`)
      }
   }, [tab, addTab, loading, title.value])

   // Handlers
   const updateName = async () => {
      const { isValid, errors } = validator.name(title.value)
      if (isValid) {
         const { data } = await updateProduct({
            variables: {
               id: state.id,
               _set: {
                  name: title.value,
               },
            },
         })
         if (data) {
            setTabTitle(title.value)
         }
      }
      setTitle({
         ...title,
         meta: {
            isTouched: true,
            errors,
            isValid,
         },
      })
   }
   const togglePublish = () => {
      const val = !state.isPublished
      if (val && !state.isValid.status) {
         return toast.error('Product should be valid!')
      }
      return updateProduct({
         variables: {
            id: state.id,
            _set: {
               isPublished: val,
            },
         },
      })
   }
   const togglePopup = () => {
      const val = !state.isPopupAllowed
      return updateProduct({
         variables: {
            id: state.id,
            _set: {
               isPopupAllowed: val,
            },
         },
      })
   }

   const renderOptions = () => {
      const { type } = state

      switch (type) {
         case 'simple': {
            return (
               <ProductOptions
                  productId={state.id}
                  options={state.productOptions || []}
               />
            )
         }
         case 'customizable': {
            return (
               <CustomizableOptions
                  productId={state.id}
                  options={state.customizableProductOptions || []}
               />
            )
         }
         default:
            return null
      }
   }

   if (loading) return <InlineLoader />
   if (!loading && error) {
      toast.error('Failed to fetch Product!')
      logger(error)
      return <ErrorState />
   }

   return (
      <ProductProvider>
         <ModifiersProvider>
            <ResponsiveFlex>
               <Form.Group>
                  <Form.Label htmlFor="title" title="title">
                     Product Name*
                  </Form.Label>
                  <Form.Text
                     id="title"
                     name="title"
                     value={title.value}
                     placeholder="Enter product name"
                     onChange={e =>
                        setTitle({ ...title, value: e.target.value })
                     }
                     onBlur={updateName}
                     hasError={!title.meta.isValid && title.meta.isTouched}
                  />
                  {title.meta.isTouched &&
                     !title.meta.isValid &&
                     title.meta.errors.map((error, index) => (
                        <Form.Error key={index}>{error}</Form.Error>
                     ))}
               </Form.Group>
               <Spacer xAxis size="16px" />

               <div>
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
               </div>
               <Spacer size="16px" />

               <Flex container alignItems="center">
                  <Form.Checkbox
                     name="popup"
                     value={state.isPopupAllowed}
                     onChange={togglePopup}
                  >
                     <Flex container alignItems="center">
                        Popup Allowed
                        <Tooltip identifier="simple_recipe_product_popup_checkbox" />
                     </Flex>
                  </Form.Checkbox>

                  <Spacer xAxis size="16px" />
                  <Form.Toggle
                     name="published"
                     value={state.isPublished}
                     onChange={togglePublish}
                  >
                     <Flex container alignItems="center">
                        Published
                        <Spacer xAxis size="16px" />
                        <Tooltip identifier="simple_recipe_product_publish" />
                     </Flex>
                  </Form.Toggle>
               </Flex>
            </ResponsiveFlex>
            <Flex as="main" padding="8px 32px" minHeight="calc(100vh - 130px)">
               <HorizontalTabs>
                  <HorizontalTabList>
                     <HorizontalTab>Basic Details</HorizontalTab>
                     <HorizontalTab>Options</HorizontalTab>
                  </HorizontalTabList>
                  <HorizontalTabPanels>
                     <HorizontalTabPanel>
                        <StyledFlex as="section" container>
                           <Description state={state} />
                           <Spacer xAxis size="16px" />
                           <Assets state={state} />
                        </StyledFlex>
                     </HorizontalTabPanel>
                     <HorizontalTabPanel>{renderOptions()}</HorizontalTabPanel>
                  </HorizontalTabPanels>
               </HorizontalTabs>
            </Flex>
         </ModifiersProvider>
      </ProductProvider>
   )
}

export default Product
