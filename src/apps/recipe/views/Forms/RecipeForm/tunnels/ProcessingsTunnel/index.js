import React from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import {
   Filler,
   List,
   ListItem,
   ListOptions,
   ListSearch,
   TunnelHeader,
   useSingleList,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { InlineLoader } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { RecipeContext } from '../../../../../context/recipee'
import { PROCESSINGS, UPDATE_RECIPE } from '../../../../../graphql'
import { TunnelBody } from '../styled'

const ProcessingsTunnel = ({ state, closeTunnel }) => {
   const { recipeState } = React.useContext(RecipeContext)

   // Query
   const { data: { ingredientProcessings = [] } = {}, loading } = useQuery(
      PROCESSINGS,
      {
         variables: {
            where: { ingredientId: { _eq: recipeState.newIngredient?.id } },
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
         fetchPolicy: 'cache-and-network',
      }
   )

   // State for search input
   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(ingredientProcessings)

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      onCompleted: () => {
         toast.success('Ingredient added!')
         closeTunnel(2)
         closeTunnel(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const add = () => {
      const ingredients = state.ingredients || []
      ingredients.push({
         id: recipeState.newIngredient.id,
         name: recipeState.newIngredient.name,
         image: recipeState.newIngredient.image,
         ingredientProcessing: {
            id: current.id,
            processingName: current.title,
         },
      })
      updateRecipe({
         variables: {
            id: state.id,
            set: {
               ingredients,
            },
         },
      })
   }

   React.useEffect(() => {
      if (current.id) {
         add()
      }
   }, [current])

   return (
      <>
         <TunnelHeader title="Select Processing" close={() => closeTunnel(2)} />
         <TunnelBody>
            {loading ? (
               <InlineLoader />
            ) : (
               <>
                  {ingredientProcessings.length ? (
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
                                    onClick={() =>
                                       selectOption('id', option.id)
                                    }
                                 />
                              ))}
                        </ListOptions>
                     </List>
                  ) : (
                     <Filler message="No processings found in ingredient! To start, add some." />
                  )}
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default ProcessingsTunnel
