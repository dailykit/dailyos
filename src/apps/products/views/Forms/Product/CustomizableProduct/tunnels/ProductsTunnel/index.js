import React from 'react'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import {
   Filler,
   List,
   ListHeader,
   ListItem,
   ListOptions,
   ListSearch,
   Tag,
   TagGroup,
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
   INVENTORY_PRODUCTS,
   SIMPLE_RECIPE_PRODUCTS,
} from '../../../../../../graphql'
import { TunnelBody } from '../styled'

const ProductsTunnel = ({ close, open }) => {
   const { productState, productDispatch } = React.useContext(
      CustomizableProductContext
   )

   const [search, setSearch] = React.useState('')
   const [products, setProducts] = React.useState([])
   const [list, current, selectOption] = useSingleList(products)

   // Queries for fetching products
   const [
      fetchSimpleRecipeProducts,
      { loading: simpleRecipeProductsLoading },
   ] = useLazyQuery(SIMPLE_RECIPE_PRODUCTS, {
      variables: {
         where: {
            _and: [
               { isPublished: { _eq: true } },
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
               { isPublished: { _eq: true } },
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

   const select = option => {
      selectOption('id', option.id)
      productDispatch({
         type: 'PRODUCT',
         payload: {
            value: option,
         },
      })
      open(3)
   }

   React.useEffect(() => {
      if (productState.meta.productType === 'inventory') {
         fetchInventoryProducts()
      } else {
         fetchSimpleRecipeProducts()
      }
   }, [])

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
               <>
                  {products.length ? (
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
                        <ListOptions>
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
                  ) : (
                     <Filler
                        message="No products found! To state, please add some."
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
