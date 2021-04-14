import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Flex,
   Form,
   Spacer,
   Text,
   HorizontalTab,
   HorizontalTabList,
   HorizontalTabPanels,
   HorizontalTabPanel,
   HorizontalTabs,
   IconButton,
} from '@dailykit/ui'
import { isEmpty, stubTrue } from 'lodash'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
   ErrorState,
   InlineLoader,
   Tooltip,
} from '../../../../../shared/components'
import { logger, randomSuffix } from '../../../../../shared/utils'
import { useTabs } from '../../../../../shared/providers'
import {
   RecipeContext,
   reducers,
   state as initialState,
} from '../../../context/recipe'
import { CREATE_SIMPLE_RECIPE, S_RECIPE, UPDATE_RECIPE } from '../../../graphql'
import {
   Information,
   Ingredients,
   Photo,
   Procedures,
   RecipeCard,
   Servings,
} from './components'
import validator from './validators'
import { ResponsiveFlex, StyledFlex } from '../Product/styled'
import { CloneIcon, ThreeDotIcon } from '../../../../../shared/assets/icons'
import { useDnd } from '../../../../../shared/components/DragNDrop/useDnd'

const RecipeForm = () => {
   // Context
   const { setTabTitle, tab, addTab } = useTabs()
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

   // Mutation
   const [createRecipe, { loading: cloning }] = useMutation(
      CREATE_SIMPLE_RECIPE,
      {
         onCompleted: input => {
            addTab(
               input.createSimpleRecipe.returning[0].name,
               `/products/recipes/${input.createSimpleRecipe.returning[0].id}`
            )
            toast.success('Recipe added!')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   React.useEffect(() => {
      if (!tab && !loading && !isEmpty(title.value)) {
         addTab(title.value, `/products/recipes/${recipeId}`)
      }
   }, [tab, loading, title.value, addTab])

   // Handlers
   const updateName = async () => {
      const { isValid, errors } = validator.name(title.value)
      if (isValid) {
         const { data } = await updateRecipe({
            variables: {
               id: state.id,
               set: {
                  name: title.value,
               },
            },
         })
         if (data) {
            setTabTitle(title.value)
         }
      }
      setTitle({
         ...title,
         meta: {
            isTouched: true,
            errors,
            isValid,
         },
      })
   }
   const togglePublish = () => {
      const val = !state.isPublished
      if (val && !state.isValid.status) {
         toast.error('Recipe should be valid!')
      } else {
         updateRecipe({
            variables: {
               id: state.id,
               set: {
                  isPublished: val,
               },
            },
         })
      }
   }

   const clone = () => {
      if (cloning) return
      const clonedRecipe = {
         name: `${state.name}-${randomSuffix()}`,
         assets: state.assets,
         isPublished: state.isPublished,
         author: state.author,
         type: state.type,
         description: state.description,
         cookingTime: state.cookingTime,
         notIncluded: state.notIncluded,
         cuisine: state.cuisine,
         utensils: state.utensils,
         showIngredients: state.showIngredients,
         showIngredientsQuantity: state.showIngredientsQuantity,
         showProcedures: state.showProcedures,
      }
      const clonedRecipeYields = state.simpleRecipeYields.map(ry => ({
         yield: ry.yield,
      }))
      const clonedSimpleRecipeIngredients = state.simpleRecipeIngredients.map(
         ing => ({
            ingredientId: ing.ingredient.id,
            processingId: ing.processing.id,
            position: ing.position,
         })
      )
      const clonedInstructionSets = state.instructionSets.map(set => {
         const newSet = {
            position: set.position,
            title: set.title,
         }
         const newSteps = set.instructionSteps.map(step => ({
            position: step.position,
            description: step.description,
            isVisible: step.isVisible,
            title: step.title,
            assets: step.assets,
         }))
         newSet.instructionSteps = {
            data: newSteps,
         }
         return newSet
      })
      clonedRecipe.simpleRecipeYields = {
         data: clonedRecipeYields,
      }
      clonedRecipe.simpleRecipeIngredients = {
         data: clonedSimpleRecipeIngredients,
      }
      clonedRecipe.instructionSets = {
         data: clonedInstructionSets,
      }
      createRecipe({
         variables: {
            objects: clonedRecipe,
         },
      })
   }

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
            <ResponsiveFlex
               container
               justifyContent="space-between"
               alignItems="start"
               padding="16px 0"
               maxWidth="1280px"
               width="calc(100vw - 64px)"
               margin="0 auto"
               style={{ borderBottom: '1px solid #f3f3f3' }}
            >
               <Form.Group>
                  <Form.Text
                     id="title"
                     name="title"
                     value={title.value}
                     placeholder="enter recipe title"
                     borderLess
                     textAlign="center"
                     fontSize="40px"
                     fontWeight="500"
                     padding="12px 12px"
                     height="48px"
                     hidePlaceholder
                     onChange={e =>
                        setTitle({ ...title, value: e.target.value })
                     }
                     onBlur={updateName}
                     hasError={!title.meta.isValid && title.meta.isTouched}
                  />
                  {title.meta.isTouched &&
                     !title.meta.isValid &&
                     title.meta.errors.map((error, index) => (
                        <Form.Error justifyContent="center" key={index}>
                           {error}
                        </Form.Error>
                     ))}
               </Form.Group>
               <Flex container alignItems="center" height="100%">
                  <Form.Toggle
                     name="published"
                     size={48}
                     variant="green"
                     iconWithText
                     style={{ fontWeight: '500', fontSize: '14px' }}
                     value={state.isPublished}
                     onChange={togglePublish}
                  >
                     <Flex container alignItems="center">
                        Published
                        <Spacer xAxis size="16px" />
                        <Tooltip identifier="recipe_publish" />
                     </Flex>
                  </Form.Toggle>
                  <Spacer xAxis size="16px" />
                  <IconButton
                     type="ghost"
                     style={{ backgroundColor: '#F4F4F4' }}
                     onClick={clone}
                  >
                     <CloneIcon color="#555B6E" />
                  </IconButton>
                  <Spacer xAxis size="16px" />
                  <IconButton
                     type="ghost"
                     style={{ backgroundColor: '#F4F4F4' }}
                  >
                     <ThreeDotIcon color="#555B6E" />
                  </IconButton>
               </Flex>
            </ResponsiveFlex>
            <Flex width="calc(100vw - 64px)" margin="0 auto" padding="32px 0">
               <HorizontalTabs>
                  <HorizontalTabList style={{ justifyContent: 'center' }}>
                     <HorizontalTab>Basic Information</HorizontalTab>
                     <HorizontalTab>Ingredients</HorizontalTab>
                     <HorizontalTab>Cooking Steps</HorizontalTab>
                  </HorizontalTabList>
                  <HorizontalTabPanels>
                     <HorizontalTabPanel>
                        <Flex maxWidth="1280px" margin="0 auto">
                           <StyledFlex container alignItems="center">
                              <Information state={state} />
                              <Spacer xAxis size="32px" />
                              <Photo state={state} />
                           </StyledFlex>
                        </Flex>
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
