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
   Loader,
} from '@dailykit/ui'
import { useLazyQuery } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'
import { CollectionContext } from '../../../../../context/collection'
import { TunnelBody } from '../styled'
import {
   SIMPLE_RECIPE_PRODUCTS,
   INVENTORY_PRODUCTS,
   CUSTOMIZABLE_PRODUCTS,
   COMBO_PRODUCTS,
} from '../../../../../graphql'

const address = 'apps.online_store.views.forms.collection.tunnels.products.'

const ProductsTunnel = ({ close }) => {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')
   const { collectionState, collectionDispatch } = React.useContext(
      CollectionContext
   )
   const [products, setProducts] = React.useState([])
   const [list, selected, selectOption] = useMultiList(products)

   // Queries for fetching products
   const [
      fetchSimpleRecipeProducts,
      { loading: simpleRecipeProductsLoading },
   ] = useLazyQuery(SIMPLE_RECIPE_PRODUCTS, {
      variables: {
         where: {
            isPublished: { _eq: true },
         },
      },
      onCompleted: data => {
         const updatedProducts = data.simpleRecipeProducts.filter(
            pdct => pdct.isValid.status
         )
         setProducts([...updatedProducts])
      },
      onError: error => {
         console.log(error)
      },
      fetchPolicy: 'cache-and-network',
   })
   const [
      fetchInventoryProducts,
      { loading: inventoryProductsLoading },
   ] = useLazyQuery(INVENTORY_PRODUCTS, {
      variables: {
         where: {
            isPublished: { _eq: true },
         },
      },
      onCompleted: data => {
         const updatedProducts = data.inventoryProducts.filter(
            pdct => pdct.isValid.status
         )
         setProducts([...updatedProducts])
      },
      onError: error => {
         console.log(error)
      },
      fetchPolicy: 'cache-and-network',
   })
   const [
      fetchCustomizableProducts,
      { loading: customizableProductsLoading },
   ] = useLazyQuery(CUSTOMIZABLE_PRODUCTS, {
      variables: {
         where: {
            isPublished: { _eq: true },
         },
      },
      onCompleted: data => {
         const updatedProducts = data.customizableProducts.filter(
            pdct => pdct.isValid.status
         )
         setProducts([...updatedProducts])
      },
      onError: error => {
         console.log(error)
      },
      fetchPolicy: 'cache-and-network',
   })
   const [fetchComboProducts, { loading: comboProductsLoading }] = useLazyQuery(
      COMBO_PRODUCTS,
      {
         variables: {
            where: {
               isPublished: { _eq: true },
            },
         },
         onCompleted: data => {
            const updatedProducts = data.comboProducts.filter(
               pdct => pdct.isValid.status
            )
            setProducts([...updatedProducts])
         },
         onError: error => {
            console.log(error)
         },
         fetchPolicy: 'cache-and-network',
      }
   )

   const save = () => {
      collectionDispatch({
         type: 'ADD_PRODUCTS',
         payload: {
            products: selected,
         },
      })
      close(2)
      close(1)
   }

   React.useEffect(() => {
      if (collectionState.meta.productType === 'inventory') {
         fetchInventoryProducts()
      } else if (collectionState.meta.productType === 'simple') {
         fetchSimpleRecipeProducts()
      } else if (collectionState.meta.productType === 'combo') {
         fetchComboProducts()
      } else {
         fetchCustomizableProducts()
      }
   }, [])

   return (
      <>
         <TunnelHeader
            title={t(
               address.concat('select and add products to the collection')
            )}
            right={{ action: save, title: t(address.concat('save')) }}
            close={() => close(2)}
         />
         <TunnelBody>
            {simpleRecipeProductsLoading ||
            inventoryProductsLoading ||
            customizableProductsLoading ||
            comboProductsLoading ? (
               <Loader />
            ) : (
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
                              onClick={() => selectOption('id', option.id)}
                           >
                              {option.title}
                           </Tag>
                        ))}
                     </TagGroup>
                  )}
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
                              onClick={() => selectOption('id', option.id)}
                              isActive={selected.find(
                                 item => item.id === option.id
                              )}
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
