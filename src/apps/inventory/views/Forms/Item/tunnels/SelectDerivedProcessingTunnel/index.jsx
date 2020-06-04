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
import { ItemContext } from '../../../../../context/item'

const address =
   'apps.inventory.views.forms.item.tunnels.selectderivedprocessingtunnel.'

export default function SelectDerivedProcessingTunnel({
   close,
   next,
   processings,
}) {
   const { t } = useTranslation()
   const { state, dispatch } = useContext(ItemContext)
   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList(processings)

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat('select processing'))}
            next={() => {
               dispatch({ type: 'ADD_DERIVED_PROCESSING', payload: current })
               dispatch({
                  type: 'ADD_CONFIGURABLE_PROCESSING',
                  payload: current,
               })
               close(6)
               next(7)
            }}
            close={() => close(6)}
            nextAction="Save"
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
                  .filter(option => option.title.toLowerCase().includes(search))
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
   )
}
