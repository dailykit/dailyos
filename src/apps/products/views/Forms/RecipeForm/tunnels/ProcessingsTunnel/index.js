import React from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import {
   List,
   ListHeader,
   ListItem,
   ListOptions,
   ListSearch,
   TunnelHeader,
   useSingleList,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { InlineLoader, Tooltip } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { RecipeContext } from '../../../../../context/recipe'
import {
   CREATE_PROCESSINGS,
   PROCESSINGS,
   UPDATE_RECIPE,
} from '../../../../../graphql'
import { TunnelBody } from '../styled'

const ProcessingsTunnel = ({ state, closeTunnel }) => {
   const { recipeState } = React.useContext(RecipeContext)

   // Query
   const { data: { ingredientProcessings = [] } = {}, loading } = useQuery(
      PROCESSINGS,
      {
         variables: {
            where: {
               _and: [
                  { ingredientId: { _eq: recipeState.newIngredient?.id } },
                  { isArchived: { _eq: false } },
               ],
            },
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

   const [createProcessing] = useMutation(CREATE_PROCESSINGS, {
      onCompleted: data => {
         console.log(data)
         const processing = {
            id: data.createIngredientProcessing.returning[0].id,
            title: data.createIngredientProcessing.returning[0].processingName,
         }
         add(processing)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const add = processing => {
      const ingredients = state.ingredients || []
      ingredients.push({
         id: recipeState.newIngredient.id,
         name: recipeState.newIngredient.name,
         image: recipeState.newIngredient.image,
         ingredientProcessing: {
            id: processing.id,
            processingName: processing.title,
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

   const quickCreateProcessing = () => {
      const processingName = search.slice(0, 1).toUpperCase() + search.slice(1)
      createProcessing({
         variables: {
            procs: [
               {
                  ingredientId: recipeState.newIngredient.id,
                  processingName,
               },
            ],
         },
      })
   }

   React.useEffect(() => {
      if (current.id) {
         add(current)
      }
   }, [current])

   return (
      <>
         <TunnelHeader
            title="Select Processing"
            close={() => closeTunnel(2)}
            tooltip={<Tooltip identifier="processings_tunnel" />}
         />
         <TunnelBody>
            {loading ? (
               <InlineLoader />
            ) : (
               <>
                  <List>
                     {Object.keys(current).length > 0 ? (
                        <ListItem type="SSL1" title={current.title} />
                     ) : (
                        <ListSearch
                           onChange={value => setSearch(value)}
                           placeholder="type what you’re looking for..."
                        />
                     )}
                     <ListHeader type="SSL1" label="Processings" />
                     <ListOptions
                        search={search}
                        handleOnCreate={quickCreateProcessing}
                     >
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
                                 onClick={() => selectOption('id', option.id)}
                              />
                           ))}
                     </ListOptions>
                  </List>
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default ProcessingsTunnel
