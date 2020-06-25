import React from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   TunnelHeader,
   Loader,
} from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { RecipeContext } from '../../../../../context/recipee'
import { TunnelBody } from '../styled'
import { INGREDIENTS } from '../../../../../graphql'

const IngredientsTunnel = ({ closeTunnel, openTunnel }) => {
   const { recipeDispatch } = React.useContext(RecipeContext)

   // State for search input
   const [search, setSearch] = React.useState('')
   const [ingredients, setIngredients] = React.useState([])
   const [list, current, selectOption] = useSingleList(ingredients)

   // Query
   const { loading } = useQuery(INGREDIENTS, {
      variables: {
         where: {
            isPublished: { _eq: true },
         },
      },
      onCompleted: data => {
         const updatedIngredients = data.ingredients.filter(
            ing => ing.isValid.status
         )
         setIngredients(updatedIngredients)
      },
      onError: error => {
         console.log(error)
         toast.error('Error: Cannot fetch Ingredients!')
      },
      fetchPolicy: 'cache-and-network',
   })

   const select = option => {
      selectOption('id', option.id)
      recipeDispatch({
         type: 'ADD_INGREDIENT',
         payload: option,
      })
      openTunnel(2)
   }

   return (
      <>
         <TunnelHeader title="Select Ingredient" close={() => closeTunnel(1)} />
         <TunnelBody>
            {loading ? (
               <Loader />
            ) : (
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
            )}
         </TunnelBody>
      </>
   )
}

export default IngredientsTunnel
