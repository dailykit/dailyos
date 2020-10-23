import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Filler,
   List,
   ListItem,
   ListOptions,
   ListSearch,
   TunnelHeader,
   useSingleList,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { InlineLoader } from '../../../../../../shared/components/InlineLoader'
import { logger } from '../../../../../../shared/utils'
import { TunnelContainer } from '../../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../../constants/errorMessages'
import { NO_BULK_ITEMS } from '../../../../constants/infoMessages'
import { OUTPUT_BULK_ITEM_ADDED } from '../../../../constants/successMessages'
import {
   GET_BULK_ITEMS_SUBSCRIPTION,
   UPDATE_BULK_WORK_ORDER,
} from '../../../../graphql'

const address = 'apps.inventory.views.forms.bulkworkorder.tunnels.'

export default function SelectOutputBulkItem({ close, state }) {
   const { t } = useTranslation()
   const [search, setSearch] = useState('')
   const [bulkItems, setBulkItems] = useState([])
   const [list, current, selectOption] = useSingleList(bulkItems)

   const { loading, error } = useSubscription(GET_BULK_ITEMS_SUBSCRIPTION, {
      variables: {
         supplierItemId: state.supplierItem.id,
      },
      onSubscriptionData: data => {
         const { bulkItems } = data.subscriptionData.data

         const refinedItems = bulkItems.filter(
            item => item.id !== state.inputBulkItem.id
         )

         setBulkItems(refinedItems)
      },
   })

   const [updateBulkWorkOrder] = useMutation(UPDATE_BULK_WORK_ORDER, {
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
      },
      onCompleted: () => {
         toast.success(OUTPUT_BULK_ITEM_ADDED)
         close(1)
      },
   })

   const handleSave = () => {
      updateBulkWorkOrder({
         variables: {
            id: state.id,
            object: {
               outputBulkItemId: current.id,
            },
         },
      })
   }

   if (error) {
      logger(error)
      return toast.error(GENERAL_ERROR_MESSAGE)
   }

   if (loading) return <InlineLoader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select output bulk item processing'))}
            right={{ title: 'Save', action: handleSave }}
            close={() => close(1)}
         />
         <TunnelContainer>
            {list.length ? (
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
            ) : (
               <Filler message={NO_BULK_ITEMS} />
            )}
         </TunnelContainer>
      </>
   )
}
