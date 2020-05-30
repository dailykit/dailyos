import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Text,
   TextButton,
   useSingleList,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { CloseIcon } from '../../../../../assets/icons'
import { RecipeContext } from '../../../../../context/recipee'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { TunnelBody, TunnelHeader } from '../styled'

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
      onError: error => {
         console.log(error)
         toast.error()
      },
   })

   //Handlers
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
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(5)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Select Processing</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={add}>
                  {busy ? 'Adding...' : 'Add'}
               </TextButton>
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
                           onClick={() => selectOption('id', option.id)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </React.Fragment>
   )
}

export default ProcessingsTunnel
