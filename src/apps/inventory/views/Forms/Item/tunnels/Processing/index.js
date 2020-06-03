import React, { useContext } from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'

import { ItemContext } from '../../../../../context/item'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'

const address = 'apps.inventory.views.forms.item.tunnels.processing.'

export default function SupplierTunnel({
   close,
   processings,
   open,
   rawProcessings,
}) {
   const { t } = useTranslation()
   const { state, dispatch } = useContext(ItemContext)
   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList(processings)

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title={t(address.concat('select processing as item shipped'))}
               next={() => {
                  const payload = rawProcessings.find(
                     processing => processing.id === current.id
                  )
                  dispatch({ type: 'PROCESSING', payload })
                  close(3)
                  open(4)
               }}
               close={() => close(3)}
               nextAction="Next"
            />

            <Spacer />

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
