import React from 'react'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
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
import { ComboProductContext } from '../../../../../../context/product/comboProduct'
import {
   CUSTOMIZABLE_PRODUCTS,
   INVENTORY_PRODUCTS,
   SIMPLE_RECIPE_PRODUCTS,
   UPDATE_COMBO_PRODUCT_COMPONENT,
} from '../../../../../../graphql'
import { TunnelBody } from '../styled'
import { logger } from '../../../../../../../../shared/utils'

const address =
   'apps.menu.views.forms.product.comboproduct.tunnels.productstunnel.'

const ProductsTunnel = ({ close }) => {
   const { t } = useTranslation()
   const { productState } = React.useContext(ComboProductContext)

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

   // Mutation
   const [updateComboProductComponent] = useMutation(
      UPDATE_COMBO_PRODUCT_COMPONENT,
      {
         onCompleted: () => {
            toast.success(t(address.concat('product added!')))
            close(3)
            close(2)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   const select = product => {
      selectOption('id', product.id)
      updateComboProductComponent({
         variables: {
            id: productState.meta.componentId,
            set: {
               customizableProductId:
                  productState.meta.productType === 'customizable'
                     ? product.id
                     : null,
               inventoryProductId:
                  productState.meta.productType === 'inventory'
                     ? product.id
                     : null,
               simpleRecipeProductId:
                  productState.meta.productType === 'simple'
                     ? product.id
                     : null,
            },
         },
      })
   }

   React.useEffect(() => {
      if (productState.meta.productType === 'inventory') {
         fetchInventoryProducts()
      } else if (productState.meta.productType === 'simple') {
         fetchSimpleRecipeProducts()
      } else {
         fetchCustomizableProducts()
      }
   }, [])

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
               <>
                  {list.length ? (
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
