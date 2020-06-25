import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
} from '@dailykit/ui'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Spacer, TunnelContainer, TunnelHeader } from '../../../../components'
import { BulkOrderContext } from '../../../../context/bulkOrder'

const address = 'apps.inventory.views.forms.bulkworkorder.tunnels.'

export default function SelectUserTunnel({ close, users }) {
   const { t } = useTranslation()
   const { bulkOrderDispatch } = useContext(BulkOrderContext)

   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(users)

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat('select user'))}
            next={() => {
               bulkOrderDispatch({ type: 'SELECT_USER', payload: current })
               close(1)
            }}
            close={() => close(1)}
            nextAction="Save"
         />

         <Spacer />

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
                  .filter(option => option.name.toLowerCase().includes(search))
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
      </TunnelContainer>
   )
}
