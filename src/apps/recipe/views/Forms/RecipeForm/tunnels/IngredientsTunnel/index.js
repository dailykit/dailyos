import React from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   TunnelHeader,
} from '@dailykit/ui'
import { RecipeContext } from '../../../../../context/recipee'
import { TunnelBody } from '../styled'

const IngredientsTunnel = ({ closeTunnel, openTunnel, ingredients }) => {
   const { recipeDispatch } = React.useContext(RecipeContext)

   // State for search input
   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(ingredients)

   const select = option => {
      selectOption('id', option.id)
      recipeDispatch({
         type: 'ADD_INGREDIENT',
         payload: option,
      })
      openTunnel(5)
   }

   return (
      <>
         <TunnelHeader title="Select Ingredient" close={() => closeTunnel(4)} />
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
                           onClick={() => select(option)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </>
   )
}

export default IngredientsTunnel
