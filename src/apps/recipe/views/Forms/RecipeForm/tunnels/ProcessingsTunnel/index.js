import React from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   TunnelHeader,
   Loader,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { RecipeContext } from '../../../../../context/recipee'
import { UPDATE_RECIPE, PROCESSINGS } from '../../../../../graphql'
import { TunnelBody } from '../styled'

const ProcessingsTunnel = ({ state, closeTunnel }) => {
   const { recipeState } = React.useContext(RecipeContext)

   const [busy, setBusy] = React.useState(false)

   // State for search input
   const [search, setSearch] = React.useState('')
   const [processings, setProcessings] = React.useState([])
   const [list, current, selectOption] = useSingleList(processings)

   // Query
   const { loading } = useQuery(PROCESSINGS, {
      variables: {
         where: { ingredientId: { _eq: recipeState.newIngredient?.id } },
      },
      onCompleted: data => {
         setProcessings(data.ingredientProcessings)
      },
      onError: error => {
         console.log(error)
         toast.error('Error: Cannot fetch Processings!')
      },
      fetchPolicy: 'cache-and-network',
   })

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      onCompleted: () => {
         toast.success('Ingredient added!')
         closeTunnel(2)
         closeTunnel(1)
      },
      onError: () => {
         toast.error()
      },
   })

   const add = () => {
      if (busy) return
      setBusy(true)
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

   return (
      <>
         <TunnelHeader
            title="Select Processing"
            right={{
               action: add,
               title: busy ? 'Adding...' : 'Add',
            }}
            close={() => closeTunnel(2)}
         />
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
                              onClick={() => selectOption('id', option.id)}
                           />
                        ))}
                  </ListOptions>
               </List>
            )}
         </TunnelBody>
      </>
   )
}

export default ProcessingsTunnel
