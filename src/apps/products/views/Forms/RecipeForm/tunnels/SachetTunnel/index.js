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
   UPSERT_SIMPLE_RECIPE_YIELD_SACHET,
   SACHETS,
   UPDATE_SIMPLE_RECIPE_YIELD_SACHET,
   UPSERT_MASTER_UNIT,
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
               {
                  ingredientId: { _eq: recipeState.sachetAddMeta.ingredientId },
               },
               {
                  ingredientProcessingId: {
                     _eq: recipeState.sachetAddMeta.processingId,
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
   const [upsertRecipeYieldSachet] = useMutation(
      UPSERT_SIMPLE_RECIPE_YIELD_SACHET,
      {
         onCompleted: () => {
            toast.success('Sachet added!')
            closeTunnel(3)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )
   // const [updateRecipeSachet] = useMutation(UPDATE_SIMPLE_RECIPE_YIELD_SACHET, {
   //    onCompleted: () => {
   //       toast.success('Sachet updated!')
   //       closeTunnel(3)
   //    },
   //    onError: error => {
   //       toast.error('Something went wrong!')
   //       logger(error)
   //    },
   // })
   const [upsertMasterUnit] = useMutation(UPSERT_MASTER_UNIT, {
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
      upsertRecipeYieldSachet({
         variables: {
            yieldId: recipeState.sachetAddMeta.yieldId,
            ingredientProcessingRecordId:
               recipeState.sachetAddMeta.ingredientProcessingRecordId,
            ingredientSachetId: curr.id,
            slipName: curr.ingredient.name,
         },
      })
   }

   const quickCreateSachet = async () => {
      if (!search.includes(' '))
         return toast.error('Quantity and Unit should be space separated!')
      const [quantity, unit] = search.trim().split(' ')
      if (quantity && unit) {
         await upsertMasterUnit({
            variables: {
               name: unit,
            },
         })
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
