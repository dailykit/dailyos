import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
} from '@dailykit/ui'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Spacer, TunnelContainer, TunnelHeader } from '../../../../components'
import { SachetOrderContext } from '../../../../context/sachetOrder'

const address = 'apps.inventory.views.forms.sachetworkorder.tunnels.'

export default function SelectInputBulkItemTunnel({ close, bulkItems }) {
   const { t } = useTranslation()
   const { sachetOrderDispatch } = useContext(SachetOrderContext)
   const [search, setSearch] = useState('')

   const [list, current, selectOption] = useSingleList(bulkItems)
   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat('select input bulk item processing'))}
            next={() => {
               sachetOrderDispatch({ type: 'ADD_INPUT_ITEM', payload: current })
               close(1)
            }}
            close={() => close(1)}
            nextAction="Save"
         />

         <Spacer />

         <List>
            {Object.keys(current).length > 0 ? (
               <ListItem
                  type="SSL2"
                  content={{
                     title: current.processingName,
                     description: `Shelf Life: ${current.shelfLife} On Hand: ${current.onHand}`,
                  }}
               />
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
                     option.processingName.toLowerCase().includes(search)
                  )
                  .map(option => (
                     <ListItem
                        type="SSL2"
                        key={option.id}
                        isActive={option.id === current.id}
                        onClick={() => selectOption('id', option.id)}
                        content={{
                           title: option.processingName,
                           description: `Shelf Life: ${option.shelfLife} On Hand: ${option.onHand}`,
                        }}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
