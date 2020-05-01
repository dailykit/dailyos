import React, { useContext, useEffect } from 'react'
import {
   List,
   ListSearch,
   ListOptions,
   ListItem,
   TagGroup,
   Tag,
   useMultiList,
   ComboButton,
} from '@dailykit/ui'

import { ProductContext } from '../../../../context/product'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'
import { Content } from '../styled'
import AddIcon from '../../../../assets/icons/Add'

import { useTranslation } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.tunnels.'

export default function AccompanimentType({ close, accompanimentTypes }) {
   const { t } = useTranslation()
   const { productState, productDispatch } = useContext(ProductContext)
   const [search, setSearch] = React.useState('')

   useEffect(() => {
      productState.currentRecipe.accompaniments.forEach(accomp => {
         selectOption('id', accomp.id)
      })
   }, [])

   console.log(accompanimentTypes)

   const [list, selected, selectOption] = useMultiList(accompanimentTypes)

   return (
      <TunnelContainer>
         <TunnelHeader
            title={`Select Accompaniment Types for: ${productState.currentRecipe.title}`}
            close={() => {
               close(6)
            }}
            next={() => {
               productDispatch({
                  type: 'ADD_ACCOMPANIMENT_TYPES',
                  payload: selected,
               })
               close(6)
            }}
            nextAction="Save"
         />
         <Spacer />

         <List>
            <Content>
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder={t(address.concat("type what you’re looking for..."))}
               />
               <ComboButton type="ghost" onClick={() => { }}>
                  <AddIcon />
                  {t(address.concat('new'))}
               </ComboButton>
            </Content>
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
                  .filter(option => option.title.toLowerCase().includes(search))
                  .map(option => (
                     <ListItem
                        type="MSL1"
                        key={option.id}
                        title={option.title}
                        onClick={() => selectOption('id', option.id)}
                        isActive={selected.find(item => item.id === option.id)}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
