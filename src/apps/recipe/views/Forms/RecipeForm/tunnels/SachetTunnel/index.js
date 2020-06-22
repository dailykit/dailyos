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
import {
   CREATE_SIMPLE_RECIPE_YIELD_SACHET,
   UPDATE_SIMPLE_RECIPE_YIELD_SACHET,
} from '../../../../../graphql'
import { TunnelBody } from '../styled'

const SachetTunnel = ({ closeTunnel, sachets }) => {
   const { recipeState } = React.useContext(RecipeContext)

   const [busy, setBusy] = React.useState(false)

   // State for search input
   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(
      sachets
         .filter(sachet => sachet.isValid.status)
         .map(sachet => ({
            ...sachet,
            title: `${sachet.quantity} ${sachet.unit}`,
         }))
   )

   // Mutation
   const [createSachet] = useMutation(CREATE_SIMPLE_RECIPE_YIELD_SACHET, {
      variables: {
         objects: [
            {
               ingredientSachetId: current.id,
               recipeYieldId: recipeState.serving.id,
               isVisible: true,
               slipName: current.ingredient?.name,
            },
         ],
      },
      onCompleted: () => {
         toast.success('Sachet added!')
         closeTunnel(7)
      },
      onError: () => {
         toast.error()
      },
   })
   const [updateSachet] = useMutation(UPDATE_SIMPLE_RECIPE_YIELD_SACHET, {
      variables: {
         sachetId: recipeState.sachet?.id,
         yieldId: recipeState.serving.id,
         set: {
            ingredientSachetId: current.id,
         },
      },
      onCompleted: () => {
         toast.success('Sachet updated!')
         closeTunnel(7)
      },
      onError: () => {
         toast.error()
      },
   })

   const save = () => {
      if (busy) return
      setBusy(true)
      if (recipeState.updating) updateSachet()
      else createSachet()
   }

   return (
      <>
         <TunnelHeader
            title="Select Sachet"
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={() => closeTunnel(7)}
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

export default SachetTunnel
