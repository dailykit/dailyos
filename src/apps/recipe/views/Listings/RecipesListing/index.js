import { useMutation, useSubscription } from '@apollo/react-hooks'
import { IconButton, Loader, TextButton } from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { toast } from 'react-toastify'
import tableOptions from '../tableOption'

import ServingsCount from '../../../utils/countFormatter'

import { randomSuffix } from '../../../../../shared/utils'
import { AddIcon, DeleteIcon } from '../../../assets/icons'
import { useTabs } from '../../../context'
import {
   CREATE_SIMPLE_RECIPE,
   DELETE_SIMPLE_RECIPES,
   S_RECIPES,
} from '../../../graphql'
import {
   StyledContent,
   StyledHeader,
   StyledTableActions,
   StyledTableHeader,
   StyledWrapper,
} from '../styled'

const address = 'apps.recipe.views.listings.recipeslisting.'

const RecipesListing = () => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   const [recipes, setRecipes] = React.useState([])

   // Queries and Mutations
   const { loading, data } = useSubscription(S_RECIPES)
   const [createRecipe] = useMutation(CREATE_SIMPLE_RECIPE, {
      onCompleted: input => {
         addTab(
            input.createSimpleRecipe.returning[0].name,
            `/recipe-app/recipes/${input.createSimpleRecipe.returning[0].id}`
         )
         toast.success('Recipe added!')
      },
      onError: error => {
         console.log(error)
         toast.error('Cannot create recipe!')
      },
   })
   const [deleteRecipes] = useMutation(DELETE_SIMPLE_RECIPES, {
      onCompleted: () => {
         toast.success('Recipe deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Failed to delete!')
      },
   })

   // Effects
   React.useEffect(() => {
      if (data) setRecipes(data.simpleRecipes)
   }, [data])

   // Handlers
   const createRecipeHandler = () => {
      const name = `recipe-${randomSuffix()}`
      createRecipe({ variables: { name } })
   }
   const deleteRecipeHandler = (e, recipe) => {
      // e.stopPropagation()
      const cnfirmed = window.confirm(
         `Are you sure you want to delete recipe - ${recipe.name}?`
      )

      if (cnfirmed) {
         deleteRecipes({
            variables: {
               ids: [recipe.id],
            },
         })
      }
   }

   if (loading) return <Loader />

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>{t(address.concat('recipes'))}</h1>
            <p>
               {t(address.concat('total'))}: {recipes.length}
            </p>
         </StyledHeader>
         <DataTable
            data={recipes}
            addTab={addTab}
            deleteRecipeHandler={deleteRecipeHandler}
            createRecipeHandler={createRecipeHandler}
         />
      </StyledWrapper>
   )
}

function DataTable({ data, addTab, deleteRecipeHandler, createRecipeHandler }) {
   const tableRef = React.useRef()

   const columns = [
      { title: 'Name', field: 'name', headerFilter: true },
      { title: 'Author', field: 'author', headerFilter: true },
      {
         title: 'Cooking Time',
         field: 'cookingTime',
         headerFilter: true,
         hozAlign: 'right',
      },
      {
         title: '# of Servings',
         field: 'simpleRecipeYields',
         headerFilter: false,
         hozAlign: 'right',
         formatter: reactFormatter(<ServingsCount />),
      },

      {
         title: 'Published',
         field: 'isPublished',
         formatter: 'tickCross',
         headerFilter: true,
         hozAlign: 'center',
      },
      {
         title: 'Actions',
         headerSort: false,
         headerFilter: false,
         hozAlign: 'center',
         cellClick: (e, cell) => {
            e.stopPropagation()
            deleteRecipeHandler(e, cell._cell.row.data)
         },
         formatter: reactFormatter(<DeleteRecipe />),
      },
   ]

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      addTab(name, `/recipe-app/recipes/${id}`)
   }

   return (
      <>
         <StyledTableHeader>
            <TextButton
               type="outline"
               onClick={() => tableRef.current.table.clearHeaderFilter()}
            >
               Clear Filters
            </TextButton>

            <StyledTableActions>
               <IconButton type="solid" onClick={createRecipeHandler}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledTableActions>
         </StyledTableHeader>
         <StyledContent>
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={data}
               rowClick={rowClick}
               options={tableOptions}
               data-custom-attr="test-custom-attribute"
               className="custom-css-class"
            />
         </StyledContent>
      </>
   )
}

function DeleteRecipe() {
   return <DeleteIcon color="#FF5A52" />
}

export default RecipesListing
