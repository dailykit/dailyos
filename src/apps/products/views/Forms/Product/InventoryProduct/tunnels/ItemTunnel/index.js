import React from 'react'
import { useMutation, useLazyQuery, useSubscription } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   TunnelHeader,
   Filler,
   ListHeader,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'
import {
   UPDATE_INVENTORY_PRODUCT,
   SUPPLIER_ITEMS,
   SACHET_ITEMS,
} from '../../../../../../graphql'
import { TunnelBody } from '../styled'
import { logger } from '../../../../../../../../shared/utils'
import {
   InlineLoader,
   Tooltip,
} from '../../../../../../../../shared/components'
import {
   CREATE_ITEM,
   CREATE_SACHET_ITEM,
} from '../../../../../../../inventory/graphql/mutations/item'

const address =
   'apps.menu.views.forms.product.inventoryproduct.tunnels.itemtunnel.'

export default function ItemTunnel({ state, close }) {
   const { t } = useTranslation()
   const { productState } = React.useContext(InventoryProductContext)

   const [busy, setBusy] = React.useState(false)
   const [search, setSearch] = React.useState('')
   const [items, setItems] = React.useState([])
   const [list, current, selectOption] = useSingleList(items)

   // Subscription for fetching items
   const { loading: supplierItemsLoading } = useSubscription(SUPPLIER_ITEMS, {
      skip: productState.meta.itemType !== 'inventory',
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
   const { loading: sachetItemsLoading } = useSubscription(SACHET_ITEMS, {
      skip: productState.meta.itemType !== 'sachet',
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

   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      variables: {
         id: state.id,
         set: {
            supplierItemId:
               productState.meta.itemType === 'inventory' ? current.id : null,
            sachetItemId:
               productState.meta.itemType === 'sachet' ? current.id : null,
         },
      },
      onCompleted: () => {
         toast.success('Item added!')
         close(2)
         close(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
         setBusy(false)
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
   const add = () => {
      if (busy) return
      setBusy(true)
      updateProduct()
   }

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
         add()
      }
   }, [current])

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select an item'))}
            close={() => close(2)}
            tooltip={<Tooltip identifier="inventory_product_item_tunnel" />}
         />
         <TunnelBody>
            {sachetItemsLoading || supplierItemsLoading ? (
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
                  <ListHeader type="SSL1" label="Items" />
                  <ListOptions
                     search={search}
                     handleOnCreate={
                        productState.meta.itemType === 'inventory'
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
