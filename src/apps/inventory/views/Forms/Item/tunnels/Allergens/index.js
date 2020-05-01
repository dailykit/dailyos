import React from 'react'

import {
   useMultiList,
   List,
   ListItem,
   ListOptions,
   ListSearch,
   TextButton,
   Tag,
   TagGroup,
} from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

import { ItemContext } from '../../../../../context/item'

import { TunnelHeader, TunnelBody } from '../styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.item.tunnels.allergens.'

export default function AllergensTunnel({ close, allergens }) {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')
   const { state, dispatch } = React.useContext(ItemContext)
   const [list, selected, selectOption] = useMultiList(allergens)

   const save = () => {
      dispatch({
         type: 'ALLERGENS',
         payload: {
            value: selected,
         },
      })
      close()
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={close}>
                  <CloseIcon size={24} />
               </span>
               <span>{t(address.concat('add allergens'))}</span>
            </div>
            <TextButton type="solid" onClick={save}>
               {t(address.concat('save'))}
            </TextButton>
         </TunnelHeader>
         <TunnelBody>
            <List>
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder={t(address.concat("type what you’re looking for")).concat('...')}
               />
               {selected.length > 0 && (
                  <TagGroup style={{ margin: '8px 0' }}>
                     {selected.map(option => (
                        <Tag
                           key={option.id}
                           title={option.title}
                           onClick={() => selectOption('id', option.id)}
                        >
                           {option.title}
                        </Tag>
                     ))}
                  </TagGroup>
               )}
               <ListOptions>
                  {list
                     .filter(option =>
                        option.title.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="MSL1"
                           key={option.id}
                           title={option.title}
                           onClick={() => selectOption('id', option.id)}
                           isActive={selected.find(
                              item => item.id === option.id
                           )}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </React.Fragment>
   )
}
