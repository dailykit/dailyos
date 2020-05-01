import React, { useContext, useEffect } from 'react'
import {
   List,
   ListSearch,
   ListOptions,
   ListItem,
   TagGroup,
   Tag,
   useMultiList,
} from '@dailykit/ui'

import { ProductContext } from '../../../../context/product'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'

import { useTranslation } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.tunnels.'

export default function SelectAccompaniments({ close, products }) {
   const { t } = useTranslation()
   const { productState, productDispatch } = useContext(ProductContext)
   const [search, setSearch] = React.useState('')

   useEffect(() => {
      // productState.activeAccomp.products.forEach(recipe => {
      //    selectOption('id', recipe.id)
      // })
   }, [])

   const [list, selected, selectOption] = useMultiList(products)

   return (
      <TunnelContainer>
         <TunnelHeader
            title={`Select Accompaniments for ${productState.itemView.itemName}`}
            close={() => {
               close(7)
            }}
            next={() => {
               productDispatch({
                  type: 'ADD_ACCOMPANIMENTS',
                  payload: selected,
               })
               close(7)
            }}
            nextAction="Save"
         />
         <Spacer />

         <List>
            <ListSearch
               onChange={value => setSearch(value)}
               placeholder={t(address.concat("type what you’re looking for..."))}
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
                  .filter(option => option.title.toLowerCase().includes(search))
                  .map(option => (
                     <ListItem
                        type="MSL2"
                        key={option.id}
                        content={{
                           title: option.title,
                        }}
                        onClick={() => selectOption('id', option.id)}
                        isActive={selected.find(item => item.id === option.id)}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
