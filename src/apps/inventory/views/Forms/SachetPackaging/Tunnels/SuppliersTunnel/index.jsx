import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
} from '@dailykit/ui'
import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { useTranslation } from 'react-i18next'
import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'
import { UPDATE_PACKAGING } from '../../../../../graphql'

const address = 'apps.inventory.views.forms.item.tunnels.suppliers.'

export default function SuppliersTunnel({ close, suppliers, state }) {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(suppliers)

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

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title={t(address.concat('select supplier'))}
               next={handleNext}
               close={() => close(1)}
               nextAction="Next"
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
