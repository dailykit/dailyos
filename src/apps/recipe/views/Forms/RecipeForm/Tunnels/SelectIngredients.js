import React, { useState, useContext, useEffect } from 'react'
import {
   List,
   ListSearch,
   ListOptions,
   ListItem,
   useMultiList,
   TagGroup,
   Tag
} from '@dailykit/ui'

import { Context as RecipeContext } from '../../../../store/recipe/index'

import { TunnelContainer } from '../styled'

import { TunnelHeader, Spacer } from '../../../../components/index'
import { INGREDIENTS } from '../../../../graphql'

export default function SelectIngredients({ close, next, ings }) {
   const { recipeState, recipeDispatch } = useContext(RecipeContext)
   const [search, setSearch] = useState('')
   const [list, selected, selectOption] = useMultiList(ings)

   useEffect(() => {
      for (const ingredient of recipeState.ingredients) {
         selectOption('id', ingredient.id)
      }
   }, [])

   return (
      <TunnelContainer>
         <TunnelHeader
            title='Add Ingredients'
            close={() => close(2)}
            next={() => {
               recipeDispatch({ type: 'ADD_INGREDIENTS', payload: selected })
               recipeDispatch({
                  type: 'ADD_INGREDIENTS_FOR_PUSHABLE',
                  payload: selected
               })
               next(2)
            }}
            nextAction='Done'
         />
         <Spacer />

         <List>
            <ListSearch
               onChange={value => setSearch(value)}
               placeholder='type what you’re looking for...'
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
                        type='MSL1'
                        key={option.id}
                        title={option.title}
                        onClick={() => {
                           selectOption('id', option.id)
                        }}
                        isActive={selected.find(item => item.id === option.id)}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
