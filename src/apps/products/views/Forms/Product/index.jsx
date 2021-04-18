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
import { ProductProvider } from '../../../context/product'
import { ModifiersProvider } from '../../../context/product/modifiers'
import { PRODUCT } from '../../../graphql'
import { Assets, Description, Pricing } from './components'
import CustomizableProductComponents from './CustomizableProductComponents'
import ProductOptions from './ProductOptions'
import { ResponsiveFlex, StyledFlex } from './styled'
import validator from './validators'
import ComboProductComponents from './ComboProductComponents'
import BasicInformation from './components/BasicInformation'
import Statusbar from './components/Statusbar'

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
               <CustomizableProductComponents
                  productId={state.id}
                  options={state.customizableProductComponents || []}
               />
            )
         }
         case 'combo': {
            return (
               <ComboProductComponents
                  productId={state.id}
                  options={state.comboProductComponents || []}
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
            <Statusbar state={state} title={title} setTitle={setTitle} />
            <Flex as="main" padding="8px 32px" minHeight="calc(100vh - 130px)">
               <HorizontalTabs>
                  <HorizontalTabList>
                     <HorizontalTab>Basic Information</HorizontalTab>
                     <HorizontalTab>Options</HorizontalTab>
                  </HorizontalTabList>
                  <HorizontalTabPanels>
                     <HorizontalTabPanel>
                        <BasicInformation state={state} />
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
