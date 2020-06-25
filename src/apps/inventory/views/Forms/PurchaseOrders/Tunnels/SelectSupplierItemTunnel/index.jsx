import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   Loader,
   TunnelHeader,
} from '@dailykit/ui'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'

import { TunnelContainer } from '../../../../../components'
import { PurchaseOrderContext } from '../../../../../context/purchaseOrder'
import { SUPPLIER_ITEMS_SUBSCRIPTION } from '../../../../../graphql'

const address =
   'apps.inventory.views.forms.purchaseorders.tunnels.selectsupplieritemtunnel.'

export default function AddressTunnel({ close }) {
   const { t } = useTranslation()
   const { purchaseOrderDispatch } = useContext(PurchaseOrderContext)
   const [search, setSearch] = useState('')
   const [data, setData] = useState([])

   const [list, current, selectOption] = useSingleList(data)

   const { loading } = useSubscription(SUPPLIER_ITEMS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.supplierItems
         setData(data)
      },
   })

   const handleNext = () => {
      const bulkItemAsShipped = current.bulkItems.find(
         item => item.id === current.bulkItemAsShippedId
      )
      const payload = { ...current, bulkItemAsShipped, bulkItems: [] }
      purchaseOrderDispatch({
         type: 'ADD_SUPPLIER_ITEM',
         payload,
      })
      close(1)
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select supplier item'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
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
         </TunnelContainer>
      </>
   )
}
