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
import { RecipeContext } from '../../../../../context/recipe'
import {
   CREATE_SIMPLE_RECIPE_YIELD_SACHET,
   SACHETS,
   UPDATE_SIMPLE_RECIPE_YIELD_SACHET,
} from '../../../../../graphql'
import { TunnelBody } from '../styled'

const SachetTunnel = ({ closeTunnel }) => {
   const { recipeState } = React.useContext(RecipeContext)

   const [sachets, setSachets] = React.useState([])

   // Query
   const { loading } = useQuery(SACHETS, {
      variables: {
         where: {
            _and: [
               { ingredientId: { _eq: recipeState.edit?.id } },
               {
                  ingredientProcessingId: {
                     _eq: recipeState.edit?.ingredientProcessing?.id,
                  },
               },
               {
                  isArchived: { _eq: false },
               },
            ],
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
         toast.error('Something went wrong!')
         logger(error)
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
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
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
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const save = () => {
      if (recipeState.updating) updateSachet()
      else createSachet()
   }

   React.useEffect(() => {
      if (current.id) {
         save()
      }
   }, [current])

   return (
      <>
         <TunnelHeader title="Select Sachet" close={() => closeTunnel(3)} />
         <TunnelBody>
            {loading ? (
               <InlineLoader />
            ) : (
               <>
                  {sachets.length ? (
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
                     <Filler message="No sachets found in processing! To start, add some." />
                  )}
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default SachetTunnel
