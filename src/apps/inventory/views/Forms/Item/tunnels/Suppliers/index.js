import React from 'react'
import { toast } from 'react-toastify'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   Loader,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'
import {
   UPDATE_SUPPLIER_ITEM,
   SUPPLIERS_SUBSCRIPTION,
} from '../../../../../graphql'

const address = 'apps.inventory.views.forms.item.tunnels.suppliers.'

export default function SupplierTunnel({ close, formState }) {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')

   const { loading: supplierLoading, data: supplierData } = useSubscription(
      SUPPLIERS_SUBSCRIPTION
   )

   const [list, current, selectOption] = useSingleList(
      supplierData?.suppliers?.map(supplier => ({
         id: supplier.id,
         title: supplier.name,
         description: `${supplier.contactPerson?.firstName} ${supplier.contactPerson?.lastName} (${supplier.contactPerson?.countryCode} ${supplier.contactPerson?.phoneNumber})`,
      }))
   )
   const [updateSupplierItem, { loading }] = useMutation(UPDATE_SUPPLIER_ITEM, {
      onCompleted: () => {
         // toast and close
         toast.info('Supplier Information Added')
         close(1)
      },
      onError: error => {
         // toast and log error
         console.log(error)
         toast.info('Error adding the supplier. Please try again')
         close(1)
      },
   })

   const handleNext = () => {
      const { id: supplierId } = current
      updateSupplierItem({
         variables: {
            id: formState.id,
            object: {
               supplierId,
            },
         },
      })
   }

   if (loading || supplierLoading) return <Loader />

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title={t(address.concat('select supplier'))}
               next={handleNext}
               close={() => close(1)}
               nextAction="Save"
            />

            <Spacer />

            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem
                     type="SSL2"
                     content={{
                        title: current.title,
                        description: current.description,
                     }}
                  />
               ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder={t(
                        address.concat('type what you’re looking for')
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
                           type="SSL2"
                           key={option.id}
                           isActive={option.id === current.id}
                           onClick={() => selectOption('id', option.id)}
                           content={{
                              title: option.title,
                              description: option.description,
                           }}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelContainer>
      </>
   )
}
