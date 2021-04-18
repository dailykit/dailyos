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
} from '@dailykit/ui'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ErrorState, InlineLoader } from '../../../../../shared/components'
import { logger } from '../../../../../shared/utils'
import { useTabs } from '../../../../../shared/providers'
import {
   RecipeContext,
   reducers,
   state as initialState,
} from '../../../context/recipe'
import { S_RECIPE } from '../../../graphql'
import {
   BasicInformation,
   Ingredients,
   Photo,
   Procedures,
   Servings,
   Statusbar,
} from './components'
import { StyledFlex } from '../Product/styled'
import { useDnd } from '../../../../../shared/components/DragNDrop/useDnd'

const RecipeForm = () => {
   // Context
   const { tab, addTab } = useTabs()
   const { initiatePriority } = useDnd()
   const { id: recipeId } = useParams()
   const [recipeState, recipeDispatch] = React.useReducer(
      reducers,
      initialState
   )

   // States
   const [state, setState] = React.useState({})

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
         <>
            {/* View */}
            <Statusbar state={state} title={title} setTitle={setTitle} />
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
         </>
      </RecipeContext.Provider>
   )
}

export default RecipeForm
