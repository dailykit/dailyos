import React from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   TunnelHeader,
   Filler,
} from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { RecipeContext } from '../../../../../context/recipe'
import { TunnelBody } from '../styled'
import { INGREDIENTS } from '../../../../../graphql'
import { InlineLoader } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'

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
            isArchived: { _eq: false },
         },
      },
      onCompleted: data => {
         const updatedIngredients = data.ingredients.filter(
            ing => ing.isValid.status
         )
         setIngredients(updatedIngredients)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
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
               <InlineLoader />
            ) : (
               <>
                  {ingredients.length ? (
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
                  ) : (
                     <Filler message="No ingredients found! To start, add some." />
                  )}
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default IngredientsTunnel
