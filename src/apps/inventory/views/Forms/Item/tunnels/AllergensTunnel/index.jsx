import { useSubscription } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Loader,
   Tag,
   TagGroup,
   useMultiList,
   TunnelHeader,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ItemContext } from '../../../../../context/item'
import { MASTER_ALLERGENS_SUBSCRIPTION } from '../../../../../graphql'
import { TunnelBody } from '../styled'

const address = 'apps.inventory.views.forms.item.tunnels.allergenstunnel.'

export default function AllergensTunnelForDerivedProcessing({ close }) {
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
         type: 'ADD_ALLERGENS_FOR_DERIVED_PROCESSING',
         payload: selected,
      })
      close()
   }

   if (allergensLoading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('add allergens'))}
            close={close}
            right={{ title: t(address.concat('save')), action: save }}
         />

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
