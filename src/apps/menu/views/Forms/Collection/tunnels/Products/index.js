import React from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Tag,
   TagGroup,
   useMultiList,
   TunnelHeader,
   Filler,
   ListHeader,
} from '@dailykit/ui'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'
import { CollectionContext } from '../../../../../context/collection'
import { TunnelBody } from '../styled'
import {
   SIMPLE_RECIPE_PRODUCTS,
   INVENTORY_PRODUCTS,
   CUSTOMIZABLE_PRODUCTS,
   COMBO_PRODUCTS,
   CREATE_COLLECTION_PRODUCT_CATEGORY_PRODUCTS,
} from '../../../../../graphql'
import { toast } from 'react-toastify'
import { InlineLoader, Tooltip } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import {
   CREATE_COMBO_PRODUCT,
   CREATE_CUSTOMIZABLE_PRODUCT,
   CREATE_INVENTORY_PRODUCT,
   CREATE_SIMPLE_RECIPE_PRODUCT,
} from '../../../../../../products/graphql'

const address = 'apps.menu.views.forms.collection.tunnels.products.'

const ProductsTunnel = ({ closeTunnel }) => {
   const { t } = useTranslation()
   const { collectionState } = React.useContext(CollectionContext)

   const [search, setSearch] = React.useState('')
   const [products, setProducts] = React.useState([])
   const [list, selected, selectOption] = useMultiList(products)

   // Subscription for fetching products
   const { loading: simpleRecipeProductsLoading } = useSubscription(
      SIMPLE_RECIPE_PRODUCTS,
      {
         skip: collectionState.productType !== 'simple',
         variables: {
            where: {
               isArchived: { _eq: false },
            },
         },
         onSubscriptionData: data => {
            const products = data.subscriptionData.data.simpleRecipeProducts
            // const updatedProducts = products.filter(pdct => pdct.isValid.status)
            setProducts([...products])
         },
      }
   )
   const { loading: inventoryProductsLoading } = useSubscription(
      INVENTORY_PRODUCTS,
      {
         skip: collectionState.productType !== 'inventory',
         variables: {
            where: {
               isArchived: { _eq: false },
            },
         },
         onSubscriptionData: data => {
            const products = data.subscriptionData.data.inventoryProducts
            // const updatedProducts = products.filter(pdct => pdct.isValid.status)
            setProducts([...products])
         },
      }
   )
   const { loading: customizableProductsLoading } = useSubscription(
      CUSTOMIZABLE_PRODUCTS,
      {
         skip: collectionState.productType !== 'customizable',
         variables: {
            where: {
               isArchived: { _eq: false },
            },
         },
         onSubscriptionData: data => {
            const products = data.subscriptionData.data.customizableProducts
            // const updatedProducts = products.filter(pdct => pdct.isValid.status)
            setProducts([...products])
         },
      }
   )
   const { loading: comboProductsLoading } = useSubscription(COMBO_PRODUCTS, {
      skip: collectionState.productType !== 'combo',
      variables: {
         where: {
            isArchived: { _eq: false },
         },
      },
      onSubscriptionData: data => {
         const products = data.subscriptionData.data.comboProducts
         // const updatedProducts = products.filter(pdct => pdct.isValid.status)
         setProducts([...products])
      },
   })

   const [createRecord, { loading: inFlight }] = useMutation(
      CREATE_COLLECTION_PRODUCT_CATEGORY_PRODUCTS,
      {
         onCompleted: data => {
            toast.success(
               `Product${
                  data.createCollectionProductCategoryProducts.returning
                     .length > 1
                     ? 's'
                     : ''
               } added!`
            )
            closeTunnel(2)
            closeTunnel(1)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   const save = () => {
      if (inFlight || !selected.length) return
      const objects = selected.map(product => {
         const obj = {
            collection_productCategoryId: collectionState.categoryId,
         }
         if (collectionState.productType === 'inventory') {
            obj.inventoryProductId = product.id
         } else if (collectionState.productType === 'simple') {
            obj.simpleRecipeProductId = product.id
         } else if (collectionState.productType === 'combo') {
            obj.comboProductId = product.id
         } else if (collectionState.productType === 'customizable') {
            obj.customizableProductId = product.id
         } else {
            throw Error('Could not resolve product type!')
         }
         return obj
      })
      createRecord({
         variables: {
            objects,
         },
      })
   }

   const [createIP] = useMutation(CREATE_INVENTORY_PRODUCT, {
      onCompleted: data => {
         console.log(data)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [createSRP] = useMutation(CREATE_SIMPLE_RECIPE_PRODUCT, {
      onCompleted: data => {
         console.log(data)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [createCUSP] = useMutation(CREATE_CUSTOMIZABLE_PRODUCT, {
      onCompleted: data => {
         console.log(data)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [createCOMP] = useMutation(CREATE_COMBO_PRODUCT, {
      onCompleted: data => {
         console.log(data)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const quickCreateProduct = () => {
      const productName = search.slice(0, 1).toUpperCase() + search.slice(1)
      console.log(productName)
      switch (collectionState.productType) {
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
         case 'combo':
            return createCOMP({
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
            title={t(
               address.concat('select and add products to the collection')
            )}
            right={{ action: save, title: inFlight ? 'Adding...' : 'Add' }}
            close={() => closeTunnel(2)}
            tooltip={<Tooltip identifier="collections_products_tunnel" />}
         />
         <TunnelBody>
            {simpleRecipeProductsLoading ||
            inventoryProductsLoading ||
            customizableProductsLoading ||
            comboProductsLoading ? (
               <InlineLoader />
            ) : (
               <>
                  {products?.length ? (
                     <List>
                        <ListSearch
                           onChange={value => setSearch(value)}
                           placeholder={t(
                              address.concat("type what you're looking for")
                           )}
                        />
                        {selected.length > 0 && (
                           <TagGroup style={{ margin: '8px 0' }}>
                              {selected.map(option => (
                                 <Tag
                                    key={option.id}
                                    title={option.title}
                                    onClick={() =>
                                       selectOption('id', option.id)
                                    }
                                 >
                                    {option.title}
                                 </Tag>
                              ))}
                           </TagGroup>
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
                                    type="MSL1"
                                    key={option.id}
                                    title={option.title}
                                    onClick={() =>
                                       selectOption('id', option.id)
                                    }
                                    isActive={selected.find(
                                       item => item.id === option.id
                                    )}
                                 />
                              ))}
                        </ListOptions>
                     </List>
                  ) : (
                     <Filler
                        message="No products found! To start, please add some."
                        height="500px"
                     />
                  )}
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default ProductsTunnel
