import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
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
import { ComboProductContext } from '../../../../../../context/product/comboProduct'
import {
   CREATE_CUSTOMIZABLE_PRODUCT,
   CREATE_INVENTORY_PRODUCT,
   CREATE_SIMPLE_RECIPE_PRODUCT,
   UPDATE_COMBO_PRODUCT_COMPONENT,
   S_CUSTOMIZABLE_PRODUCTS,
   S_INVENTORY_PRODUCTS,
   S_SIMPLE_RECIPE_PRODUCTS,
} from '../../../../../../graphql'
import { TunnelBody } from '../styled'
import { logger } from '../../../../../../../../shared/utils'

const address =
   'apps.menu.views.forms.product.comboproduct.tunnels.productstunnel.'

const ProductsTunnel = ({ close, open }) => {
   const { t } = useTranslation()
   const { productState, productDispatch } = React.useContext(
      ComboProductContext
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
   const { loading: customizableProductsLoading } = useSubscription(
      S_CUSTOMIZABLE_PRODUCTS,
      {
         skip: productState.meta.productType !== 'customizable',
         onSubscriptionData: data => {
            const products = data.subscriptionData.data.customizableProducts
            // const updatedProducts = products.filter(
            //    pdct => pdct.isValid.status
            // )
            setProducts([...products])
         },
      }
   )

   // Mutation
   const [updateComboProductComponent, { loading: saving }] = useMutation(
      UPDATE_COMBO_PRODUCT_COMPONENT,
      {
         onCompleted: () => {
            toast.success('Product added!')
            close(3)
            close(2)
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
   const [createCUSP] = useMutation(CREATE_CUSTOMIZABLE_PRODUCT, {
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const select = product => {
      selectOption('id', product.id)
      if (product.__typename.includes('customizableProduct')) {
         updateComboProductComponent({
            variables: {
               id: productState.meta.componentId,
               set: {
                  customizableProductId: product.id,
                  inventoryProductId: null,
                  simpleRecipeProductId: null,
               },
            },
         })
      } else {
         productDispatch({ type: 'PRODUCT', payload: { value: product } })
         productDispatch({
            type: 'OPTIONS_MODE',
            payload: {
               type: 'add',
               componentId: undefined,
               selectedOptions: [],
            },
         })
         open(4)
      }
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
         case 'customizable':
            return createCUSP({
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
            title={t(address.concat('select product to add'))}
            close={() => close(3)}
            tooltip={<Tooltip identifier="combo_product_products_tunnel" />}
         />
         <TunnelBody>
            {simpleRecipeProductsLoading ||
            inventoryProductsLoading ||
            customizableProductsLoading ? (
               <InlineLoader />
            ) : (
               <List>
                  {Object.keys(current).length > 0 ? (
                     <ListItem type="SSL1" title={current.title} />
                  ) : (
                     <ListSearch
                        onChange={value => setSearch(value)}
                        placeholder={t(
                           address.concat("type what you're looking for")
                        )}
                     />
                  )}
                  <ListHeader type="MSL1" label="Products" />
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
