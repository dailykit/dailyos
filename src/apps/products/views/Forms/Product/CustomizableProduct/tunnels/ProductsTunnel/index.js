import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Filler,
   List,
   ListHeader,
   ListItem,
   ListOptions,
   ListSearch,
   TunnelHeader,
   useSingleList,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
   InlineLoader,
   Tooltip,
} from '../../../../../../../../shared/components'
import { logger } from '../../../../../../../../shared/utils'
import { CustomizableProductContext } from '../../../../../../context/product/customizableProduct'
import {
   CREATE_CUSTOMIZABLE_PRODUCT_OPTIONS,
   CREATE_INVENTORY_PRODUCT,
   CREATE_SIMPLE_RECIPE_PRODUCT,
   S_INVENTORY_PRODUCTS,
   S_SIMPLE_RECIPE_PRODUCTS,
} from '../../../../../../graphql'
import { TunnelBody } from '../styled'

const ProductsTunnel = ({ close, state }) => {
   const { productState, productDispatch } = React.useContext(
      CustomizableProductContext
   )

   const [search, setSearch] = React.useState('')
   const [products, setProducts] = React.useState([])
   const [list, current, selectOption] = useSingleList(products)

   // Subscription for fetching products
   const { loading: simpleRecipeProductsLoading } = useSubscription(
      S_SIMPLE_RECIPE_PRODUCTS,
      {
         skip: productState.meta.productType !== 'simple',
         onSubscriptionData: data => {
            const { simpleRecipeProducts } = data.subscriptionData.data
            // const updatedProducts = products.filter(
            //    pdct => pdct.isValid.status
            // )
            setProducts([...simpleRecipeProducts])
         },
      }
   )
   const { loading: inventoryProductsLoading } = useSubscription(
      S_INVENTORY_PRODUCTS,
      {
         skip: productState.meta.productType !== 'inventory',
         onSubscriptionData: data => {
            const { inventoryProducts } = data.subscriptionData.data
            // const updatedProducts = products.filter(
            //    pdct => pdct.isValid.status
            // )
            setProducts([...inventoryProducts])
         },
      }
   )

   const [createCustomizableProductOption, { loading: saving }] = useMutation(
      CREATE_CUSTOMIZABLE_PRODUCT_OPTIONS,
      {
         onCompleted: () => {
            toast.success('Product added!')
            close(2)
            close(1)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   const [createIP] = useMutation(CREATE_INVENTORY_PRODUCT, {
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [createSRP] = useMutation(CREATE_SIMPLE_RECIPE_PRODUCT, {
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const select = option => {
      selectOption('id', option.id)
      createCustomizableProductOption({
         variables: {
            objects: [
               {
                  customizableProductId: state.id,
                  inventoryProductId:
                     productState.meta.productType === 'inventory'
                        ? option.id
                        : null,
                  simpleRecipeProductId:
                     productState.meta.productType === 'simple'
                        ? option.id
                        : null,
               },
            ],
         },
      })
   }

   const quickCreateProduct = () => {
      const productName = search.slice(0, 1).toUpperCase() + search.slice(1)
      switch (productState.meta.productType) {
         case 'inventory':
            return createIP({
               variables: {
                  objects: [
                     {
                        name: productName,
                     },
                  ],
               },
            })
         case 'simple':
            return createSRP({
               variables: {
                  objects: [
                     {
                        name: productName,
                     },
                  ],
               },
            })
         default:
            console.error('No product type matched!')
      }
   }

   return (
      <>
         <TunnelHeader
            title="Select Product to Add"
            close={() => close(2)}
            tooltip={
               <Tooltip identifier="customizable_product_products_tunnel" />
            }
         />
         <TunnelBody>
            {simpleRecipeProductsLoading || inventoryProductsLoading ? (
               <InlineLoader />
            ) : (
               <List>
                  {Object.keys(current).length > 0 ? (
                     <ListItem type="SSL1" title={current.title} />
                  ) : (
                     <ListSearch
                        onChange={value => setSearch(value)}
                        placeholder="type what you’re looking for..."
                     />
                  )}
                  <ListHeader type="SSL1" label="Products" />
                  <ListOptions
                     search={search}
                     handleOnCreate={quickCreateProduct}
                  >
                     {list
                        .filter(option =>
                           option.title.toLowerCase().includes(search)
                        )
                        .map(option => (
                           <ListItem
                              type="SSL1"
                              key={option.id}
                              title={option.title}
                              isActive={option.id === current.id}
                              onClick={() => select(option)}
                           />
                        ))}
                  </ListOptions>
               </List>
            )}
         </TunnelBody>
      </>
   )
}

export default ProductsTunnel
