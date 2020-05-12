import React from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Text,
   useSingleList,
} from '@dailykit/ui'
import { CloseIcon } from '../../../../../assets/icons'
import { RecipeContext } from '../../../../../context/recipee'
import { TunnelBody, TunnelHeader } from '../styled'

const IngredientsTunnel = ({ closeTunnel, openTunnel, ingredients }) => {
   const { recipeDispatch } = React.useContext(RecipeContext)

   // State for search input
   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(
      ingredients.map(ing => ({ ...ing, title: ing.name }))
   )

   //Handlers
   const select = option => {
      selectOption('id', option.id)
      recipeDispatch({
         type: 'ADD_INGREDIENT',
         payload: option,
      })
      openTunnel(5)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(4)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Select Ingredient</Text>
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
                           onClick={() => select(option)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </React.Fragment>
   )
}

export default IngredientsTunnel
