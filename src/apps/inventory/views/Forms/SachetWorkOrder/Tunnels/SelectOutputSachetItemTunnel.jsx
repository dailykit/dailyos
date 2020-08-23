import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   Loader,
   TunnelHeader,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import React, { useState } from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

import { TunnelContainer } from '../../../../components'

import {
   SACHET_ITEMS_SUBSCRIPTION,
   UPDATE_SACHET_WORK_ORDER,
} from '../../../../graphql'

const address = 'apps.inventory.views.forms.sachetworkorder.tunnels.'

const onError = error => {
   console.log(error)
   toast.error(error.message)
}

export default function SelectOutputSachetItemTunnel({ close, state }) {
   const { t } = useTranslation()

   const [search, setSearch] = useState('')
   const [data, setData] = useState([])

   const [list, current, selectOption] = useSingleList(data)

   const { loading } = useSubscription(SACHET_ITEMS_SUBSCRIPTION, {
      variables: { bulkItemId: state.bulkItem.id },
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.sachetItems
         setData(data)
      },
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
               outputSachetItemId: current.id,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select output bulk sachet'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem
                     type="SSL2"
                     content={{
                        title: `${current.unitSize} ${current.unit}`,
                        description: `onHand: ${current.onHand} |  Par: ${current.parLevel}`,
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
                        option.unitSize
                           .toString()
                           .toLowerCase()
                           .includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="SSL2"
                           key={option.id}
                           isActive={option.id === current.id}
                           onClick={() => selectOption('id', option.id)}
                           content={{
                              title: `${option.unitSize} ${option.unit}`,
                              description: `onHand: ${option.onHand} |  Par: ${option.parLevel}`,
                           }}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelContainer>
      </>
   )
}
