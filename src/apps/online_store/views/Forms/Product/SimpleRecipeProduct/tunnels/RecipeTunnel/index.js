import React from 'react'

import {
   TextButton,
   useSingleList,
   List,
   ListItem,
   ListOptions,
   ListSearch,
} from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'
import { TunnelHeader, TunnelBody } from '../styled'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'

export default function RecipeTunnel({ close, recipes }) {
   const { state, dispatch } = React.useContext(SimpleProductContext)

   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(recipes)

   const selectRecipe = recipe => {
      selectOption('id', recipe.id)
      dispatch({
         type: 'RECIPE',
         payload: { value: recipe },
      })
      dispatch({
         type: 'OPTIONS',
         payload: { value: recipe.simpleRecipeYields },
      })
      close(2)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(2)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <span>Select a Recipe</span>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.title} />
               ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder="type what you’re looking for..."
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
                           onClick={() => selectRecipe(option)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </React.Fragment>
   )
}
