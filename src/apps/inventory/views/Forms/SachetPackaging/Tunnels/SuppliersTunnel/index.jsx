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
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
   ErrorState,
   InlineLoader,
} from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { TunnelContainer } from '../../../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../../../constants/errorMessages'
import { NO_SUPPLIERS } from '../../../../../constants/infoMessages'
import {
   SUPPLIERS_SUBSCRIPTION,
   UPDATE_PACKAGING,
} from '../../../../../graphql'

const address = 'apps.inventory.views.forms.item.tunnels.suppliers.'

export default function SuppliersTunnel({ close, state }) {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')
   const [data, setData] = React.useState([])
   const [list, current, selectOption] = useSingleList(data)

   const { loading, error } = useSubscription(SUPPLIERS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const newSuppliers = input.subscriptionData.data.suppliers.map(sup => {
            const firstName = sup.contactPerson?.firstName || ''
            const lastName = firstName ? `${sup.contactPerson?.lastName}` : ''
            const title = firstName + lastName || sup.name

            return {
               id: sup.id,
               supplier: { title: sup.name },
               contact: {
                  title,
                  img: '',
               },
            }
         })

         setData(newSuppliers)
      },
   })

   const [updatePackaging] = useMutation(UPDATE_PACKAGING, {
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
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

   if (error) {
      logger(error)
      return <ErrorState />
   }
   if (loading) return <InlineLoader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select supplier'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            {list.length ? (
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
            ) : (
               <Filler message={NO_SUPPLIERS} />
            )}
         </TunnelContainer>
      </>
   )
}
