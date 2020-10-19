import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Loader,
   useSingleList,
   TunnelHeader,
   Filler,
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
import { logger } from '../../../../../../shared/utils'
import { GENERAL_ERROR_MESSAGE } from '../../../../constants/errorMessages'
import { NO_SUPPLIER_ITEMS } from '../../../../constants/infoMessages'

const address = 'apps.inventory.views.forms.bulkworkorder.tunnels.'

export default function SelectSupplierTunnel({ close, state }) {
   const { t } = useTranslation()

   const [search, setSearch] = useState('')
   const [data, setData] = useState([])

   const [list, current, selectOption] = useSingleList(data)

   const { loading, error } = useSubscription(SUPPLIER_ITEMS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.supplierItems
         setData(data)
      },
   })

   const [updateBulkWorkOrder] = useMutation(UPDATE_BULK_WORK_ORDER, {
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
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

   if (error) {
      logger(error)
      return toast.error(GENERAL_ERROR_MESSAGE)
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
            {list.length ? (
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
            ) : (
               <Filler message={NO_SUPPLIER_ITEMS} />
            )}
         </TunnelContainer>
      </>
   )
}
