import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
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
import { TunnelContainer } from '../../../components'
import {
   PURCHASE_ORDERS_PACKAGING_SUBSCRIPTION,
   UPDATE_PURCHASE_ORDER_ITEM,
} from '../../../graphql'

function onError(error) {
   console.log(error)
   toast.error(error.message)
}

export default function AddressTunnel({ close }) {
   const [search, setSearch] = useState('')
   const [data, setData] = useState([])
   const { id } = useParams()

   const [list, current, selectOption] = useSingleList(data)

   const { loading } = useSubscription(PURCHASE_ORDERS_PACKAGING_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.packagings
         setData(data)
      },
      onError,
   })

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

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title="Select Packaging"
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
