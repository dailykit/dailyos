import React from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import {
   Filler,
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
   CREATE_SACHET,
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
   const [createRecipeSachet] = useMutation(CREATE_SIMPLE_RECIPE_YIELD_SACHET, {
      onCompleted: () => {
         toast.success('Sachet added!')
         closeTunnel(3)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [updateRecipeSachet] = useMutation(UPDATE_SIMPLE_RECIPE_YIELD_SACHET, {
      onCompleted: () => {
         toast.success('Sachet updated!')
         closeTunnel(3)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [createSachet] = useMutation(CREATE_SACHET, {
      onCompleted: data => {
         const sachet = {
            id: data.createIngredientSachet.returning[0].id,
            ingredient: {
               name:
                  data.createIngredientSachet.returning[0]?.ingredient?.name ||
                  '',
            },
         }
         save(sachet)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const save = curr => {
      if (recipeState.updating) {
         updateRecipeSachet({
            variables: {
               objects: [
                  {
                     sachetId: recipeState.sachet?.id,
                     yieldId: recipeState.serving.id,
                     set: {
                        ingredientSachetId: curr.id,
                     },
                  },
               ],
            },
         })
      } else {
         createRecipeSachet({
            variables: {
               objects: [
                  {
                     ingredientSachetId: curr.id,
                     recipeYieldId: recipeState.serving.id,
                     isVisible: true,
                     slipName: curr.ingredient?.name,
                  },
               ],
            },
         })
      }
   }

   const quickCreateSachet = () => {
      const [quantity, unit] = search.trim().split(' ')
      if (quantity && unit) {
         createSachet({
            variables: {
               objects: [
                  {
                     ingredientId: recipeState.edit?.id,
                     ingredientProcessingId:
                        recipeState.edit?.ingredientProcessing?.id,
                     quantity: +quantity,
                     unit,
                     tracking: false,
                  },
               ],
            },
         })
      } else {
         toast.error('Enter a valid quantity and unit!')
      }
   }

   React.useEffect(() => {
      if (current.id) {
         save(current)
      }
   }, [current])

   return (
      <>
         <TunnelHeader
            title="Select Sachet"
            close={() => closeTunnel(3)}
            tooltip={<Tooltip identifier="sachets_tunnel" />}
         />
         <TunnelBody>
            {loading ? (
               <InlineLoader />
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
                  <ListHeader type="SSL1" label="Sachets" />
                  <ListOptions
                     search={search}
                     handleOnCreate={quickCreateSachet}
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
            )}
         </TunnelBody>
      </>
   )
}

export default SachetTunnel
