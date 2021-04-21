import React from 'react'
import { Form, Spacer, IconButton, Flex, Text } from '@dailykit/ui'
import { ResponsiveFlex } from '../../../Product/styled'
import {
   CloneIcon,
   CloseIcon,
   TickIcon,
} from '../../../../../../../shared/assets/icons'
import {
   Tooltip,
   UpdatingSpinner,
} from '../../../../../../../shared/components'
import { CREATE_SIMPLE_RECIPE, UPDATE_RECIPE } from '../../../../../graphql'
import { useMutation } from '@apollo/react-hooks'
import { logger, randomSuffix } from '../../../../../../../shared/utils'
import { toast } from 'react-toastify'
import { useTabs } from '../../../../../../../shared/providers'
import validator from '../../validators'

const Statusbar = ({ state, setTitle, title }) => {
   const [updated, setUpdated] = React.useState(null)
   const { addTab, setTabTitle } = useTabs()
   //Mutations
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

   const [updateName, { loading: updatingName }] = useMutation(UPDATE_RECIPE, {
      variables: {
         id: state.id,
         set: {
            name: title.value,
         },
      },

      onCompleted: () => {
         setUpdated('name')
         setTabTitle(title.value)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const [togglePublish, { loading: updatingPublish }] = useMutation(
      UPDATE_RECIPE,
      {
         variables: {
            id: state.id,
            set: {
               isPublished: !state.isPublished,
            },
         },

         onCompleted: () => {
            setUpdated('published')
            setTabTitle(title.value)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   //Handlers
   const handleUpdateName = async () => {
      const { isValid, errors } = validator.name(title.value)
      if (isValid) {
         updateName()
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

   const handleTogglePublish = () => {
      const val = !state.isPublished
      if (val && !state.isValid.status) {
         toast.error('Recipe should be valid!')
      } else {
         togglePublish()
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

   return (
      <>
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
            <Flex container alignItems="center">
               <Form.Group>
                  <Form.Text
                     id="title"
                     name="title"
                     value={title.value}
                     placeholder="enter recipe title"
                     variant="revamp"
                     onChange={e =>
                        setTitle({ ...title, value: e.target.value })
                     }
                     onBlur={handleUpdateName}
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
               <Spacer xAxis size="16px" />
               <UpdatingSpinner
                  updated={updated}
                  setUpdated={setUpdated}
                  updatedField="name"
                  loading={updatingName}
               />
            </Flex>
            <Flex container alignItems="center">
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
            </Flex>
            <Spacer xAxis size="16px" />
            <Flex container alignItems="center" height="100%">
               <Form.Toggle
                  name="published"
                  size={48}
                  variant="green"
                  iconWithText
                  style={{ fontWeight: '500', fontSize: '14px' }}
                  value={state.isPublished}
                  onChange={handleTogglePublish}
               >
                  <Flex container alignItems="center">
                     Published
                     <Spacer xAxis size="16px" />
                     <Tooltip identifier="recipe_publish" />
                  </Flex>
               </Form.Toggle>
               <Spacer xAxis size="16px" />
               <UpdatingSpinner
                  updated={updated}
                  setUpdated={setUpdated}
                  updatedField="published"
                  loading={updatingPublish}
               />
               <Spacer xAxis size="16px" />
               <IconButton
                  type="ghost"
                  style={{ backgroundColor: '#F4F4F4' }}
                  onClick={clone}
               >
                  <CloneIcon color="#555B6E" />
               </IconButton>
            </Flex>
         </ResponsiveFlex>
      </>
   )
}

export default Statusbar
