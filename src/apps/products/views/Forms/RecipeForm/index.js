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
   ComboButton,
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
import { CloseIcon, TickIcon } from '../../../assets/icons'
import { useTabs } from '../../../context'
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
import { CloneIcon } from '../../../../../shared/assets/icons'

const RecipeForm = () => {
   // Context
   const { setTabTitle, tab, addTab } = useTabs()
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
         console.log(data.subscriptionData.data.simpleRecipe)
         setState(data.subscriptionData.data.simpleRecipe)
         setTitle({
            ...title,
            value: data.subscriptionData.data.simpleRecipe.name,
         })
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
         procedures: state.procedures,
         ingredients: state.ingredients,
         showIngredients: state.showIngredients,
         showIngredientsQuantity: state.showIngredientsQuantity,
         showProcedures: state.showProcedures,
      }
      const clonedRecipeYields = state.simpleRecipeYields.map(ry => {
         const clonedSachets = ry.ingredientSachets.map(sachet => ({
            isVisible: sachet.isVisible,
            slipName: sachet.slipName,
            ingredientSachetId: sachet.ingredientSachet.id,
         }))

         return {
            yield: ry.yield,
            ingredientSachets: {
               data: clonedSachets,
            },
         }
      })
      clonedRecipe.simpleRecipeYields = {
         data: clonedRecipeYields,
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
                  <Form.Label htmlFor="title" title="title">
                     Recipe Name*
                  </Form.Label>
                  <Form.Text
                     id="title"
                     name="title"
                     value={title.value}
                     placeholder="Enter recipe name"
                     onChange={e =>
                        setTitle({ ...title, value: e.target.value })
                     }
                     onBlur={updateName}
                     hasError={!title.meta.isValid && title.meta.isTouched}
                  />
                  {title.meta.isTouched &&
                     !title.meta.isValid &&
                     title.meta.errors.map((error, index) => (
                        <Form.Error key={index}>{error}</Form.Error>
                     ))}
               </Form.Group>
               <Flex container alignItems="center" height="100%">
                  {state.isValid?.status ? (
                     <>
                        <TickIcon color="#00ff00" stroke={2} />
                        <Text as="p">All good!</Text>
                     </>
                  ) : (
                     <>
                        <CloseIcon color="#ff0000" />
                        <Text as="p">{state.isValid?.error}</Text>
                     </>
                  )}
                  <Spacer xAxis size="16px" />
                  <ComboButton type="ghost" size="sm" onClick={clone}>
                     <CloneIcon color="#00A7E1" />
                     {cloning ? 'Cloning...' : 'Clone Recipe'}
                  </ComboButton>
                  <Spacer xAxis size="16px" />
                  <Form.Toggle
                     name="published"
                     value={state.isPublished}
                     onChange={togglePublish}
                  >
                     <Flex container alignItems="center">
                        Published
                        <Spacer xAxis size="16px" />
                        <Tooltip identifier="recipe_publish" />
                     </Flex>
                  </Form.Toggle>
               </Flex>
            </ResponsiveFlex>
            <Flex width="calc(100vw - 64px)" margin="0 auto" padding="32px 0">
               <HorizontalTabs>
                  <HorizontalTabList>
                     <HorizontalTab>Basic Details</HorizontalTab>
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
                           <Spacer size="32px" />
                           <Servings state={state} />
                        </Flex>
                     </HorizontalTabPanel>
                     <HorizontalTabPanel>
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
