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
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { TunnelContainer } from '../../../../../components'
import {
   SUPPLIERS_SUBSCRIPTION,
   UPDATE_SUPPLIER_ITEM,
} from '../../../../../graphql'

const address = 'apps.inventory.views.forms.item.tunnels.suppliers.'

export default function SupplierTunnel({ close, formState }) {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')
   const [data, setData] = React.useState([])
   const [list, current, selectOption] = useSingleList(data)

   const { loading: supplierLoading } = useSubscription(
      SUPPLIERS_SUBSCRIPTION,
      {
         onSubscriptionData: input => {
            const newSuppliers = input.subscriptionData.data.suppliers.map(
               sup => {
                  const title = sup.contactPerson?.firstName || ''
                  const lastName = title ? `${sup.contactPerson?.lastName}` : ''
                  return {
                     id: sup.id,
                     supplier: { title: sup.name },
                     contact: {
                        title: title + lastName,
                        img: '',
                     },
                  }
               }
            )

            setData(newSuppliers)
         },
      }
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
         <TunnelHeader
            title={t(address.concat('select supplier'))}
            close={() => close(1)}
            right={{ action: handleNext, title: 'Save' }}
         />
         <TunnelContainer>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem
                     type="SSL22"
                     content={{
                        supplier: current.supplier,
                        contact: current.contact,
                     }}
                  />
               ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder="type what you’re looking for..."
                  />
               )}
               <ListOptions>
                  {list
                     .filter(option =>
                        option.supplier.title.toLowerCase().includes(search)
                     )
                     .map(option => {
                        return (
                           <ListItem
                              type="SSL22"
                              key={option.id}
                              isActive={option.id === current.id}
                              onClick={() => selectOption('id', option.id)}
                              content={{
                                 supplier: option.supplier,
                                 contact:
                                    option.contact && option.contact.title
                                       ? option.contact
                                       : {
                                            title: 'N/A',
                                            img: '',
                                         },
                              }}
                           />
                        )
                     })}
               </ListOptions>
            </List>
         </TunnelContainer>
      </>
   )
}
