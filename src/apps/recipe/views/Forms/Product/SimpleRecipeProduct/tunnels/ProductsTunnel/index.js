import React from 'react'
import { useMutation, useLazyQuery } from '@apollo/react-hooks'
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
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import {
   UPDATE_SIMPLE_RECIPE_PRODUCT,
   SIMPLE_RECIPE_PRODUCTS,
   INVENTORY_PRODUCTS,
} from '../../../../../../graphql'
import { TunnelBody } from '../styled'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.tunnels.productstunnel.'

const ProductsTunnel = ({ state, close }) => {
   const { t } = useTranslation()
   const { productState } = React.useContext(SimpleProductContext)

   const [busy, setBusy] = React.useState(false)
   const [search, setSearch] = React.useState('')
   const [products, setProducts] = React.useState([])
   const [list, selected, selectOption] = useMultiList(products)

   // Query for fetching products
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

   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      onCompleted: () => {
         toast.success('Products added!')
         close(2)
         close(1)
      },
      onError: () => {
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      const { recommendations } = state
      const updatedProducts = selected.map(el => {
         return {
            id: el.id,
            title: el.name,
            image: el.assets?.images[0],
            type: el.__typename.split('_')[1],
         }
      })
      const index = recommendations.findIndex(
         ({ type }) => type === productState.recommendationType
      )
      recommendations[index].products = [
         ...recommendations[index].products,
         ...updatedProducts,
      ]
      updateProduct({
         variables: {
            id: state.id,
            set: {
               recommendations,
            },
         },
      })
   }

   React.useEffect(() => {
      if (productState.recommendationProductType === 'inventory') {
         fetchInventoryProducts()
      } else {
         fetchSimpleRecipeProducts()
      }
   }, [])

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select products to add'))}
            right={{
               action: save,
               title: busy
                  ? t(address.concat('saving'))
                  : t(address.concat('save')),
            }}
            close={() => close(2)}
         />
         <TunnelBody>
            {simpleRecipeProductsLoading || inventoryProductsLoading ? (
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
