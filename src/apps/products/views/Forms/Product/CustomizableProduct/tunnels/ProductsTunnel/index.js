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
   useMultiList,
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

const address =
   'apps.menu.views.forms.product.customizableproduct.tunnels.productstunnel.'

const ProductsTunnel = ({ state, close }) => {
   const { t } = useTranslation()
   const { productState } = React.useContext(CustomizableProductContext)

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

   const [
      createCustomizableProductOptions,
      { loading: inFlight },
   ] = useMutation(CREATE_CUSTOMIZABLE_PRODUCT_OPTIONS, {
      onCompleted: () => {
         toast.success(t(address.concat('products added!')))
         close(2)
         close(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const save = () => {
      if (inFlight) return
      const objects = selected.map(product => {
         return {
            customizableProductId: state.id,
            inventoryProductId:
               productState.meta.itemType === 'inventory' ? product.id : null,
            simpleRecipeProductId:
               productState.meta.itemType === 'simple' ? product.id : null,
         }
      })
      createCustomizableProductOptions({
         variables: {
            objects,
         },
      })
   }

   React.useEffect(() => {
      if (productState.meta.itemType === 'inventory') {
         fetchInventoryProducts()
      } else {
         fetchSimpleRecipeProducts()
      }
   }, [])

   return (
      <>
         <TunnelHeader
            title={`${t(address.concat('select'))} 
                  ${
                     productState.meta.itemType === 'inventory'
                        ? t(address.concat('inventory products'))
                        : t(address.concat('simple recipe products'))
                  } 
                  ${t(address.concat('to add'))}`}
            right={{
               action: save,
               title: inFlight ? 'Adding...' : 'Add',
            }}
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
