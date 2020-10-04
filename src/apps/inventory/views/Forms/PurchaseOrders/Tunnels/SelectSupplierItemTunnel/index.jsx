import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   Loader,
   TunnelHeader,
   Flex,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { useTranslation } from 'react-i18next'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import {
   SUPPLIER_ITEMS_SUBSCRIPTION,
   UPDATE_PURCHASE_ORDER_ITEM,
} from '../../../../../graphql'

const address =
   'apps.inventory.views.forms.purchaseorders.tunnels.selectsupplieritemtunnel.'

export default function AddressTunnel({ close, state }) {
   const { t } = useTranslation()
   const [search, setSearch] = useState('')
   const [data, setData] = useState([])

   const [list, current, selectOption] = useSingleList(data)

   const { loading } = useSubscription(SUPPLIER_ITEMS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.supplierItems
         setData(data)
      },
   })

   const [updatePurchaseOrder] = useMutation(UPDATE_PURCHASE_ORDER_ITEM, {
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
      onCompleted: () => {
         toast.success('Supplier Item added!')
         close(1)
      },
   })

   const handleSave = () => {
      updatePurchaseOrder({
         variables: {
            id: state.id,
            set: {
               supplierItemId: current.id,
               bulkItemId: current.bulkItemAsShippedId,
               supplierId: current.supplier?.id,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select supplier item'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleSave }}
         />
         <Flex padding="0 16px">
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.name} />
               ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder="type what you’re looking for..."
                  />
               )}
               <ListOptions>
                  {list
                     .filter(option =>
                        option.name.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="SSL1"
                           key={option.id}
                           title={option.name}
                           isActive={option.id === current.id}
                           onClick={() => selectOption('id', option.id)}
                        />
                     ))}
               </ListOptions>
            </List>
            <br />
            <br />
         </Flex>
      </>
   )
}
