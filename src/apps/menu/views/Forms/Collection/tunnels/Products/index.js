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
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
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

const address = 'apps.menu.views.forms.collection.tunnels.products.'

const ProductsTunnel = ({ closeTunnel }) => {
   const { t } = useTranslation()
   const { collectionState } = React.useContext(CollectionContext)

   const [search, setSearch] = React.useState('')
   const [products, setProducts] = React.useState([])
   const [list, selected, selectOption] = useMultiList(products)

   // Queries for fetching products
   const [
      fetchSimpleRecipeProducts,
      { loading: simpleRecipeProductsLoading },
   ] = useLazyQuery(SIMPLE_RECIPE_PRODUCTS, {
      variables: {
         where: {
            _and: [
               {
                  isPublished: { _eq: true },
               },
               {
                  isArchived: { _eq: false },
               },
            ],
         },
      },
      onCompleted: data => {
         const updatedProducts = data.simpleRecipeProducts.filter(
            pdct => pdct.isValid.status
         )
         setProducts([...updatedProducts])
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
      fetchPolicy: 'cache-and-network',
   })
   const [
      fetchInventoryProducts,
      { loading: inventoryProductsLoading },
   ] = useLazyQuery(INVENTORY_PRODUCTS, {
      variables: {
         where: {
            _and: [
               {
                  isPublished: { _eq: true },
               },
               {
                  isArchived: { _eq: false },
               },
            ],
         },
      },
      onCompleted: data => {
         const updatedProducts = data.inventoryProducts.filter(
            pdct => pdct.isValid.status
         )
         setProducts([...updatedProducts])
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
      fetchPolicy: 'cache-and-network',
   })
   const [
      fetchCustomizableProducts,
      { loading: customizableProductsLoading },
   ] = useLazyQuery(CUSTOMIZABLE_PRODUCTS, {
      variables: {
         where: {
            _and: [
               {
                  isPublished: { _eq: true },
               },
               {
                  isArchived: { _eq: false },
               },
            ],
         },
      },
      onCompleted: data => {
         const updatedProducts = data.customizableProducts.filter(
            pdct => pdct.isValid.status
         )
         setProducts([...updatedProducts])
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
      fetchPolicy: 'cache-and-network',
   })
   const [fetchComboProducts, { loading: comboProductsLoading }] = useLazyQuery(
      COMBO_PRODUCTS,
      {
         variables: {
            where: {
               _and: [
                  {
                     isPublished: { _eq: true },
                  },
                  {
                     isArchived: { _eq: false },
                  },
               ],
            },
         },
         onCompleted: data => {
            const updatedProducts = data.comboProducts.filter(
               pdct => pdct.isValid.status
            )
            setProducts([...updatedProducts])
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
         fetchPolicy: 'cache-and-network',
      }
   )

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

   React.useEffect(() => {
      if (collectionState.productType === 'inventory') {
         fetchInventoryProducts()
      } else if (collectionState.productType === 'simple') {
         fetchSimpleRecipeProducts()
      } else if (collectionState.productType === 'combo') {
         fetchComboProducts()
      } else if (collectionState.productType === 'customizable') {
         fetchCustomizableProducts()
      } else {
         toast.error('Could not resolve product type!')
      }
   }, [])

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
                        <ListOptions>
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
