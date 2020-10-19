import React from 'react'

// third party imports
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
   ComboButton,
   Flex,
   IconButton,
   Loader,
   Spacer,
   Text,
   TextButton,
} from '@dailykit/ui'

// shared dir imports
import { Tooltip } from '../../../../../shared/components'
import { logger, randomSuffix } from '../../../../../shared/utils'

// graphql imports
import {
   CREATE_SIMPLE_RECIPE,
   DELETE_SIMPLE_RECIPES,
   S_RECIPES,
} from '../../../graphql'

// context imports
import { useTabs } from '../../../context'

// local imports
import { AddIcon, DeleteIcon } from '../../../assets/icons'
import ServingsCount from '../../../utils/countFormatter'
import tableOptions from '../tableOption'

const address = 'apps.recipe.views.listings.recipeslisting.'

const RecipesListing = () => {
   const { t } = useTranslation()
   const { addTab, tab } = useTabs()

   // Queries and Mutations
   const {
      loading,
      data: { simpleRecipes: recipes = [] } = {},
      error,
   } = useSubscription(S_RECIPES)

   if (error) {
      toast.error('Something went wrong!')
      logger(error)
   }

   const [createRecipe] = useMutation(CREATE_SIMPLE_RECIPE, {
      onCompleted: input => {
         addTab(
            input.createSimpleRecipe.returning[0].name,
            `/recipe/recipes/${input.createSimpleRecipe.returning[0].id}`
         )
         toast.success('Recipe added!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const [deleteRecipes] = useMutation(DELETE_SIMPLE_RECIPES, {
      onCompleted: () => {
         toast.success('Recipe deleted!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   React.useEffect(() => {
      if (!tab) {
         addTab('Recipes', '/recipe/recipes')
      }
   }, [tab, addTab])

   // Handlers
   const createRecipeHandler = () => {
      const name = `recipe-${randomSuffix()}`
      createRecipe({ variables: { name } })
   }

   const deleteRecipeHandler = recipe => {
      const confirmed = window.confirm(
         `Are you sure you want to delete recipe - ${recipe.name}?`
      )
      if (confirmed) {
         deleteRecipes({
            variables: {
               ids: [recipe.id],
            },
         })
      }
   }

   if (loading) return <Loader />

   return (
      <Flex maxWidth="1280px" width="calc(100vw - 64px)" margin="0 auto">
         <Flex
            container
            alignItems="center"
            justifyContent="space-between"
            height="72px"
         >
            <Flex container alignItems="center">
               <Text as="h2">
                  {t(address.concat('recipes'))}({recipes.length})
               </Text>
               <Tooltip identifier="recipes_list_heading" />
            </Flex>
         </Flex>
         <DataTable
            data={recipes}
            addTab={addTab}
            deleteRecipeHandler={deleteRecipeHandler}
            createRecipeHandler={createRecipeHandler}
         />
      </Flex>
   )
}

function DataTable({ data, addTab, deleteRecipeHandler, createRecipeHandler }) {
   const tableRef = React.useRef()

   const columns = [
      {
         title: 'Name',
         field: 'name',
         headerFilter: true,
         cellClick: (e, cell) => {
            const { name, id } = cell._cell.row.data
            addTab(name, `/recipe/recipes/${id}`)
         },
         cssClass: 'colHover',
      },
      { title: 'Author', field: 'author', headerFilter: true },
      {
         title: 'Cooking Time',
         field: 'cookingTime',
         headerFilter: true,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
      },
      {
         title: '# of Servings',
         field: 'simpleRecipeYields',
         headerFilter: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         formatter: reactFormatter(<ServingsCount />),
         width: 150,
      },

      {
         title: 'Published',
         field: 'isPublished',
         formatter: 'tickCross',
         hozAlign: 'center',
         headerHozAlign: 'center',
         width: 150,
      },
      {
         title: 'Actions',
         headerSort: false,
         headerFilter: false,
         hozAlign: 'center',
         headerHozAlign: 'center',
         formatter: reactFormatter(
            <DeleteRecipe onDelete={deleteRecipeHandler} />
         ),
         width: 150,
      },
   ]

   return (
      <>
         <Flex container alignItems="center" justifyContent="space-between">
            <TextButton
               type="outline"
               onClick={() => tableRef.current.table.clearHeaderFilter()}
            >
               Clear Filters
            </TextButton>
            <ComboButton type="solid" onClick={createRecipeHandler}>
               <AddIcon color="#fff" size={24} /> Create Recipe
            </ComboButton>
         </Flex>
         <Spacer size="16px" />
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={data}
            options={tableOptions}
            data-custom-attr="test-custom-attribute"
            className="custom-css-class"
         />
      </>
   )
}

function DeleteRecipe({ cell, onDelete }) {
   const recipe = cell.getData()

   return (
      <IconButton type="ghost" onClick={() => onDelete(recipe)}>
         <DeleteIcon color="#FF5A52" />
      </IconButton>
   )
}

export default RecipesListing
