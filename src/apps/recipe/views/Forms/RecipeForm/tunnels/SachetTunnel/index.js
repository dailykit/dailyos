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
import {
   CREATE_SIMPLE_RECIPE_YIELD_SACHET,
   UPDATE_SIMPLE_RECIPE_YIELD_SACHET,
   SACHETS,
} from '../../../../../graphql'
import { TunnelBody } from '../styled'

const SachetTunnel = ({ closeTunnel }) => {
   const { recipeState } = React.useContext(RecipeContext)

   const [sachets, setSachets] = React.useState([])
   const [busy, setBusy] = React.useState(false)

   // Query
   const { loading } = useQuery(SACHETS, {
      variables: {
         where: {
            ingredientId: { _eq: recipeState.edit?.id },
            ingredientProcessingId: {
               _eq: recipeState.edit?.ingredientProcessing?.id,
            },
         },
      },
      onCompleted: data => {
         const updatedSachets = data.ingredientSachets.map(sachet => ({
            ...sachet,
            title: `${sachet.quantity}  ${sachet.unit}`,
         }))
         setSachets(updatedSachets)
      },
      onError: error => {
         console.log(error)
         toast.error('Error: Cannot fetch Sachets!')
      },
      fetchPolicy: 'cache-and-network',
   })

   // State for search input
   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(sachets)

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
         closeTunnel(3)
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
         closeTunnel(3)
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
            close={() => closeTunnel(3)}
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

export default SachetTunnel
