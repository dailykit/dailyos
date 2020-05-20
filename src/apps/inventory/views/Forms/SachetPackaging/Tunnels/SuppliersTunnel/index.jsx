import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
} from '@dailykit/ui'
import React, { useContext } from 'react'

import { useTranslation } from 'react-i18next'
import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'
import { SachetPackagingContext } from '../../../../../context'

const address = 'apps.inventory.views.forms.item.tunnels.suppliers.'

export default function SuppliersTunnel({
   close,
   suppliers,
   open,
   rawSuppliers,
}) {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')
   const { sachetPackagingDispatch } = useContext(SachetPackagingContext)
   const [list, current, selectOption] = useSingleList(suppliers)

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title={t(address.concat('select supplier'))}
               next={() => {
                  const payload = rawSuppliers.find(
                     supplier => supplier.id === current.id
                  )
                  sachetPackagingDispatch({ type: 'SET_SUPPLIER', payload })
                  close(1)
                  open(2)
               }}
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
