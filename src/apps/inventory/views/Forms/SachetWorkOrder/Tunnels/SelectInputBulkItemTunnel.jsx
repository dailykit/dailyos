import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   TunnelHeader,
   Loader,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import {
   GET_BULK_ITEMS_SUBSCRIPTION,
   UPDATE_SACHET_WORK_ORDER,
} from '../../../../graphql'
import { TunnelContainer } from '../../../../components'

const address = 'apps.inventory.views.forms.sachetworkorder.tunnels.'

const onError = error => {
   console.log(error)
   toast.error(error.message)
}

export default function SelectInputBulkItemTunnel({ close, state }) {
   const { t } = useTranslation()
   const [search, setSearch] = useState('')
   const [data, setData] = useState([])

   const [list, current, selectOption] = useSingleList(data)

   const { loading } = useSubscription(GET_BULK_ITEMS_SUBSCRIPTION, {
      variables: {
         supplierItemId: state.supplierItem.id,
      },
      onSubscriptionData: resp => {
         const data = resp.subscriptionData.data?.bulkItems
         setData(data)
      },
      onError,
   })

   const [updateSachetWorkOrder] = useMutation(UPDATE_SACHET_WORK_ORDER, {
      onCompleted: () => {
         toast.info('Work Order updated successfully!')
         close(1)
      },
      onError,
   })

   const handleNext = () => {
      if (!current || !current.id) return toast.error('Select an item first!')
      updateSachetWorkOrder({
         variables: {
            id: state.id,
            set: {
               inputBulkItemId: current.id,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select input bulk item processing'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem
                     type="SSL2"
                     content={{
                        title: current.processingName,
                        description: `Shelf Life: ${current.shelfLife} On Hand: ${current.onHand}`,
                     }}
                  />
               ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder={t(
                        address.concat("type what you're looking for")
                     )}
                  />
               )}
               <ListOptions>
                  {list
                     .filter(option =>
                        option.processingName.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="SSL2"
                           key={option.id}
                           isActive={option.id === current.id}
                           onClick={() => selectOption('id', option.id)}
                           content={{
                              title: option.processingName,
                              description: `Shelf Life: ${option.shelfLife} On Hand: ${option.onHand}`,
                           }}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelContainer>
      </>
   )
}
