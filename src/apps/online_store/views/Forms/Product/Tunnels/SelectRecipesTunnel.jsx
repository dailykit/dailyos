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

export default function SelectRecipesTunnel({ close, recipes }) {
   const { productState, productDispatch } = useContext(ProductContext)
   const [search, setSearch] = React.useState('')

   useEffect(() => {
      productState.itemView.recipes.forEach(recipe => {
         selectOption('id', recipe.recipe)
      })
   }, [])

   const [list, selected, selectOption] = useMultiList(recipes)

   return (
      <TunnelContainer>
         <TunnelHeader
            title={`Select Recipes for ${productState.itemView.label}`}
            close={() => {
               close(2)
            }}
            next={() => {
               productDispatch({ type: 'SELECT_RECIPES', payload: selected })
               close(2)
            }}
            nextAction="Save"
         />
         <Spacer />
         <List>
            <ListSearch
               onChange={value => setSearch(value)}
               placeholder="type what you’re looking for..."
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
