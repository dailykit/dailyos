import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Loader,
   TunnelHeader,
   useSingleList,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils/errorLog'

import { TunnelContainer } from '../../../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../../../constants/errorMessages'
import {
   BULK_ITEM_AS_SHIPPED_ADDED,
   BULK_ITEM_CREATED,
} from '../../../../../constants/successMessages'
import {
   CREATE_BULK_ITEM,
   MASTER_PROCESSINGS_SUBSCRIPTION,
   UPDATE_SUPPLIER_ITEM,
} from '../../../../../graphql'
import ConfigTunnel from '../Config'

const address = 'apps.inventory.views.forms.item.tunnels.processing.'

export default function ProcessingTunnel({ close, formState }) {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')
   const [data, setData] = React.useState([])
   const [list, current, selectOption] = useSingleList(data)

   const [configTunnel, openConfigTunnel, closeConfigTunnel] = useTunnel(1)

   const [updateSupplierItem] = useMutation(UPDATE_SUPPLIER_ITEM, {
      onCompleted: () => {
         toast.info(BULK_ITEM_CREATED)
         toast.success(BULK_ITEM_AS_SHIPPED_ADDED)
         openConfigTunnel(1)
      },
      onError: error => {
         console.log(error)
         toast.error(error.message)
         close(1)
      },
   })

   const [
      createBulkItem,
      {
         loading,
         data: { createBulkItem: { returning: bulkItems = [] } = {} } = {},
      },
   ] = useMutation(CREATE_BULK_ITEM, {
      onCompleted: data => {
         if (formState.bulkItemAsShippedId) {
            toast.info(BULK_ITEM_CREATED)
            openConfigTunnel(1)
         } else
            updateSupplierItem({
               variables: {
                  id: formState.id,
                  object: {
                     bulkItemAsShippedId: data.createBulkItem.returning[0].id,
                  },
               },
            })
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
         close(1)
      },
   })

   const { loading: processingsLoading } = useSubscription(
      MASTER_PROCESSINGS_SUBSCRIPTION,
      {
         variables: { supplierItemId: formState.id },
         onSubscriptionData: input => {
            const newProcessings =
               input.subscriptionData.data.masterProcessingsAggregate.nodes

            setData(newProcessings)
         },
      }
   )

   const handleNext = () => {
      createBulkItem({
         variables: {
            processingName: current.title,
            itemId: formState.id,
            unit: formState.unit, // string
         },
      })
   }

   if (processingsLoading || loading) return <Loader />

   return (
      <>
         <Tunnels tunnels={configTunnel}>
            <Tunnel style={{ overflowY: 'auto' }} layer={1} size="lg">
               <ConfigTunnel
                  close={closeConfigTunnel}
                  open={openConfigTunnel}
                  fromTunnel
                  closeParent={() => close(1)}
                  id={bulkItems[0]?.id}
               />
            </Tunnel>
         </Tunnels>
         <TunnelHeader
            title={t(address.concat('select processing as item shipped'))}
            close={() => close(1)}
            right={{
               title: 'Next',
               action: handleNext,
            }}
         />
         <TunnelContainer>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.title} />
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
                        option.title.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="SSL1"
                           key={option.id}
                           title={option.title}
                           isActive={option.id === current.id}
                           onClick={() => selectOption('id', option.id)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelContainer>
      </>
   )
}
