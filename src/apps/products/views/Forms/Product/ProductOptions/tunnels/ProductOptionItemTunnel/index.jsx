import React from 'react'
import { toast } from 'react-toastify'
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

import {
   InlineLoader,
   Tooltip,
} from '../../../../../../../../shared/components'
import { logger } from '../../../../../../../../shared/utils'
import {
   CREATE_ITEM,
   CREATE_SACHET_ITEM,
} from '../../../../../../../inventory/graphql/mutations/item'
import { ProductContext } from '../../../../../../context/product'
import {
   PRODUCT_OPTION,
   SACHET_ITEMS,
   SIMPLE_RECIPES,
   SUPPLIER_ITEMS,
   S_SACHET_ITEMS,
   S_SIMPLE_RECIPE_YIELDS,
   S_SUPPLIER_ITEMS,
} from '../../../../../../graphql'
import { TunnelBody } from '../../../tunnels/styled'

const ProductOptionItemTunnel = ({ closeTunnel }) => {
   const { productState } = React.useContext(ProductContext)

   const [search, setSearch] = React.useState('')
   const [items, setItems] = React.useState([])
   const [list, current, selectOption] = useSingleList(items)

   // Subscription for fetching items
   const { loading: supplierItemsLoading } = useSubscription(S_SUPPLIER_ITEMS, {
      skip: productState.productOptionType !== 'inventory',
      onSubscriptionData: data => {
         const { supplierItems } = data.subscriptionData.data
         const updatedItems = supplierItems.map(item => {
            return {
               id: item.id,
               title: `${item.name} - ${item.unitSize} ${item.unit}`,
            }
         })
         setItems([...updatedItems])
      },
   })
   const { loading: sachetItemsLoading } = useSubscription(S_SACHET_ITEMS, {
      skip: productState.productOptionType !== 'sachet',
      onSubscriptionData: data => {
         const { sachetItems } = data.subscriptionData.data
         const updatedItems = sachetItems.map(item => {
            return {
               id: item.id,
               title: `${item.bulkItem.supplierItem.name} ${item.bulkItem.processingName} - ${item.unitSize} ${item.unit}`,
            }
         })
         setItems([...updatedItems])
      },
   })
   const { loading: servingsLoading } = useSubscription(
      S_SIMPLE_RECIPE_YIELDS,
      {
         skip: productState.productOptionType !== 'serving',
         onSubscriptionData: data => {
            const { simpleRecipeYields } = data.subscriptionData.data
            const updatedItems = simpleRecipeYields.map(y => {
               return {
                  id: y.id,
                  title: `${y.yield.serving} serving - ${y.simpleRecipe.name}`,
               }
            })
            setItems([...updatedItems])
         },
      }
   )

   const [updateProductOption] = useMutation(PRODUCT_OPTION.UPDATE, {
      onCompleted: () => {
         toast.success('Item linked.')
         closeTunnel(2)
         closeTunnel(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const [createSupplierItem] = useMutation(CREATE_ITEM, {
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [createSachetItem] = useMutation(CREATE_SACHET_ITEM, {
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   // Handlers
   const quickCreateItem = () => {
      const itemName = search.slice(0, 1).toUpperCase() + search.slice(1)
      switch (productState.meta.itemType) {
         case 'inventory':
            return createSupplierItem({
               variables: {
                  object: {
                     name: itemName,
                  },
               },
            })
         // TODO: handle sachet item quick create in inventory products
         // case 'sachet':
         //    return createSachetItem({
         //       variables: {
         //          object: {
         //             name: itemName,
         //          },
         //       },
         //    })
         default:
            console.error('No item type matched!')
      }
   }

   React.useEffect(() => {
      if (current.id) {
         updateProductOption({
            variables: {
               id: productState.optionId,
               _set: {
                  supplierItemId:
                     productState.productOptionType === 'inventory'
                        ? current.id
                        : null,
                  sachetItemId:
                     productState.productOptionType === 'sachet'
                        ? current.id
                        : null,
                  simpleRecipeYieldId:
                     productState.productOptionType === 'serving'
                        ? current.id
                        : null,
               },
            },
         })
      }
   }, [current])

   return (
      <>
         <TunnelHeader
            title="Select an item"
            close={() => closeTunnel(2)}
            tooltip={<Tooltip identifier="product_option_item_tunnel" />}
         />
         <TunnelBody>
            {sachetItemsLoading || supplierItemsLoading || servingsLoading ? (
               <InlineLoader />
            ) : (
               <List>
                  {Object.keys(current).length > 0 ? (
                     <ListItem type="SSL1" title={current.title} />
                  ) : (
                     <ListSearch
                        onChange={value => setSearch(value)}
                        placeholder="Type what you're looking for"
                     />
                  )}
                  <ListHeader type="SSL1" label="Items" />
                  <ListOptions
                     search={search}
                     handleOnCreate={
                        productState.productOptionType === 'inventory'
                           ? quickCreateItem
                           : null
                     }
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
                              onClick={() => selectOption('id', option.id)}
                           />
                        ))}
                  </ListOptions>
               </List>
            )}
         </TunnelBody>
      </>
   )
}

export default ProductOptionItemTunnel
