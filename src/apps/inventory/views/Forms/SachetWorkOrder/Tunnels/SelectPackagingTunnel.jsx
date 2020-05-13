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
import { SachetOrderContext } from '../../../../context/sachetOrder'

const address = 'apps.inventory.views.forms.sachetworkorder.tunnels.'

export default function SelectPackagingTunnel({ close, packagings }) {
   const { t } = useTranslation()
   const { sachetOrderDispatch } = useContext(SachetOrderContext)

   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList(packagings)

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat('select packaging'))}
            next={() => {
               sachetOrderDispatch({
                  type: 'SELECT_PACKAGING',
                  payload: current,
               })
               close(6)
            }}
            close={() => close(6)}
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
                     address.concat('type what you’re looking for')
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
