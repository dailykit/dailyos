import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   Loader,
   TunnelHeader,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { Spacer, TunnelContainer } from '../../../../components'
import {
   GET_BULK_ITEMS_SUBSCRIPTION,
   UPDATE_BULK_WORK_ORDER,
} from '../../../../graphql'

const address = 'apps.inventory.views.forms.bulkworkorder.tunnels.'

export default function SelectInputBulkItemTunnel({ close, state }) {
   const { t } = useTranslation()
   const [search, setSearch] = useState('')
   const [bulkItems, setBulkItems] = useState([])
   const [list, current, selectOption] = useSingleList(bulkItems)

   const { loading } = useSubscription(GET_BULK_ITEMS_SUBSCRIPTION, {
      variables: {
         supplierItemId: state.supplierItem.id,
      },
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
      onSubscriptionData: data => {
         const { bulkItems } = data.subscriptionData.data

         setBulkItems(bulkItems)
      },
   })

   const [updateBulkWorkOrder] = useMutation(UPDATE_BULK_WORK_ORDER, {
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
      onCompleted: () => {
         toast.success('Input Bulk Item added!')
         close(1)
      },
   })

   const handleSave = () => {
      if (!current || !current.id) return toast.error('Please select an item.')

      updateBulkWorkOrder({
         variables: {
            id: state.id,
            object: {
               inputBulkItemId: current.id,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat('select input bulk item processing'))}
            close={() => close(1)}
            right={{ action: handleSave, title: 'Save' }}
         />

         <Spacer />

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
                           description: `Shelf Life: ${
                              option.shelfLife?.value || 'N/A'
                           } ${option.shelfLife?.unit || ''} On Hand: ${
                              option.onHand
                           }`,
                        }}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
