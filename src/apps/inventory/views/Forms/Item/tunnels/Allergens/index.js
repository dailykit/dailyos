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
   Loader,
} from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

import { CloseIcon } from '../../../../../assets/icons'

import { ItemContext } from '../../../../../context/item'

import { TunnelHeader, TunnelBody } from '../styled'
import { MASTER_ALLERGENS_SUBSCRIPTION } from '../../../../../graphql'

const address = 'apps.inventory.views.forms.item.tunnels.allergens.'

export default function AllergensTunnel({ close }) {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')
   const { dispatch } = React.useContext(ItemContext)

   const {
      loading: allergensLoading,
      data: { masterAllergens = [] } = {},
   } = useSubscription(MASTER_ALLERGENS_SUBSCRIPTION)

   const [list, selected, selectOption] = useMultiList(masterAllergens)

   const save = () => {
      dispatch({
         type: 'ALLERGENS',
         payload: {
            value: selected,
         },
      })
      close()
   }

   if (allergensLoading) return <Loader />

   return (
      <>
         <TunnelHeader>
            <div>
               <span onClick={() => close()}>
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
                  placeholder={t(
                     address.concat("type what you're looking for")
                  )}
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
      </>
   )
}
