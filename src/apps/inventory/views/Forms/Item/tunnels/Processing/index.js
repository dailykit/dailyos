import React from 'react'

import {
   useSingleList,
   List,
   ListItem,
   ListOptions,
   ListSearch,
} from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

import { ItemContext } from '../../../../../context/item'

import { TunnelHeader, TunnelBody } from '../styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.item.tunnels.processing.'

export default function ProcessingTunnel({ close, next, processings }) {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')
   const { state, dispatch } = React.useContext(ItemContext)
   const [list, current, selectOption] = useSingleList(processings)

   const selectProcessing = processing => {
      dispatch({
         type: 'PROCESSING',
         payload: { value: processing },
      })
      dispatch({
         type: 'META',
         payload: { name: 'shipped', value: true },
      })
      close()
      next()
   }

   return (
      <>
         <TunnelHeader>
            <div>
               <span onClick={close}>
                  <CloseIcon size={24} />
               </span>
               <span>{t(address.concat('select processing as item shipped'))}</span>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.title} />
               ) : (
                     <ListSearch
                        onChange={value => setSearch(value)}
                        placeholder={t(address.concat("type what you’re looking for").concat('...'))}
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
                           onClick={() => selectProcessing(option)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </>
   )
}
