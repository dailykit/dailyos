import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   TunnelHeader,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { RecipeContext } from '../../../../../context/recipee'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { TunnelBody } from '../styled'

const ProcessingsTunnel = ({ state, closeTunnel, processings }) => {
   const { recipeState } = React.useContext(RecipeContext)

   const [busy, setBusy] = React.useState(false)

   // State for search input
   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(
      processings.map(proc => ({ ...proc, title: proc.processingName }))
   )

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      onCompleted: () => {
         toast.success('Ingredient added!')
         closeTunnel(5)
         closeTunnel(4)
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
            close={() => closeTunnel(5)}
         />
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
                           onClick={() => selectOption('id', option.id)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </>
   )
}

export default ProcessingsTunnel
