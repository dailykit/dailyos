import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   Loader,
   TunnelHeader,
} from '@dailykit/ui'
import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { useTranslation } from 'react-i18next'
import { TunnelContainer } from '../../../../../components'
import {
   UPDATE_PACKAGING,
   SUPPLIERS_SUBSCRIPTION,
} from '../../../../../graphql'

const address = 'apps.inventory.views.forms.item.tunnels.suppliers.'

export default function SuppliersTunnel({ close, state }) {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')
   const [data, setData] = React.useState([])
   const [list, current, selectOption] = useSingleList(data)

   const { loading } = useSubscription(SUPPLIERS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const newSuppliers = input.subscriptionData.data.suppliers.map(sup => {
            return {
               id: sup.id,
               supplier: { title: sup.name },
               contact: {
                  title: `${sup.contactPerson?.firstName || ''} ${
                     sup.contactPerson?.lastName || ''
                  }`,
                  img: '',
               },
            }
         })

         setData(newSuppliers)
      },
   })

   const [updatePackaging] = useMutation(UPDATE_PACKAGING, {
      onError: error => {
         console.log(error)
         toast.error('Error! Please try again')
      },
      onCompleted: () => {
         close(1)
         toast.success('Supplier Added!')
      },
   })

   const handleNext = () => {
      updatePackaging({
         variables: {
            id: state.id,
            object: {
               supplierId: current.id,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select supplier'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
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
                     .map(option => (
                        <ListItem
                           type="SSL22"
                           key={option.id}
                           isActive={option.id === current.id}
                           onClick={() => selectOption('id', option.id)}
                           content={{
                              supplier: option.supplier,
                              contact: option.contact,
                           }}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelContainer>
      </>
   )
}
