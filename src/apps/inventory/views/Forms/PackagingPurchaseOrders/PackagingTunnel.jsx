import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Filler,
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Loader,
   TunnelHeader,
   useSingleList,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { logger } from '../../../../../shared/utils/errorLog'
import { TunnelContainer } from '../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../constants/errorMessages'
import { NO_PACKAGINGS } from '../../../constants/infoMessages'
import {
   PURCHASE_ORDERS_PACKAGING_SUBSCRIPTION,
   UPDATE_PURCHASE_ORDER_ITEM,
} from '../../../graphql'

function onError(error) {
   logger(error)
   toast.error(GENERAL_ERROR_MESSAGE)
}

export default function AddressTunnel({ close }) {
   const [search, setSearch] = useState('')
   const [data, setData] = useState([])
   const { id } = useParams()

   const [list, current, selectOption] = useSingleList(data)

   const { loading, error } = useSubscription(
      PURCHASE_ORDERS_PACKAGING_SUBSCRIPTION,
      {
         onSubscriptionData: input => {
            const data = input.subscriptionData.data.packagings
            setData(data)
         },
      }
   )

   const [updatePurchaseOrderItem] = useMutation(UPDATE_PURCHASE_ORDER_ITEM, {
      onError,
      onCompleted: () => {
         toast.success('Packaging added.')
         close(1)
      },
   })

   const handleNext = () => {
      updatePurchaseOrderItem({
         variables: {
            id,
            set: { packagingId: current.id, supplierId: current.supplier?.id },
         },
      })
   }

   if (error) {
      onError(error)
      return null
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title="Select Packaging"
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            {list.length ? (
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
            ) : (
               <Filler message={NO_PACKAGINGS} />
            )}
         </TunnelContainer>
      </>
   )
}
