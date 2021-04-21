import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import {
   Flex,
   Spacer,
   HorizontalTab,
   HorizontalTabList,
   HorizontalTabPanels,
   HorizontalTabPanel,
   HorizontalTabs,
   ComboButton,
   Tunnel,
   useTunnel,
   Tunnels,
   Text,
} from '@dailykit/ui'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { ErrorState, InlineLoader } from '../../../../../shared/components'
import { logger } from '../../../../../shared/utils'
import { EyeIcon } from '../../../assets/icons'
import { useTabs } from '../../../../../shared/providers'
import {
   RecipeContext,
   reducers,
   state as initialState,
} from '../../../context/recipe'
import {
   S_RECIPE,
   S_SIMPLE_PRODUCTS_FROM_RECIPE_AGGREGATE,
} from '../../../graphql'
import {
   BasicInformation,
   Ingredients,
   Photo,
   Procedures,
   Servings,
   Statusbar,
} from './components'

import { StyledFlex } from '../Product/styled'
import { PlusIcon } from '../../../../../shared/assets/icons'
import { useDnd } from '../../../../../shared/components/DragNDrop/useDnd'
import { CreateProductTunnel, LinkedProductsTunnel } from './tunnels'

const RecipeForm = () => {
   const { tab, addTab } = useTabs()
   const { initiatePriority } = useDnd()
   const { id: recipeId } = useParams()
   const [recipeState, recipeDispatch] = React.useReducer(
      reducers,
      initialState
   )

   const [productTunnels, openProductsTunnel, closeProductsTunnel] = useTunnel(
      1
   )
   const [
      linkedProductsTunnels,
      openLinkedProductsTunnel,
      closeLinkedProductsTunnel,
   ] = useTunnel(1)

   // States
   const [state, setState] = React.useState({})
   const [linkedProductsCount, setLinkedProductsCount] = React.useState(0)

   const [title, setTitle] = React.useState({
      value: '',
      meta: {
         errors: [],
         isValid: false,
         isTouched: false,
      },
   })

   // Subscription
   const { loading, error } = useSubscription(S_RECIPE, {
      variables: {
         id: recipeId,
      },
      onSubscriptionData: data => {
         const recipe = data.subscriptionData.data.simpleRecipe
         console.log(
            '🚀 ~ file: index.js ~ line 74 ~ RecipeForm ~ recipe',
            recipe
         )
         setState(recipe)
         setTitle({
            ...title,
            value: recipe.name,
         })
         if (recipe.simpleRecipeIngredients) {
            initiatePriority({
               tablename: 'simpleRecipe_ingredient_processing',
               schemaname: 'simpleRecipe',
               data: recipe.simpleRecipeIngredients,
            })
         }
      },
   })
   useSubscription(S_SIMPLE_PRODUCTS_FROM_RECIPE_AGGREGATE, {
      skip: !state.simpleRecipeYields,
      variables: {
         where: {
            simpleRecipeYieldId: {
               _in: state.simpleRecipeYields?.map(y => y.id),
            },
            isArchived: { _eq: false },
            product: {
               isArchived: { _eq: false },
            },
         },
         distinct_on: ['productId'],
      },
      onSubscriptionData: data => {
         setLinkedProductsCount(
            data.subscriptionData.data.productOptionsAggregate.aggregate.count
         )
      },
   })

   React.useEffect(() => {
      if (!tab && !loading && !isEmpty(title.value)) {
         addTab(title.value, `/products/recipes/${recipeId}`)
      }
   }, [tab, loading, title.value, addTab])

   if (loading) return <InlineLoader />
   if (!loading && error) {
      toast.error('Failed to fetch Recipe!')
      logger(error)
      return <ErrorState />
   }

   return (
      <RecipeContext.Provider value={{ recipeState, recipeDispatch }}>
         <Statusbar state={state} title={title} setTitle={setTitle} />
         <Flex container justifyContent="center">
            <ComboButton
               type="ghost"
               size="sm"
               onClick={() => openLinkedProductsTunnel(1)}
            >
               <EyeIcon color="#00A7E1" />
               {`Linked Products (${linkedProductsCount})`}
            </ComboButton>
            <Spacer xAxis size="16px" />
            <ComboButton
               type="ghost"
               size="sm"
               onClick={() => openProductsTunnel(1)}
            >
               <PlusIcon color="#00A7E1" />
               Create Product
            </ComboButton>
         </Flex>
         <Flex width="calc(100vw - 64px)" margin="0 auto" padding="32px 0">
            <HorizontalTabs>
               <HorizontalTabList style={{ justifyContent: 'center' }}>
                  <HorizontalTab>Basic Information</HorizontalTab>
                  <HorizontalTab>Ingredients</HorizontalTab>
                  <HorizontalTab>Cooking Steps</HorizontalTab>
               </HorizontalTabList>
               <HorizontalTabPanels>
                  <HorizontalTabPanel>
                     <StyledFlex container justifyContent="space-between">
                        <BasicInformation state={state} />
                        <Photo state={state} />
                     </StyledFlex>
                  </HorizontalTabPanel>
                  <HorizontalTabPanel>
                     <Servings state={state} />
                     <Spacer size="32px" />
                     <Ingredients state={state} />
                  </HorizontalTabPanel>
                  <HorizontalTabPanel>
                     <Procedures state={state} />
                  </HorizontalTabPanel>
               </HorizontalTabPanels>
            </HorizontalTabs>
         </Flex>
         <Tunnels tunnels={productTunnels}>
            <Tunnel layer={1}>
               <CreateProductTunnel
                  state={state}
                  closeTunnel={closeProductsTunnel}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={linkedProductsTunnels}>
            <Tunnel layer={1} size="sm">
               <LinkedProductsTunnel
                  state={state}
                  closeTunnel={closeLinkedProductsTunnel}
               />
            </Tunnel>
         </Tunnels>
      </RecipeContext.Provider>
   )
}

export default RecipeForm
