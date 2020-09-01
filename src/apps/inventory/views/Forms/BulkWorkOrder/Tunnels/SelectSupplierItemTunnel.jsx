import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Loader,
   useSingleList,
   TunnelHeader,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import { TunnelContainer } from '../../../../components'
import {
   SUPPLIER_ITEMS_SUBSCRIPTION,
   UPDATE_BULK_WORK_ORDER,
} from '../../../../graphql'

const address = 'apps.inventory.views.forms.bulkworkorder.tunnels.'

export default function SelectSupplierTunnel({ close, state }) {
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

   const [updateBulkWorkOrder] = useMutation(UPDATE_BULK_WORK_ORDER, {
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
      if (!current || !current.id) return toast.error('Please select an item.')
      // save supplierItem
      updateBulkWorkOrder({
         variables: {
            id: state.id,
            object: {
               supplierItemId: current.id,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select supplier item'))}
            right={{ title: 'Save', action: handleSave }}
            close={() => close(1)}
         />
         <TunnelContainer>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.name} />
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
